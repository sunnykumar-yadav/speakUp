import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Heart, Shield, Sparkles, BookOpen, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Mic className="h-4 w-4" />
              </div>
              <span className="text-lg font-black text-slate-900">SpeakUp AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering learners who understand English to overcome hesitation and speak confidently through daily AI conversations.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Principle: Teach to Speak, Not Just Memorize.</span>
            </div>
          </div>

          {/* Quick Learning Rooms */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Speaking & Practice</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/speaking-room" className="hover:text-emerald-600 transition flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-500" />
                  <span>AI Speaking Room</span>
                </Link>
              </li>
              <li>
                <Link to="/grammar" className="hover:text-emerald-600 transition flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                  <span>14 Grammar Topics</span>
                </Link>
              </li>
              <li>
                <Link to="/sentence-builder" className="hover:text-emerald-600 transition flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Hindi Sentence Builder</span>
                </Link>
              </li>
              <li>
                <Link to="/assessment" className="hover:text-emerald-600 transition">
                  Comprehensive Diagnostic
                </Link>
              </li>
            </ul>
          </div>

          {/* Grammar Highlights */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Key Grammar Topics</h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>Is, Am, Are vs Action Verbs</li>
              <li>Was & Were Past Concord</li>
              <li>Have, Has, Had Possession</li>
              <li>Do, Does, Did Negatives</li>
              <li>Simple Past vs Continuous</li>
              <li>Modal Verbs (Can, Could, Should)</li>
            </ul>
          </div>

          {/* Disclaimer & Transparency */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pedagogical Disclaimer</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              We never promise unrealistic overnight fluency. Spoken confidence is an organic muscle developed through daily, patient practice with constructive feedback.
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-400">
              API keys are stored securely on the backend server with environment variable protection.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SpeakUp AI – Personal English Speaking Coach. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted for confident bilingual speakers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};
