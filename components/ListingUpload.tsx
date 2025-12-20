
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CLOUDINARY_CLOUD_NAME = "ds2mbrzcn";
const CLOUDINARY_UPLOAD_PRESET = "real_unsigned";

interface ListingUploadProps {
  onClose: () => void;
  onSuccess: (newProperty: any) => void;
  initialData?: any;
}

const ListingUpload: React.FC<ListingUploadProps> = ({ onClose, onSuccess, initialData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState(initialData || {
    title: '',
    location: 'Lavington',
    price: '',
    bedrooms: '1',
    type: 'Apartment',
    description: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const optimizeUrl = (url: string) => {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !initialData?.imageUrl) return alert("Please select media for the listing.");

    setUploading(true);
    setProgress(5);

    try {
      let finalUrl = initialData?.imageUrl || '';

      if (file) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const xhr = new XMLHttpRequest();
        // Determine if it's a video or image based on file type
        const resourceType = file.type.startsWith('video') ? 'video' : 'image';
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, true);

        const uploadPromise = new Promise<string>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percentComplete = Math.round((e.loaded / e.total) * 85);
              setProgress(percentComplete);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(optimizeUrl(response.secure_url));
            } else {
              reject("Cloudinary failure");
            }
          };
          xhr.onerror = () => reject("Network failure");
          xhr.send(cloudinaryFormData);
        });

        finalUrl = await uploadPromise;
      }

      const propertyToSave = {
        title: formData.title,
        location: formData.location,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        imageUrl: finalUrl,
        type: formData.type,
        description: formData.description,
        isAvailable: true,
        amenities: ['Verified Listing', 'Professional Management'],
        updatedAt: new Date().toISOString()
      };

      setProgress(95);
      // For local demo we just call onSuccess, in real world we await addDoc(collection(db, "properties"), propertyToSave);
      const savedProperty = { ...propertyToSave, id: initialData?.id || Date.now().toString() };
      
      setProgress(100);
      setTimeout(() => {
        onSuccess(savedProperty);
        onClose();
      }, 500);

    } catch (error) {
      alert("Media upload failed. Please verify credentials.");
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 bg-brand-void/90 backdrop-blur-2xl">
      <div className="glass w-full max-w-2xl rounded-[2.5rem] border border-white/10 overflow-hidden animate-reveal bg-brand-void/40">
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-serif font-black text-white">{initialData ? 'Edit Residence' : 'List Residence'}</h2>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-gold mt-2">Elite Media Pipeline</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Official Title</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-gold/50 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Precise Location</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-gold/50 transition-all appearance-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>
                  <option value="Lavington">Lavington</option>
                  <option value="Kitisuru">Kitisuru</option>
                  <option value="Muthiga">Muthiga</option>
                  <option value="Waiyaki Way">Waiyaki Way</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Monthly Investment (KES)</label>
                <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-gold/50 transition-all" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Bedroom Count</label>
                <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-brand-gold/50 transition-all" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Cinematic Media (Photo/Video)</label>
              <div className="relative group overflow-hidden rounded-2xl">
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${file ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 bg-white/5 hover:border-brand-gold/30'}`}>
                   <p className="text-xs font-bold text-gray-500">{file ? file.name : "Drop 4K media here"}</p>
                </div>
              </div>
            </div>

            {uploading && (
              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-brand-gold">
                  <span>Vault Transmission</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full gold-bg-gradient transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            <div className="pt-6">
              <button type="submit" disabled={uploading} className="w-full py-5 gold-bg-gradient text-brand-black font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-brand-gold/10 hover:brightness-110 transition-all active:scale-[0.98]">
                {uploading ? "Processing Asset..." : "Authorize Publication"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListingUpload;
