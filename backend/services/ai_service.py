import re
import json
import logging
from config import Config

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.provider = None
        self._init_providers()

    def _init_providers(self):
        # Auto-detect or use configured provider
        if Config.GEMINI_API_KEY:
            self.provider = "gemini"
        elif Config.GROQ_API_KEY:
            self.provider = "groq"
        elif Config.OPENAI_API_KEY:
            self.provider = "openai"
        else:
            self.provider = "demo"

    def get_status(self):
        return {
            "active_provider": self.provider,
            "has_gemini": bool(Config.GEMINI_API_KEY),
            "has_groq": bool(Config.GROQ_API_KEY),
            "has_openai": bool(Config.OPENAI_API_KEY),
            "is_demo_mode": self.provider == "demo"
        }

    def update_keys(self, gemini_key=None, groq_key=None, openai_key=None, preferred_provider=None):
        if gemini_key is not None:
            Config.GEMINI_API_KEY = gemini_key
        if groq_key is not None:
            Config.GROQ_API_KEY = groq_key
        if openai_key is not None:
            Config.OPENAI_API_KEY = openai_key
            
        if preferred_provider and preferred_provider in ["gemini", "groq", "openai", "demo", "auto"]:
            Config.AI_PROVIDER = preferred_provider
            
        if Config.AI_PROVIDER != "auto":
            self.provider = Config.AI_PROVIDER
        else:
            self._init_providers()

    def generate_chat_response(self, user_message, scenario="daily_chat", conversation_history=None, student_level="Beginner (A1)"):
        """
        Generates teacher response with gentle corrections, explanations, follow-up, and repetition prompts.
        """
        # If API key available, attempt cloud AI call
        if self.provider == "gemini" and Config.GEMINI_API_KEY:
            try:
                return self._call_gemini_chat(user_message, scenario, conversation_history, student_level)
            except Exception as e:
                logger.error(f"Gemini API error, falling back to smart local engine: {e}")
        elif self.provider == "groq" and Config.GROQ_API_KEY:
            try:
                return self._call_groq_chat(user_message, scenario, conversation_history, student_level)
            except Exception as e:
                logger.error(f"Groq API error, falling back to smart local engine: {e}")
        elif self.provider == "openai" and Config.OPENAI_API_KEY:
            try:
                return self._call_openai_chat(user_message, scenario, conversation_history, student_level)
            except Exception as e:
                logger.error(f"OpenAI API error, falling back to smart local engine: {e}")

        # Smart Offline Local Teacher Engine
        return self._smart_local_chat(user_message, scenario, conversation_history, student_level)

    def _call_gemini_chat(self, user_message, scenario, history, level):
        from google import genai
        client = genai.Client(api_key=Config.GEMINI_API_KEY)
        
        system_instruction = self._get_teacher_system_prompt(scenario, level)
        prompt = f"""
Student says: "{user_message}"

Respond strictly as JSON with this schema:
{{
  "teacher_reply": "Friendly conversational answer that acknowledges what they said and asks a follow-up question",
  "has_mistake": true/false,
  "corrected_sentence": "Properly phrased English sentence if there was an error, else null",
  "explanation_hinglish": "Clear, gentle 1-2 sentence explanation in Hindi/Hinglish of why the correction is needed",
  "repeat_prompt": "A short sentence for the student to practice repeating aloud",
  "topic_tag": "Grammar topic if mistake found (e.g. Past Simple, Is/Am/Are, Prepositions) or null"
}}
"""
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "system_instruction": system_instruction,
                "response_mime_type": "application/json"
            }
        )
        data = json.loads(response.text)
        data["provider"] = "gemini"
        return data

    def _call_groq_chat(self, user_message, scenario, history, level):
        from groq import Groq
        client = Groq(api_key=Config.GROQ_API_KEY)
        
        system_prompt = self._get_teacher_system_prompt(scenario, level)
        user_prompt = f"""Student says: "{user_message}"
Respond strictly in JSON:
{{
  "teacher_reply": "Friendly response and follow-up question",
  "has_mistake": true/false,
  "corrected_sentence": "Corrected sentence if mistake",
  "explanation_hinglish": "Hinglish explanation of grammar mistake",
  "repeat_prompt": "Repeat prompt",
  "topic_tag": "Grammar topic"
}}"""
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        data = json.loads(chat_completion.choices[0].message.content)
        data["provider"] = "groq"
        return data

    def _call_openai_chat(self, user_message, scenario, history, level):
        from openai import OpenAI
        client = OpenAI(api_key=Config.OPENAI_API_KEY)
        
        system_prompt = self._get_teacher_system_prompt(scenario, level)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f'Student says: "{user_message}". Respond in JSON with keys: teacher_reply, has_mistake, corrected_sentence, explanation_hinglish, repeat_prompt, topic_tag.'}
            ],
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
        data["provider"] = "openai"
        return data

    def _get_teacher_system_prompt(self, scenario, level):
        return f"""You are 'Aarav Sir', a warm, encouraging, and world-class AI English Speaking Coach on SpeakUp AI.
Target audience: Hindi speakers who understand English but hesitate when speaking.
Current student level: {level}.
Conversation scenario: {scenario}.
Core principles:
1. Always encourage! Never shame the student.
2. If the student makes a common grammatical or Hindi-to-English translation error, gently correct it with a friendly Hinglish explanation.
3. Don't correct everything all at once - pick the most impactful mistake.
4. Keep the conversation moving forward with a natural follow-up question.
5. Provide a short repetition sentence for oral muscle-memory practice."""

    def _smart_local_chat(self, user_message, scenario, history, level):
        """
        High quality rule-based + linguistic feedback engine for Demo Mode.
        Never fakes responses; performs deterministic grammar checking and context-aware coaching.
        """
        text = user_message.strip()
        lower = text.lower()
        
        mistake = None
        corrected = None
        explanation = None
        topic_tag = None
        repeat_prompt = None

        # Check Common Indian English / Hindi Translation Traps
        # 1. "I am agree" / "He is agree"
        if re.search(r"\b(i|he|she|we|they)\s+(am|is|are)\s+agree\b", lower):
            subj = re.search(r"\b(i|he|she|we|they)\b", lower).group(1)
            verb = "agrees" if subj in ["he", "she"] else "agree"
            corrected = re.sub(r"\b(i|he|she|we|they)\s+(am|is|are)\s+agree\b", f"{subj.capitalize()} {verb}", text, flags=re.IGNORECASE)
            explanation = "'Agree' एक क्रिया (Verb) है, विशेषण नहीं। इसलिए 'am/is agree' नहीं, बल्कि सीधे 'agree / agrees' बोलें।"
            topic_tag = "Is, Am, Are"
            mistake = True

        # 2. "Yesterday I go" / "Yesterday I am go"
        elif re.search(r"\byesterday\b.*\b(i|he|she|we|they)\s+(go|come|see|take|make|eat)\b", lower):
            m = re.search(r"\b(go|come|see|take|make|eat)\b", lower).group(1)
            past_forms = {"go": "went", "come": "came", "see": "saw", "take": "took", "make": "made", "eat": "ate"}
            past = past_forms.get(m, m + "ed")
            corrected = re.sub(r"\b" + m + r"\b", past, text, flags=re.IGNORECASE)
            explanation = f"क्योंकि आप 'Yesterday' (बीते हुए कल) की बात कर रहे हैं, तो Past Simple (V2) का प्रयोग करें: '{m}' की जगह '{past}' आएगा।"
            topic_tag = "Past Simple"
            mistake = True

        # 3. "Did you went" / "Did you called"
        elif re.search(r"\bdid\s+(you|he|she|they)\s+(\w+ed|went|saw|came|took)\b", lower):
            match = re.search(r"\bdid\s+(you|he|she|they)\s+(\w+)\b", lower)
            subj = match.group(1)
            past_v = match.group(2)
            base_map = {"went": "go", "saw": "see", "came": "come", "took": "take", "called": "call", "finished": "finish", "asked": "ask"}
            base_v = base_map.get(past_v, re.sub(r"ed$", "", past_v))
            corrected = re.sub(rf"\bdid\s+{subj}\s+{past_v}\b", f"Did {subj} {base_v}", text, flags=re.IGNORECASE)
            explanation = f"जब वाक्य में 'Did' आ जाता है, तो मुख्य verb की पहली form (V1) आती है। 'Did {subj} {past_v}' नहीं, 'Did {subj} {base_v}' बोलें।"
            topic_tag = "Do, Does, Did"
            mistake = True

        # 4. "He don't know" / "She don't like"
        elif re.search(r"\b(he|she|it)\s+don't\b", lower):
            subj = re.search(r"\b(he|she|it)\b", lower).group(1)
            corrected = re.sub(r"\bdon't\b", "doesn't", text, flags=re.IGNORECASE)
            explanation = f"He, She और It के साथ 'don't' नहीं, 'doesn't' का प्रयोग होता है।"
            topic_tag = "Do, Does, Did"
            mistake = True

        # 5. "Myself [Name]"
        elif lower.startswith("myself "):
            name_part = text[7:].strip()
            corrected = f"I am {name_part}. (or My name is {name_part})"
            explanation = "'Myself' से वाक्य शुरू करना व्याकरण की दृष्टि से गलत माना जाता है। प्रोफेशनल रूप से 'I am...' या 'My name is...' कहें।"
            topic_tag = "Pronouns"
            mistake = True

        # 6. "I am having a car / laptop"
        elif re.search(r"\bi\s+am\s+having\s+(a|an|two|\d+)?\s*(car|laptop|phone|bike|sister|brother|job)\b", lower):
            corrected = re.sub(r"\bam\s+having\b", "have", text, flags=re.IGNORECASE)
            explanation = "कब्जा या अधिकार (Possession) दर्शाने के लिए 'having' नहीं, साधारण 'have' का उपयोग करें: 'I have a...'।"
            topic_tag = "Have, Has, Had"
            mistake = True

        # 7. "Since 2 years / Since 3 days"
        elif re.search(r"\bsince\s+\d+\s+(years|months|days|hours|weeks)\b", lower):
            corrected = re.sub(r"\bsince\b", "for", text, flags=re.IGNORECASE)
            explanation = "समय की अवधि (Duration) के लिए 'Since' नहीं, 'For' लगता है। जैसे: 'for 2 years'। 'Since' केवल शुरुआती बिंदु (Since 2022) के लिए आता है।"
            topic_tag = "Prepositions"
            mistake = True

        # 8. "He can speaks / I must to go"
        elif re.search(r"\b(can|could|should|would|must)\s+(\w+s|\bto\s+\w+)\b", lower):
            bad = re.search(r"\b(can|could|should|would|must)\s+(\w+s|\bto\s+\w+)\b", lower).group(0)
            fixed = re.sub(r"\bto\s+", "", bad)
            fixed = re.sub(r"s$", "", fixed)
            corrected = text.replace(bad, fixed)
            explanation = "Modal verbs (can, could, should, must) के बाद हमेशा Verb की मूल अवस्था (V1 बिना 's' या 'to') आती है।"
            topic_tag = "Modal Verbs"
            mistake = True

        # Build dynamic, scenario-aware conversational replies
        reply = self._build_scenario_reply(text, scenario, corrected if mistake else None)
        
        if mistake and corrected:
            repeat_prompt = f"Try repeating the corrected phrase: '{corrected}'"
        else:
            repeat_prompt = "Great sentence formation! Say your response out loud one more time with clear rhythm."

        return {
            "teacher_reply": reply,
            "has_mistake": bool(mistake),
            "corrected_sentence": corrected,
            "explanation_hinglish": explanation,
            "repeat_prompt": repeat_prompt,
            "topic_tag": topic_tag,
            "provider": "demo"
        }

    def _build_scenario_reply(self, text, scenario, correction=None):
        lower = text.lower()
        prefix = ""
        if correction:
            prefix = "That's a very good attempt! Notice how we refine it for natural flow. "

        if scenario == "job_interview":
            if any(w in lower for w in ["hello", "hi", "good morning", "myself", "name"]):
                return prefix + "Welcome to the interview! It is a pleasure to meet you. To start off, could you briefly introduce yourself and share what motivates you in your career?"
            elif any(w in lower for w in ["experience", "worked", "project", "skill", "company"]):
                return prefix + "That sounds like valuable hands-on experience. What was one major challenge you faced in your previous projects, and how did you resolve it?"
            elif any(w in lower for w in ["strength", "weakness", "learn", "hardworking"]):
                return prefix + "Self-awareness is key in professional growth. How do you handle constructive feedback when working closely in a team?"
            else:
                return prefix + "Thank you for explaining that clearly. Why do you believe you are the right fit for this role, and where do you see yourself in the next two years?"

        elif scenario == "ordering_cafe":
            if any(w in lower for w in ["menu", "coffee", "tea", "latte", "cappuccino", "order"]):
                return prefix + "Good afternoon! We have freshly brewed Americanos, creamy Lattes, and Masala Chai today. What size would you prefer: Regular or Large?"
            elif any(w in lower for w in ["sugar", "milk", "oat", "large", "small", "regular"]):
                return prefix + "Noted! Would you like to pair your drink with any fresh croissants, blueberry muffins, or savory sandwiches?"
            elif any(w in lower for w in ["bill", "check", "pay", "card", "upi", "cash"]):
                return prefix + "Certainly! Your total comes to 240 rupees. You can scan the QR code on the counter or tap your card. Would you like a printed receipt?"
            else:
                return prefix + "Hello! Welcome to Brew & Co. What can I get started for you today?"

        elif scenario == "daily_routine":
            if any(w in lower for w in ["wake", "morning", "breakfast", "tea", "exercise"]):
                return prefix + "Starting the day with a solid routine really sets a positive tone! What is the very first productive task you do after your morning tea?"
            elif any(w in lower for w in ["office", "work", "study", "college", "commute", "traffic"]):
                return prefix + "Commuting and daily schedules can get hectic. How do you manage your time during peak work hours to stay focused?"
            elif any(w in lower for w in ["evening", "night", "dinner", "sleep", "relax", "family"]):
                return prefix + "Winding down peacefully is so important. How much time do you usually set aside in the evening for your hobbies or English practice?"
            else:
                return prefix + "Tell me about your typical weekday. What time does your day normally begin, and what are your favorite morning habits?"

        elif scenario == "introducing_yourself":
            if any(w in lower for w in ["name", "live", "from", "delhi", "mumbai", "india", "student", "engineer"]):
                return prefix + "It's wonderful to get to know you! What hobbies or activities do you enjoy spending your free time on?"
            elif any(w in lower for w in ["hobby", "cricket", "music", "movies", "reading", "travel"]):
                return prefix + "That sounds fascinating! How often do you get to do that, and what is your favorite memory related to it?"
            else:
                return prefix + "Nice to meet you! Tell me where you are from and what you are currently focusing on in your life."

        # Default Free Chat
        if any(w in lower for w in ["hello", "hi", "hey"]):
            return prefix + "Hello! I am your SpeakUp AI speaking coach. I am right here with you to practice speaking naturally without any fear of mistakes. What would you like to talk about today?"
        elif any(w in lower for w in ["how are you", "how r u"]):
            return prefix + "I'm doing fantastic, thank you for asking! I'm excited to help you speak confidently. How has your day been going so far?"
        elif any(w in lower for w in ["nervous", "hesitant", "scared", "fear", "hesitate"]):
            return prefix + "It is completely normal to feel nervous. Even native speakers feel hesitant in new situations! Remember: making mistakes is the only way our brain creates new speaking pathways. Take a deep breath. What is one topic you are really passionate about?"
        else:
            return prefix + "That is an interesting thought! Could you elaborate a little more on that in two or three sentences? Practice speaking slowly and clearly."

ai_service = AIService()
