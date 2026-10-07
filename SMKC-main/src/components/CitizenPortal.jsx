import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Camera, 
  MapPin, 
  Phone, 
  User, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Search, 
  Upload,
  Sparkles
} from 'lucide-react';

export default function CitizenPortal({ complaints, onAddComplaint, t, lang }) {
  const [formData, setFormData] = useState({
    citizenName: '',
    citizenPhone: '',
    city: 'Sangli',
    ward: 'Prabhag 03 - Vishrambag',
    location: '',
    description: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [submittedToken, setSubmittedToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.citizenName || !formData.citizenPhone || !formData.location) {
      alert('Please fill all mandatory fields: Name, Phone, and Exact Location');
      return;
    }

    setIsSubmitting(true);
    const newComplaint = {
      ...formData,
      imageUrl: previewImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    };

    const res = await onAddComplaint(newComplaint);
    setIsSubmitting(false);

    if (res && res.id) {
      setSubmittedToken(res.id);
      setFormData({
        citizenName: '',
        citizenPhone: '',
        city: 'Sangli',
        ward: 'Prabhag 03 - Vishrambag',
        location: '',
        description: '',
      });
      setPreviewImage(null);
    }
  };

  const filteredComplaints = complaints.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
          <span>SMKC Jan-Samwad Civic Vigilance Cell</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {t.citizenTitle || 'Citizen Complaint Portal'}
        </h1>
        <p className="text-slate-500 text-sm max-w-3xl">
          {t.citizenSubtitle || 'Report unauthorized banners, hoardings, and encroachments to the municipal corporation.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Reporting Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Report Unauthorized Banner / Flex</span>
            </h2>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Bombay HC PIL 155/2011 Action
            </span>
          </div>

          {submittedToken && (
            <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm space-y-2 animate-fadeIn shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{t.citizenSuccessMsg || 'Complaint registered successfully!'}</span>
                <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded text-emerald-900 border border-emerald-300">
                  {submittedToken}
                </span>
              </div>
              <p className="text-xs text-emerald-700">
                An automated SMS alert has been dispatched to the Ward Junior Engineer. The demolition squad will inspect the spot within 24 hours.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  {t.citizenFormName || 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.citizenName}
                    onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  {t.citizenFormPhone || 'Phone Number'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.citizenPhone}
                    onChange={(e) => setFormData({ ...formData, citizenPhone: e.target.value })}
                    placeholder="+91 98220 12345"
                    className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  {t.citizenFormCity || 'City'}
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                >
                  <option value="Sangli">सांगली (Sangli)</option>
                  <option value="Miraj">मिरज (Miraj)</option>
                  <option value="Kupwad">कुपवाड (Kupwad)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  {t.citizenFormWard || 'Ward / Prabhag'}
                </label>
                <select
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                >
                  <option value="Prabhag 01 - Ganpati Peth">Prabhag 01 - Ganpati Peth</option>
                  <option value="Prabhag 02 - Civil Hospital">Prabhag 02 - Civil Hospital Road</option>
                  <option value="Prabhag 03 - Vishrambag">Prabhag 03 - Vishrambag</option>
                  <option value="Prabhag 04 - Rajwada">Prabhag 04 - Rajwada</option>
                  <option value="Prabhag 07 - Station Road Miraj">Prabhag 07 - Station Road Miraj</option>
                  <option value="Prabhag 08 - Gandhi Chowk Miraj">Prabhag 08 - Gandhi Chowk Miraj</option>
                  <option value="Prabhag 11 - Kupwad MIDC">Prabhag 11 - Kupwad MIDC</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                {t.citizenFormLocation || 'Exact Location'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Near Ganpati Temple Chowk, opposite State Bank"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                {t.citizenFormDesc || 'Description'}
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mention if it blocks traffic signal, hangs from electric wire, or obstructs pedestrian footpath..."
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-colors resize-y"
              />
            </div>

            {/* Photo Attachment */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                {t.citizenFormPhoto || 'Upload Photo'}
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 cursor-pointer transition-all">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-600 font-medium text-sm">{previewImage ? 'Change Image' : 'Select Photo from Device'}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {previewImage && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Grievance...' : (t.citizenSubmitBtn || 'Submit Complaint')}</span>
            </button>
          </form>
        </div>

        {/* Right: Live Complaints Tracker Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-base text-slate-900">
                {t.existingComplaints || 'Live Complaints Feed'}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Transparent civic action logs
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
              {complaints.length} Total
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search token, location or description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
            />
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all text-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-700 text-xs">
                    {c.id}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Clock className="w-3 h-3" />
                    {c.status}
                  </span>
                </div>

                <p className="text-slate-800 font-medium leading-snug">
                  {c.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                  <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{c.location} ({c.city})</span>
                  </span>
                  <span className="text-[10px] font-medium">{c.filedDate?.slice(0, 10)}</span>
                </div>

                {c.assignedOfficer && (
                  <div className="text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded mt-1 border border-slate-100 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    Officer: <span className="font-semibold">{c.assignedOfficer}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
