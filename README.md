# SpeakUp AI – Personal English Speaking Coach

**Speak English. Think Confidently.**

SpeakUp AI is a production-grade, AI-powered English learning web platform designed specifically for learners who understand English (70–90%) but hesitate and struggle to speak it fluently in real life.

---

## 🌟 Key Features

1. **AI Speaking Room (Most Important Feature)**
   - Interactive, real-time voice & text conversations across 6 real-world scenarios:
     - Job Interview Practice
     - Cafe & Restaurant Order
     - Daily Casual Chat
     - Introducing Yourself
     - Workplace Team Meeting
     - Travel & Asking Directions
   - **Friendly AI Coach ("Aarav Sir")**: Never shames students; gently identifies errors.
   - **Hinglish Explanations**: Tells the student *why* an error happened in Hindi.
   - **Speech-to-Text & Text-to-Speech**: Live microphone audio with waveform visualization and speech synthesis.
   - **Slow Speech Toggle (0.75x)**: For easier listening and accent comprehension.
   - **Repeat Prompts**: Oral muscle-memory exercises.

2. **Personal Grammar Coach (14 Structured Topics)**
   - Covers all 14 required topics:
     1. Is, Am, Are
     2. Was, Were
     3. Have, Has, Had
     4. Do, Does, Did
     5. Present Simple
     6. Present Continuous
     7. Past Simple
     8. Past Continuous
     9. Future Tenses (Will vs Going To)
     10. Sentence Formation (SVO vs SOV)
     11. WH Questions
     12. Pronouns & Possessives
     13. Prepositions (In, On, At, For, Since)
     14. Modal Verbs (Can, Could, Should, Would, Must)
   - Every topic includes:
     - Bilingual explanation in Hindi / Hinglish
     - Spoken English audio examples
     - Mental translation traps ("Don't say X, say Y")
     - Interactive quizzes with instant explanations
     - Speaking challenges using live microphone speech recognition
     - Confetti celebration upon completion

3. **Hindi Sentence Builder**
   - Type or speak any sentence in Hindi or Hinglish (e.g. *"मैं कल ऑफिस नहीं आ पाऊंगा क्योंकि मुझे डॉक्टर के पास जाना है"*).
   - AI translates it into natural English, analyzes Subject-Verb-Object (SVO) order, explains tense rules, offers 3 stylistic expressions (Formal, Spoken, Short), and generates an independent practice challenge with evaluation.

4. **English Assessment & Diagnostic**
   - Multi-part written and spoken evaluation.
   - Automatically calculates CEFR Level (A1, A2, B1, B2) and sub-scores for Grammar, Tenses, Vocabulary, Sentence Formation, and Spoken Confidence.
   - Includes transparent **pedagogical disclaimer** on assessment limitations.

5. **Student Dashboard & Daily Learning Routine**
   - Daily target tracking (30 minutes balanced routine).
   - 7-day speaking minutes trend chart.
   - AI Student Memory: Tracks repeated mistakes and weak areas.

6. **Modular AI Engine with Transparent Demo Mode**
   - Supports **Google Gemini**, **Groq**, and **OpenAI**.
   - If no API key is supplied, runs the built-in **Smart Local Grammar Engine** (Demo Mode) with zero API costs, clear labels, and full functionality.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Python Flask, SQLite (PostgreSQL compatible architecture), PBKDF2 SHA-256 secure auth.
- **Speech**: Browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).

---

## 🚀 Running the Project

### 1. Start the Flask Backend (Port 5000)
```bash
cd backend
python app.py
```

### 2. Start the Vite Frontend (Port 5173)
```bash
cd frontend
node ./node_modules/vite/bin/vite.js
```

Open your browser at `http://localhost:5173` to start learning!
