
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-16" }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative group">
        {/* House Roof Line - refined */}
        <svg className="w-14 h-6 absolute -top-3 left-1/2 -translate-x-1/2 transition-transform duration-700 group-hover:-translate-y-1" viewBox="0 0 100 40" fill="none">
           <path d="M10 35 L50 5 L90 35" stroke="#C5A028" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="text-6xl font-serif font-black italic gold-gradient tracking-tighter">R</span>
      </div>
      <div className="text-center -mt-2">
        <div className="flex items-center gap-1">
          <h1 className="text-xs font-black tracking-[0.4em] text-white">RAMBU</h1>
          <h1 className="text-xs font-black tracking-[0.4em] text-brand-gold">RENTALS</h1>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1.5 mb-1.5"></div>
        <p className="text-[6px] font-black text-gray-500 tracking-[0.5em] uppercase whitespace-nowrap">Your Key to East African Living</p>
      </div>
    </div>
  );
};
