
import React from 'react';
import { CelebrationContent } from '../types';

interface Props {
  content: CelebrationContent;
}

const CelebrationCertificate: React.FC<Props> = ({ content }) => {
  return (
    <div className="w-full max-w-2xl bg-[#fffaf0] border-[12px] border-double border-[#d4af37] p-8 md:p-12 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-1000">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="10" cy="10" r="20" fill="#d4af37" />
          <circle cx="90" cy="90" r="30" fill="#d4af37" />
        </svg>
      </div>

      <div className="relative flex flex-col items-center border-2 border-[#d4af37]/30 p-6 md:p-10">
        <h2 className="text-4xl md:text-5xl font-black mb-8 text-[#c04848] tracking-[0.5em] font-serif border-b-4 border-[#c04848]/20 pb-4 w-full text-center">
          表彰状
        </h2>

        <div className="w-full text-left mb-8 space-y-4">
          <p className="text-xl md:text-2xl font-bold text-[#2c1810]">
            貴殿
          </p>
          <p className="text-lg md:text-xl leading-relaxed text-[#5d4037] font-serif indent-4">
            貴殿は「百人一首・かりんとう饅頭修練」において、
            百首全ての難関を見事に突破し、伝説のかりんとう饅頭を
            完成させました。その不屈の精神と雅なる知性を讃え、
            ここにこれを賞します。
          </p>
        </div>

        {/* The Original Poem - Vertical Layout */}
        <div className="bg-white/60 p-6 rounded-lg border border-[#d4af37]/30 shadow-inner mb-8 w-full">
            <div className="text-[#c04848] text-xs font-bold mb-4 text-center uppercase tracking-widest">かりんと丸 祝賀の詠</div>
            <div className="flex justify-center items-center py-4">
                <div className="japanese-vertical text-2xl md:text-3xl font-bold leading-relaxed tracking-tighter text-[#2c1810] h-64 flex justify-center">
                    {content.originalPoem}
                </div>
            </div>
            <div className="mt-4 border-t border-[#d4af37]/20 pt-4 text-sm text-[#8c7a6b] italic text-center">
                {content.poemMeaning}
            </div>
        </div>

        <div className="w-full flex justify-between items-end mt-4">
          <div className="text-[#8c7a6b] font-serif">
            令和{content.date}
          </div>
          <div className="relative flex flex-col items-center">
            <div className="text-sm font-bold text-[#2c1810] mb-2 font-serif">
              修練司・かりんと丸
            </div>
            {/* Hanko (Stamp) */}
            <div className="w-16 h-16 border-4 border-[#c04848] rounded-lg flex items-center justify-center rotate-12 bg-white/40">
                <div className="text-[#c04848] font-black text-center leading-none">
                    <div className="text-[10px]">極上</div>
                    <div className="text-sm">かりんと</div>
                    <div className="text-[10px]">之印</div>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#d4af37]" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#d4af37]" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#d4af37]" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#d4af37]" />
    </div>
  );
};

export default CelebrationCertificate;
