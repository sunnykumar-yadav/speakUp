// Web Speech API wrapper for Speech Recognition & Synthesis

export interface SpeechRecognitionHookOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  lang?: string;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(
  text: string,
  rate: number = 1.0,
  onStart?: () => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (!isSpeechSynthesisSupported()) return null;

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const cleanText = text.replace(/[*_#`]/g, ''); // Strip markdown
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = rate; // 0.75 for slow speech, 1.0 for normal
  utterance.pitch = 1.0;

  // Try to find a pleasant English voice (e.g. Google US English, Samantha, or Indian English)
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) => (v.lang.includes('en-IN') || v.lang.includes('en-US') || v.lang.includes('en-GB')) && !v.name.includes('Bad')
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
