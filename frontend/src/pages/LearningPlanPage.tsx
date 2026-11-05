import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  Mic, 
  RotateCcw, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import type { DailyPlanResponse, LearningTask } from '../types';

export const LearningPlanPage: React.FC = () => {
  const [plan, setPlan] = useState<DailyPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const res = await api.getDailyPlan();
      setPlan(res);
    } catch (e) {
      console.warn('Failed to load plan:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (taskId: number) => {
    if (!plan) return;
    try {
      const res = await api.togglePlanTask(taskId);
      setPlan((prev) => {
        if (!prev) return prev;
        const updated = prev.tasks.map((t) =>
          t.id === taskId ? { ...t, is_completed: res.is_completed ? 1 : 0 } : t
        );
        const newCompletedCount = updated.filter((t) => t.is_completed).length;
        return {
          ...prev,
          tasks: updated,
          completed_count: newCompletedCount,
        };
      });
    } catch (e) {
      console.warn('Error toggling task:', e);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'grammar': return BookOpen;
      case 'sentence': return MessageSquare;
      case 'speaking': return Mic;
      default: return RotateCcw;
    }
  };

  const completedPct = plan && plan.total_tasks > 0
    ? Math.round((plan.completed_count / plan.total_tasks) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Personalized Daily Routine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          My Daily English Speaking Routine
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          A scientifically structured 40-minute daily schedule customized to your diagnostic strengths and weaknesses.
        </p>
      </div>

      {/* Routine Progress Card */}
      <div className="rounded-3xl border border-emerald-200 bg-linear-to-r from-emerald-50/70 via-white to-teal-50/50 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Today's Completion Status
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {plan?.completed_count || 0} of {plan?.total_tasks || 4} Tasks Completed
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-700 bg-white px-4 py-2 rounded-2xl border border-emerald-200 shadow-2xs">
            {completedPct}%
          </span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${completedPct}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Today's 4-Part Daily Routine:
        </h2>

        {plan?.tasks.map((task) => {
          const Icon = getTaskIcon(task.task_type);
          const isDone = Boolean(task.is_completed);

          return (
            <div
              key={task.id}
              className={`rounded-2xl border p-5 flex items-center justify-between gap-4 transition shadow-xs ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/30 text-slate-500'
                  : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleToggle(task.id)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border transition cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white hover:border-emerald-500'
                  }`}
                >
                  {isDone && <CheckCircle className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    isDone ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{task.duration_minutes} Minutes</span>
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={task.action_route}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50 border border-slate-200 px-3 py-2 rounded-xl transition shrink-0"
              >
                <span>Start</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Pedagogical Principle: Realistic Timeline Banner */}
      <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Estimated Learning Trajectory</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          {plan?.estimated_timeline || 'Estimated timeline to reach Conversational B1: 8–12 weeks of active 30-40 daily speaking practice.'}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
          <strong>Important Principle:</strong> We never guarantee fluency within a fixed magic number of days. Fluent spoken English is an organic habit developed through active vocal articulation and patient daily consistency.
        </p>
      </div>
    </div>
  );
};
