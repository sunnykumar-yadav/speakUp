import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Mic, 
  Square, 
  Sparkles, 
  BookOpen, 
  Award,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';
import type { GrammarTopic } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { AudioWave } from '../components/AudioWave';
import confetti from 'canvas-confetti';

export const GrammarLessonPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<GrammarTopic | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [speakingResult, setSpeakingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { speak, isSlowMode, toggleSlowMode } = useSpeechSynthesis();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (slug) {
      loadTopic(slug);
    }
  }, [slug]);

  const loadTopic = async (topicSlug: string) => {
    try {
      const res = await api.getTopicDetail(topicSlug);
      setTopic(res.topic);
    } catch (e) {
      console.warn('Failed to load topic:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuizOption = (quizIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [quizIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!topic || !topic.content?.quizzes) return;
    const quizzes = topic.content.quizzes;
    let correctCount = 0;
    quizzes.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quizzes.length) * 100);
    setQuizSubmitted(true);

    try {
      await api.submitQuiz(topic.id, score);
      if (score >= 60) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      console.warn('Could not save quiz:', e);
    }
  };

  const handleVerifySpeaking = async (expectedText: string) => {
    if (!topic) return;
    if (isListening) stopListening();

    const spoken = transcript.trim();
    if (!spoken) {
      alert('Please speak into the microphone first!');
      return;
    }

    try {
      const res = await api.submitSpeaking(topic.id, expectedText, spoken);
      setSpeakingResult(res);
      if (res.passed) {
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      console.warn('Could not evaluate speaking:', e);
    }
  };

  if (isLoading || !topic) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const content = topic.content;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/grammar"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Topics</span>
        </Link>
      </div>

      {/* Lesson Header */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            {topic.level}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Topic {topic.id} of 14
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {topic.title}
        </h1>
        <p className="text-base font-bold text-emerald-800 mt-1">
          {topic.hindi_title}
        </p>
        <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-2xl">
          {topic.description_hindi}
        </p>

        {/* Core Formula Box */}
        {content?.formula && (
          <div className="mt-6 rounded-2xl bg-white p-4 border border-emerald-200 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Core Sentence Formula:
            </span>
            <code className="text-sm font-bold text-slate-800 block">
              {content.formula}
            </code>
          </div>
        )}
      </div>

      {/* Concept Breakdown in Hindi/Hinglish */}
      {content?.concept_explanation && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>Why Indian Speakers Make Mistakes Here (Hinglish Guide)</span>
          </h2>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-amber-50/40 rounded-2xl p-5 border border-amber-200/60 font-medium">
            {content.concept_explanation}
          </div>
        </div>
      )}

      {/* Real-Life Examples with Pronunciation Audio */}
      {content?.examples && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-emerald-600" />
              <span>Real-Life Spoken Examples</span>
            </h2>
            <button
              onClick={toggleSlowMode}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {isSlowMode ? 'Audio Speed: 0.75x' : 'Audio Speed: 1.0x'}
            </button>
          </div>

          <div className="space-y-3">
            {content.examples.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-300 transition"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{ex.english}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ex.hindi}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speak(ex.english)}
                  className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-emerald-50 px-3 py-1.5 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-emerald-700 shrink-0 shadow-2xs transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Mental Translation Traps */}
      {content?.common_mistakes_breakdown && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/30 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-rose-950 flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Common Hindi Translation Traps to Stop Making</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.common_mistakes_breakdown.map((item, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-4 border border-rose-100 shadow-2xs space-y-2">
                <div className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Don't say: <em>"{item.wrong}"</em></span>
                </div>
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Say instead: <em>"{item.correct}"</em></span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 leading-snug">
                  💡 <strong>Rule:</strong> {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speaking Exercise with Microphone */}
      {content?.speaking_exercises && content.speaking_exercises.length > 0 && (
        <div className="rounded-3xl border border-purple-200 bg-purple-50/40 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
            <Mic className="w-5 h-5 text-purple-600" />
            <span>Speaking Exercise: Train Your Vocal Cords</span>
          </div>
          <p className="text-xs text-purple-800/80">
            Click the microphone and speak this sentence out loud. AI will compare your pronunciation in real-time.
          </p>

          <div className="rounded-2xl bg-white p-5 border border-purple-200 shadow-xs space-y-4">
            <div className="text-sm font-bold text-slate-900">
              {content.speaking_exercises[0].prompt}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition ${
                  isListening ? 'bg-rose-500 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'Stop Recording' : 'Start Speaking'}</span>
              </button>

              <button
                type="button"
                onClick={() => speak(content.speaking_exercises[0].expected_text)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Pronunciation</span>
              </button>
            </div>

            {isListening && (
              <div className="flex items-center gap-2 text-xs text-purple-700 font-medium">
                <AudioWave isActive={true} color="bg-purple-600" />
                <span>Listening: "{transcript || '...'}"</span>
              </div>
            )}

            {transcript && !isListening && (
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
                <span className="text-slate-400 font-bold block mb-1">You said:</span>
                <p className="font-semibold text-slate-800">"{transcript}"</p>
                <button
                  type="button"
                  onClick={() => handleVerifySpeaking(content.speaking_exercises[0].expected_text)}
                  className="mt-2 text-xs font-bold text-purple-700 underline"
                >
                  Verify My Pronunciation
                </button>
              </div>
            )}

            {speakingResult && (
              <div className={`rounded-xl p-3 text-xs flex items-center justify-between ${
                speakingResult.passed
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 font-medium'
              }`}>
                <span>{speakingResult.feedback} (Match: {speakingResult.match_percentage}%)</span>
                {speakingResult.passed && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mini Quiz Practice */}
      {content?.quizzes && content.quizzes.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Mini Test: Verify Your Understanding</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">{content.quizzes.length} Questions</span>
          </div>

          <div className="space-y-6">
            {content.quizzes.map((q, qIdx) => {
              const selectedOpt = quizAnswers[qIdx];
              return (
                <div key={qIdx} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                  <p className="text-xs font-bold text-slate-800">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      let btnStyle = 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300';
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold';
                        else if (isSelected) btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                      } else if (isSelected) {
                        btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <p className="text-[11px] text-slate-600 italic pt-1">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < content.quizzes.length}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition disabled:opacity-40"
            >
              Submit Quiz & Complete Lesson
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <Award className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-emerald-950">Lesson Completed Successfully!</h4>
              <p className="text-xs text-emerald-800 mt-1">
                Your progress has been updated in your dashboard and daily learning routine.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
