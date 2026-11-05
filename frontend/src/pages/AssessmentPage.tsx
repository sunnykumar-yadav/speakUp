import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Mic, 
  Square, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Award, 
  BookOpen, 
  RotateCcw,
  ShieldAlert,
  Volume2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Question, AssessmentReport } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { AudioWave } from '../components/AudioWave';
import confetti from 'canvas-confetti';

export const AssessmentPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string | number, any>>({});
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Speech recognition for audio questions
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript, 
    isSupported 
  } = useSpeechRecognition();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await api.getAssessmentQuestions();
      setQuestions(res.questions || []);
    } catch (e) {
      console.warn('Failed to fetch questions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync spoken transcript into current answers
  useEffect(() => {
    if (questions[currentIndex]?.type === 'speaking_audio' && transcript) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentIndex].id]: transcript,
      }));
    }
  }, [transcript, currentIndex, questions]);

  const handleSelectMCQ = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: optionIndex,
    }));
  };

  const handleWrittenChange = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: text,
    }));
  };

  const handleNext = () => {
    if (isListening) {
      stopListening();
    }
    resetTranscript();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.submitAssessment(answers);
      setReport(res.report);
      if (res.report?.cefr_level) {
        updateProfile({ english_level: res.report.cefr_level });
      }
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error('Error submitting assessment:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
  const currentAnswer = currentQ ? answers[currentQ.id] : null;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading diagnostic evaluation...</p>
        </div>
      </div>
    );
  }

  // Assessment Report Card View
  if (report) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3.5 py-1 text-xs font-bold mb-3">
              <Award className="w-4 h-4" />
              <span>Assessment Completed</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Your Personalized English Assessment Report
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Evaluated across helping verbs, past tenses, sentence formation, and spoken confidence.
            </p>
          </div>

          {/* Level Badge Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white text-center shadow-md mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Assigned Proficiency Level</span>
            <div className="text-4xl font-black mt-1 text-white">{report.cefr_level}</div>
            <p className="mt-2 text-xs text-slate-300 max-w-lg mx-auto">{report.summary}</p>
            <div className="mt-4 inline-block bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
              Overall Diagnostic Score: {report.overall_score}%
            </div>
          </div>

          {/* 5 Sub-Scores Breakdown */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Competency Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Grammar & Helping Verbs', score: report.grammar_score, color: 'bg-emerald-500' },
                { label: 'Tense Consistency', score: report.tenses_score, color: 'bg-teal-500' },
                { label: 'Sentence Formation', score: report.formation_score, color: 'bg-blue-500' },
                { label: 'Vocabulary Range', score: report.vocab_score, color: 'bg-indigo-500' },
                { label: 'Speaking Confidence', score: report.speaking_score, color: 'bg-purple-500' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                    <span>{item.label}</span>
                    <span className="font-bold">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weak Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Identified Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Areas to Strengthen</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {report.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Honest Diagnostic Limitations Disclaimer */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 mb-8">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Pedagogical Note on Assessment Limitations</strong>
                {report.limitations_disclaimer}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/speaking-room"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 text-sm font-bold shadow-md shadow-emerald-600/20 transition"
            >
              <Mic className="w-4 h-4" />
              <span>Practice in AI Speaking Room</span>
            </Link>
            <Link
              to="/learning-plan"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-300 hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-700 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>View My Learning Plan</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Assessment Question View
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Step Tracker Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
          {currentQ?.category}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
        {/* MCQ Type Question */}
        {currentQ?.type === 'mcq' && (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options?.map((option, idx) => {
                const isSelected = currentAnswer === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectMCQ(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold shadow-xs'
                        : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{option}</span>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Written Sentence Formation Question */}
        {currentQ?.type === 'written_formation' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Sentence Formation Challenge
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-relaxed">
                {currentQ.prompt}
              </h2>
            </div>

            <textarea
              rows={4}
              value={currentAnswer || ''}
              onChange={(e) => handleWrittenChange(e.target.value)}
              placeholder={currentQ.placeholder || 'Type the English sentence...'}
              className="w-full rounded-2xl border border-slate-300 p-4 text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition leading-relaxed"
            />

            <p className="text-xs text-slate-400 italic">
              Tip: Avoid translating word-by-word. Think about who is performing the action (Subject) and the right past tense verb.
            </p>
          </div>
        )}

        {/* Spoken Audio Question with Web Speech API */}
        {currentQ?.type === 'speaking_audio' && (
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                <Mic className="w-3.5 h-3.5" />
                <span>Spoken Audio Diagnostic</span>
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                {currentQ.prompt}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{currentQ.instructions}</p>
            </div>

            {/* Microphone Recording Container */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 flex flex-col items-center justify-center text-center">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 shadow-lg cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105'
                }`}
              >
                {isListening ? <Square className="w-8 h-8" /> : <Mic className="w-9 h-9" />}
              </button>

              <div className="mt-4">
                <p className="text-xs font-bold text-slate-700">
                  {isListening ? 'Listening to your voice... Speak now!' : 'Click the microphone to start speaking'}
                </p>
                <AudioWave isActive={isListening} />
              </div>

              {/* Live Transcript Preview */}
              <div className="mt-4 w-full rounded-xl bg-white p-4 border border-slate-200 text-left min-h-[70px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Recognized Speech Transcript:
                </span>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {currentAnswer || (
                    <span className="text-slate-400 italic">
                      {isListening ? 'Listening...' : 'Your spoken words will appear here in real-time...'}
                    </span>
                  )}
                </p>
              </div>

              {/* Or manual text edit if microphone is unavailable */}
              <div className="mt-3 w-full text-right">
                <button
                  type="button"
                  onClick={() => {
                    const fallback = prompt('Type your answer if microphone is not available:', currentAnswer || '');
                    if (fallback !== null) handleWrittenChange(fallback);
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                >
                  Edit / Type manually if mic unavailable
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30 transition"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs font-bold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            <span>{currentIndex === questions.length - 1 ? (isSubmitting ? 'Generating Report...' : 'Submit Assessment') : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
