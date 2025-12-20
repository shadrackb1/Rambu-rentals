
import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: (p: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      onClick={() => onClick(property)}
      className="group flex flex-col h-full cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-8 shadow-2xl bg-white/5 transition-all duration-700 group-hover:shadow-brand-gold/10">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-all duration-700"></div>
        
        <div className="absolute top-6 right-6">
          <span className={`px-4 py-2 text-[9px] font-black tracking-[0.2em] uppercase rounded-xl backdrop-blur-xl border transition-all duration-500 ${
            property.isAvailable 
              ? 'bg-brand-gold/90 text-brand-black border-brand-gold shadow-lg shadow-brand-gold/20' 
              : 'bg-white/5 text-gray-400 border-white/10'
          }`}>
            {property.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
           <button className="w-full py-4 gold-bg-gradient text-brand-black text-[9px] font-black uppercase tracking-widest rounded-xl shadow-xl">
             View Exclusive Details
           </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-2">
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[10px] font-black tracking-[0.4em] text-brand-gold uppercase">
            {property.location}
          </p>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>
        
        <h3 className="text-2xl font-serif font-black text-white mb-3 line-clamp-1 group-hover:text-brand-gold transition-colors duration-500">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">
          <span>{property.bedrooms} Bed</span>
          <span className="w-1 h-1 bg-brand-gold/30 rounded-full"></span>
          <span>{property.type}</span>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-black mb-1.5">Monthly Investment</span>
            <span className="text-2xl font-black text-white tabular-nums tracking-tight">{formatPrice(property.price)}</span>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-brand-black transition-all duration-500 transform group-hover:rotate-45">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
