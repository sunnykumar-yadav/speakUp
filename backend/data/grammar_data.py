"""
Data for the 14 structured grammar topics required for SpeakUp AI.
Each topic includes:
- Hindi & English explanations
- Clear mental translation traps (Hindi to English translation traps)
- Pronunciation and usage rules
- Real life examples
- Interactive quiz questions with explanations
- Speaking practice prompts
"""

GRAMMAR_TOPICS_DATA = [
    {
        "id": 1,
        "slug": "is-am-are",
        "title": "Is, Am, Are (Helping Verbs)",
        "hindi_title": "Is, Am, Are का सही इस्तेमाल (वर्तमान स्थिति)",
        "description_hindi": "जब हम किसी इंसान, वस्तु या भावना की वर्तमान स्थिति (State of Being) या पहचान बताते हैं, तब Is, Am, Are का उपयोग होता है।",
        "description_english": "Used to describe the current state, identity, location, or continuous action of a subject.",
        "key_rule": "I -> am | He, She, It, Singular -> is | You, We, They, Plural -> are",
        "common_mistake": "Don't say 'I am work here'. Say 'I work here' or 'I am working here'.",
        "icon": "UserCheck",
        "level": "Beginner (A1)",
        "content": {
            "concept_explanation": "बहुत से भारतीय छात्र 'मैं खुश हूँ' का अनुवाद 'I am happy' करते हैं जो सही है, लेकिन 'मैं जाता हूँ' को 'I am go' बोल देते हैं जो गलत है! जब कोई क्रिया (Action) होती है, तो साधारण Present Tense में Is/Am/Are नहीं लगता। Is/Am/Are केवल पहचान (Identity) या चल रहे काम (ing) में आता है।",
            "formula": "Subject + is/am/are + Complement/Noun/Adjective OR Verb+ing",
            "examples": [
                {"english": "I am confident.", "hindi": "मैं आत्मविश्वासी हूँ।", "highlight": "am"},
                {"english": "She is a software engineer.", "hindi": "वह एक सॉफ्टवेयर इंजीनियर है।", "highlight": "is"},
                {"english": "They are ready for the meeting.", "hindi": "वे मीटिंग के लिए तैयार हैं।", "highlight": "are"},
                {"english": "We are learning to speak English fluently.", "hindi": "हम धाराप्रवाह अंग्रेजी बोलना सीख रहे हैं।", "highlight": "are"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "He is agree with me.",
                    "correct": "He agrees with me.",
                    "explanation": "'Agree' एक verb (क्रिया) है, adjective नहीं। इसलिए 'is agree' नहीं, 'agrees' आएगा।"
                },
                {
                    "wrong": "I am know the answer.",
                    "correct": "I know the answer.",
                    "explanation": "Normal habit or knowledge बताने के लिए 'am' की जरूरत नहीं है।"
                }
            ],
            "quizzes": [
                {
                    "question": "Fill in the blank: Priya and Rahul _____ working on the presentation.",
                    "options": ["is", "are", "am", "be"],
                    "correctIndex": 1,
                    "explanation": "Because Priya and Rahul are two people (plural subject), we use 'are'."
                },
                {
                    "question": "Choose the correct sentence:",
                    "options": ["I am understand the problem.", "I understand the problem.", "I is understand the problem.", "I am understood."],
                    "correctIndex": 1,
                    "explanation": "In simple present tense for stative verbs like understand, do not add 'am'."
                },
                {
                    "question": "Which helping verb fits: 'The weather today _____ quite pleasant'?",
                    "options": ["are", "am", "is", "were"],
                    "correctIndex": 2,
                    "explanation": "'The weather' is an uncountable singular noun, so it takes 'is'."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'I am ready to speak English with confidence.'",
                    "expected_text": "I am ready to speak English with confidence.",
                    "target_word": "am"
                },
                {
                    "prompt": "Say: 'She is my manager and she is very supportive.'",
                    "expected_text": "She is my manager and she is very supportive.",
                    "target_word": "is"
                }
            ]
        }
    },
    {
        "id": 2,
        "slug": "was-were",
        "title": "Was & Were (Past States)",
        "hindi_title": "Was और Were का सही इस्तेमाल (भूतकाल की स्थिति)",
        "description_hindi": "बीते हुए कल (Past) में कोई क्या था, कहाँ था, या कैसा महसूस कर रहा था, यह बताने के लिए Was और Were का प्रयोग किया जाता है।",
        "description_english": "Used for past states of being, conditions, locations, or continuous actions.",
        "key_rule": "I, He, She, It, Singular -> was | You, We, They, Plural -> were",
        "common_mistake": "Pronunciation: 'Were' is pronounced like /wur/, not /ware/ (वेयर).",
        "icon": "Clock",
        "level": "Beginner (A1)",
        "content": {
            "concept_explanation": "जब हिंदी में 'था, थी, थे' आता है और मुख्य क्रिया नहीं होती, तब Was या Were लगता है। याद रखें: 'You' चाहे एक व्यक्ति के लिए हो या अनेक के लिए, हमेशा 'Were' लेता है ('You was' कभी नहीं होता!)।",
            "formula": "Subject + was/were + Noun/Adjective/Prepositional Phrase OR Verb+ing",
            "examples": [
                {"english": "I was very nervous in my first interview.", "hindi": "मैं अपने पहले इंटरव्यू में बहुत नर्वस था।", "highlight": "was"},
                {"english": "You were completely right about the deadline.", "hindi": "डेडलाइन के बारे में आप बिल्कुल सही थे।", "highlight": "were"},
                {"english": "We were waiting for your phone call.", "hindi": "हम आपके फोन कॉल का इंतजार कर रहे थे।", "highlight": "were"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "You was looking very happy.",
                    "correct": "You were looking very happy.",
                    "explanation": "You हमेशा 'were' लेता है, भले ही आप एक ही व्यक्ति से बात कर रहे हों।"
                },
                {
                    "wrong": "I was go to office yesterday.",
                    "correct": "I went to the office yesterday.",
                    "explanation": "Past simple में सीधे 2nd form of verb (went) आती है, 'was go' नहीं।"
                }
            ],
            "quizzes": [
                {
                    "question": "Choose the correct verb: 'Yesterday, the client _____ very satisfied with our demo.'",
                    "options": ["were", "was", "is", "are"],
                    "correctIndex": 1,
                    "explanation": "'The client' is singular, so in the past tense we use 'was'."
                },
                {
                    "question": "Select the grammatically correct sentence:",
                    "options": ["Where was you yesterday evening?", "Where were you yesterday evening?", "Where are you yesterday evening?", "Where did you was yesterday?"],
                    "correctIndex": 1,
                    "explanation": "'You' always takes 'were' in past questions."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'Yesterday I was busy, but today I am completely free.'",
                    "expected_text": "Yesterday I was busy, but today I am completely free.",
                    "target_word": "was"
                },
                {
                    "prompt": "Say: 'We were nervous earlier, but now we are confident.'",
                    "expected_text": "We were nervous earlier, but now we are confident.",
                    "target_word": "were"
                }
            ]
        }
    },
    {
        "id": 3,
        "slug": "have-has-had",
        "title": "Have, Has & Had (Possession & Perfect Tense)",
        "hindi_title": "Have, Has, Had का सही इस्तेमाल (अधिकार और पूर्ण कार्य)",
        "description_hindi": "पास में कोई चीज़ होना (Possession) या किसी काम का पूरा हो जाना (Perfect Tense) बताने के लिए इनका उपयोग होता है।",
        "description_english": "Used to show possession, relationships, illnesses, and in perfect tenses with Past Participle (V3).",
        "key_rule": "Present: He/She/It -> has | I/You/We/They -> have || Past: Everyone -> had",
        "common_mistake": "Never say 'I am having a car' to show ownership. Say 'I have a car'.",
        "icon": "Briefcase",
        "level": "Beginner (A2)",
        "content": {
            "concept_explanation": "जब आपके पास कोई चीज़ है (जैसे 'मेरे पास एक लैपटॉप है'), तो कहिए 'I have a laptop'। 'I am having a laptop' मत कहिए! 'Having' केवल खाने-पीने (I am having lunch) या अनुभव (I am having fun) में आता है।",
            "formula": "Possession: Subject + have/has/had + Object | Perfect: Subject + have/has/had + V3",
            "examples": [
                {"english": "I have two years of work experience.", "hindi": "मेरे पास दो साल का कार्य अनुभव है।", "highlight": "have"},
                {"english": "She has completed her master's degree.", "hindi": "उसने अपनी मास्टर डिग्री पूरी कर ली है।", "highlight": "has"},
                {"english": "We had already discussed this topic last week.", "hindi": "हमने पिछले हफ्ते इस विषय पर पहले ही चर्चा कर ली थी।", "highlight": "had"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "I am having two sisters.",
                    "correct": "I have two sisters.",
                    "explanation": "संबंध (relationships) या अधिकार (possession) में 'having' नहीं, 'have' इस्तेमाल करें।"
                },
                {
                    "wrong": "She have a nice car.",
                    "correct": "She has a nice car.",
                    "explanation": "He/She/It singular subjects के साथ 'has' आता है।"
                }
            ],
            "quizzes": [
                {
                    "question": "Which sentence correctly shows ownership?",
                    "options": ["I am having a laptop.", "I have a laptop.", "I having a laptop.", "I has a laptop."],
                    "correctIndex": 1,
                    "explanation": "'I have a laptop' is standard. 'Having' is not used for static possession."
                },
                {
                    "question": "Complete: 'Aman _____ submitted the project report.'",
                    "options": ["have", "has", "is", "having"],
                    "correctIndex": 1,
                    "explanation": "Aman is 3rd person singular, so we use 'has' with the past participle 'submitted'."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'I have a strong desire to improve my spoken English.'",
                    "expected_text": "I have a strong desire to improve my spoken English.",
                    "target_word": "have"
                },
                {
                    "prompt": "Say: 'She has already finished her morning presentation.'",
                    "expected_text": "She has already finished her morning presentation.",
                    "target_word": "has"
                }
            ]
        }
    },
    {
        "id": 4,
        "slug": "do-does-did",
        "title": "Do, Does & Did (Questions & Negatives)",
        "hindi_title": "Do, Does, Did का इस्तेमाल (सवाल और नकारात्मक वाक्य)",
        "description_hindi": "Present और Past simple में सवाल पूछने और 'नहीं' (Negative) बोलने के लिए Do, Does और Did का उपयोग किया जाता है।",
        "description_english": "Used as auxiliary verbs for questions, negatives, and emphasis in Simple Present and Simple Past.",
        "key_rule": "Present: He/She/It -> does/doesn't | I/You/We/They -> do/don't || Past: Everyone -> did/didn't",
        "common_mistake": "After does/did, always use base verb (V1): 'He doesn't knows' is WRONG! Say 'He doesn't know'.",
        "icon": "HelpCircle",
        "level": "Beginner (A2)",
        "content": {
            "concept_explanation": "यह गलती 90% भारतीय छात्र करते हैं: जब आप 'does' या 'did' लगा देते हैं, तो मुख्य verb की 's/es' या 2nd form हट जाती है और पहली form (V1) आती है! जैसे: 'He doesn't know' (not knows), 'Did you go?' (not Did you went).",
            "formula": "Negative: Subject + do/does/did + not + Base Verb (V1) | Question: Do/Does/Did + Subject + Base Verb?",
            "examples": [
                {"english": "Do you speak English at work?", "hindi": "क्या आप काम पर अंग्रेजी बोलते हैं?", "highlight": "Do"},
                {"english": "He doesn't understand the problem yet.", "hindi": "वह अभी तक समस्या को नहीं समझता है।", "highlight": "doesn't"},
                {"english": "Did you receive my email this morning?", "hindi": "क्या आपको आज सुबह मेरा ईमेल मिला?", "highlight": "Did"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "Did you went there yesterday?",
                    "correct": "Did you go there yesterday?",
                    "explanation": "Did पहले से past tense दर्शा रहा है, इसलिए उसके बाद 'go' (V1) आएगा, 'went' नहीं।"
                },
                {
                    "wrong": "She does not likes tea.",
                    "correct": "She does not like tea.",
                    "explanation": "Does में 'es' पहले से जुड़ा हुआ है, इसलिए 'like' में 's' नहीं लगेगा।"
                }
            ],
            "quizzes": [
                {
                    "question": "Correct the error: 'Why did you called him?'",
                    "options": ["Why did you call him?", "Why do you called him?", "Why were you call him?", "Why did you calls him?"],
                    "correctIndex": 0,
                    "explanation": "After 'did', we must use the base verb 'call'."
                },
                {
                    "question": "Which sentence is correct?",
                    "options": ["He don't like coffee.", "He doesn't likes coffee.", "He doesn't like coffee.", "He not like coffee."],
                    "correctIndex": 2,
                    "explanation": "Third-person singular takes 'doesn't' + base verb 'like'."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'Do you practice English speaking every single day?'",
                    "expected_text": "Do you practice English speaking every single day?",
                    "target_word": "Do"
                },
                {
                    "prompt": "Say: 'I did not understand that sentence, could you repeat it?'",
                    "expected_text": "I did not understand that sentence, could you repeat it?",
                    "target_word": "did not"
                }
            ]
        }
    },
    {
        "id": 5,
        "slug": "present-simple",
        "title": "Present Simple Tense (Daily Habits & Routines)",
        "hindi_title": "Present Simple Tense (दैनिक आदतें और सामान्य सत्य)",
        "description_hindi": "अपनी रोजमर्रा की आदतें, दिनचर्या (Daily Routine), और शाश्वत सत्य (Universal Truths) बताने के लिए।",
        "description_english": "Used for repeated actions, habits, daily routines, facts, and permanent situations.",
        "key_rule": "Subject + V1 (+ s/es for He/She/It)",
        "common_mistake": "Forgetting the 's/es' with He/She/It. Don't say 'My brother work in Delhi'. Say 'My brother works in Delhi'.",
        "icon": "Sun",
        "level": "Beginner (A1-A2)",
        "content": {
            "concept_explanation": "जब भी आप अपनी दिनचर्या बताते हैं (जैसे: मैं सुबह 7 बजे उठता हूँ, चाय पीता हूँ), तो हमेशा Present Simple इस्तेमाल करें। यहाँ Is/Am/Are नहीं आता!",
            "formula": "Positive: Subject + V1 (s/es) | Negative: Subject + do/does + not + V1",
            "examples": [
                {"english": "I wake up at six thirty every morning.", "hindi": "मैं हर सुबह साढ़े छह बजे उठता हूँ।", "highlight": "wake up"},
                {"english": "My manager speaks very clearly.", "hindi": "मेरे मैनेजर बहुत स्पष्ट रूप से बोलते हैं।", "highlight": "speaks"},
                {"english": "The sun rises in the east.", "hindi": "सूरज पूर्व में उगता है।", "highlight": "rises"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "I am working at Google (to mean your permanent profession).",
                    "correct": "I work at Google.",
                    "explanation": "स्थायी नौकरी (permanent job) के लिए Present Simple 'I work' कहना अधिक स्वाभाविक है।"
                }
            ],
            "quizzes": [
                {
                    "question": "Fill in the blank: 'Rohit _____ his emails first thing in the morning.'",
                    "options": ["check", "checks", "is checking", "checked"],
                    "correctIndex": 1,
                    "explanation": "Rohit is a singular subject, so the verb takes 's' -> 'checks'."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'I practice speaking English for twenty minutes every evening.'",
                    "expected_text": "I practice speaking English for twenty minutes every evening.",
                    "target_word": "practice"
                }
            ]
        }
    },
    {
        "id": 6,
        "slug": "present-continuous",
        "title": "Present Continuous Tense (Happening Right Now)",
        "hindi_title": "Present Continuous Tense (जो अभी हो रहा है)",
        "description_hindi": "जो काम इस समय आपकी आँखों के सामने या वर्तमान दौर में चल रहा है (रहा है, रही है, रहे हैं)।",
        "description_english": "Used for actions happening right at this moment or around the present time.",
        "key_rule": "Subject + is/am/are + Verb-ing",
        "common_mistake": "Using continuous tense for sense/thinking verbs: 'I am knowing' is wrong. Say 'I know'.",
        "icon": "PlayCircle",
        "level": "Beginner (A1-A2)",
        "content": {
            "concept_explanation": "जब काम अभी हो रहा हो: 'I am talking to you right now'. लेकिन ध्यान रखें: 'love, hate, like, understand, believe, know' जैसी क्रियाओं में सामान्यतः 'ing' नहीं लगता।",
            "formula": "Subject + is/am/are + Verb-ing + Object",
            "examples": [
                {"english": "I am improving my English pronunciation.", "hindi": "मैं अपना अंग्रेजी उच्चारण सुधार रहा हूँ।", "highlight": "am improving"},
                {"english": "The team is discussing the project requirements.", "hindi": "टीम प्रोजेक्ट की आवश्यकताओं पर चर्चा कर रही है।", "highlight": "is discussing"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "I am understanding what you mean.",
                    "correct": "I understand what you mean.",
                    "explanation": "'Understand' एक stative verb है, इसलिए 'I understand' कहें।"
                }
            ],
            "quizzes": [
                {
                    "question": "Choose the correct sentence:",
                    "options": ["We are prepare for the exam.", "We are preparing for the exam.", "We preparing for the exam.", "We is preparing for the exam."],
                    "correctIndex": 1,
                    "explanation": "'We are preparing' has both the helping verb 'are' and '-ing' form."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'I am speaking English right now without any fear.'",
                    "expected_text": "I am speaking English right now without any fear.",
                    "target_word": "am speaking"
                }
            ]
        }
    },
    {
        "id": 7,
        "slug": "past-simple",
        "title": "Past Simple Tense (Finished Past Actions)",
        "hindi_title": "Past Simple Tense (बीते समय में पूरा हुआ काम)",
        "description_hindi": "जब कोई काम बीते समय में किसी निश्चित समय पर पूरा हो गया (गया, आया, देखा, किया)।",
        "description_english": "Used for actions that started and finished at a specific time in the past.",
        "key_rule": "Subject + V2 (Past form of verb)",
        "common_mistake": "Don't use 'was' before V2. Say 'I called him', NOT 'I was called him'.",
        "icon": "Calendar",
        "level": "Intermediate (A2-B1)",
        "content": {
            "concept_explanation": "Past Simple अंग्रेजी बोलने का सबसे महत्वपूर्ण Tense है! जब भी आप कल, पिछले हफ्ते या बचपन की बात करें: Subject + V2 लगाएं। उदा: 'I went to Mumbai last month'.",
            "formula": "Positive: Subject + V2 | Negative: Subject + did not + V1 | Question: Did + Subject + V1?",
            "examples": [
                {"english": "I graduated from university in 2023.", "hindi": "मैंने 2023 में विश्वविद्यालय से स्नातक किया।", "highlight": "graduated"},
                {"english": "We launched our new software yesterday.", "hindi": "हमने कल अपना नया सॉफ्टवेयर लॉन्च किया।", "highlight": "launched"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "I was attended the meeting yesterday.",
                    "correct": "I attended the meeting yesterday.",
                    "explanation": "'Was attended' passive बन जाता है। Active वाक्य में सिर्फ 'attended' कहें।"
                }
            ],
            "quizzes": [
                {
                    "question": "Select the correct past form: 'Last night I _____ a very interesting podcast.'",
                    "options": ["listen", "listened", "was listened", "am listening"],
                    "correctIndex": 1,
                    "explanation": "Past simple active sentence requires V2: 'listened'."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'Yesterday, I completed all my scheduled tasks on time.'",
                    "expected_text": "Yesterday, I completed all my scheduled tasks on time.",
                    "target_word": "completed"
                }
            ]
        }
    },
    {
        "id": 8,
        "slug": "past-continuous",
        "title": "Past Continuous Tense (In-Progress in the Past)",
        "hindi_title": "Past Continuous Tense (अतीत में चल रहा कार्य)",
        "description_hindi": "बीते हुए समय में जब कोई काम किसी निश्चित पल पर चल रहा था (कर रहा था, जा रहा था)।",
        "description_english": "Used for actions that were ongoing at a specific moment in the past.",
        "key_rule": "Subject + was/were + Verb-ing",
        "common_mistake": "Often used together with Past Simple: 'When the phone rang, I was taking a shower.'",
        "icon": "FastForward",
        "level": "Intermediate (B1)",
        "content": {
            "concept_explanation": "जब अतीत में कोई लंबा काम चल रहा था और बीच में कोई दूसरा काम हुआ, तो लंबे काम के लिए Past Continuous (was/were + ing) और छोटे व्यवधान के लिए Past Simple (V2) आता है।",
            "formula": "Subject + was/were + Verb-ing + Object",
            "examples": [
                {"english": "I was working on my laptop when the power went out.", "hindi": "मैं अपने लैपटॉप पर काम कर रहा था जब बिजली चली गई।", "highlight": "was working"},
                {"english": "They were discussing the budget throughout the morning.", "hindi": "वे पूरी सुबह बजट पर चर्चा कर रहे थे।", "highlight": "were discussing"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "While I drove, it started raining.",
                    "correct": "While I was driving, it started raining.",
                    "explanation": "चालू क्रिया के लिए 'was driving' लगाना अधिक स्वाभाविक है।"
                }
            ],
            "quizzes": [
                {
                    "question": "Fill in the blank: 'At 8 PM yesterday, we _____ dinner.'",
                    "options": ["were having", "was having", "had", "are having"],
                    "correctIndex": 0,
                    "explanation": "Subject 'we' takes 'were having' for an ongoing past action at a specific time."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'I was preparing my notes when my manager called me.'",
                    "expected_text": "I was preparing my notes when my manager called me.",
                    "target_word": "was preparing"
                }
            ]
        }
    },
    {
        "id": 9,
        "slug": "future-tenses",
        "title": "Future Tenses (Will vs Going To)",
        "hindi_title": "भविष्य काल (Will बनाम Going To का अंतर)",
        "description_hindi": "भविष्य की योजनाओं (Plans), निर्णयों (Instant Decisions) और भविष्यवाणियों (Predictions) को व्यक्त करने के लिए।",
        "description_english": "Will (instant decisions, promises) vs Be Going To (pre-planned intentions, evidence-based predictions).",
        "key_rule": "Instant decision -> will | Prior plan -> be going to",
        "common_mistake": "Don't use 'will' after 'when/if' in condition clauses: 'When you will come' is WRONG! Say 'When you come'.",
        "icon": "Compass",
        "level": "Intermediate (A2-B1)",
        "content": {
            "concept_explanation": "अगर आपने पहले से मन बना रखा है: कहिए 'I am going to start a new course next Monday'। अगर आपने अभी इसी क्षण निर्णय लिया है: कहिए 'I will help you right now'!",
            "formula": "Will: Subject + will + V1 | Going to: Subject + is/am/are + going to + V1",
            "examples": [
                {"english": "I will answer the door.", "hindi": "मैं दरवाजा खोलता हूँ (तुरंत निर्णय)।", "highlight": "will answer"},
                {"english": "I am going to visit my parents this weekend.", "hindi": "मैं इस सप्ताहांत अपने माता-पिता से मिलने जा रहा हूँ (पहले से तय)।", "highlight": "am going to visit"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "If you will call me, I will reply.",
                    "correct": "If you call me, I will reply.",
                    "explanation": "Condition (शर्त वाले हिस्से) में 'will' नहीं आता, Present Simple आता है।"
                }
            ],
            "quizzes": [
                {
                    "question": "You hear someone knock on the door right now. What do you say?",
                    "options": ["I am going to open it.", "I will open it.", "I opened it.", "I open it."],
                    "correctIndex": 1,
                    "explanation": "Instant spontaneous decision made at the moment of speaking takes 'will'."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'I will definitely become fluent in English within a few months.'",
                    "expected_text": "I will definitely become fluent in English within a few months.",
                    "target_word": "will definitely"
                }
            ]
        }
    },
    {
        "id": 10,
        "slug": "sentence-formation",
        "title": "Sentence Formation (SVO vs SOV)",
        "hindi_title": "वाक्य निर्माण (हिंदी बनाम अंग्रेजी संरचना)",
        "description_hindi": "हिंदी की बनावट (कर्ता + कर्म + क्रिया) से हटकर अंग्रेजी की सही बनावट (Subject + Verb + Object) सीखें।",
        "description_english": "Master English Subject-Verb-Object (SVO) order to stop translating Hindi (SOV) directly.",
        "key_rule": "Hindi: मैं (S) चाय (O) पीता हूँ (V) -> English: I (S) drink (V) tea (O)",
        "common_mistake": "Translating word-for-word from Hindi causes jumbled word order in English.",
        "icon": "Layers",
        "level": "All Levels (A1-B2)",
        "content": {
            "concept_explanation": "हिंदी में क्रिया (Verb) वाक्य के अंत में आती है, लेकिन अंग्रेजी में क्रिया कर्ता (Subject) के तुरंत बाद आती है! यदि आप दिमाग में हिंदी से अनुवाद करेंगे तो गलतियाँ होंगी। हमेशा याद रखें: SVO (Who does what to whom).",
            "formula": "Subject (कर्ता) + Verb (क्रिया) + Object (कर्म) + Manner + Place + Time (SVOMPT)",
            "examples": [
                {"english": "Rahul sent the email yesterday.", "hindi": "राहुल ने कल ईमेल भेजा था।", "highlight": "sent the email"},
                {"english": "She speaks English very fluently.", "hindi": "वह बहुत धाराप्रवाह अंग्रेजी बोलती है।", "highlight": "speaks English"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "I yesterday went to market.",
                    "correct": "I went to the market yesterday.",
                    "explanation": "Time expressions (yesterday, tomorrow) वाक्य के अंत में या शुरू में आते हैं, बीच में नहीं।"
                }
            ],
            "quizzes": [
                {
                    "question": "Rearrange into correct English order: 'the manager / called / yesterday / me'",
                    "options": ["The manager me called yesterday.", "The manager called me yesterday.", "Yesterday me the manager called.", "The manager yesterday called me."],
                    "correctIndex": 1,
                    "explanation": "Subject (The manager) + Verb (called) + Object (me) + Time (yesterday)."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'I learn new English words every day to improve my vocabulary.'",
                    "expected_text": "I learn new English words every day to improve my vocabulary.",
                    "target_word": "learn"
                }
            ]
        }
    },
    {
        "id": 11,
        "slug": "wh-questions",
        "title": "WH Questions (What, Where, When, Why, How)",
        "hindi_title": "WH प्रश्न पूछना (जानकारी प्राप्त करना)",
        "description_hindi": "बातचीत में सवाल पूछना सबसे जरूरी कला है। जानिए What, Where, When, Why, Who, How से सही सवाल कैसे बनाएं।",
        "description_english": "Formulate open-ended questions using question words, auxiliary verbs, subjects, and main verbs.",
        "key_rule": "WH Word + Helping Verb + Subject + Main Verb? (QUASM)",
        "common_mistake": "Don't invert without auxiliary: 'Where you are going?' is WRONG! Say 'Where are you going?'.",
        "icon": "HelpCircle",
        "level": "Intermediate (A2)",
        "content": {
            "concept_explanation": "जब भी WH सवाल बनाएं, तो WH शब्द के तुरंत बाद Helping Verb (is, are, do, does, did, can) जरूर आना चाहिए! 'What your name is?' गलत है, 'What is your name?' सही है।",
            "formula": "WH Word + Auxiliary Verb + Subject + Main Verb + (Rest of Sentence)?",
            "examples": [
                {"english": "Where do you work?", "hindi": "आप कहाँ काम करते हैं?", "highlight": "Where do"},
                {"english": "How did you solve this problem?", "hindi": "आपने इस समस्या को कैसे हल किया?", "highlight": "How did"},
                {"english": "Why are you looking so worried?", "hindi": "आप इतने चिंतित क्यों दिख रहे हैं?", "highlight": "Why are"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "What you want?",
                    "correct": "What do you want?",
                    "explanation": "Present simple question में 'do' helping verb लगाना अनिवार्य है।"
                }
            ],
            "quizzes": [
                {
                    "question": "Which question is formulated correctly?",
                    "options": ["Where you live?", "Where do you live?", "Where you are live?", "Where does you live?"],
                    "correctIndex": 1,
                    "explanation": "WH word + do + you + base verb live."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'Where can I find the nearest metro station?'",
                    "expected_text": "Where can I find the nearest metro station?",
                    "target_word": "Where can I"
                }
            ]
        }
    },
    {
        "id": 12,
        "slug": "pronouns",
        "title": "Pronouns & Possessives (I vs Me, He vs Him, Mine)",
        "hindi_title": "सर्वनाम (Subject, Object और Possessive Pronouns)",
        "description_hindi": "I, Me, My, Mine, You, Your, He, Him, His, She, Her, We, Us, They, Them का सही चुनाव।",
        "description_english": "Master subject pronouns, object pronouns, possessive adjectives, and possessive pronouns.",
        "key_rule": "Before verb -> Subject (I, he) | After verb/preposition -> Object (me, him)",
        "common_mistake": "Don't say 'Me and my friend went'. Say 'My friend and I went'.",
        "icon": "Users",
        "level": "Beginner (A1-A2)",
        "content": {
            "concept_explanation": "क्रिया से पहले Subject pronoun आता है (He called me), और क्रिया या preposition के बाद Object pronoun आता है (Listen to him, between you and me)।",
            "formula": "Subject: I, You, He, She, It, We, They | Object: Me, You, Him, Her, It, Us, Them",
            "examples": [
                {"english": "My colleague and I finished the report.", "hindi": "मेरे सहकर्मी और मैंने रिपोर्ट पूरी की।", "highlight": "and I"},
                {"english": "Please send the file to him and me.", "hindi": "कृपया फ़ाइल उसे और मुझे भेजें।", "highlight": "him and me"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "Myself Rahul from Delhi.",
                    "correct": "I am Rahul from Delhi. / My name is Rahul.",
                    "explanation": "'Myself' एक reflexive pronoun है, इसका उपयोग वाक्य की शुरुआत में अपना परिचय देने के लिए कभी न करें।"
                }
            ],
            "quizzes": [
                {
                    "question": "Choose the best introduction:",
                    "options": ["Myself Amit.", "I am Amit.", "Me is Amit.", "Mine name Amit."],
                    "correctIndex": 1,
                    "explanation": "'I am Amit' or 'My name is Amit' is grammatically correct and professional."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'My colleague and I will deliver the presentation together.'",
                    "expected_text": "My colleague and I will deliver the presentation together.",
                    "target_word": "and I"
                }
            ]
        }
    },
    {
        "id": 13,
        "slug": "prepositions",
        "title": "Prepositions (In, On, At, To, For, Since)",
        "hindi_title": "Prepositions का सही इस्तेमाल (स्थान और समय)",
        "description_hindi": "In, On, At का समय (Time) और स्थान (Place) के संदर्भ में सही नियम, और For बनाम Since का अंतर।",
        "description_english": "In/On/At for time and place, and For vs Since for durations and starting points.",
        "key_rule": "Time: At (exact time) | On (days, dates) | In (months, years, centuries)",
        "common_mistake": "Don't say 'Since 2 years'. Say 'For 2 years'. Use 'Since' for starting points ('Since 2022').",
        "icon": "MapPin",
        "level": "Intermediate (A2-B1)",
        "content": {
            "concept_explanation": "घड़ी के समय के लिए 'at' (at 5 PM), दिनों और तारीखों के लिए 'on' (on Monday, on 15th August), और महीनों/सालों के लिए 'in' (in July, in 2024)। 'For' अवधि (Duration) के लिए आता है और 'Since' शुरुआती बिंदु (Starting point) के लिए।",
            "formula": "At 5 PM | On Monday | In December || For 3 months | Since Monday",
            "examples": [
                {"english": "The conference starts at 10 AM on Monday.", "hindi": "सम्मेलन सोमवार को सुबह 10 बजे शुरू होता है।", "highlight": "at 10 AM on Monday"},
                {"english": "I have been living in this city for five years.", "hindi": "मैं पाँच साल से इस शहर में रह रहा हूँ।", "highlight": "for five years"},
                {"english": "She has been working here since 2021.", "hindi": "वह 2021 से यहाँ काम कर रही है।", "highlight": "since 2021"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "I am working here since 3 years.",
                    "correct": "I have been working here for 3 years.",
                    "explanation": "अवधि (3 years) के साथ 'for' आता है और tense Present Perfect Continuous होना चाहिए।"
                }
            ],
            "quizzes": [
                {
                    "question": "Fill in the blank: 'We will meet you _____ Friday _____ 4 PM.'",
                    "options": ["in, at", "on, at", "at, on", "on, in"],
                    "correctIndex": 1,
                    "explanation": "Days take 'on' and specific times take 'at' -> 'on Friday at 4 PM'."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'Our team will meet on Tuesday morning at ten o'clock.'",
                    "expected_text": "Our team will meet on Tuesday morning at ten o'clock.",
                    "target_word": "on Tuesday"
                }
            ]
        }
    },
    {
        "id": 14,
        "slug": "modal-verbs",
        "title": "Modal Verbs (Can, Could, Should, Would, Must)",
        "hindi_title": "Modal Verbs (सलाह, क्षमता, विनम्र निवेदन और अनिवार्यता)",
        "description_hindi": "Can (क्षमता), Could (विनम्र निवेदन / भूतकाल), Should (सलाह), Would (इच्छा / प्राथमिकता), Must (जरूरी)।",
        "description_english": "Express ability, polite requests, advice, possibility, and obligation.",
        "key_rule": "Modal + Base Verb (V1) always! Never say 'You should to go' or 'He can speaks'.",
        "common_mistake": "Never add 'to' after can/could/should/would/must: 'I can to do this' is WRONG!",
        "icon": "ShieldCheck",
        "level": "Intermediate (B1-B2)",
        "content": {
            "concept_explanation": "Modal verbs के बाद हमेशा क्रिया का पहला रूप (V1) आता है, बिना 'to' और बिना 's/ed' के। विनम्र बातचीत के लिए 'Could you please help me?' या 'Would you like some water?' का प्रयोग करें।",
            "formula": "Subject + Modal Verb + Base Verb (V1) + Object",
            "examples": [
                {"english": "Could you please share your screen?", "hindi": "क्या आप कृपया अपनी स्क्रीन शेयर कर सकते हैं?", "highlight": "Could you please share"},
                {"english": "You should practice speaking English every day.", "hindi": "आपको हर दिन अंग्रेजी बोलने का अभ्यास करना चाहिए।", "highlight": "should practice"},
                {"english": "I would like to schedule a call tomorrow.", "hindi": "मैं कल एक कॉल शेड्यूल करना चाहूँगा।", "highlight": "would like to"}
            ],
            "common_mistakes_breakdown": [
                {
                    "wrong": "He can speaks fluent English.",
                    "correct": "He can speak fluent English.",
                    "explanation": "Modal verb 'can' के बाद 's' नहीं लगता, सिर्फ base form 'speak' आती है।"
                },
                {
                    "wrong": "You must to complete this today.",
                    "correct": "You must complete this today.",
                    "explanation": "'Must' के बाद सीधे क्रिया आती है, 'to' नहीं लगता।"
                }
            ],
            "quizzes": [
                {
                    "question": "Which sentence makes a polite professional request?",
                    "options": ["Give me the report now.", "Could you please send me the report?", "You must give report.", "Send me report please."],
                    "correctIndex": 1,
                    "explanation": "'Could you please...' is the most natural polite form for business and casual requests."
                }
            ],
            "speaking_exercises": [
                {
                    "prompt": "Say: 'Could you please explain that grammar rule one more time?'",
                    "expected_text": "Could you please explain that grammar rule one more time?",
                    "target_word": "Could you please"
                }
            ]
        }
    }
]
