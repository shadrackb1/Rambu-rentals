
import React, { useState } from 'react';
import { Property } from '../types';
import { Logo } from './Logo';
import ListingUpload from './ListingUpload';
import { db } from '../firebase';
import { doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';

interface AdminPanelProps {
  properties: Property[];
  siteContent: any;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  properties, 
  siteContent,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'site'>('listings');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const handleDelete = async (id: string) => {
    if(confirm("Permanently remove this asset from the portfolio? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "properties", id));
      } catch (e) {
        alert("Authorization error. Check terminal logs.");
      }
    }
  };

  const handleUpdateAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "properties", id), {
        isAvailable: !currentStatus
      });
    } catch (e) {
      alert("Status toggle failed.");
    }
  };

  const handleSaveSiteConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await setDoc(doc(db, "settings", "site_config"), siteContent);
      alert("Global site configuration synchronized successfully.");
    } catch (e) {
      alert("Database persistence failed.");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-brand-void overflow-y-auto animate-reveal">
      <header className="sticky top-0 z-[100] bg-brand-void/80 backdrop-blur-3xl border-b border-white/5 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Logo className="scale-75" />
          <nav className="hidden lg:flex gap-10">
            {[
              { id: 'listings', label: 'Portfolio Management' },
              { id: 'site', label: 'Site Terminal Config' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all pb-1 border-b-2 ${
                  activeTab === tab.id ? 'text-brand-gold border-brand-gold' : 'text-gray-600 border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secure Root Session</span>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            Terminal Exit
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-20">
        {activeTab === 'listings' ? (
          <div className="space-y-16">
            <div className="flex items-end justify-between border-b border-white/5 pb-10">
              <div>
                <p className="text-brand-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4">Administration Center</p>
                <h2 className="text-5xl font-serif font-black text-white">Asset Inventory</h2>
              </div>
              <button 
                onClick={() => setIsAdding(true)}
                className="px-10 py-5 gold-bg-gradient text-brand-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-brand-gold/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Inject New Property
              </button>
            </div>

            <div className="glass rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.03]">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Reference</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Asset Title</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Investment</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Status</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.01] transition-all group">
                      <td className="px-10 py-8">
                        <span className="text-[10px] font-mono font-bold text-gray-700">#{p.id.slice(-6)}</span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
                             <img src={p.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div>
                            <p className="text-base font-bold text-white mb-1">{p.title}</p>
                            <p className="text-[10px] text-brand-gold font-black uppercase tracking-widest">{p.location} • {p.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-lg font-black text-white tabular-nums">
                        KES {p.price.toLocaleString()}
                      </td>
                      <td className="px-10 py-8">
                        <button 
                          onClick={() => handleUpdateAvailability(p.id, p.isAvailable)}
                          className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all border ${
                            p.isAvailable 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}
                        >
                          {p.isAvailable ? 'Online' : 'Sold/Leased'}
                        </button>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <button 
                            onClick={() => setEditingProperty(p)}
                            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-brand-gold hover:bg-brand-gold/10 transition-all active:scale-90"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2" /></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl space-y-20">
            <div>
              <p className="text-brand-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4">Site Global Config</p>
              <h2 className="text-5xl font-serif font-black text-white">Platform Interface</h2>
            </div>

            <form onSubmit={handleSaveSiteConfig} className="glass p-16 rounded-[4rem] border border-white/10 space-y-12 shadow-2xl">
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Primary Hero Headline</label>
                <input 
                  type="text" 
                  className="admin-input w-full"
                  defaultValue={siteContent.heroTitle}
                  onChange={e => siteContent.heroTitle = e.target.value}
                />
              </div>
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Portfolio Overview Sub-Text</label>
                <textarea 
                  rows={4}
                  className="admin-input w-full leading-loose"
                  defaultValue={siteContent.heroSubtitle}
                  onChange={e => siteContent.heroSubtitle = e.target.value}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Concierge WhatsApp</label>
                  <input 
                    type="text" 
                    className="admin-input w-full"
                    defaultValue={siteContent.whatsappNumber}
                    onChange={e => siteContent.whatsappNumber = e.target.value}
                  />
                </div>
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Instagram Portfolio URL</label>
                  <input 
                    type="text" 
                    className="admin-input w-full"
                    defaultValue={siteContent.instagramUrl}
                    onChange={e => siteContent.instagramUrl = e.target.value}
                  />
                </div>
              </div>
              <div className="pt-10">
                <button 
                  disabled={savingSettings}
                  type="submit"
                  className="w-full py-7 gold-bg-gradient text-brand-black font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl shadow-brand-gold/20 hover:brightness-110 active:scale-98 transition-all"
                >
                  {savingSettings ? "Synchronizing Data..." : "Apply Global Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {(editingProperty || isAdding) && (
        <ListingUpload 
          initialData={editingProperty}
          onClose={() => { setEditingProperty(null); setIsAdding(false); }}
          onSuccess={() => {
            setEditingProperty(null);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;
