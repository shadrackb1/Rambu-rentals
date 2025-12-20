
import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi Rambu Rentals, I'm interested in the ${property.title} in ${property.location} (KES ${property.price.toLocaleString()}). Is it still available?`);
    window.open(`https://wa.me/254700000000?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col group h-full">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
            property.isAvailable 
              ? 'bg-emerald-500/90 text-white' 
              : 'bg-rose-500/90 text-white'
          }`}>
            {property.isAvailable ? 'AVAILABLE' : 'TAKEN'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest font-bold text-white border border-white/20">
            {property.type}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {property.location}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">{property.title}</h3>
        
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 font-medium">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {property.bedrooms} Beds
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div>Prime Spot</div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price</p>
            <span className="text-2xl font-black text-gray-900">{formatPrice(property.price)}</span>
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">/ Month</p>
        </div>

        <button 
          className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-100"
          onClick={handleWhatsApp}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Check Availability
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
