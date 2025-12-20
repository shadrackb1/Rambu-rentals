
import React from 'react';

const PropertySkeleton: React.FC = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[4/5] bg-white/5 rounded-2xl mb-5 border border-white/5"></div>
      <div className="space-y-4 px-1">
        <div className="h-3 bg-white/5 rounded w-1/4"></div>
        <div className="h-8 bg-white/5 rounded w-3/4"></div>
        <div className="flex gap-2">
          <div className="h-3 bg-white/5 rounded w-16"></div>
          <div className="h-3 bg-white/5 rounded w-16"></div>
        </div>
        <div className="pt-4 border-t border-white/5 flex justify-between">
          <div className="h-8 bg-white/5 rounded w-1/3"></div>
          <div className="w-8 h-8 rounded-full bg-white/5"></div>
        </div>
      </div>
    </div>
  );
};

export const ListingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
      {[...Array(6)].map((_, i) => (
        <PropertySkeleton key={i} />
      ))}
    </div>
  );
};
