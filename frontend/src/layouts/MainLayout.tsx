import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Sparkles, Info, X } from 'lucide-react';
import { api } from '../services/api';
import { AISettingsModal } from '../components/AISettingsModal';

export const MainLayout: React.FC = () => {
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await api.getAIStatus();
      setAiStatus(res);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* Demo Mode Notice Top Banner */}
      {aiStatus?.is_demo_mode && !isBannerDismissed && (
        <aside aria-label="Demo mode notice" className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 px-4 py-1.5 text-white text-xs font-medium shadow-xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 animate-spin" />
              <span>
                <strong>Smart Local Engine Active (Demo Mode):</strong> Full grammar corrections, Hinglish explanations, and scenario chat run with zero API costs.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="underline hover:text-amber-100 font-semibold cursor-pointer"
              >
                Connect Cloud AI Key
              </button>
              <button
                onClick={() => setIsBannerDismissed(true)}
                className="text-white/80 hover:text-white"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onStatusUpdated={checkStatus}
      />
    </div>
  );
};
