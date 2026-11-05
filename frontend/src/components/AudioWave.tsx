import React from 'react';

interface AudioWaveProps {
  isActive: boolean;
  color?: string;
}

export const AudioWave: React.FC<AudioWaveProps> = ({ isActive, color = 'bg-emerald-500' }) => {
  if (!isActive) return null;

  return (
    <div className="flex items-center gap-1 h-7 px-2">
      <span className={`w-1 rounded-full ${color} animate-wave-1`} />
      <span className={`w-1 rounded-full ${color} animate-wave-2`} />
      <span className={`w-1 rounded-full ${color} animate-wave-3`} />
      <span className={`w-1 rounded-full ${color} animate-wave-4`} />
      <span className={`w-1 rounded-full ${color} animate-wave-5`} />
    </div>
  );
};
