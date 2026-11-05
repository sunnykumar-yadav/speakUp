import { useState, useCallback, useEffect } from 'react';
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from '../services/speech';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const isSupported = isSpeechSynthesisSupported();

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return;

      const rate = isSlowMode ? 0.75 : 1.0;
      setIsSpeaking(true);
      speakText(
        text,
        rate,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    },
    [isSupported, isSlowMode]
  );

  const stop = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  const toggleSlowMode = useCallback(() => {
    setIsSlowMode((prev) => !prev);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSlowMode,
    toggleSlowMode,
    isSupported,
  };
}
