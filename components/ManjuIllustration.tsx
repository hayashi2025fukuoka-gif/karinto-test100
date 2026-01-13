
import React from 'react';

interface Props {
  step: number;
}

const ManjuIllustration: React.FC<Props> = ({ step }) => {
  // ステージ判定
  const getStage = () => {
    if (step === 0) return 'start';
    if (step <= 15) return 'ingredients'; // 黒糖と水
    if (step <= 40) return 'dough';       // 生地作り
    if (step <= 75) return 'shaping';     // 餡包み
    if (step <= 95) return 'frying';      // 揚げ
    return 'complete';                    // 完成
  };

  const stage = getStage();

  return (
    <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
      {/* 雅な台座（折敷） */}
      <svg viewBox="0 0 100 100" className="absolute w-full h-full drop-shadow-lg">
        <rect x="10" y="70" width="80" height="20" fill="#8c7a6b" rx="2" />
        <rect x="15" y="65" width="70" height="10" fill="#a68b7c" rx="2" />
        
        {/* ステージ別のイラスト */}
        {stage === 'start' && (
          <g opacity="0.5">
            <text x="50" y="45" textAnchor="middle" fill="#8c7a6b" fontSize="6" className="font-serif italic">材料を待つ...</text>
          </g>
        )}

        {stage === 'ingredients' && (
          <g>
            {/* 黒糖の塊 */}
            <rect x="30" y="40" width="15" height="15" fill="#4b2e21" rx="2" transform="rotate(10 37 47)" />
            <rect x="50" y="45" width="12" height="12" fill="#5d4037" rx="2" transform="rotate(-15 56 51)" />
            {/* 水滴 */}
            <circle cx="45" cy="30" r="3" fill="#add8e6" opacity="0.8" />
            <circle cx="55" cy="25" r="2" fill="#add8e6" opacity="0.6" />
          </g>
        )}

        {stage === 'dough' && (
          <g>
            {/* 練られた生地 */}
            <ellipse cx="50" cy="50" r="25" fill="#8d6e63" />
            <path d="M35 45 Q50 35 65 45" stroke="#5d4037" fill="none" strokeWidth="2" opacity="0.5" />
          </g>
        )}

        {stage === 'shaping' && (
          <g>
            {/* 成形された饅頭 */}
            <circle cx="50" cy="50" r="22" fill="#6d4c41" />
            <circle cx="50" cy="50" r="18" fill="#5d4037" stroke="#d4af37" strokeDasharray="2 1" fillOpacity="0.3" />
            <text x="50" y="53" textAnchor="middle" fill="#fdfaf1" fontSize="8" fontWeight="bold">餡</text>
          </g>
        )}

        {stage === 'frying' && (
          <g>
            {/* 揚げてる最中の泡 */}
            <circle cx="50" cy="50" r="22" fill="#3e2723" />
            <g className="animate-pulse">
              <circle cx="35" cy="40" r="2" fill="white" opacity="0.6" />
              <circle cx="65" cy="45" r="3" fill="white" opacity="0.4" />
              <circle cx="50" cy="35" r="2" fill="white" opacity="0.5" />
              <circle cx="40" cy="60" r="2.5" fill="white" opacity="0.4" />
            </g>
            <path d="M30 70 Q50 65 70 70" stroke="#ff8c00" fill="none" strokeWidth="3" opacity="0.6" />
          </g>
        )}

        {stage === 'complete' && (
          <g className="animate-bounce" style={{ animationDuration: '3s' }}>
            {/* 完成したかりんとう饅頭 */}
            <circle cx="50" cy="45" r="25" fill="#2c1810" />
            {/* 艶（ハイライト） */}
            <path d="M35 35 Q40 25 50 30" stroke="white" fill="none" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
            {/* 後光 */}
            <g opacity="0.6">
              {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <line 
                  key={deg}
                  x1="50" y1="45" 
                  x2={50 + 35 * Math.cos(deg * Math.PI / 180)} 
                  y2={45 + 35 * Math.sin(deg * Math.PI / 180)} 
                  stroke="#d4af37" strokeWidth="1" 
                />
              ))}
            </g>
          </g>
        )}
      </svg>
      
      {/* 工程数バッジ */}
      <div className="absolute -bottom-2 bg-[#c04848] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md border border-[#d4af37]">
        工程：{step}/100
      </div>
    </div>
  );
};

export default ManjuIllustration;
