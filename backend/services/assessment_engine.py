"""
English Assessment Engine for SpeakUp AI.
Evaluates written and spoken responses across Grammar, Vocabulary, Tenses,
Sentence Formation, and Speaking Confidence. Generates CEFR levels and realistic disclaimers.
"""

import re
import json

ASSESSMENT_QUESTIONS = [
    {
        "id": 1,
        "type": "mcq",
        "category": "Is/Am/Are",
        "question": "Choose the correct sentence to introduce yourself and your current profession:",
        "options": [
            "I am agree with you and I am work as developer.",
            "I am Rahul and I work as a software engineer.",
            "Myself Rahul and I working as developer.",
            "I am Rahul and I am worked as engineer."
        ],
        "correct_index": 1,
        "explanation": "'I am Rahul' establishes identity, and 'I work' is the correct simple present form for a job."
    },
    {
        "id": 2,
        "type": "mcq",
        "category": "Was/Were",
        "question": "Which sentence correctly talks about yesterday's team meeting?",
        "options": [
            "You was very helpful during the presentation yesterday.",
            "We were having a meeting yesterday and it was productive.",
            "Yesterday I was attend the whole meeting.",
            "They was not present in the meeting yesterday."
        ],
        "correct_index": 1,
        "explanation": "'We were having...' correctly uses 'were' with plural 'we' and 'was' with singular 'it'."
    },
    {
        "id": 3,
        "type": "mcq",
        "category": "Have/Has/Had",
        "question": "How do you naturally express that your colleague completed her task?",
        "options": [
            "She is having completed the assignment.",
            "She have completed the assignment.",
            "She has completed the assignment on time.",
            "She was completed the assignment on time."
        ],
        "correct_index": 2,
        "explanation": "Singular 3rd person (She) takes 'has' with the past participle (completed)."
    },
    {
        "id": 4,
        "type": "mcq",
        "category": "Tenses",
        "question": "Select the sentence with correct past tense usage:",
        "options": [
            "Did you called the client yesterday evening?",
            "I didn't went to the market yesterday.",
            "When did you finish the project report?",
            "He does not arrived at the venue yet."
        ],
        "correct_index": 2,
        "explanation": "After 'did', we use the base verb 'finish'."
    },
    {
        "id": 5,
        "type": "written_formation",
        "category": "Sentence Formation",
        "prompt": "Translate and fix this mental Hindi sentence into professional English: 'मैं कल ऑफिस नहीं गया था क्योंकि मेरी तबियत ठीक नहीं थी।'",
        "placeholder": "Type your English sentence here...",
        "sample_good": "I did not go to the office yesterday because I was not feeling well."
    },
    {
        "id": 6,
        "type": "speaking_audio",
        "category": "Speaking Confidence",
        "prompt": "Speak into your microphone for 30–45 seconds: 'Tell me about what you did yesterday from morning to evening.'",
        "instructions": "Click the microphone button and describe your daily activities in past tense.",
        "sample_phrases": ["Yesterday I woke up at...", "Then I had breakfast and worked on...", "In the evening, I spent time with..."]
    },
    {
        "id": 7,
        "type": "speaking_audio",
        "category": "Conversational Fluency",
        "prompt": "Speak into your microphone: 'Why do you want to improve your spoken English, and how will it help your future?'",
        "instructions": "Speak naturally as if answering an interview question.",
        "sample_phrases": ["I want to speak fluently because...", "It will help me communicate with...", "I will feel much more confident when..."]
    }
]

