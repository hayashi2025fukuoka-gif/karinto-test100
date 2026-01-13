
import React from 'react';

interface Props {
  message: string;
  mood?: 'happy' | 'thinking' | 'encouraging';
}

const KarintoMaru: React.FC<Props> = ({ message, mood = 'happy' }) => {
  return (
    <div className="flex items-start gap-4 p-4 bg-white/40 border border-[#d4af37]/30 rounded-2xl shadow-sm mb-6 max-w-lg w-full">
      <div className="relative w-24 h-24 flex-shrink-0 bg-[#fdfaf1] rounded-full border-2 border-[#d4af37] overflow-hidden flex items-center justify-center">
        {/* Simple SVG Character representation of Karinto-maru */}
        <svg viewBox="0 0 100 100" className="w-20 h-20">
          {/* Hat (Eboshi) */}
          <path d="M30 30 L50 10 L70 30 Z" fill="#2c1810" />
          {/* Face */}
          <circle cx="50" cy="55" r="30" fill="#f9e4c8" />
          
          {/* Glasses (Added) */}
          <g stroke="#2c1810" fill="none" strokeWidth="1">
            <circle cx="40" cy="50" r="8" />
            <circle cx="60" cy="50" r="8" />
            <path d="M48 50 L52 50" />
            <path d="M32 50 L25 45" />
            <path d="M68 50 L75 45" />
          </g>

          {/* Eyes */}
          <circle cx="40" cy="50" r="2.5" fill="#2c1810" />
          <circle cx="60" cy="50" r="2.5" fill="#2c1810" />
          
          {/* Mouth */}
          {mood === 'happy' && <path d="M40 68 Q50 78 60 68" stroke="#2c1810" fill="none" strokeWidth="1.5" />}
          {mood === 'thinking' && <path d="M43 72 L57 72" stroke="#2c1810" fill="none" strokeWidth="1.5" />}
          {mood === 'encouraging' && <path d="M43 70 Q50 65 57 70" stroke="#2c1810" fill="none" strokeWidth="1.5" />}
          
          {/* Cheeks */}
          <circle cx="35" cy="62" r="3" fill="#f0a0a0" opacity="0.6" />
          <circle cx="65" cy="62" r="3" fill="#f0a0a0" opacity="0.6" />
          
          {/* Body (Kimono) */}
          <path d="M20 85 Q50 100 80 85 L80 100 L20 100 Z" fill="#c04848" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="text-xs font-bold text-[#c04848] mb-1">かりんと丸（知恵者）</div>
        <div className="text-sm leading-relaxed text-[#2c1810] font-serif">
          「{message}」
        </div>
      </div>
    </div>
  );
};

export default KarintoMaru;
