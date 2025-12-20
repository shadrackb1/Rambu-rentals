
import React, { useState, useEffect, useMemo } from 'react';
import { PROPERTIES } from './data';
import { Filters, Location, PriceRange, BedCount } from './types';
import PropertyCard from './components/PropertyCard';
import { ListingSkeleton } from './components/Skeleton';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    location: 'All',
    priceRange: 'All',
    beds: 'All',
    availableOnly: false
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(p => {
      const locationMatch = filters.location === 'All' || p.location === filters.location;
      
      let priceMatch = true;
      if (filters.priceRange === 'Under 50k') priceMatch = p.price < 50000;
      else if (filters.priceRange === '50k - 150k') priceMatch = p.price >= 50000 && p.price <= 150000;
      else if (filters.priceRange === 'Above 150k') priceMatch = p.price > 150000;

      let bedMatch = true;
      if (filters.beds !== 'All') {
        const target = parseInt(filters.beds);
        bedMatch = filters.beds.includes('+') ? p.bedrooms >= target : p.bedrooms === target;
      }

      const availabilityMatch = !filters.availableOnly || p.isAvailable;
      
      return locationMatch && priceMatch && bedMatch && availabilityMatch;
    });
  }, [filters]);

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col pb-12 selection:bg-blue-100">
      {/* Premium Header */}
      <header className="bg-white pt-10 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">
                RAMBU<span className="text-blue-600 italic">RENTALS</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3,300+ Active Listings</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Property Portal</span>
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
              Nairobi's Best <br/>Homes <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">On-Demand.</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Find your next space in Lavington, Muthiga, or Kitisuru without the "Is this available?" DM cycle.
            </p>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-y border-gray-100 px-4 py-4 mb-10 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Location Select */}
            <div className="relative">
              <select 
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-gray-800 appearance-none transition-all outline-none text-sm"
              >
                <option value="All">All Locations</option>
                <option value="Lavington">Lavington</option>
                <option value="Kitisuru">Kitisuru</option>
                <option value="Muthiga">Muthiga</option>
                <option value="Waiyaki Way">Waiyaki Way</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Price Range Select */}
            <div className="relative">
              <select 
                value={filters.priceRange}
                onChange={(e) => updateFilter('priceRange', e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-gray-800 appearance-none transition-all outline-none text-sm"
              >
                <option value="All">Any Budget</option>
                <option value="Under 50k">Under 50k</option>
                <option value="50k - 150k">50k - 150k</option>
                <option value="Above 150k">150k+</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Bedrooms Select */}
            <div className="relative">
              <select 
                value={filters.beds}
                onChange={(e) => updateFilter('beds', e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-gray-800 appearance-none transition-all outline-none text-sm"
              >
                <option value="All">Any Size</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4+">4+ Bedrooms</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Available Toggle */}
            <button 
              onClick={() => updateFilter('availableOnly', !filters.availableOnly)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all border-2 ${
                filters.availableOnly 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'bg-white border-gray-100 text-gray-400'
              }`}
            >
              <span>Available Only</span>
              <div className={`w-2 h-2 rounded-full ${filters.availableOnly ? 'bg-white' : 'bg-gray-200'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <main className="max-w-6xl mx-auto w-full px-4 flex-1">
        {loading ? (
          <ListingSkeleton />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
                {filteredProperties.length} Matches Found
              </h3>
              <div className="h-px bg-gray-100 flex-1 ml-6"></div>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProperties.map((property, idx) => (
                  <div 
                    key={property.id} 
                    className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-2">No units found</h4>
                <p className="text-gray-400 font-medium max-w-sm">
                  We have thousands of properties, but none match those specific filters. Try expanding your search!
                </p>
                <button 
                  onClick={() => setFilters({ location: 'All', priceRange: 'All', beds: 'All', availableOnly: false })}
                  className="mt-8 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="mt-24 px-6 py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h5 className="text-xl font-black tracking-tighter text-gray-900 mb-2">
              RAMBU<span className="text-blue-600">RENTALS</span>
            </h5>
            <p className="text-sm font-bold text-gray-400 tracking-wide">THE FUTURE OF KENYAN REAL ESTATE</p>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Office</p>
              <p className="text-sm font-bold text-gray-900">Nairobi, KE</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Inquiries</p>
              <p className="text-sm font-bold text-gray-900">@rambu_rentals</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
