import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Send, 
  Volume2, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  Coffee, 
  Briefcase, 
  Users, 
  Laptop, 
  MapPin, 
  MessageCircle,
  Gauge,
  Check,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { ConversationScenario, ConversationMessage } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { AudioWave } from '../components/AudioWave';

export const SpeakingRoomPage: React.FC = () => {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<ConversationScenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('daily_chat');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [detailedExplanation, setDetailedExplanation] = useState<{ msgId: number; text: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech Recognition (Microphone)
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSTTSupported,
  } = useSpeechRecognition();

  // Speech Synthesis (TTS Audio)
  const {
    speak,
    stop: stopAudio,
    isSpeaking,
    isSlowMode,
    toggleSlowMode,
  } = useSpeechSynthesis();

  // Fetch Scenarios on Mount
  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const res = await api.getScenarios();
      setScenarios(res.scenarios || []);
      if (res.scenarios?.length > 0) {
        initScenario(res.scenarios[0]);
      }
    } catch (e) {
      console.warn('Could not load scenarios:', e);
    }
  };

  const initScenario = (scenario: ConversationScenario) => {
    setActiveScenarioId(scenario.id);
    setConversationId(null);
    setDetailedExplanation(null);
    const initialAiMsg = {
      id: 0,
      sender: 'ai',
      text: scenario.starter_message,
      created_at: new Date().toISOString(),
    };
    setMessages([initialAiMsg]);
    // Optionally speak starter message
    speak(scenario.starter_message);
  };

  // When speech transcript updates, populate input box
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, detailedExplanation]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    if (isListening) {
      stopListening();
    }
    resetTranscript();
    setInputText('');
    setIsSending(true);

    // Optimistically append student message
    const tempStudentMsg = {
      id: Date.now(),
      sender: 'student',
      text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempStudentMsg]);

    try {
      const res = await api.sendMessage({
        message: text,
        scenario_id: activeScenarioId,
        conversation_id: conversationId || undefined,
        student_level: user?.english_level || 'Beginner (A1)',
      });

      if (res.conversation_id) {
        setConversationId(res.conversation_id);
      }

      const aiMsg = {
        id: res.message_id || Date.now() + 1,
        sender: 'ai',
        text: res.reply,
        has_mistake: res.has_mistake,
        corrected_sentence: res.corrected_sentence,
        explanation: res.explanation,
        repeat_prompt: res.repeat_prompt,
        topic_tag: res.topic_tag,
        provider: res.provider,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Speak AI teacher response aloud
      speak(res.reply);
    } catch (err) {
      console.error('Send message error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'ai',
          text: "I heard you clearly! Let's continue speaking. What other thoughts would you like to share on this topic?",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleExplainMistake = async (msg: any) => {
    try {
      const res = await api.explainMistake({
        student_text: msg.student_text || 'earlier sentence',
        corrected_sentence: msg.corrected_sentence,
        topic_tag: msg.topic_tag,
      });
      setDetailedExplanation({ msgId: msg.id, text: res.explanation });
    } catch (e) {
      // fallback
      setDetailedExplanation({
        msgId: msg.id,
        text: `In spoken English, say '${msg.corrected_sentence}'. Because Indian languages place verbs at the end of the sentence, translating directly causes grammatical traps. Practice saying it aloud 3 times!`,
      });
    }
  };

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return Briefcase;
      case 'Coffee': return Coffee;
      case 'Users': return Users;
      case 'Laptop': return Laptop;
      case 'MapPin': return MapPin;
      default: return MessageCircle;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Scenario Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {scenarios.map((sc) => {
          const Icon = getScenarioIcon(sc.icon);
          const isActive = sc.id === activeScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => initScenario(sc)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold shrink-0 transition cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Conversation Window */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col h-[75vh]">
        {/* Chat Room Top Bar */}
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-sm shadow-sm">
                AS
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Aarav Sir</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  AI Speaking Coach
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Scenario: <strong>{activeScenario?.title}</strong> ({activeScenario?.role})
              </p>
            </div>
          </div>

          {/* Controls: Slow Speech & Restart */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSlowMode}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition border ${
                isSlowMode
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle slower speech rate (0.75x) for clearer listening"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{isSlowMode ? 'Slow Speech (0.75x) ON' : 'Normal Speed (1.0x)'}</span>
            </button>

            <button
              onClick={() => activeScenario && initScenario(activeScenario)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 transition"
              title="Restart Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-white to-slate-50/40">
          {messages.map((msg, index) => {
            const isStudent = msg.sender === 'student';

            return (
              <div
                key={index}
                className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-xs ${
                    isStudent
                      ? 'bg-emerald-600 text-white rounded-br-xs font-medium'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Audio Controls for AI Message */}
                  {!isStudent && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speak(msg.text)}
                          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => speak(msg.text)}
                          className="text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Repeat Audio
                        </button>
                      </div>

                      {msg.provider && (
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          {msg.provider}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Instant Feedback & Gentle Correction Box */}
                {!isStudent && msg.has_mistake && msg.corrected_sentence && (
                  <div className="mt-2.5 max-w-[85%] sm:max-w-[70%] rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-xs text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Gentle English Coach Tip:</span>
                    </div>

                    <div className="rounded-xl bg-white p-2.5 border border-emerald-100 text-slate-800 font-semibold">
                      Natural English: <span className="text-emerald-700">"{msg.corrected_sentence}"</span>
                    </div>

                    {msg.explanation && (
                      <p className="text-emerald-900/90 font-medium leading-relaxed">
                        💡 <strong>Why (Hinglish):</strong> {msg.explanation}
                      </p>
                    )}

                    {msg.repeat_prompt && (
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => speak(msg.repeat_prompt)}
                          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold shadow-2xs cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Practice Repeating Aloud</span>
                        </button>

                        <button
                          onClick={() => handleExplainMistake(msg)}
                          className="text-emerald-800 hover:underline font-semibold"
                        >
                          Explain in detail
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Detailed Explanation Drawer */}
                {detailedExplanation && detailedExplanation.msgId === msg.id && (
                  <div className="mt-2 max-w-[85%] sm:max-w-[70%] rounded-xl bg-slate-900 text-slate-200 p-4 text-xs leading-relaxed border border-slate-700 shadow-md">
                    <div className="flex items-center justify-between text-emerald-400 font-bold mb-2">
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Teacher Breakdown</span>
                      </span>
                      <button
                        onClick={() => setDetailedExplanation(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="whitespace-pre-line">{detailedExplanation.text}</p>
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Aarav Sir is thinking & preparing speaking feedback...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice & Input Controls Footer */}
        <div className="border-t border-slate-200 bg-white p-4">
          {/* Live Mic Transcript Preview */}
          {isListening && (
            <div className="mb-3 rounded-2xl bg-emerald-50 p-3 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AudioWave isActive={true} />
                <span className="text-xs text-emerald-900 font-medium">
                  Listening... <em>"{transcript || 'Speak now in English...'}"</em>
                </span>
              </div>
              <button
                onClick={stopListening}
                className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold"
              >
                Stop
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 shadow-md cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 shadow-emerald-600/25'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to speak using microphone'}
            >
              {isListening ? <Square className="w-5 h-5" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Text Input Box */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? 'Listening to your voice...' : 'Type or speak your answer in English...'}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition"
              />
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isSending}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Scenario Starter Pills */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto text-xs text-slate-500">
            <span className="font-semibold text-slate-400 text-[11px] shrink-0">Try saying:</span>
            {[
              "Yesterday I completed my pending work.",
              "I have three years of experience in this field.",
              "Could you please tell me about today's special menu?",
              "I want to become fluent in English for my job."
            ].map((phrase, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(phrase)}
                className="rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300 px-3 py-1 shrink-0 text-slate-700 transition"
              >
                "{phrase}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
