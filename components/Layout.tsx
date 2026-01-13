
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 bg-[#fdfaf1]">
      {/* Decorative Border */}
      <div className="w-full max-w-4xl min-h-[85vh] relative washi-card rounded-lg p-6 flex flex-col items-center">
        {/* Decorative corner patterns (simulated with CSS/SVG) */}
        <div className="absolute top-0 left-0 p-2 opacity-30 select-none pointer-events-none">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#d4af37" strokeWidth="2">
            <circle cx="20" cy="20" r="10" />
            <path d="M0 50 Q 25 25 50 0" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 p-2 opacity-30 rotate-90 select-none pointer-events-none">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#d4af37" strokeWidth="2">
            <circle cx="20" cy="20" r="10" />
            <path d="M0 50 Q 25 25 50 0" />
          </svg>
        </div>
        
        {children}
        
        {/* Footer Text */}
        <footer className="mt-auto pt-8 text-[#8c7a6b] text-sm text-center font-serif italic">
          平安の響き、今に伝ふ。
        </footer>
      </div>
    </div>
  );
};

export default Layout;
