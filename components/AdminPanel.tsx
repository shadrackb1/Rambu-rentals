
import React, { useState } from 'react';
import { Property } from '../types';
import { Logo } from './Logo';
import ListingUpload from './ListingUpload';

interface AdminPanelProps {
  properties: Property[];
  siteContent: any;
  onUpdateContent: (content: any) => void;
  onUpdateProperty: (p: Property) => void;
  onDeleteProperty: (id: string) => void;
  onAddProperty: (p: Property) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  properties, 
  siteContent,
  onUpdateContent,
  onUpdateProperty, 
  onDeleteProperty, 
  onAddProperty,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'site'>('listings');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="fixed inset-0 z-[300] bg-brand-void overflow-y-auto">
      {/* Admin Sidebar/Header */}
      <header className="sticky top-0 z-[100] bg-brand-void border-b border-white/5 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Logo className="scale-75" />
          <nav className="hidden lg:flex gap-8">
            <button 
              onClick={() => setActiveTab('listings')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${activeTab === 'listings' ? 'text-brand-gold' : 'text-gray-600 hover:text-white'}`}
            >
              Portfolio Asset Management
            </button>
            <button 
              onClick={() => setActiveTab('site')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${activeTab === 'site' ? 'text-brand-gold' : 'text-gray-600 hover:text-white'}`}
            >
              Site Terminal Config
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Secure Session: Root</span>
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-all"
          >
            Terminal Exit
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 animate-reveal">
        {activeTab === 'listings' ? (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif font-black text-white">Asset Inventory</h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Manage all live residencies</p>
              </div>
              <button 
                onClick={() => setIsAdding(true)}
                className="px-8 py-4 gold-bg-gradient text-brand-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-gold/10"
              >
                Inject New Asset
              </button>
            </div>

            <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Asset</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Location</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Investment</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black">
                             <img src={p.imageUrl} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{p.title}</p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{p.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-400">{p.location}</td>
                      <td className="px-8 py-6 text-sm font-black text-brand-gold">KES {p.price.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${p.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {p.isAvailable ? 'Online' : 'Sold/Leased'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => setEditingProperty(p)}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2" /></svg>
                          </button>
                          <button 
                            onClick={() => { if(confirm("Terminate asset record?")) onDeleteProperty(p.id) }}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" /></svg>
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
          <div className="max-w-3xl space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-black text-white">Global Interface Config</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Adjust public-facing messaging</p>
            </div>

            <div className="glass p-10 rounded-[2.5rem] border border-white/10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">Hero Title (Main)</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-gold/50"
                  value={siteContent.heroTitle}
                  onChange={e => onUpdateContent({...siteContent, heroTitle: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">Hero Sub-Text</label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-gold/50"
                  value={siteContent.heroSubtitle}
                  onChange={e => onUpdateContent({...siteContent, heroSubtitle: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">Primary WhatsApp</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-gold/50"
                    value={siteContent.whatsappNumber}
                    onChange={e => onUpdateContent({...siteContent, whatsappNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">Instagram Portal</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-gold/50"
                    value={siteContent.instagramUrl}
                    onChange={e => onUpdateContent({...siteContent, instagramUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upload/Edit Modals */}
      {(editingProperty || isAdding) && (
        <ListingUpload 
          initialData={editingProperty}
          onClose={() => { setEditingProperty(null); setIsAdding(false); }}
          onSuccess={(p) => {
            if (editingProperty) onUpdateProperty(p);
            else onAddProperty(p);
            setEditingProperty(null);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;
