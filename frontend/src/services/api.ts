const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('speakup_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || `Request failed with status ${response.status}`, response.status);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { name: string; email: string; password: string; english_level?: string }) =>
    request<{ message: string; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ message: string; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProfile: () => request<{ user: any }>('/auth/profile'),

  updateProfile: (payload: Partial<{ name: string; target_minutes: number; preferred_language: string; english_level: string }>) =>
    request<{ message: string; user: any }>('/auth/update', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Assessment
  getAssessmentQuestions: () => request<{ questions: any[] }>('/assessment/questions'),

  submitAssessment: (answers: Record<string | number, any>) =>
    request<{ message: string; report: any }>('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  getLatestAssessment: () => request<{ assessment: any }>('/assessment/latest'),

  // Conversation / Speaking Room
  getScenarios: () => request<{ scenarios: any[] }>('/conversation/scenarios'),

  sendMessage: (payload: { message: string; scenario_id: string; conversation_id?: number; student_level?: string }) =>
    request<{
      conversation_id: number;
      message_id: number;
      reply: string;
      has_mistake: boolean;
      corrected_sentence?: string;
      explanation?: string;
      repeat_prompt?: string;
      topic_tag?: string;
      provider: string;
    }>('/conversation/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getHistory: (convId: number) => request<{ messages: any[] }>(`/conversation/history/${convId}`),

  explainMistake: (payload: { student_text: string; corrected_sentence: string; topic_tag?: string }) =>
    request<{ explanation: string }>('/conversation/explain-mistake', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Grammar Coach
  getGrammarTopics: () => request<{ topics: any[] }>('/grammar/topics'),

  getTopicDetail: (slugOrId: string | number) => request<{ topic: any }>(`/grammar/topic/${slugOrId}`),

  submitQuiz: (topic_id: number, score: number) =>
    request<{ message: string; score: number; completed: boolean }>('/grammar/submit-quiz', {
      method: 'POST',
      body: JSON.stringify({ topic_id, score }),
    }),

  submitSpeaking: (topic_id: number, expected_text: string, spoken_transcript: string) =>
    request<{ passed: boolean; match_percentage: number; feedback: string; spoken_transcript: string }>('/grammar/submit-speaking', {
      method: 'POST',
      body: JSON.stringify({ topic_id, expected_text, spoken_transcript }),
    }),

  // Sentence Builder
  getSentencePresets: () => request<{ presets: any[] }>('/sentence-builder/presets'),

  translateSentence: (hindi_sentence: string) =>
    request<{ result: any }>('/sentence-builder/translate', {
      method: 'POST',
      body: JSON.stringify({ hindi_sentence }),
    }),

  verifyChallenge: (challenge: string, student_answer: string) =>
    request<{ is_good: boolean; feedback: string; score: number; student_sentence: string }>('/sentence-builder/verify', {
      method: 'POST',
      body: JSON.stringify({ challenge, student_answer }),
    }),

  // Progress
  getProgressSummary: () => request<any>('/progress/summary'),

  getWeeklyReport: () => request<any>('/progress/weekly-report'),

  // Learning Plan
  getDailyPlan: () => request<any>('/learning-plan/daily'),

  togglePlanTask: (taskId: number) => request<{ success: boolean; is_completed: boolean }>(`/learning-plan/toggle-task/${taskId}`, { method: 'POST' }),

  // Settings
  getAIStatus: () => request<{ active_provider: string; has_gemini: boolean; has_groq: boolean; has_openai: boolean; is_demo_mode: boolean }>('/settings/ai-status'),

  saveAIKeys: (payload: { gemini_key?: string; groq_key?: string; openai_key?: string; preferred_provider?: string }) =>
    request<{ message: string; status: any }>('/settings/save-keys', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
