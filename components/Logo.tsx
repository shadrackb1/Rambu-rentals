
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-16" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* House Roof Line */}
        <svg className="w-16 h-8 absolute -top-4 left-1/2 -translate-x-1/2" viewBox="0 0 100 40" fill="none">
           <path d="M10 35 L50 5 L90 35" stroke="#D4AF37" strokeWidth="4" />
        </svg>
        <span className="text-6xl font-serif font-black text-brand-gold italic">R</span>
      </div>
      <div className="text-center mt-[-8px]">
        <h1 className="text-sm font-black tracking-[0.3em] text-white">RAMBU</h1>
        <h1 className="text-sm font-black tracking-[0.3em] text-brand-gold">RENTALS</h1>
        <p className="text-[6px] font-bold text-gray-400 tracking-[0.4em] mt-1 whitespace-nowrap">YOUR KEY TO EAST AFRICAN LIVING</p>
      </div>
    </div>
  );
};
