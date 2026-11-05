import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AssessmentPage } from './pages/AssessmentPage';
import { SpeakingRoomPage } from './pages/SpeakingRoomPage';
import { GrammarCoachPage } from './pages/GrammarCoachPage';
import { GrammarLessonPage } from './pages/GrammarLessonPage';
import { SentenceBuilderPage } from './pages/SentenceBuilderPage';
import { ProgressPage } from './pages/ProgressPage';
import { LearningPlanPage } from './pages/LearningPlanPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/speaking-room" element={<SpeakingRoomPage />} />
            <Route path="/grammar" element={<GrammarCoachPage />} />
            <Route path="/grammar/:slug" element={<GrammarLessonPage />} />
            <Route path="/sentence-builder" element={<SentenceBuilderPage />} />
            <Route path="/learning-plan" element={<LearningPlanPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
