import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  LogOut,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  AlertTriangle,
  Search,
  MapPin,
  Phone,
  Activity,
  ChevronRight,
  ExternalLink,
  X,
  Bell,
  Home,
  Map,
  ShieldAlert,
  Settings,
  FileBarChart,
  Check
} from 'lucide-react';

export default function OfficerPortal({
  isOpen = true,
  onClose,
  scannedSubmissions = [],
  onUpdateScanProgress,
  setSelectedHoardingForNotice,
  setActiveTab,
  t,
  lang
}) {
  const [isLoggedIn, setIsLoggedIn]         = useState(false);
  const [officerProfile, setOfficerProfile] = useState(null);
  const [officerId, setOfficerId]           = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [loginError, setLoginError]         = useState('');
  const [officerAuthToken, setOfficerAuthToken] = useState('');
  const [authorizedScans, setAuthorizedScans] = useState([]);

  const [selectedScanId, setSelectedScanId]         = useState(scannedSubmissions[0]?.id || null);
  const [workStage, setWorkStage]                   = useState('In Progress');
  const [workProgressPercent, setWorkProgressPercent] = useState(65);
  const [progressRemarks, setProgressRemarks]       = useState('');
  const [assignedSquad, setAssignedSquad]           = useState('Sangli Enforcement Squad 01');
  const [isUpdating, setIsUpdating]                 = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg]     = useState('');

  const [activeSidebarTab, setActiveSidebarTab] = useState('Citizen Reports');

  if (!isOpen) return null;

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const loginResponse = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: officerId.trim(), password: officerPassword })
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.error || 'Unable to sign in.');

      const scansResponse = await fetch('/api/scans', {
        headers: { Authorization: `Bearer ${loginData.token}` }
      });
      const scans = await scansResponse.json();
      if (!scansResponse.ok) throw new Error('Unable to load officer cases.');

      setOfficerAuthToken(loginData.token);
      setOfficerProfile(loginData.officer);
      setAuthorizedScans(scans);
      setOfficerPassword('');
      setIsLoggedIn(true);
    } catch (error) {
      setLoginError(error.message || 'Unable to sign in. Check your credentials or contact the system administrator.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', headers: { Authorization: `Bearer ${officerAuthToken}` } });
    } catch (error) {}
    setIsLoggedIn(false);
    setOfficerProfile(null);
    setOfficerAuthToken('');
    setOfficerId('');
    setOfficerPassword('');
  };

  const currentScan = authorizedScans.find(s => s.id === selectedScanId) || authorizedScans[0];

  const handleSaveProgress = async (e) => {
    e.preventDefault();
    if (!currentScan) return;
    setIsUpdating(true);
    const updatedData = {
      status: workStage,
      workProgress: Number(workProgressPercent),
      progressRemarks: progressRemarks || currentScan.progressRemarks,
      assignedSquad,
      assignedOfficer: officerProfile?.name || 'SMKC Ward Officer'
    };
    if (onUpdateScanProgress) {
      const saved = await onUpdateScanProgress(currentScan.id, updatedData, officerAuthToken);
      if (!saved) {
        setIsUpdating(false);
        setLoginError('Unable to save the update. Please sign in again.');
        return;
      }
    }
    setAuthorizedScans(previous => previous.map(scan => scan.id === currentScan.id ? { ...scan, ...updatedData } : scan));
    setIsUpdating(false);
    setUpdateSuccessMsg('Updated successfully');
    setTimeout(() => setUpdateSuccessMsg(''), 3000);
  };

  // Mock stats
  const stats = [
    { label: 'Total Cases', value: 24, icon: <FileText size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Pending Verification', value: 8, icon: <Clock size={20} className="text-amber-500" />, bg: 'bg-amber-50' },
    { label: 'Notices Issued', value: 6, icon: <FileText size={20} className="text-purple-500" />, bg: 'bg-purple-50' },
    { label: 'Under Action', value: 7, icon: <AlertTriangle size={20} className="text-emerald-500" />, bg: 'bg-emerald-50' },
    { label: 'Closed', value: 3, icon: <CheckCircle2 size={20} className="text-slate-500" />, bg: 'bg-slate-50' }
  ];

  const getStatusColor = (status, progress) => {
    if (progress === 100 || status?.includes('Closed')) return 'bg-emerald-100 text-emerald-800';
    if (status?.includes('Notice') || progress > 50) return 'bg-amber-100 text-amber-800';
    if (status?.includes('Priority') || status?.includes('Hazard')) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  // ----- VIEW A: LOGIN -----
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[400] bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
          {onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          )}
          <div className="bg-[#1A2A4A] p-6 text-center text-white">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img src="/smkc-logo.png" alt="SMKC" className="w-10 h-10 object-contain" onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%231A2A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>'; }} />
            </div>
            <h2 className="text-xl font-bold">SMKC Administrative Control Room</h2>
            <p className="text-blue-200 text-sm mt-1">Officer Login Portal</p>
          </div>
          
          <div className="p-6">
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Officer ID</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={officerId}
                    onChange={e => setOfficerId(e.target.value)}
                    autoComplete="username"
                    placeholder="Enter officer ID"
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={officerPassword}
                    onChange={e => setOfficerPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-[#1A2A4A] hover:bg-[#0F172A] text-white font-bold py-2.5 rounded-lg transition-colors mt-2 text-sm shadow-md">
                Secure Login
              </button>
            </form>

            <p className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500 text-center">Authorized municipal staff only</p>
          </div>
        </div>
      </div>
    );
  }

  // ----- VIEW B: LOGGED IN DASHBOARD (Matches White Image) -----
  return (
    <div className="fixed inset-0 z-[400] bg-[#F5F7FA] flex flex-col font-sans overflow-hidden animate-fadeIn text-slate-800">
      
      {/* Header */}
      <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center p-1 overflow-hidden shrink-0">
             <img src="/smkc-logo.png" alt="SMKC" className="w-full h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%231A2A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>'; }} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">SMKC</h1>
              <div className="h-5 w-px bg-slate-300 hidden sm:block"></div>
              <h2 className="text-lg font-bold text-slate-800 hidden sm:block leading-tight">Illegal Hoarding & Encroachment Monitoring System</h2>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Sangli - Miraj - Kupwad Municipal Corporation</span>
              <span className="hidden sm:inline">• Administrative Control Room | Officer Dashboard</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <button className="relative p-2 text-slate-500 hover:text-slate-700 bg-slate-50 rounded-full border border-slate-200">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
            <div className="w-9 h-9 bg-[#1E293B] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
              {officerProfile?.name.slice(0, 2) || 'SK'}
            </div>
            <div className="hidden md:block text-right">
              <div className="text-sm font-bold text-slate-800">{officerProfile?.name || 'Dr. SK Mahajan'}</div>
              <div className="text-xs text-slate-500">{officerProfile?.role || 'Ward Officer'}</div>
            </div>
          </div>

          <button onClick={handleLogout} className="ml-2 px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            Logout
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-1">
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-56 bg-[#1A2A4A] text-slate-300 flex flex-col shrink-0">
          <div className="py-4 flex flex-col gap-1 px-3">
            {[
              { id: 'Dashboard', icon: <Home size={18} /> },
              { id: 'Citizen Reports', icon: <FileText size={18} /> },
              { id: 'Truck Detections', icon: <Truck size={18} /> },
              { id: 'Map View', icon: <Map size={18} /> },
              { id: 'Enforcement', icon: <ShieldAlert size={18} /> },
              { id: 'Reports', icon: <FileBarChart size={18} /> },
              { id: 'Settings', icon: <Settings size={18} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSidebarTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSidebarTab === tab.id 
                    ? 'bg-[#3b82f6]/20 text-blue-400 border-l-4 border-blue-400 rounded-l-none' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.id}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800 leading-none mb-1">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            
            {/* Column 1: Reported Cases List (3/12) */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm">Reported Cases</h3>
                <select className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-600 outline-none">
                  <option>Latest</option>
                  <option>High Priority</option>
                </select>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {authorizedScans.map(scan => {
                  const isSelected = scan.id === selectedScanId;
                  const statusColor = getStatusColor(scan.status, scan.workProgress);
                  const displayStatus = scan.workProgress === 100 ? 'Closed' : scan.workProgress > 50 ? 'Notice Issued' : scan.workProgress > 20 ? 'Under Verification' : 'High Priority';
                  const realColor = getStatusColor(displayStatus, scan.workProgress);

                  return (
                    <div 
                      key={scan.id}
                      onClick={() => {
                        setSelectedScanId(scan.id);
                        setWorkStage(scan.status || 'In Progress');
                        setWorkProgressPercent(scan.workProgress || 15);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex gap-3 ${
                        isSelected ? 'bg-blue-50 border-blue-300 shadow-sm ring-1 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                        <img src={scan.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="text-sm font-bold text-slate-800 truncate mb-1">{scan.id}</div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block w-fit mb-1.5 ${realColor}`}>
                          {displayStatus}
                        </span>
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <MapPin size={10} /> {scan.location}
                        </div>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Case Details (5/12) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
              {currentScan ? (
                <>
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">Case Details</h3>
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border border-red-200">
                      High Priority
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1 overflow-y-auto">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">{currentScan.id}</h2>
                    
                    {/* Main Image */}
                    <div className="w-full h-48 sm:h-64 bg-slate-100 rounded-xl mb-4 overflow-hidden border border-slate-200 relative group">
                       <img src={currentScan.imageUrl} alt="Hoarding" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <button className="bg-white/20 hover:bg-white/40 text-white backdrop-blur px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1">
                           <MapPin size={14} /> Tag
                         </button>
                         <button className="bg-white/20 hover:bg-white/40 text-white backdrop-blur px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1">
                           <ExternalLink size={14} /> Full View
                         </button>
                       </div>
                    </div>

                    {/* Sub Images Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      <div className="aspect-video bg-slate-100 rounded-lg border border-blue-400 overflow-hidden ring-2 ring-blue-100">
                        <img src={currentScan.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-video bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=300&q=80" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-video bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&q=80" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-video bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100">
                        <span className="text-sm font-bold">+2</span>
                        <span className="text-[10px]">more</span>
                      </div>
                    </div>

                    {/* Details Table */}
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500 font-semibold">Citizen:</span>
                        <span className="col-span-2 text-slate-800 font-medium">{currentScan.citizenName} ({currentScan.citizenPhone})</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500 font-semibold">Location:</span>
                        <span className="col-span-2 text-slate-800 font-medium">{currentScan.location}, {currentScan.city}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500 font-semibold">Date & Time:</span>
                        <span className="col-span-2 text-slate-800 font-medium">{new Date().toLocaleString('en-IN')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500 font-semibold">Source:</span>
                        <span className="col-span-2 text-slate-800 font-medium">Citizen Report</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500 font-semibold">Category:</span>
                        <span className="col-span-2 text-slate-800 font-medium">Illegal Hoarding</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span className="text-slate-500 font-semibold">AI Suspicion Score:</span>
                        <div className="col-span-2 flex items-center gap-3">
                          <span className="text-slate-800 font-bold">92%</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full bg-red-500" style={{width: '92%'}}></div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500 font-semibold">Estimated Size:</span>
                        <span className="col-span-2 text-slate-800 font-medium">Approx. 18 ft × 12 ft</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-500 font-semibold">Note:</span>
                        <span className="col-span-2 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                          {currentScan.notes || "Large political flex hanging on street light pole, blocking traffic view."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap gap-3">
                    <button className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2">
                      <Check size={16} /> Verify
                    </button>
                    <button 
                      onClick={() => {
                        const h = {
                          id: currentScan.id,
                          title: { en: currentScan.location, mr: currentScan.location, hi: currentScan.location },
                          locationName: currentScan.location,
                          ward: currentScan.ward,
                          city: currentScan.city,
                          advertiser: currentScan.citizenName,
                          contactNumber: currentScan.citizenPhone,
                          fineAmount: currentScan.calculatedFine || 15000,
                          imageUrl: currentScan.imageUrl
                        };
                        setSelectedHoardingForNotice(h);
                        setActiveTab('notice');
                        if (onClose) onClose();
                      }}
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> Generate Notice
                    </button>
                    <button className="flex-1 sm:flex-none bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2">
                      <User size={16} /> Assign Officer
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400">Select a case</div>
              )}
            </div>

            {/* Column 3: Context & Tracking (4/12) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* GIS Map Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col shrink-0">
                <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-sm">Location & GIS</h3>
                  <a href="#" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    Open in Google Maps <ExternalLink size={10} />
                  </a>
                </div>
                <div className="p-3">
                  <div className="w-full h-32 bg-slate-100 rounded-lg mb-3 relative overflow-hidden border border-slate-200">
                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" alt="Map" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-blue-50/30"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow text-[10px] font-bold text-slate-800 flex items-center gap-1 border border-slate-200">
                      <MapPin size={12} className="text-red-500" /> Vishrambag Main Chowk
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Coordinates: <span className="font-mono text-slate-900 font-semibold">16.8524° N, 74.5815° E</span></span>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                      <FileText size={12} /> Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Case History Timeline */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-sm">Case History</h3>
                  <button className="text-xs text-blue-600 font-semibold hover:underline">View All</button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
                    {[
                      { date: '5 Oct 2026, 11:24 AM', text: 'New complaint received (Citizen)' },
                      { date: '5 Oct 2026, 12:10 PM', text: 'AI analysis completed (Suspicion: 92%)' },
                      { date: '6 Oct 2026, 9:30 AM', text: 'Assigned to Ward Officer (Dr. SK Mahajan)' }
                    ].map((h, i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2"></div>
                        <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0">
                          <div className="text-xs text-slate-500 mb-0.5">{h.date}</div>
                          <div className="text-sm font-medium text-slate-800">{h.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enforcement Tracking */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
                <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-sm">Enforcement Tracking</h3>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-md">Status: Notice Issued</span>
                </div>
                <div className="p-4">
                  <div className="relative pl-6 space-y-4 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-slate-200">
                    
                    <div className="relative">
                      <div className="absolute -left-[25px] top-0.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                        <Check size={12} className="text-white" />
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-slate-800">Notice Issued</span>
                        <span className="text-xs text-slate-500">6 Oct 2026</span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[25px] top-0.5 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-slate-800">Compliance Deadline</span>
                        <span className="text-xs text-slate-500">13 Oct 2026 (7 days)</span>
                      </div>
                    </div>

                    {['Reinspection (Pending)', 'Action Taken (Pending)', 'Case Closure (Pending)'].map((step, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[25px] top-0.5 w-5 h-5 bg-slate-200 rounded-full border-2 border-white z-10"></div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-slate-400">{step}</span>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