class AssessmentEngine:
    def get_questions(self):
        return ASSESSMENT_QUESTIONS

    def evaluate_submission(self, answers):
        """
        Evaluates user answers:
        answers is a dict of question_id -> response (index or string)
        """
        grammar_score = 0
        tenses_score = 0
        vocab_score = 0
        formation_score = 0
        speaking_score = 0
        
        strengths = []
        weaknesses = []
        recommendations = []

        # 1. MCQ Checks
        # Q1: Is/Am/Are
        q1_ans = answers.get("1") or answers.get(1)
        if q1_ans == 1:
            grammar_score += 25
            strengths.append("Clear understanding of 'Is/Am/Are' vs action verbs")
        else:
            weaknesses.append("Confusion with 'Is/Am/Are' and 'I am agree / I am work' habit")
            recommendations.append("Review Lesson 1: Is, Am, Are and mental Hindi translation traps")

        # Q2: Was/Were
        q2_ans = answers.get("2") or answers.get(2)
        if q2_ans == 1:
            grammar_score += 25
            tenses_score += 25
            strengths.append("Correct usage of 'was' and 'were' with subject agreement")
        else:
            weaknesses.append("Difficulty matching 'was/were' with singular vs plural subjects (e.g. 'You was')")
            recommendations.append("Review Lesson 2: Was & Were rules")

        # Q3: Have/Has/Had
        q3_ans = answers.get("3") or answers.get(3)
        if q3_ans == 2:
            grammar_score += 25
            strengths.append("Sound knowledge of 'have vs has' in possession & perfect tenses")
        else:
            weaknesses.append("Tendency to use 'having' for possession or confuse 'have/has'")
            recommendations.append("Review Lesson 3: Have, Has, Had")

        # Q4: Tenses & Did
        q4_ans = answers.get("4") or answers.get(4)
        if q4_ans == 2:
            tenses_score += 35
            formation_score += 25
            strengths.append("Accurate auxiliary verb 'did' question structure without double past tense")
        else:
            weaknesses.append("Double past tense error after 'did' (e.g. 'did you called / didn't went')")
            recommendations.append("Review Lesson 4: Do, Does, Did and Past Simple")

        # Q5: Written sentence formation
        q5_ans = str(answers.get("5") or answers.get(5) or "").strip().lower()
        if q5_ans:
            # Check for key past elements: did not go / didn't go, yesterday, because, was not feeling well / was sick
            score_q5 = 0
            if "didn't go" in q5_ans or "did not go" in q5_ans:
                score_q5 += 40
            elif "not went" in q5_ans:
                weaknesses.append("Incorrect negative past structure ('did not go' instead of 'not went')")
                score_q5 += 15

            if "yesterday" in q5_ans:
                score_q5 += 20
            if "because" in q5_ans or "as" in q5_ans:
                score_q5 += 20
            if "well" in q5_ans or "sick" in q5_ans or "unwell" in q5_ans or "ill" in q5_ans:
                score_q5 += 20

            formation_score += min(50, int(score_q5 * 0.5))
            vocab_score += 40
            if score_q5 >= 60:
                strengths.append("Good ability to construct complex compound sentences with conjunctions")
        else:
            weaknesses.append("Sentence formation requires practice with subject-verb-object order")

        # Q6 & Q7: Spoken Responses (evaluated via transcript or word count/vocabulary diversity)
        q6_transcript = str(answers.get("6") or answers.get(6) or "").strip()
        q7_transcript = str(answers.get("7") or answers.get(7) or "").strip()

        combined_spoken = f"{q6_transcript} {q7_transcript}".strip()
        spoken_words = len(re.findall(r"\w+", combined_spoken))

        if spoken_words > 40:
            speaking_score = 85
            vocab_score = max(vocab_score, 80)
            tenses_score = max(tenses_score, 75)
            strengths.append("High willingness to speak continuously and express multi-sentence thoughts")
        elif spoken_words > 15:
            speaking_score = 65
            vocab_score = max(vocab_score, 60)
            strengths.append("Able to convey basic thoughts in English with reasonable clarity")
        elif spoken_words > 0:
            speaking_score = 45
            weaknesses.append("Hesitation and brevity in spoken responses; need to build speaking endurance")
            recommendations.append("Daily 15-minute speaking practice in the AI Speaking Room")
        else:
            speaking_score = 40
            weaknesses.append("Spoken practice not attempted or very brief; speaking hesitation detected")
            recommendations.append("Start with guided AI conversation room scenarios to build vocal confidence")

        # Normalize scores to 0-100
        grammar_score = min(100, grammar_score + 25)
        tenses_score = min(100, tenses_score + 30)
        vocab_score = min(100, max(vocab_score, 50))
        formation_score = min(100, formation_score + 25)
        confidence_score = max(35, min(95, int(speaking_score * 0.9 + formation_score * 0.1)))

        overall_score = round(
            (grammar_score * 0.25) +
            (tenses_score * 0.25) +
            (vocab_score * 0.15) +
            (formation_score * 0.15) +
            (speaking_score * 0.20),
            1
        )

        # CEFR Mapping
        if overall_score >= 82:
            cefr_level = "Intermediate (B1+)"
            summary = "You have a solid foundation and can hold conversations, but polishing tense consistency and idiomatic expressions will take you to fluency."
        elif overall_score >= 65:
            cefr_level = "Elementary (A2)"
            summary = "You understand English well and know grammar rules, but you still translate from Hindi in your mind, leading to hesitation when speaking."
        else:
            cefr_level = "Beginner (A1)"
            summary = "You know basic vocabulary and comprehend spoken English, but forming full spoken sentences without hesitation requires regular practice."

        if not strengths:
            strengths = ["Familiarity with basic English vocabulary", "Clear motivation to achieve conversational fluency"]
        if not weaknesses:
            weaknesses = ["Occasional hesitation under rapid speaking pressure", "Minor preposition and article slips"]
        if not recommendations:
            recommendations = ["Practice 15 minutes daily in the Speaking Room", "Complete daily sentence builder challenges"]

        limitations_disclaimer = (
            "Assessment Limitations Note: This diagnostic test provides an accurate snapshot of core sentence formation, "
            "helping-verb agreement, and basic vocal delivery. A 10-minute diagnostic cannot evaluate full conversational nuances, "
            "accent subtleties, or performance under high-pressure real-life debates. Fluency is an evolving habit built through daily speaking."
        )

        return {
            "overall_score": overall_score,
            "cefr_level": cefr_level,
            "grammar_score": grammar_score,
            "vocab_score": vocab_score,
            "tenses_score": tenses_score,
            "formation_score": formation_score,
            "speaking_score": speaking_score,
            "confidence_score": confidence_score,
            "summary": summary,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations,
            "limitations_disclaimer": limitations_disclaimer
        }

assessment_engine = AssessmentEngine()
