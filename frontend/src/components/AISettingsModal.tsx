import React, { useState, useEffect } from 'react';
import { X, Sparkles, Key, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose, onStatusUpdated }) => {
  const [provider, setPreferredProvider] = useState<'auto' | 'gemini' | 'groq' | 'openai' | 'demo'>('auto');
  const [geminiKey, setGeminiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    try {
      const res = await api.getAIStatus();
      setStatus(res);
      if (res.active_provider) {
        setPreferredProvider(res.active_provider as any);
      }
    } catch (err) {
      console.warn('Could not load AI status:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMessage(null);
    try {
      const res = await api.saveAIKeys({
        gemini_key: geminiKey || undefined,
        groq_key: groqKey || undefined,
        openai_key: openaiKey || undefined,
        preferred_provider: provider,
      });
      setStatus(res.status);
      setFeedbackMessage('Settings saved successfully!');
      if (onStatusUpdated) onStatusUpdated();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setFeedbackMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">AI Teaching Engine Settings</h3>
            <p className="text-sm text-slate-500">Configure Cloud AI Keys or use Offline Smart Demo Engine</p>
          </div>
        </div>

        {status && (
          <div className="mb-5 rounded-xl bg-slate-50 p-4 border border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Current Active Engine:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                status.active_provider === 'demo'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {status.active_provider === 'demo' ? 'Smart Local Engine (Demo Mode)' : `${status.active_provider.toUpperCase()} AI`}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              {status.active_provider === 'demo'
                ? 'Offline smart engine is active. It runs fast rule-based grammar analysis, Hinglish explanations, and scenario responses with zero API costs.'
                : 'Connected to Live Cloud AI for unlimited fluid conversation generation.'}
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Preferred Engine
            </label>
            <select
              value={provider}
              onChange={(e: any) => setPreferredProvider(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition"
            >
              <option value="auto">Auto (Use first available key, fallback to Demo)</option>
              <option value="demo">Demo Mode (Smart Local Grammar & Conversation Engine)</option>
              <option value="gemini">Google Gemini (Gemini 2.5 Flash)</option>
              <option value="groq">Groq (Llama-3.3 70B Versatile)</option>
              <option value="openai">OpenAI (GPT-4o-mini)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Groq API Key</span>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Keys are handled strictly by the backend server and never leaked into client bundles.</span>
          </div>

          {feedbackMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              feedbackMessage.includes('Error')
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {feedbackMessage.includes('Error') ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{feedbackMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save & Apply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
