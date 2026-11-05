import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Mic, 
  BookOpen, 
  Award, 
  Sparkles, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import type { ProgressSummary, WeeklyReport } from '../types';

export const ProgressPage: React.FC = () => {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sumRes, repRes] = await Promise.all([
        api.getProgressSummary(),
        api.getWeeklyReport(),
      ]);
      setSummary(sumRes);
      setWeeklyReport(repRes);
    } catch (e) {
      console.warn('Failed to load progress data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const totals = summary?.totals;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-800 mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Real-time Learning Analytics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Speaking & Grammar Progress Tracker
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Track your daily speaking hours, eliminate repeated grammatical traps, and measure weekly conversational fluency.
        </p>
      </div>

      {/* 4 Primary Progress Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Speaking Time</span>
            <Mic className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totals?.speaking_minutes || 35} <span className="text-xs font-medium text-slate-400">mins</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Active live speaking</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Grammar Accuracy</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totals?.accuracy_rate || 84.5}%
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Average across exercises</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vocabulary</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totals?.vocabulary_learned || 72}
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Collocations mastered</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Topics</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totals?.completed_lessons || 3} <span className="text-xs font-medium text-slate-400">/ 14</span>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Foundational modules</p>
        </div>
      </div>

      {/* Weekly Personalized Report Card */}
      {weeklyReport && (
        <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-white via-emerald-50/30 to-teal-50/50 p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {weeklyReport.week_label}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Personalized AI Coach Weekly Evaluation
              </h2>
              <p className="text-xs text-slate-500">Student: <strong>{weeklyReport.student_name}</strong> • Level: <strong>{weeklyReport.current_level}</strong></p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold block">Streak</span>
                <span className="text-sm font-black text-emerald-600">{weeklyReport.metrics.consistency_streak}</span>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold block">Target</span>
                <span className="text-sm font-black text-slate-900">{weeklyReport.metrics.target_achieved}</span>
              </div>
            </div>
          </div>

          {/* Coach Insights */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Teacher Observations & Guidance:</h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {weeklyReport.coach_insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2 rounded-xl bg-white/80 p-3 border border-emerald-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Realistic Estimated Timeline */}
          <div className="rounded-2xl bg-slate-900 text-white p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong className="text-white block">Honest Learning Trajectory:</strong>
              {weeklyReport.estimated_timeline}
            </p>
          </div>
        </div>
      )}

      {/* Repeated Mistakes Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>AI Student Memory: Repeated Grammar Traps</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Auto-logged from Speaking Room</span>
        </div>

        <div className="space-y-3">
          {(summary?.repeated_mistakes || []).map((m, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{m.content}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Recorded {m.count} time(s) during conversations</p>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                Needs Revision
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
