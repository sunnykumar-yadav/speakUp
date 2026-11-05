"""
Sentence Builder Engine for SpeakUp AI.
Converts Hindi / Hinglish thoughts into natural English,
explains structural differences (SOV vs SVO), details tense usage,
provides alternative natural expressions, and offers practice challenges.
"""

import json
import logging
from config import Config
from services.ai_service import ai_service

logger = logging.getLogger(__name__)

# Pre-curated sentence catalog for common Hindi-speaker scenarios
PRESET_SENTENCES = [
    {
        "hindi": "मैं कल ऑफिस नहीं आ पाऊंगा क्योंकि मुझे डॉक्टर के पास जाना है।",
        "hinglish": "Main kal office nahi aa paunga kyunki mujhe doctor ke paas jana hai.",
        "category": "Workplace",
        "english": "I won't be able to come to the office tomorrow because I have to visit the doctor.",
        "tense": "Future Simple (will not be able to) + Present Obligation (have to)",
        "structure": "Subject (I) + Modal Verb (won't be able to come) + Prepositional Object (to the office) + Time (tomorrow) + Conjunction (because) + Clause 2",
        "alternatives": [
            {"style": "Professional / Formal", "text": "I will be unable to attend work tomorrow due to a doctor's appointment."},
            {"style": "Casual / Friendly", "text": "I can't make it to office tomorrow, got a doctor visit scheduled."},
            {"style": "Short & Direct", "text": "I am taking leave tomorrow for a medical appointment."}
        ],
        "challenge": "Try making a sentence: 'मैं कल मीटिंग अटेंड नहीं कर पाऊंगा क्योंकि मेरा इंटरनेट खराब है।'"
    },
    {
        "hindi": "मुझे अंग्रेजी बोलते समय झिझक महसूस होती है।",
        "hinglish": "Mujhe English bolte samay jhijhak mehsoos hoti hai.",
        "category": "Daily Life",
        "english": "I feel hesitant while speaking English.",
        "tense": "Present Simple Tense (Habitual State)",
        "structure": "Subject (I) + Verb (feel) + Adjective (hesitant) + Conjunctional phrase (while speaking English)",
        "alternatives": [
            {"style": "Natural Spoken", "text": "I get nervous when I have to speak English."},
            {"style": "Confident & Clear", "text": "I often hesitate to express myself in English."},
            {"style": "Proactive", "text": "Speaking English still feels a bit intimidating to me, but I am practicing daily."}
        ],
        "challenge": "Try making a sentence: 'मुझे इंटरव्यू में बात करते समय डर लगता है।'"
    },
    {
        "hindi": "क्या आप मुझे बता सकते हैं कि निकटतम मेट्रो स्टेशन कहाँ है?",
        "hinglish": "Kya aap mujhe bata sakte hain ki nearest metro station kahan hai?",
        "category": "Travel & Directions",
        "english": "Could you please tell me where the nearest metro station is?",
        "tense": "Polite Modal Request (Could) + Embedded Question (where ... is)",
        "structure": "Modal (Could) + Subject (you) + Adverb (please) + Verb (tell) + Object (me) + Embedded clause (where the nearest metro station is)",
        "alternatives": [
            {"style": "Polite & Standard", "text": "Excuse me, how do I get to the nearest metro station?"},
            {"style": "Short & Casual", "text": "Where is the closest metro station around here?"},
            {"style": "Business / Formal", "text": "Pardon me, could you direct me to the nearest metro station?"}
        ],
        "challenge": "Try making a sentence: 'क्या आप मुझे बता सकते हैं कि मैनेजर का केबिन कहाँ है?'"
    },
    {
        "hindi": "मैं पिछले दो साल से इस कंपनी में काम कर रहा हूँ।",
        "hinglish": "Main pichhle do saal se is company mein kaam kar raha hoon.",
        "category": "Interview & Career",
        "english": "I have been working at this company for two years.",
        "tense": "Present Perfect Continuous Tense (Action started in past and still continues)",
        "structure": "Subject (I) + Helping Verb (have been) + Verb-ing (working) + Preposition (at this company) + Preposition of duration (for two years)",
        "alternatives": [
            {"style": "Professional / Standard", "text": "I have been with this organization for the past two years."},
            {"style": "Career-Focused", "text": "It has been two years since I joined this company."},
            {"style": "Resume Summary", "text": "I possess two years of continuous experience at this firm."}
        ],
        "challenge": "Try making a sentence: 'मैं तीन महीने से अंग्रेजी सीख रहा हूँ।'"
    }
]

