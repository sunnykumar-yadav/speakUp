import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mic, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle, 
  Award, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { ProgressSummary } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await api.getProgressSummary();
      setSummary(res);
    } catch (e) {
      console.warn('Could not load summary:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const studentName = user?.name || 'Aman';
  const englishLevel = user?.english_level || 'Elementary (A2)';
  const targetMins = user?.target_minutes || 30;
  const currentSpeakingMins = summary?.totals?.speaking_minutes || 22;
  const currentGrammarMins = summary?.totals?.grammar_minutes || 10;
  const totalMinsToday = currentSpeakingMins + currentGrammarMins;
  const progressPercent = Math.min(100, Math.round((totalMinsToday / targetMins) * 100));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome Back, {studentName}!</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready for today's speaking practice?
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Consistent 20-30 minutes of oral practice eliminates mental translation faster than months of passive reading.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/speaking-room"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 text-sm font-black shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Launch Speaking Room</span>
            </Link>
            <Link
              to="/assessment"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3.5 text-sm font-semibold transition"
            >
              <span>Take Diagnostic</span>
            </Link>
          </div>
        </div>

        {/* Level Tag bottom bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
          <div>
            <span className="text-slate-400">Current Level: </span>
            <strong className="text-emerald-300 font-bold ml-1">{englishLevel}</strong>
          </div>
          <div>
            <span className="text-slate-400">Daily Target: </span>
            <strong className="text-white font-bold ml-1">{targetMins} Minutes</strong>
          </div>
          <div>
            <span className="text-slate-400">Language Mode: </span>
            <strong className="text-teal-300 font-bold ml-1">Hinglish / English Support</strong>
          </div>
        </div>
      </div>

      {/* Recommended Next Lesson Card */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/50 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Recommended Next Step
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Topic 2: Was & Were (Fixing Past State Mistakes)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Stop saying "You was" or "Yesterday I was go". Master English past states with Hindi context.
            </p>
          </div>
        </div>

        <Link
          to="/grammar/was-were"
          className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 text-xs font-bold shrink-0 transition"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Continue Learning</span>
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Speaking Time</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary?.totals?.speaking_minutes || 35} <span className="text-xs font-medium text-slate-400">mins</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Active conversation time</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Grammar Accuracy</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary?.totals?.accuracy_rate || 84.5}%
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Across quizzes & speaking</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Completed Lessons</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary?.totals?.completed_lessons || 3} <span className="text-xs font-medium text-slate-400">/ 14</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Foundational grammar topics</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Vocabulary Mastered</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary?.totals?.vocabulary_learned || 68} <span className="text-xs font-medium text-slate-400">phrases</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Spoken collocations learned</p>
        </div>
      </div>

      {/* Two Column Section: Daily Target & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Daily Target & Weak Areas */}
        <div className="lg:col-span-1 space-y-6">
          {/* Daily Goal Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Today's Learning Target</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-3">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>{totalMinsToday} mins spent</span>
              <span>Goal: {targetMins} mins</span>
            </div>

            <Link
              to="/learning-plan"
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition"
            >
              <span>View Today's Routine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* AI Memory: Words / Traps to Watch */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>AI Memory: Weak Spots to Watch</span>
            </div>
            <p className="text-xs text-amber-800/80 mb-4 leading-relaxed">
              Based on your speaking history, your AI teacher detected these repeated Hindi-translation slips:
            </p>
            <ul className="space-y-2.5 text-xs">
              {(summary?.repeated_mistakes || [
                { content: "Is/Am/Are: 'I am agree' -> say 'I agree'", count: 3 },
                { content: "Past Simple: 'Yesterday I go' -> say 'Yesterday I went'", count: 2 },
                { content: "Did questions: 'Did you went' -> say 'Did you go'", count: 2 }
              ]).map((m, i) => (
                <li key={i} className="flex items-start gap-2 rounded-xl bg-white p-3 border border-amber-200/60 shadow-2xs">
                  <span className="text-rose-500 font-bold mt-0.5">!</span>
                  <span className="text-slate-800 font-medium">{m.content}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Quick Access & Weekly Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Practice Rooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/speaking-room"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">AI Speaking Room</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Practice Job Interviews, Cafe orders, and everyday small talk with friendly AI Aarav Sir.
              </p>
            </Link>

            <Link
              to="/grammar"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">14 Grammar Topics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Structured bilingual modules for Is/Am/Are, Was/Were, Have/Has/Had, Tenses, and Modal Verbs.
              </p>
            </Link>

            <Link
              to="/sentence-builder"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Hindi Sentence Builder</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Input Hindi/Hinglish thoughts and instantly learn natural SVO sentence structures and alternatives.
              </p>
            </Link>

            <Link
              to="/progress"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Weekly Report & Metrics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                View your consistency streak, weekly personalized evaluation, and estimated timelines.
              </p>
            </Link>
          </div>

          {/* Weekly Practice Time Chart */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">7-Day Speaking Minutes Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Daily minutes invested in active spoken practice</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600">Active Daily Habit</span>
            </div>

            <div className="flex items-end justify-between gap-3 h-36 pt-4 border-b border-slate-100">
              {(summary?.weekly_chart || [
                { log_date: 'Mon', speaking_minutes: 15 },
                { log_date: 'Tue', speaking_minutes: 25 },
                { log_date: 'Wed', speaking_minutes: 18 },
                { log_date: 'Thu', speaking_minutes: 30 },
                { log_date: 'Fri', speaking_minutes: 20 },
                { log_date: 'Sat', speaking_minutes: 35 },
                { log_date: 'Sun', speaking_minutes: 22 }
              ]).map((day, idx) => {
                const heightPct = Math.min(100, Math.max(15, (day.speaking_minutes / 40) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600">{day.speaking_minutes}m</span>
                    <div className="w-full bg-slate-100 rounded-t-md h-24 flex items-end">
                      <div
                        className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {day.log_date.length > 5 ? day.log_date.slice(5) : day.log_date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
