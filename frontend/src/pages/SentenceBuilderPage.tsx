import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Mic, 
  Square, 
  Send, 
  Volume2, 
  ArrowRight, 
  Layers, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import type { SentenceResult } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { AudioWave } from '../components/AudioWave';

export const SentenceBuilderPage: React.FC = () => {
  const [hindiInput, setHindiInput] = useState('');
  const [presets, setPresets] = useState<any[]>([]);
  const [result, setResult] = useState<SentenceResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Challenge practice states
  const [studentChallengeAnswer, setStudentChallengeAnswer] = useState('');
  const [challengeFeedback, setChallengeFeedback] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition('hi-IN');
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const res = await api.getSentencePresets();
      setPresets(res.presets || []);
    } catch (e) {
      console.warn('Failed to load presets:', e);
    }
  };

  useEffect(() => {
    if (transcript) {
      setHindiInput(transcript);
    }
  }, [transcript]);

  const handleTranslate = async (textToUse?: string) => {
    const text = (textToUse || hindiInput).trim();
    if (!text || isTranslating) return;

    if (isListening) stopListening();
    resetTranscript();
    setIsTranslating(true);
    setChallengeFeedback(null);
    setStudentChallengeAnswer('');

    try {
      const res = await api.translateSentence(text);
      setResult(res.result);
      if (res.result?.english) {
        speak(res.result.english);
      }
    } catch (e) {
      console.error('Translation error:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVerifyChallenge = async () => {
    if (!result?.challenge || !studentChallengeAnswer.trim() || isVerifying) return;
    setIsVerifying(true);
    try {
      const res = await api.verifyChallenge(result.challenge, studentChallengeAnswer);
      setChallengeFeedback(res);
    } catch (e) {
      console.warn('Challenge verification error:', e);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-800 mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Stop Mind Translation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Hindi to Natural English Sentence Builder
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Type or speak how you naturally think in Hindi or Hinglish. AI breaks down the Subject-Verb-Object (SVO) order and presents natural spoken expressions.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Enter Your Thought (Hindi or Hinglish):
        </label>

        <div className="relative">
          <textarea
            rows={3}
            value={hindiInput}
            onChange={(e) => setHindiInput(e.target.value)}
            placeholder="जैसे: मैं कल ऑफिस नहीं जा पाऊंगा क्योंकि मुझे डॉक्टर के पास जाना है..."
            className="w-full rounded-2xl border border-slate-300 p-4 text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition leading-relaxed"
          />

          {isListening && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-2.5 py-1 rounded-full">
              <AudioWave isActive={true} color="bg-rose-500" />
              <span>Listening to Hindi...</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400 text-[11px]">Quick Samples:</span>
            {presets.slice(0, 3).map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setHindiInput(p.hindi);
                  handleTranslate(p.hindi);
                }}
                className="rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-300 px-3 py-1 text-slate-700 transition"
              >
                {p.category}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-xl border transition ${
                isListening
                  ? 'bg-rose-500 border-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
              title="Speak in Hindi"
            >
              {isListening ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => handleTranslate()}
              disabled={!hindiInput.trim() || isTranslating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs font-bold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isTranslating ? 'Analyzing Structure...' : 'Build Natural English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Structural Breakdown & Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Main English Translation Card */}
          <div className="rounded-3xl border border-emerald-200 bg-linear-to-r from-emerald-50/80 via-white to-teal-50/50 p-6 sm:p-8 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Natural Spoken English Translation
              </span>
              <button
                type="button"
                onClick={() => speak(result.english)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Audio</span>
              </button>
            </div>

            <p className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              "{result.english}"
            </p>
          </div>

          {/* Two-Card Grid: Structural Breakdown & Tense */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SVO Structure Breakdown */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Sentence Structure (SVO vs SOV)</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {result.structure}
              </p>
            </div>

            {/* Tense Usage */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Tense & Auxiliary Verb Rules</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {result.tense}
              </p>
            </div>
          </div>

          {/* 3 Stylistic Spoken Alternatives */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Alternative Natural Expressions by Context
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.alternatives.map((alt, i) => (
                  <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                        {alt.style}
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        "{alt.text}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speak(alt.text)}
                      className="self-start mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Student Challenge */}
          {result.challenge && (
            <div className="rounded-3xl border border-purple-200 bg-purple-50/50 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Independent Practice Challenge</span>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed font-medium">
                {result.challenge}
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={studentChallengeAnswer}
                  onChange={(e) => setStudentChallengeAnswer(e.target.value)}
                  placeholder="Type your English translation here..."
                  className="w-full rounded-2xl border border-purple-200 bg-white p-3.5 text-xs text-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden transition"
                />

                <button
                  type="button"
                  onClick={handleVerifyChallenge}
                  disabled={!studentChallengeAnswer.trim() || isVerifying}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-purple-600/20 transition disabled:opacity-50"
                >
                  <span>{isVerifying ? 'Checking...' : 'Check My Sentence'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {challengeFeedback && (
                <div className={`rounded-xl p-4 text-xs ${
                  challengeFeedback.is_good
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-amber-50 border border-amber-200 text-amber-900 font-medium'
                }`}>
                  <p>{challengeFeedback.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
