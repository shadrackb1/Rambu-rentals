
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
      className="bg-[#151515] rounded-3xl overflow-hidden shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 flex flex-col group h-full border border-white/5 cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg backdrop-blur-md tracking-widest ${
            property.isAvailable 
              ? 'bg-brand-gold text-brand-black' 
              : 'bg-white/20 text-white'
          }`}>
            {property.isAvailable ? 'AVAILABLE' : 'TAKEN'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest font-bold text-white border border-white/10">
            {property.type}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2">
          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {property.location}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-brand-gold transition-colors font-serif">{property.title}</h3>
        
        <div className="flex items-center gap-4 mb-6 text-xs text-gray-400 font-bold">
          <div className="flex items-center">
            {property.bedrooms} Beds
          </div>
          <div className="w-1 h-1 bg-white/10 rounded-full"></div>
          <div>Prime Spot</div>
        </div>

        <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-0.5">Monthly Rent</p>
            <span className="text-2xl font-black text-brand-gold">{formatPrice(property.price)}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-black transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
