
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
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-5">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-md backdrop-blur-md border ${
            property.isAvailable 
              ? 'bg-brand-gold/90 text-brand-black border-brand-gold' 
              : 'bg-white/10 text-white border-white/20'
          }`}>
            {property.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-1">
        <p className="text-[10px] font-black tracking-[0.3em] text-brand-gold uppercase mb-2">
          {property.location}
        </p>
        <h3 className="text-xl font-serif font-bold text-white mb-2 line-clamp-1 group-hover:text-brand-gold-light transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-4">
          <span>{property.bedrooms} Bedrooms</span>
          <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span>{property.type}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-0.5">Rent Per Month</span>
            <span className="text-xl font-bold text-white">{formatPrice(property.price)}</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-brand-black transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
