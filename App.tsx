
import React, { useState, useEffect, useMemo } from 'react';
import { PROPERTIES as INITIAL_PROPERTIES } from './data';
import { Filters, Property } from './types';
import PropertyCard from './components/PropertyCard';
import { ListingSkeleton } from './components/Skeleton';
import { Logo } from './components/Logo';
import ListingUpload from './components/ListingUpload';
import AdminPanel from './components/AdminPanel';
import { db } from './firebase';
import { collection, onSnapshot, query, doc, setDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
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
    const q = query(collection(db, "properties"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const propsArr: Property[] = [];
      querySnapshot.forEach((doc) => {
        propsArr.push({ id: doc.id, ...doc.data() } as Property);
      });
      setProperties(propsArr.length > 0 ? propsArr : INITIAL_PROPERTIES);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const settingsRef = doc(db, "settings", "site_config");
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSiteContent(docSnap.data() as any);
      }
    });
    return () => unsubscribe();
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
        onClose={() => setShowAdmin(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-void text-white selection:bg-brand-gold/30 scroll-smooth">
      {showUpload && <ListingUpload onClose={() => setShowUpload(false)} onSuccess={() => setShowUpload(false)} />}
      
      {/* Dynamic Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 bg-brand-void/40 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="cursor-pointer transition-transform hover:scale-95" onClick={() => setSelectedProperty(null)}>
            <Logo className="scale-75 sm:scale-90" />
          </div>
          <div className="hidden lg:flex items-center gap-12">
            {['Portfolio', 'Locations', 'Concierge'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-brand-gold transition-all">
                {item}
              </a>
            ))}
            <button 
              onClick={() => setShowUpload(true)}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold hover:text-white transition-all px-4 py-2 rounded-full border border-brand-gold/20 hover:border-brand-gold"
            >
              List Property
            </button>
          </div>
          <a 
            href={`https://wa.me/${siteContent.whatsappNumber}`} 
            target="_blank"
            className="px-8 py-3.5 gold-bg-gradient text-brand-black text-[10px] font-black uppercase tracking-widest rounded-full hover:brightness-110 shadow-lg shadow-brand-gold/10 transition-all active:scale-95"
          >
            Agent Chat
          </a>
        </div>
      </nav>

      {/* Property Detail Overlay */}
      {selectedProperty && (
        <div className="fixed inset-0 z-[150] bg-brand-void/98 backdrop-blur-3xl overflow-y-auto animate-reveal">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-12">
              <button 
                onClick={() => setSelectedProperty(null)}
                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
              >
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-white/10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </div>
                Return to Portfolio
              </button>
              <div className="scale-75"><Logo /></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 space-y-12">
                <section className="rounded-[2.5rem] overflow-hidden aspect-[16/9] shadow-2xl relative bg-black/40 group">
                  {selectedProperty.imageUrl.includes('video') ? (
                    <video src={selectedProperty.imageUrl} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={selectedProperty.imageUrl} className="w-full h-full object-cover" alt={selectedProperty.title} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-void/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-12 left-12 right-12">
                     <p className="text-brand-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4">Exquisite Managed Asset</p>
                     <h1 className="text-5xl sm:text-7xl font-serif font-black leading-tight text-white">{selectedProperty.title}</h1>
                  </div>
                </section>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Bedrooms', value: selectedProperty.bedrooms, desc: 'Ensuite' },
                    { label: 'Asset Type', value: selectedProperty.type, desc: 'Architecture' },
                    { label: 'Locale', value: selectedProperty.location, desc: 'Prime Area' },
                    { label: 'Agency Ref', value: `RR-${selectedProperty.id.slice(-4)}`, desc: 'Secure ID' }
                  ].map((item, i) => (
                    <div key={i} className="p-8 glass rounded-[2rem] border border-white/5 group hover:border-brand-gold/30 transition-all">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">{item.label}</p>
                      <p className="text-xl font-bold text-white mb-1">{item.value}</p>
                      <p className="text-[8px] font-black uppercase text-brand-gold/50">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-12">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-serif font-bold text-white mb-6">Director's Summary</h2>
                    <p className="text-gray-400 text-lg leading-loose font-medium">
                      {selectedProperty.description || 'This premium residency represents the pinnacle of Nairobi living, offering unparalleled security and world-class finishes in a highly sought-after location.'}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-8">Distinguished Amenities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(selectedProperty.amenities || ['24/7 Elite Security', 'Infinity Access']).map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-6 glass rounded-2xl group hover:border-brand-gold/40 transition-all">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold group-hover:scale-[2] transition-all"></div>
                          <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="sticky top-32 glass p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-10">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-4">Monthly Investment</p>
                    <p className="text-5xl font-black text-brand-gold tabular-nums">{selectedProperty.price.toLocaleString()}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mt-2">Kenyan Shillings</p>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        const text = encodeURIComponent(`Hi Rambu Rentals, I'm interested in the "${selectedProperty.title}" (KES ${selectedProperty.price.toLocaleString()}).`);
                        window.open(`https://wa.me/${siteContent.whatsappNumber}?text=${text}`, '_blank');
                      }}
                      className="w-full py-6 gold-bg-gradient text-brand-black font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-brand-gold/20 flex items-center justify-center gap-3"
                    >
                      Connect with Concierge
                    </button>
                    <button 
                      onClick={() => window.open(`tel:+${siteContent.whatsappNumber}`, '_self')}
                      className="w-full py-6 glass border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 active:scale-[0.98] transition-all"
                    >
                      Direct Secure Call
                    </button>
                  </div>

                  <div className="flex items-center gap-5 p-6 bg-white/[0.02] rounded-3xl">
                    <div className="w-12 h-12 rounded-full gold-bg-gradient flex items-center justify-center text-brand-black text-xl font-serif italic font-black shadow-lg">R</div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-widest">Rambu Portfolio Manager</p>
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Status: Online</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <header className="pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-gold/5 rounded-full blur-[180px] -mr-60 -mt-60 animate-float"></div>
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-20">
              <div className="max-w-4xl space-y-10">
                <div className="flex items-center gap-6 animate-fade-in-up">
                  <span className="w-16 h-px bg-brand-gold"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-gold">Rambu Rentals Portfolio</span>
                </div>
                <h1 className="text-6xl sm:text-8xl md:text-[110px] font-serif font-black leading-[0.85] tracking-tighter animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  {siteContent.heroTitle.split('.').map((part, i) => part ? <span key={i} className="block">{part}</span> : null)}
                </h1>
                <p className="text-xl sm:text-3xl text-gray-500 font-medium max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {siteContent.heroSubtitle}
                </p>
              </div>
              <div className="flex gap-12 lg:pb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-center">
                  <p className="text-5xl font-black text-white tabular-nums">{properties.length}</p>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mt-3">Curated Assets</p>
                </div>
                <div className="w-px h-16 bg-white/10"></div>
                <div className="text-center">
                  <p className="text-5xl font-black text-white tabular-nums">14k+</p>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mt-3">Elite Clients</p>
                </div>
              </div>
           </div>
        </div>
      </header>

      {/* Filter Terminal */}
      <section className="sticky top-24 z-50 px-6 pb-12" id="portfolio">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-3 rounded-[2.5rem] flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-2xl shadow-black/50">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select 
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="bg-white/5 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white outline-none border-none hover:bg-white/10 rounded-2xl transition-all cursor-pointer appearance-none"
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
                className="bg-white/5 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white outline-none border-none hover:bg-white/10 rounded-2xl transition-all cursor-pointer appearance-none"
              >
                <option value="All" className="bg-brand-black">Investment Range</option>
                <option value="Under 50k" className="bg-brand-black">Under 50k</option>
                <option value="50k - 150k" className="bg-brand-black">50k - 150k</option>
                <option value="Above 150k" className="bg-brand-black">150k+</option>
              </select>

              <select 
                value={filters.beds}
                onChange={(e) => updateFilter('beds', e.target.value)}
                className="bg-white/5 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white outline-none border-none hover:bg-white/10 rounded-2xl transition-all cursor-pointer appearance-none"
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
              className={`px-10 py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                filters.availableOnly 
                ? 'gold-bg-gradient text-brand-black shadow-lg shadow-brand-gold/20' 
                : 'bg-white/5 text-gray-500 hover:text-white'
              }`}
            >
              Online Now
            </button>
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20 min-h-[70vh]">
        {loading ? (
          <ListingSkeleton />
        ) : (
          <div className="space-y-24">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
               <div>
                 <h2 className="text-4xl font-serif font-black text-white">Featured Residencies</h2>
                 <div className="h-1.5 w-20 gold-bg-gradient mt-4 rounded-full"></div>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">{filteredProperties.length} Verified Listings</p>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {filteredProperties.map((p, idx) => (
                  <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.15}s` }}>
                    <PropertyCard property={p} onClick={setSelectedProperty} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-48 flex flex-col items-center text-center animate-reveal">
                <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center mb-10 text-gray-800">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="1.5" /></svg>
                </div>
                <h3 className="text-4xl font-serif font-black mb-6">No Assets Match Your Search</h3>
                <p className="text-gray-500 max-w-md text-lg mb-12 font-medium">Our portfolio is constantly evolving. Broaden your search or consult our private concierge for off-market access.</p>
                <button 
                  onClick={() => setFilters({ location: 'All', priceRange: 'All', beds: 'All', availableOnly: false })}
                  className="px-12 py-6 gold-bg-gradient text-brand-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl shadow-brand-gold/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  Reset Parameters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-void pt-48 pb-20 px-6 border-t border-white/5 overflow-hidden relative" id="concierge">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-32 mb-40">
            <div className="space-y-12 max-w-md">
              <Logo className="scale-125 origin-left" />
              <p className="text-gray-500 text-lg leading-loose font-medium pt-8">
                Distinguished property management and advisory for Nairobi's elite. We bridge the gap between exclusive inventory and discerning residents.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-24 flex-1">
              <div>
                <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-10">Inventory</p>
                <ul className="space-y-6 text-sm font-bold text-gray-500">
                  {['Lavington', 'Kitisuru', 'Westlands', 'Private Collection'].map(item => (
                    <li key={item}><a href="#" className="hover:text-white transition-all uppercase tracking-widest text-[10px]">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-10">Access</p>
                <ul className="space-y-6 text-sm font-bold text-gray-500">
                  <li><button onClick={() => setShowUpload(true)} className="hover:text-white transition-all uppercase tracking-widest text-[10px]">List With Us</button></li>
                  <li><a href={siteContent.instagramUrl} className="hover:text-white transition-all uppercase tracking-widest text-[10px]">Instagram</a></li>
                  <li><button onClick={handleAdminLogin} className="text-gray-800 hover:text-brand-gold transition-all uppercase tracking-widest text-[10px]">Admin Terminal</button></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-10 pt-20 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">
            <p>© 2024 RAMBU RENTALS LIMITED • ALL RIGHTS RESERVED</p>
            <p className="text-brand-gold/30">Nairobi, Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