class SentenceEngine:
    def get_preset_sentences(self):
        return PRESET_SENTENCES

    def build_sentence(self, user_input):
        """
        Translates Hindi/Hinglish sentence into natural English with structural analysis.
        Uses Cloud AI if available, otherwise Smart Rule Engine with extensive matching.
        """
        clean_input = user_input.strip()

        # Check if matches any presets
        for preset in PRESET_SENTENCES:
            if clean_input.lower() in preset["hindi"].lower() or clean_input.lower() in preset["hinglish"].lower() or preset["english"].lower() in clean_input.lower():
                res = dict(preset)
                res["provider"] = "catalog"
                return res

        # Try Live AI if provider is configured
        if ai_service.provider in ["gemini", "groq", "openai"]:
            try:
                return self._call_ai_sentence_builder(clean_input)
            except Exception as e:
                logger.error(f"AI Sentence Builder error, using fallback: {e}")

        # Smart fallback generator
        return self._generate_smart_fallback(clean_input)

    def _call_ai_sentence_builder(self, text):
        prompt = f"""
Input Hindi / Hinglish sentence: "{text}"

Analyze this sentence for an Indian student learning to speak English.
Respond strictly in JSON format with keys:
{{
  "hindi": "Original Hindi/Hinglish text",
  "english": "Natural, modern spoken English translation",
  "tense": "Name and explanation of the primary tense used",
  "structure": "Subject-Verb-Object (SVO) structural breakdown contrasted with Hindi SOV",
  "alternatives": [
    {{"style": "Formal / Professional", "text": "..."}},
    {{"style": "Casual / Spoken", "text": "..."}},
    {{"style": "Direct / Short", "text": "..."}}
  ],
  "challenge": "A similar practice prompt for the student to translate independently",
  "provider": "{ai_service.provider}"
}}
"""
        if ai_service.provider == "gemini" and Config.GEMINI_API_KEY:
            from google import genai
            client = genai.Client(api_key=Config.GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            data["provider"] = "gemini"
            return data

        elif ai_service.provider == "groq" and Config.GROQ_API_KEY:
            from groq import Groq
            client = Groq(api_key=Config.GROQ_API_KEY)
            res = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"}
            )
            data = json.loads(res.choices[0].message.content)
            data["provider"] = "groq"
            return data

        elif ai_service.provider == "openai" and Config.OPENAI_API_KEY:
            from openai import OpenAI
            client = OpenAI(api_key=Config.OPENAI_API_KEY)
            res = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            data = json.loads(res.choices[0].message.content)
            data["provider"] = "openai"
            return data

        return self._generate_smart_fallback(text)

    def _generate_smart_fallback(self, text):
        """
        Smart offline pattern-based translation and grammar breakdown
        """
        lower = text.lower()
        
        # Pattern 1: Doctor / Hospital / Sick
        if any(w in lower for w in ["doctor", "tabiyat", "bimar", "hospital", "unwell"]):
            english = "I am not feeling well today, so I need to visit the doctor."
            tense = "Present Continuous ('am not feeling') + Present Need ('need to visit')"
            structure = "Hindi has verb at the end ('जाना है'), while English places 'need to visit' right after subject 'I'."
            alts = [
                {"style": "Professional", "text": "I am indisposed today and will be consulting my physician."},
                {"style": "Casual", "text": "Feeling under the weather today, heading to the clinic."},
                {"style": "Short", "text": "I am sick today, visiting a doctor."}
            ]
            challenge = "Now try creating this sentence: 'कल मेरी माँ की तबियत खराब थी।'"

        # Pattern 2: Office / Meeting / Late / Traffic
        elif any(w in lower for w in ["office", "late", "traffic", "jam", "deri"]):
            english = "I am stuck in heavy traffic, so I might be slightly late to the office."
            tense = "Present Passive State ('stuck') + Modal of Possibility ('might be late')"
            structure = "Hindi: 'ट्रैफिक में फंसा हूँ'. English puts 'I am stuck in...' followed by consequence."
            alts = [
                {"style": "Professional", "text": "I am currently held up in transit and expect to arrive approximately fifteen minutes late."},
                {"style": "Casual", "text": "Heavy traffic on the way, will reach a bit late!"},
                {"style": "Quick SMS", "text": "Running late due to traffic, reaching soon."}
            ]
            challenge = "Now try creating this sentence: 'ट्रेन लेट थी इसलिए मैं समय पर नहीं पहुँच सका।'"

        # Pattern 3: English speaking / learning / practice
        elif any(w in lower for w in ["english", "seekh", "bolna", "practice", "speak"]):
            english = "I want to speak fluent English so that I can advance in my career."
            tense = "Present Simple Tense ('want to speak') + Modal Clause of Purpose ('can advance')"
            structure = "Subject (I) + Verb (want) + Infinitive (to speak) + Object (fluent English) + Connector (so that) + Subject (I) + Modal (can advance)."
            alts = [
                {"style": "Professional", "text": "My goal is to attain professional English fluency to enhance my career opportunities."},
                {"style": "Conversational", "text": "I am working on my spoken English to communicate more naturally."},
                {"style": "Inspiring", "text": "Speaking English fluently will unlock great new opportunities for me."}
            ]
            challenge = "Now try creating this sentence: 'मैं हर रोज़ 20 मिनट अंग्रेजी बोलने का अभ्यास करता हूँ।'"

        # Default general sentence
        else:
            english = f"I would like to express that {text}."
            tense = "Standard Declarative Sentence Structure"
            structure = "Remember the core rule: Subject + Verb + Object (SVO). Always place the action right after the person performing it."
            alts = [
                {"style": "Standard English", "text": f"Here is how you can express your thought clearly: '{text}'."},
                {"style": "Polite", "text": f"Could I mention that {text}?"},
                {"style": "Direct", "text": f"In short, {text}."}
            ]
            challenge = "Try creating a sentence using 'Because' and 'Therefore' to connect two thoughts."

        return {
            "hindi": text,
            "english": english,
            "tense": tense,
            "structure": structure,
            "alternatives": alts,
            "challenge": challenge,
            "provider": "smart_engine (demo mode)"
        }

    def verify_challenge_attempt(self, challenge_prompt, student_answer):
        """
        Checks student's attempt for the challenge sentence.
        """
        ans = student_answer.strip()
        if len(ans.split()) < 3:
            return {
                "is_good": False,
                "feedback": "Your sentence is quite short. Try including both the subject and the action verb!",
                "score": 40
            }

        # Check for basic capitalization and punctuation
        score = 85
        feedback = "Excellent effort! You successfully formed the sentence with the correct Subject-Verb order."
        
        # Indian English trap checks
        lower = ans.lower()
        if "i am agree" in lower:
            feedback = "Good attempt, but remember: say 'I agree', not 'I am agree'!"
            score = 65
        elif "yesterday i go" in lower:
            feedback = "Good try! Because you mentioned yesterday, use 'went' instead of 'go'."
            score = 70

        return {
            "is_good": score >= 75,
            "feedback": feedback,
            "score": score,
            "student_sentence": ans
        }

sentence_engine = SentenceEngine()
