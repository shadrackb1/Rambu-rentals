
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

  const INSTAGRAM_URL = "https://www.instagram.com/ramburentals?igsh=cTJoMHl3aHIwa2Rn";
  const WHATSAPP_NUMBER = "254724668338";

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
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col selection:bg-blue-100">
      {/* Top Utility Bar */}
      <div className="bg-gray-900 text-white py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +254 724 668 338
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white pt-12 pb-10 px-4 sm:px-8 border-b border-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 leading-none">
                  RAMBU<span className="text-blue-600 italic">RENTALS</span>
                </h1>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3,300+ Live Units</span>
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 leading-[1] mb-6 tracking-tight">
                Nairobi's Homes <br/> <span className="text-blue-600">On-Demand.</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                Browse verified listings across Lavington, Muthiga, and Kitisuru. Your next home is just one click away.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 lg:pb-2">
               <a 
                href={INSTAGRAM_URL} 
                target="_blank" 
                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-3xl transition-all border border-gray-100"
               >
                 <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.013 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.419.419-.818.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.013-4.85-.07c-1.17-.054-1.805-.249-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.419-.679-.818-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.013-3.584.07-4.85c.054-1.17.249-1.805.415-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.149.26-2.911.557-.788.306-1.455.715-2.12 1.38s-1.074 1.332-1.38 2.121c-.297.761-.5 1.634-.557 2.911-.058 1.28-.071 1.688-.071 4.947s.013 3.667.071 4.947c.057 1.277.26 2.148.557 2.911.306.788.715 1.455 1.38 2.12s1.332 1.074 2.121 1.38c.761.297 1.634.5 2.911.557 1.28.058 1.688.071 4.947.071s3.667-.013 4.947-.071c1.277-.057 2.148-.26 2.911-.557.788-.306 1.455-.715 2.12-1.38s1.074-1.332 1.38-2.121c.297-.761.5-1.634.557-2.911.058-1.28.071-1.688.071-4.947s-.013-3.667-.071-4.947c-.057-1.277-.26-2.148-.557-2.911-.306-.788-.715-1.455-1.38-2.12s-1.332-1.074-2.121-1.38c-.761-.297-1.634-.5-2.911-.557-1.28-.058-1.688-.071-4.947-.071z"/></svg>
               </a>
               <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                target="_blank" 
                className="bg-emerald-50 hover:bg-emerald-100 p-4 rounded-3xl transition-all border border-emerald-100 flex items-center gap-3 group"
               >
                 <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">WhatsApp Agent</p>
                  <p className="text-sm font-bold text-emerald-600">Active Now</p>
                </div>
               </a>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Filters */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-y border-gray-100 px-4 py-4 mb-10 shadow-sm overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-nowrap md:grid md:grid-cols-4 gap-3 min-w-[600px] md:min-w-0">
            {/* Location Select */}
            <div className="relative flex-1">
              <select 
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-gray-800 appearance-none transition-all outline-none text-xs"
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
            <div className="relative flex-1">
              <select 
                value={filters.priceRange}
                onChange={(e) => updateFilter('priceRange', e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-gray-800 appearance-none transition-all outline-none text-xs"
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
            <div className="relative flex-1">
              <select 
                value={filters.beds}
                onChange={(e) => updateFilter('beds', e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl font-bold text-gray-800 appearance-none transition-all outline-none text-xs"
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
              className={`flex flex-1 items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-xs transition-all border-2 ${
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

      {/* Results Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 flex-1">
        {loading ? (
          <ListingSkeleton />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                {filteredProperties.length} Properties in View
              </h3>
              <div className="h-px bg-gray-100 flex-1 ml-8"></div>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 xl:gap-10">
                {filteredProperties.map((property, idx) => (
                  <div 
                    key={property.id} 
                    className="animate-in fade-in slide-in-from-bottom-12 duration-700"
                    style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 sm:py-32 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                  <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-4">No Matches Found</h4>
                <p className="text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
                  We update our 3,300+ listings daily. Try resetting your filters to see more available options.
                </p>
                <button 
                  onClick={() => setFilters({ location: 'All', priceRange: 'All', beds: 'All', availableOnly: false })}
                  className="mt-10 bg-gray-900 text-white px-10 py-4 rounded-3xl font-black text-sm hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Comprehensive Footer */}
      <footer className="mt-24 px-6 sm:px-12 py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
            <div className="col-span-1 lg:col-span-2">
              <h5 className="text-2xl font-black tracking-tighter text-gray-900 mb-6">
                RAMBU<span className="text-blue-600">RENTALS</span>
              </h5>
              <p className="text-gray-400 font-bold leading-relaxed max-w-md mb-8">
                Kenya's most tech-forward real estate agency. Providing seamless property search and acquisition experiences for over 12,200 followers.
              </p>
              <div className="flex gap-4">
                <a href={INSTAGRAM_URL} target="_blank" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.013 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.419.419-.818.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.013-4.85-.07c-1.17-.054-1.805-.249-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.419-.679-.818-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.013-3.584.07-4.85c.054-1.17.249-1.805.415-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.149.26-2.911.557-.788.306-1.455.715-2.12 1.38s-1.074 1.332-1.38 2.121c-.297.761-.5 1.634-.557 2.911-.058 1.28-.071 1.688-.071 4.947s.013 3.667.071 4.947c.057 1.277.26 2.148.557 2.911.306.788.715 1.455 1.38 2.12s1.332 1.074 2.121 1.38c.761.297 1.634.5 2.911.557 1.28.058 1.688.071 4.947.071s3.667-.013 4.947-.071c1.277-.057 2.148-.26 2.911-.557.788-.306 1.455-.715 2.12-1.38s1.074-1.332 1.38-2.121c.297-.761.5-1.634.557-2.911.058-1.28.071-1.688.071-4.947s-.013-3.667-.071-4.947c-.057-1.277-.26-2.148-.557-2.911-.306-.788-.715-1.455-1.38-2.12s-1.332-1.074-2.121-1.38c-.761-.297-1.634-.5-2.911-.557-1.28-.058-1.688-.071-4.947-.071z"/></svg>
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Contact Us</p>
              <ul className="space-y-4 font-bold text-gray-900">
                <li>
                  <a href={`tel:+${WHATSAPP_NUMBER}`} className="hover:text-blue-600 transition-colors">+254 724 668 338</a>
                </li>
                <li>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="hover:text-blue-600 transition-colors">WhatsApp Chat</a>
                </li>
                <li>
                  <p className="text-gray-400">Nairobi, Kenya</p>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Quick Links</p>
              <ul className="space-y-4 font-bold text-gray-900">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Latest Listings</a></li>
                <li><a href={INSTAGRAM_URL} className="hover:text-blue-600 transition-colors">Instagram Feed</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Available Units</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">© 2024 RAMBU RENTALS LTD.</p>
            <div className="flex gap-8 text-xs font-black text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
