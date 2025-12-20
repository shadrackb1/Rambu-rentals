
import React, { useState, useEffect, useMemo } from 'react';
import { PROPERTIES as INITIAL_PROPERTIES } from './data';
import { Filters, Location, PriceRange, BedCount, Property } from './types';
import PropertyCard from './components/PropertyCard';
import { ListingSkeleton } from './components/Skeleton';
import { Logo } from './components/Logo';
import ListingUpload from './components/ListingUpload';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Site-wide editable content
  const [siteContent, setSiteContent] = useState({
    heroTitle: "Nairobi's Most Respected Addresses.",
    heroSubtitle: "Curated luxury properties in Kitisuru, Lavington, and Westlands. Measured by excellence, defined by service.",
    whatsappNumber: "254724668338",
    instagramUrl: "https://www.instagram.com/ramburentals"
  });

  const [filters, setFilters] = useState<Filters>({
    location: 'All',
    priceRange: 'All',
    beds: 'All',
    availableOnly: false
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
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
  }, [filters, properties]);

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleInquiry = (p: Property) => {
    const text = encodeURIComponent(`Hi Rambu Rentals, I'm interested in the "${p.title}" in ${p.location} (KES ${p.price.toLocaleString()}). Is it still available?`);
    window.open(`https://wa.me/${siteContent.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleNewListing = (newProperty: Property) => {
    setProperties(prev => [newProperty, ...prev]);
  };

  const handleUpdateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleShare = async (p: Property) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rambu Rentals | ${p.title}`,
          text: `Check out this ${p.bedrooms} bedroom ${p.type} in ${p.location} via Rambu Rentals.`,
          url: window.location.href,
        });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  const handleAdminLogin = () => {
    const password = prompt("Enter Administration Credentials:");
    if (password === "12345") {
      setIsAdminAuthenticated(true);
      setShowAdmin(true);
    } else if (password !== null) {
      alert("Unauthorized Access Attempt Blocked.");
    }
  };

  if (showAdmin && isAdminAuthenticated) {
    return (
      <AdminPanel 
        properties={properties} 
        siteContent={siteContent}
        onUpdateContent={setSiteContent}
        onUpdateProperty={handleUpdateProperty}
        onDeleteProperty={handleDeleteProperty}
        onAddProperty={handleNewListing}
        onClose={() => setShowAdmin(false)} 
      />
    );
  }

  if (selectedProperty) {
    return (
      <div className="min-h-screen bg-brand-void text-white selection:bg-brand-gold/30">
        <header className="sticky top-0 z-[100] bg-brand-void/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <button 
              onClick={() => setSelectedProperty(null)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-gold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              Return
            </button>
            <div className="scale-75 cursor-pointer" onClick={() => setSelectedProperty(null)}>
              <Logo />
            </div>
            <button 
              onClick={() => handleShare(selectedProperty)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12 animate-reveal">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <section className="rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl relative bg-black/40">
                {selectedProperty.imageUrl.includes('video') ? (
                  <video 
                    src={selectedProperty.imageUrl} 
                    controls 
                    className="w-full h-full object-cover"
                    poster={selectedProperty.imageUrl.replace('.mp4', '.jpg')}
                  />
                ) : (
                  <img src={selectedProperty.imageUrl} className="w-full h-full object-cover" alt={selectedProperty.title} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-void/80 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-10 left-10 pointer-events-none">
                   <h1 className="text-4xl sm:text-6xl font-serif font-black mb-4 leading-tight">{selectedProperty.title}</h1>
                   <div className="flex gap-4">
                     <span className="bg-brand-gold text-brand-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Premium Portfolio</span>
                     <span className="glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">Verified Agency</span>
                   </div>
                </div>
              </section>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Bedrooms', value: selectedProperty.bedrooms, icon: '🏠' },
                  { label: 'Property Type', value: selectedProperty.type, icon: '🏛️' },
                  { label: 'Location', value: selectedProperty.location, icon: '📍' },
                  { label: 'Agency Ref', value: `RR-${selectedProperty.id}`, icon: '🏷️' }
                ].map((item, i) => (
                  <div key={i} className="p-6 glass rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{item.label}</p>
                    <p className="text-lg font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-white">Executive Summary</h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                  {selectedProperty.description || 'Professional property listing curated by Rambu Rentals.'}
                </p>
              </div>

              <div className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-white">Distinguished Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(selectedProperty.amenities || ['24/7 Security']).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 glass rounded-2xl group hover:border-brand-gold/30 transition-all">
                      <div className="w-2 h-2 rounded-full bg-brand-gold group-hover:scale-150 transition-transform"></div>
                      <span className="text-sm font-bold text-gray-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-32 glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Investment</p>
                  <p className="text-4xl font-black text-brand-gold">{selectedProperty.price.toLocaleString()} <span className="text-xs uppercase text-gray-500">KES / Mo</span></p>
                </div>

                <div className="h-px bg-white/5"></div>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleInquiry(selectedProperty)}
                    className="w-full py-5 gold-bg-gradient text-brand-black font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-brand-gold/10 flex items-center justify-center gap-3"
                  >
                    Connect with Agent
                  </button>
                  <button 
                    onClick={() => window.open(`tel:+${siteContent.whatsappNumber}`, '_self')}
                    className="w-full py-5 glass border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 active:scale-[0.98] transition-all"
                  >
                    Direct Call
                  </button>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full gold-bg-gradient flex items-center justify-center text-brand-black font-black">R</div>
                  <div>
                    <p className="text-sm font-bold text-white">Rambu Concierge</p>
                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Active Now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-void text-white">
      {showUpload && <ListingUpload onClose={() => setShowUpload(false)} onSuccess={handleNewListing} />}
      
      {/* Dynamic Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-brand-void/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo className="scale-75 sm:scale-90" />
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-brand-gold transition-colors">Portfolio</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-brand-gold transition-colors">Locations</a>
            <button 
              onClick={() => setShowUpload(true)}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold hover:text-white transition-colors"
            >
              List Property
            </button>
          </div>
          <a 
            href={`https://wa.me/${siteContent.whatsappNumber}`} 
            target="_blank"
            className="hidden sm:block px-6 py-3 border border-brand-gold/50 text-brand-gold text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-gold hover:text-brand-black transition-all"
          >
            Agent Chat
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[150px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div className="max-w-3xl space-y-8">
                <div className="flex items-center gap-4 animate-reveal">
                  <span className="w-12 h-px bg-brand-gold"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Exquisite Living Redefined</span>
                </div>
                <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif font-black leading-[0.9] tracking-tighter animate-reveal" style={{ animationDelay: '0.1s' }}>
                  {siteContent.heroTitle.split('.').map((part, i) => part ? <span key={i}>{part}{i === 0 ? <br/> : ''}</span> : null)}
                  <span className="gold-gradient italic"> Addresses.</span>
                </h1>
                <p className="text-lg sm:text-2xl text-gray-500 font-medium max-w-xl leading-relaxed animate-reveal" style={{ animationDelay: '0.2s' }}>
                  {siteContent.heroSubtitle}
                </p>
              </div>
              <div className="flex gap-10 lg:pb-10 animate-reveal" style={{ animationDelay: '0.3s' }}>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{properties.length}</p>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">Managed Properties</p>
                </div>
                <div className="w-px h-10 bg-white/5"></div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">12k+</p>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">Private Clients</p>
                </div>
              </div>
           </div>
        </div>
      </header>

      {/* Minimalist Filter System */}
      <section className="sticky top-20 z-50 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-2 rounded-[2rem] flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-2xl">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select 
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="bg-transparent px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none border-none hover:bg-white/5 rounded-2xl transition-all cursor-pointer"
              >
                <option value="All" className="bg-brand-black">All Locations</option>
                <option value="Lavington" className="bg-brand-black">Lavington</option>
                <option value="Kitisuru" className="bg-brand-black">Kitisuru</option>
                <option value="Muthiga" className="bg-brand-black">Muthiga</option>
                <option value="Waiyaki Way" className="bg-brand-black">Waiyaki Way</option>
              </select>

              <select 
                value={filters.priceRange}
                onChange={(e) => updateFilter('priceRange', e.target.value)}
                className="bg-transparent px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none border-none hover:bg-white/5 rounded-2xl transition-all cursor-pointer border-l border-white/5"
              >
                <option value="All" className="bg-brand-black">Investment Range</option>
                <option value="Under 50k" className="bg-brand-black">Under 50k</option>
                <option value="50k - 150k" className="bg-brand-black">50k - 150k</option>
                <option value="Above 150k" className="bg-brand-black">150k+</option>
              </select>

              <select 
                value={filters.beds}
                onChange={(e) => updateFilter('beds', e.target.value)}
                className="bg-transparent px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none border-none hover:bg-white/5 rounded-2xl transition-all cursor-pointer border-l border-white/5"
              >
                <option value="All" className="bg-brand-black">Any Bed Count</option>
                <option value="1" className="bg-brand-black">1 Bedroom</option>
                <option value="2" className="bg-brand-black">2 Bedrooms</option>
                <option value="3" className="bg-brand-black">3 Bedrooms</option>
                <option value="4+" className="bg-brand-black">4+ Bedrooms</option>
              </select>
            </div>

            <button 
              onClick={() => updateFilter('availableOnly', !filters.availableOnly)}
              className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filters.availableOnly 
                ? 'gold-bg-gradient text-brand-black shadow-lg shadow-brand-gold/20' 
                : 'bg-white/5 text-gray-500 hover:text-white'
              }`}
            >
              Available Only
            </button>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20 min-h-[60vh]">
        {loading ? (
          <ListingSkeleton />
        ) : (
          <div className="space-y-16">
            <div className="flex items-center justify-between">
               <h2 className="text-3xl font-serif font-bold text-white">Current Portfolio</h2>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">{filteredProperties.length} Matches Found</p>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {filteredProperties.map((p, idx) => (
                  <div key={p.id} className="animate-reveal" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <PropertyCard property={p} onClick={setSelectedProperty} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-40 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-8 text-gray-700">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" /></svg>
                </div>
                <h3 className="text-3xl font-serif font-black mb-4">No Residences Matching Your Selection</h3>
                <p className="text-gray-500 max-w-sm font-medium mb-10">We suggest broadening your search criteria or contacting our concierge for private listings.</p>
                <button 
                  onClick={() => setFilters({ location: 'All', priceRange: 'All', beds: 'All', availableOnly: false })}
                  className="px-10 py-5 gold-bg-gradient text-brand-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-brand-gold/20"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Minimal Business Footer */}
      <footer className="bg-brand-void pt-32 pb-16 px-6 border-t border-white/5 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-20 mb-32">
            <div className="space-y-8 max-w-xs">
              <Logo className="scale-110 origin-left" />
              <p className="text-gray-600 text-sm font-medium leading-loose pt-6">
                Providing exceptional real estate management and acquisition services across East Africa's most prestigious locales.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 flex-1">
              <div>
                <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-6">Concierge</p>
                <ul className="space-y-4 text-sm font-bold text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
                  <li><button onClick={() => setShowUpload(true)} className="hover:text-white transition-colors">List Your Property</button></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-6">Connect</p>
                <ul className="space-y-4 text-sm font-bold text-gray-400">
                  <li><a href={siteContent.instagramUrl} className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href={`tel:+${siteContent.whatsappNumber}`} className="hover:text-white transition-colors">Direct Inquiry</a></li>
                  <li><button onClick={handleAdminLogin} className="hover:text-brand-gold transition-colors text-gray-700">Admin Console</button></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">
            <p>© 2024 RAMBU RENTALS LIMITED</p>
            <p>Your Key to East African Living</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
