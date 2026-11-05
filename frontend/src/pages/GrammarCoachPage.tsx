import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  UserCheck, 
  Calendar, 
  Compass, 
  Briefcase, 
  HelpCircle, 
  PlayCircle, 
  Layers, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Sun, 
  FastForward,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import type { GrammarTopic } from '../types';

export const GrammarCoachPage: React.FC = () => {
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const res = await api.getGrammarTopics();
      setTopics(res.topics || []);
    } catch (e) {
      console.warn('Could not load topics:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'UserCheck': return UserCheck;
      case 'Clock': return Clock;
      case 'Briefcase': return Briefcase;
      case 'HelpCircle': return HelpCircle;
      case 'Sun': return Sun;
      case 'PlayCircle': return PlayCircle;
      case 'Calendar': return Calendar;
      case 'FastForward': return FastForward;
      case 'Compass': return Compass;
      case 'Layers': return Layers;
      case 'Users': return Users;
      case 'MapPin': return MapPin;
      case 'ShieldCheck': return ShieldCheck;
      default: return BookOpen;
    }
  };

  const filteredTopics = topics.filter((t) => {
    if (filter === 'beginner') return t.level.includes('Beginner') || t.level.includes('A1') || t.level.includes('A2');
    if (filter === 'intermediate') return t.level.includes('Intermediate') || t.level.includes('B1') || t.level.includes('B2');
    if (filter === 'completed') return t.is_completed;
    return true;
  });

  const completedCount = topics.filter((t) => t.is_completed).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Structured 14-Topic Syllabus</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Personal Grammar Coach
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl">
            Learn grammar through real conversational rules and Hindi translation traps, not abstract book definitions.
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 shrink-0 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">
                {completedCount} <span className="text-xs font-medium text-slate-500">/ 14</span>
              </div>
              <p className="text-xs font-semibold text-emerald-800 mt-1">Modules Mastered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'all', label: 'All 14 Topics' },
          { key: 'beginner', label: 'Beginner (A1 - A2)' },
          { key: 'intermediate', label: 'Intermediate (B1 - B2)' },
          { key: 'completed', label: `Completed (${completedCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              filter === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const Icon = getIcon(topic.icon);
          const isDone = Boolean(topic.is_completed);

          return (
            <div
              key={topic.id}
              className={`rounded-3xl border bg-white p-6 shadow-xs flex flex-col justify-between transition hover:shadow-md hover:border-emerald-400 group ${
                isDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                  } transition`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {topic.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {topic.title}
                </h3>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                  {topic.hindi_title}
                </p>

                <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                  {topic.description_hindi}
                </p>

                {/* Common Mistake Warning Pill */}
                <div className="mt-4 rounded-xl bg-rose-50 border border-rose-100 p-2.5 text-[11px] text-rose-800 leading-snug">
                  <strong>Common Trap:</strong> {topic.common_mistake}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Score: {topic.quiz_score}%</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">Ready to start</span>
                  )}
                </div>

                <Link
                  to={`/grammar/${topic.slug}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition"
                >
                  <span>{isDone ? 'Review Lesson' : 'Start Lesson'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
