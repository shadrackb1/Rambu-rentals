
import React, { useState, useEffect, useMemo } from 'react';
import { PROPERTIES } from './data';
import { Filters, Location, PriceRange, BedCount, Property } from './types';
import PropertyCard from './components/PropertyCard';
import { ListingSkeleton } from './components/Skeleton';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<Filters>({
    location: 'All',
    priceRange: 'All',
    beds: 'All',
    availableOnly: false
  });

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

  const handleInquiry = (p: Property) => {
    const text = encodeURIComponent(`Hi Rambu Rentals, I'm interested in the "${p.title}" in ${p.location} (KES ${p.price.toLocaleString()}). Is it still available?`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:+${WHATSAPP_NUMBER}`, '_self');
  };

  // --- RENDERING DETAIL VIEW ---
  if (selectedProperty) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col animate-in fade-in duration-500">
        <header className="p-6 sm:p-8 flex items-center justify-between border-b border-white/5">
          <button 
            onClick={() => setSelectedProperty(null)}
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-black transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Logo className="h-10 scale-75" />
          <div className="w-12"></div> {/* Spacer */}
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 space-y-8 pb-32">
          <div className="rounded-3xl overflow-hidden shadow-2xl h-[40vh] sm:h-[60vh] border border-white/5">
            <img src={selectedProperty.imageUrl} className="w-full h-full object-cover" alt={selectedProperty.title} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-5xl font-serif font-black text-white">{selectedProperty.title}</h1>
                  <p className="text-brand-gold font-black uppercase tracking-[0.2em] mt-2">{selectedProperty.location}, Nairobi</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Monthly Rent</p>
                  <p className="text-3xl font-black text-brand-gold">KES {selectedProperty.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-6 border-y border-white/5 py-6 overflow-x-auto scrollbar-hide">
                 <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl whitespace-nowrap">
                   <span className="text-brand-gold font-black">{selectedProperty.bedrooms}</span>
                   <span className="text-xs font-bold text-gray-400">Bedrooms</span>
                 </div>
                 <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl whitespace-nowrap">
                   <span className="text-brand-gold font-black">Verified</span>
                   <span className="text-xs font-bold text-gray-400">Listing</span>
                 </div>
                 <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl whitespace-nowrap">
                   <span className="text-brand-gold font-black">Prime</span>
                   <span className="text-xs font-bold text-gray-400">Location</span>
                 </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Property Description</h3>
                <p className="text-gray-400 leading-relaxed font-medium">
                  {selectedProperty.description}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Top Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedProperty.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-300 font-bold text-sm">
                      <svg className="w-5 h-5 text-brand-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 space-y-6 lg:sticky lg:top-32">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full gold-bg-gradient flex items-center justify-center text-black font-black text-xl">R</div>
                    <div>
                      <p className="text-sm font-black text-white">Rambu Rentals</p>
                      <p className="text-xs font-bold text-emerald-500">Agent Active</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => handleInquiry(selectedProperty)}
                  className="w-full py-5 gold-bg-gradient text-brand-black font-black uppercase tracking-widest rounded-2xl transition-transform active:scale-95 shadow-lg shadow-brand-gold/20"
                 >
                   Inquire via WhatsApp
                 </button>
                 <button 
                  onClick={handleCall}
                  className="w-full py-5 bg-white text-brand-black font-black uppercase tracking-widest rounded-2xl transition-transform active:scale-95 shadow-lg shadow-white/5"
                 >
                   Call Agent
                 </button>
                 <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest pt-2">Ref: RR-0{selectedProperty.id}</p>
              </div>
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-4 lg:hidden bg-brand-black/80 backdrop-blur-md border-t border-white/5">
           <button 
             onClick={() => handleInquiry(selectedProperty)}
             className="w-full py-5 gold-bg-gradient text-brand-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-3"
           >
             Book a Viewing
           </button>
        </div>
      </div>
    );
  }

  // --- RENDERING LISTING VIEW ---
  return (
    <div className="min-h-screen flex flex-col">
      {/* Premium Hero Section */}
      <header className="bg-brand-black py-16 px-6 sm:px-12 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px] -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <Logo className="mb-12" />
          
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black text-white leading-tight mb-8">
            Nairobi's Most <br/>
            <span className="gold-gradient">Elite Residencies.</span>
          </h2>
          <p className="text-gray-400 font-bold text-lg sm:text-xl max-w-2xl leading-relaxed mb-12">
            Over 3,300 verified listings across Kitisuru, Lavington, and beyond. 
            Luxury living, curated just for you.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
             <div className="text-center">
               <p className="text-3xl font-black text-white">3.3k+</p>
               <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Listings</p>
             </div>
             <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
             <div className="text-center">
               <p className="text-3xl font-black text-white">12k+</p>
               <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Followers</p>
             </div>
             <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
             <div className="text-center">
               <p className="text-3xl font-black text-white">100%</p>
               <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Verified</p>
             </div>
          </div>
        </div>
      </header>

      {/* Sticky Filter Controls */}
      <div className="sticky top-0 z-40 bg-brand-black/95 backdrop-blur-xl border-y border-white/5 px-4 py-6 shadow-2xl overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-nowrap lg:grid lg:grid-cols-4 gap-4 min-w-[700px] lg:min-w-0">
            {/* Location */}
            <select 
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="flex-1 px-6 py-4 bg-[#1a1a1a] border border-white/5 focus:border-brand-gold/50 rounded-2xl font-black text-xs uppercase tracking-widest text-white outline-none"
            >
              <option value="All">All Locations</option>
              <option value="Lavington">Lavington</option>
              <option value="Kitisuru">Kitisuru</option>
              <option value="Muthiga">Muthiga</option>
              <option value="Waiyaki Way">Waiyaki Way</option>
            </select>

            {/* Price */}
            <select 
              value={filters.priceRange}
              onChange={(e) => updateFilter('priceRange', e.target.value)}
              className="flex-1 px-6 py-4 bg-[#1a1a1a] border border-white/5 focus:border-brand-gold/50 rounded-2xl font-black text-xs uppercase tracking-widest text-white outline-none"
            >
              <option value="All">Any Budget</option>
              <option value="Under 50k">Under 50k</option>
              <option value="50k - 150k">50k - 150k</option>
              <option value="Above 150k">150k+</option>
            </select>

            {/* Beds */}
            <select 
              value={filters.beds}
              onChange={(e) => updateFilter('beds', e.target.value)}
              className="flex-1 px-6 py-4 bg-[#1a1a1a] border border-white/5 focus:border-brand-gold/50 rounded-2xl font-black text-xs uppercase tracking-widest text-white outline-none"
            >
              <option value="All">Any Bed Count</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4+">4+ Bedrooms</option>
            </select>

            {/* Availability */}
            <button 
              onClick={() => updateFilter('availableOnly', !filters.availableOnly)}
              className={`flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                filters.availableOnly 
                ? 'bg-brand-gold border-brand-gold text-brand-black shadow-lg shadow-brand-gold/20' 
                : 'bg-[#1a1a1a] border-white/5 text-gray-500 hover:text-white'
              }`}
            >
              Available Units Only
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Results */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-12 flex-1 pt-12 pb-24">
        {loading ? (
          <ListingSkeleton />
        ) : (
          <>
            <div className="flex items-center gap-8 mb-12">
               <h3 className="text-xs font-black text-brand-gold uppercase tracking-[0.4em] whitespace-nowrap">
                 {filteredProperties.length} Premium Properties Found
               </h3>
               <div className="h-px bg-white/10 flex-1"></div>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                {filteredProperties.map((property, idx) => (
                  <div 
                    key={property.id} 
                    className="animate-in fade-in slide-in-from-bottom-12 duration-700"
                    style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                  >
                    <PropertyCard property={property} onClick={setSelectedProperty} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                  <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="text-3xl font-serif font-black text-white mb-4">Refining the Search...</h4>
                <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed">
                  We currently have no available units matching these specific filters. Try expanding your luxury criteria.
                </p>
                <button 
                  onClick={() => setFilters({ location: 'All', priceRange: 'All', beds: 'All', availableOnly: false })}
                  className="mt-12 gold-bg-gradient text-brand-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-gold/10 active:scale-95 transition-all"
                >
                  Reset Catalog
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Luxury Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-24 px-6 sm:px-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px] opacity-20"></div>
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <Logo className="mb-16" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full text-center">
             <div className="space-y-4">
               <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">Nairobi Office</p>
               <p className="text-white font-bold text-sm leading-loose">
                 Westlands, Kenya<br/>
                 East African Living Specialists
               </p>
             </div>
             <div className="space-y-4">
               <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">Direct Inquiries</p>
               <p className="text-white font-bold text-sm leading-loose">
                 +254 724 668 338<br/>
                 @ramburentals
               </p>
             </div>
             <div className="space-y-4">
               <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">Follow Us</p>
               <div className="flex justify-center gap-6">
                 <a href="#" className="text-gray-500 hover:text-brand-gold transition-colors font-bold uppercase tracking-widest text-xs">Instagram</a>
                 <a href="#" className="text-gray-500 hover:text-brand-gold transition-colors font-bold uppercase tracking-widest text-xs">Twitter</a>
               </div>
             </div>
          </div>

          <div className="mt-24 pt-12 border-t border-white/5 w-full flex flex-col sm:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">© 2024 RAMBU RENTALS LIMITED. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-10 text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
