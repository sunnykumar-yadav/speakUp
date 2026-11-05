export type EnglishLevel = 'Beginner (A1)' | 'Elementary (A2)' | 'Intermediate (B1)' | 'Intermediate (B1+)' | 'Upper-Intermediate (B2)';

export interface User {
  id: number;
  name: string;
  email: string;
  english_level: EnglishLevel;
  target_minutes: number;
  preferred_language: 'Hinglish' | 'English';
  created_at?: string;
  latest_assessment?: {
    overall_score: number;
    cefr_level: EnglishLevel;
    created_at: string;
  };
}

export interface Question {
  id: number;
  type: 'mcq' | 'written_formation' | 'speaking_audio';
  category: string;
  question?: string;
  prompt?: string;
  options?: string[];
  correct_index?: number;
  explanation?: string;
  placeholder?: string;
  instructions?: string;
  sample_phrases?: string[];
}

export interface AssessmentReport {
  assessment_id?: number;
  overall_score: number;
  cefr_level: EnglishLevel;
  grammar_score: number;
  vocab_score: number;
  tenses_score: number;
  formation_score: number;
  speaking_score: number;
  confidence_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  limitations_disclaimer: string;
}

export interface ConversationScenario {
  id: string;
  title: string;
  role: string;
  icon: string;
  description: string;
  starter_message: string;
}

export interface ConversationMessage {
  id: number;
  conversation_id: number;
  sender: 'student' | 'ai';
  text: string;
  corrected_sentence?: string;
  explanation?: string;
  repeat_prompt?: string;
  mistakes_json?: string;
  created_at: string;
}

export interface GrammarTopic {
  id: number;
  slug: string;
  title: string;
  hindi_title: string;
  description_hindi: string;
  description_english: string;
  key_rule: string;
  common_mistake: string;
  icon: string;
  level: string;
  is_completed?: number;
  quiz_score?: number;
  speaking_completed?: number;
  content?: {
    concept_explanation: string;
    formula: string;
    examples: Array<{ english: string; hindi: string; highlight: string }>;
    common_mistakes_breakdown: Array<{ wrong: string; correct: string; explanation: string }>;
    quizzes: Array<{ question: string; options: string[]; correctIndex: number; explanation: string }>;
    speaking_exercises: Array<{ prompt: string; expected_text: string; target_word: string }>;
  };
  progress?: {
    completed: number;
    quiz_score: number;
    speaking_completed: number;
  };
}

export interface SentenceResult {
  hindi: string;
  english: string;
  tense: string;
  structure: string;
  alternatives: Array<{ style: string; text: string }>;
  challenge: string;
  provider?: string;
}

export interface LearningTask {
  id: number;
  task_type: string;
  title: string;
  duration_minutes: number;
  action_route: string;
  is_completed: number;
}

export interface DailyPlanResponse {
  plan_date: string;
  tasks: LearningTask[];
  completed_count: number;
  total_tasks: number;
  total_minutes: number;
  estimated_timeline: string;
}

export interface ProgressSummary {
  totals: {
    speaking_minutes: number;
    grammar_minutes: number;
    sentence_minutes: number;
    accuracy_rate: number;
    completed_lessons: number;
    vocabulary_learned: number;
  };
  repeated_mistakes: Array<{ content: string; count: number }>;
  weekly_chart: Array<{
    log_date: string;
    speaking_minutes: number;
    grammar_minutes: number;
    sentence_minutes: number;
    accuracy_rate: number;
  }>;
}

export interface WeeklyReport {
  report_id: string;
  student_name: string;
  current_level: string;
  week_label: string;
  metrics: {
    speaking_time: string;
    accuracy: string;
    consistency_streak: string;
    target_achieved: string;
  };
  coach_insights: string[];
  estimated_timeline: string;
}
