import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mic, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Volume2, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-xs mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>AI English Speaking Coach for Bilingual Learners</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Speak English. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              Think Confidently.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            You understand 80% of English, but hesitate when speaking. 
            SpeakUp AI identifies your mental Hindi-to-English translation traps and trains your voice with daily interactive speaking practice.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/assessment"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-base font-bold shadow-lg shadow-emerald-600/25 transition hover:scale-[1.02] active:scale-95"
            >
              <span>Start Free Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/speaking-room"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 bg-white text-slate-800 px-8 py-4 text-base font-bold transition hover:scale-[1.02] active:scale-95"
            >
              <Mic className="w-5 h-5 text-emerald-600" />
              <span>Enter AI Speaking Room</span>
            </Link>
          </div>

          {/* Feature Highlights Trust Row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bilingual Hindi/Hinglish explanations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Voice speech-to-text & audio playback</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero-judgment, safe practice room</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Real Problem & Solution */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">The Hidden Obstacle</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Why do smart people struggle to speak English?
            </h3>
            <p className="mt-4 text-base text-slate-600">
              Grammar books teach you how to write exams, not how to react in live conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* The Trap */}
            <div className="rounded-3xl border border-rose-100 bg-white p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">The Hindi-to-English Mental Trap</h4>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>Mind translation delay:</strong> Thinking in Hindi first and translating word-by-word into English before speaking creates painful hesitation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>Helping verb confusion:</strong> Saying <em>"I am agree"</em>, <em>"He don't know"</em>, or <em>"Did you went"</em> because Hindi structures mislead you.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>Fear of social embarrassment:</strong> Being terrified that a colleague or interviewer will judge a grammatical slip.</span>
                </li>
              </ul>
            </div>

            {/* The SpeakUp AI Method */}
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50 p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">The SpeakUp AI Solution</h4>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span><strong>Instant, gentle coaching:</strong> When you speak, AI catches the error immediately without interrupting your flow.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span><strong>Bilingual Hinglish context:</strong> Explains exactly <em>why</em> it happens in Hindi so your brain builds the right reflex.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span><strong>Vocal muscle repetition:</strong> Trains your vocal cords by having you immediately repeat the natural phrase aloud.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Teaching Works */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Interactive Teaching Flow</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              How Aarav Sir (AI Coach) Teaches You
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'You Speak Naturally',
                desc: 'Use your voice or keyboard in real scenarios like Job Interviews or Cafe Orders.',
                icon: Mic
              },
              {
                step: '02',
                title: 'Gentle Detection',
                desc: 'AI detects the exact tense or helping verb slip without causing embarrassment.',
                icon: HelpCircle
              },
              {
                step: '03',
                title: 'Hinglish Explanation',
                desc: 'Get an intuitive explanation in Hindi of why English structures work this way.',
                icon: BookOpen
              },
              {
                step: '04',
                title: 'Oral Repetition',
                desc: 'Speak the corrected sentence out loud to cement vocal muscle memory.',
                icon: Volume2
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative rounded-3xl border border-slate-200 bg-slate-50/60 p-6 hover:shadow-lg hover:border-emerald-300 transition group">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-200 transition">
                    {item.step}
                  </span>
                  <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 sm:py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Core Platform Capabilities</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Everything you need to speak fluently
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:border-emerald-300 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-5">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">AI Speaking Room</h4>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                Live interactive audio conversations across Job Interviews, Cafe orders, and Daily chats with real-time speech-to-text and slow-speech audio narration.
              </p>
              <Link to="/speaking-room" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                <span>Try a conversation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:border-emerald-300 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">14 Personal Grammar Topics</h4>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                Master Is/Am/Are, Was/Were, Have/Has/Had, Do/Does/Did, Prepositions, and WH Questions with bilingual lessons, interactive quizzes, and microphone pronunciation challenges.
              </p>
              <Link to="/grammar" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                <span>Explore 14 topics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:border-emerald-300 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 mb-5">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Sentence Builder</h4>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                Type or speak your Hindi thought. AI translates it into natural English, analyzes SVO structural differences, and presents 3 stylistic alternatives.
              </p>
              <Link to="/sentence-builder" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                <span>Build a sentence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Sample Marked) */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 mb-3">
              <span>Sample Learner Experiences</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Hear from confident bilingual speakers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I used to always say 'I am agree' and translate from Hindi. The Hinglish explanations made it click immediately. I cracked my tech lead interview last week!",
                name: "Rahul Verma",
                role: "Software Engineer, Bengaluru",
                level: "Intermediate (B1+)"
              },
              {
                quote: "Practicing with the AI Speaking Room gave me a safe space where no one was judging me. Being able to repeat the corrected audio at 0.75x speed built my confidence.",
                name: "Pooja Sharma",
                role: "MBA Student, Delhi",
                level: "Elementary to Fluent"
              },
              {
                quote: "The Sentence Builder is magic. I speak what I am thinking in Hindi, and it shows me formal vs casual spoken alternatives. My client calls are 100% smoother.",
                name: "Vikram Malhotra",
                role: "Sales Operations, Mumbai",
                level: "Upper-Intermediate (B2)"
              }
            ].map((t, i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between">
                <p className="text-sm text-slate-700 italic leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{t.name}</h5>
                  <p className="text-xs text-slate-500">{t.role}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {t.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to stop translating in your mind?
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Take the 5-minute interactive diagnostic test to uncover your specific grammar and speaking blind spots today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/assessment"
              className="w-full sm:w-auto rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-8 py-4 text-base shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-95"
            >
              Start Free Assessment
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto rounded-2xl border border-slate-700 hover:bg-slate-800/80 text-white font-bold px-8 py-4 text-base transition"
            >
              View Student Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
