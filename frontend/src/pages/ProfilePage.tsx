import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Target, 
  Globe, 
  Award, 
  CheckCircle2, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { EnglishLevel } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [targetMinutes, setTargetMinutes] = useState(user?.target_minutes || 30);
  const [preferredLanguage, setPreferredLanguage] = useState<'Hinglish' | 'English'>(user?.preferred_language || 'Hinglish');
  const [level, setLevel] = useState<EnglishLevel>(user?.english_level || 'Elementary (A2)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      target_minutes: targetMinutes,
      preferred_language: preferredLanguage,
      english_level: level,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Profile & Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your learning preferences, target daily minutes, and language mode</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-2xl shadow-md shadow-emerald-600/25">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {user?.english_level}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Student Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Daily Practice Target
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTargetMinutes(mins)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    targetMinutes === mins
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {mins} Mins
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Grammar Explanation Language Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'Hinglish', label: 'Hinglish (Hindi + English Examples)' },
                { key: 'English', label: 'English Only' },
              ].map((lang) => (
                <button
                  key={lang.key}
                  type="button"
                  onClick={() => setPreferredLanguage(lang.key as any)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                    preferredLanguage === lang.key
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Proficiency Benchmark
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as EnglishLevel)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition"
            >
              <option value="Beginner (A1)">Beginner (A1)</option>
              <option value="Elementary (A2)">Elementary (A2)</option>
              <option value="Intermediate (B1)">Intermediate (B1)</option>
              <option value="Intermediate (B1+)">Intermediate (B1+)</option>
              <option value="Upper-Intermediate (B2)">Upper-Intermediate (B2)</option>
            </select>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile preferences saved successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
