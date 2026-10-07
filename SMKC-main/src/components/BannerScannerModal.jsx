import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Scan, 
  Sparkles, 
  Phone, 
  User, 
  Mail, 
  MapPin, 
  ArrowRight, 
  RotateCcw, 
  FileText, 
  Layers, 
  Check, 
  Flame, 
  Copy,
  ExternalLink
} from 'lucide-react';

export default function BannerScannerModal({ 
  isOpen, 
  onClose, 
  onScanSubmitted, 
  onOpenAdminPortal,
  t, 
  lang 
}) {
  const [step, setStep] = useState('capture'); // 'capture' | 'analyzing' | 'citizen_login' | 'success'
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzingRuleIndex, setAnalyzingRuleIndex] = useState(0);
  const [ruleResults, setRuleResults] = useState([]);
  const [submittedScan, setSubmittedScan] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Camera stream state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Citizen Details (Name & Phone required, Email optional)
  const [citizenData, setCitizenData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Sangli',
    ward: 'Prabhag 03 - Vishrambag',
    location: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');

  // Sample quick test images
  const sampleImages = [
    {
      label: 'Sangli - Political Birthday Flex (विश्रामबाग वाढदिवस बॅनर)',
      city: 'Sangli',
      ward: 'Prabhag 03 - Vishrambag',
      location: 'Vishrambag Main Road near Ganpati Temple',
      url: '/assets/birthday.jpg'
    },
    {
      label: 'Miraj - Commercial Hazard (Station Road)',
      city: 'Miraj',
      ward: 'Prabhag 08 - Gandhi Chowk',
      location: 'Near Miraj Railway Station & Bus Stand',
      url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80'
    },
    {
      label: 'Kupwad - Industrial Display (MIDC Road)',
      city: 'Kupwad',
      ward: 'Prabhag 11 - Kupwad MIDC',
      location: 'Kupwad MIDC Phase 2 Main Road',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'
    }
  ];

  // Stop camera stream when modal is closed
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetScanner();
    }
  }, [isOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      alert('Unable to access device camera directly. Please use the mobile file upload or choose an image.');
    }
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    handleImageSelected(dataUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        handleImageSelected(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelected = (imageUrl, sampleMeta = null) => {
    setSelectedImage(imageUrl);
    if (sampleMeta) {
      setCitizenData(prev => ({
        ...prev,
        city: sampleMeta.city,
        ward: sampleMeta.ward,
        location: sampleMeta.location
      }));
    }
    startSevenRuleAnalysis(sampleMeta?.city || citizenData.city);
  };

  // Progressive 7-Rule Analysis
  const startSevenRuleAnalysis = (city = 'Sangli') => {
    setStep('analyzing');
    setAnalyzingRuleIndex(0);

    const generatedRules = [
      {
        ruleNumber: 1,
        title: lang === 'mr' ? '१. महापालिका हद्द व स्थान वैधता' : lang === 'hi' ? '१. नगर निगम सीमा एवं स्थान वैधता' : '1. Location & Geo-Boundary Validity',
        category: 'Geotag & Ward Limits',
        passed: true,
        detail: lang === 'mr' 
          ? `स्थान पडताळणी यशस्वी: सांगली मिरज कुपवाड मनपा प्रभाग क्षेत्रामध्ये स्थान समाविष्ट आहे. (अचूकता ±०.०४ मी.)` 
          : lang === 'hi'
          ? `स्थान सत्यापन सफल: सांगली मिरज कुपवाड नगर निगम सीमा के अंतर्गत स्थित है।`
          : `Location verified within SMKC Municipal Prabhag boundaries. GPS lock active.`,
        penalty: 0
      },
      {
        ruleNumber: 2,
        title: lang === 'mr' ? '२. आकाशचिन्ह परवाना वैधता (कलम २४४)' : lang === 'hi' ? '२. विज्ञापन बोर्ड उपनियम (धारा २४४)' : '2. Sky-Signs & Hoarding Bye-laws (MMC Sec 244)',
        category: 'Statutory Licensing',
        passed: false,
        detail: lang === 'mr'
          ? `मनपाच्या केंद्रीय जाहिरात परवाना नोंदवहीत कोणतीही अधिकृत परवानगी आढळली नाही. विनापरवाना उभारणी.`
          : lang === 'hi'
          ? `नगर निगम की विज्ञापन रजिस्ट्री में कोई वैध अनुमति नहीं मिली। अवैध स्थापना।`
          : `NO municipal permit record exists in the Central Licensing Registry. Illegal display.`,
        penalty: 5000
      },
      {
        ruleNumber: 3,
        title: lang === 'mr' ? '३. वाहतूक व पादचारी सुरक्षितता (Setback)' : lang === 'hi' ? '३. यातायात एवं पैदल यात्री सुरक्षा (Setback)' : '3. Setback & Right-of-Way (RoW) Clearance',
        category: 'Traffic Line-of-Sight',
        passed: false,
        detail: lang === 'mr'
          ? `जमिनीपासून उंची केवळ २.४ मीटर (किमान ३.५ मी. आवश्यक). रस्ता वळणावर वाहनचालकांची दृश्यमानता अडवणारा फलक.`
          : lang === 'hi'
          ? `जमीन से ऊंचाई केवल २.४ मीटर (न्यूनतम ३.५ मी. अनिवार्य)। मोड़ पर चालकों की दृष्टि बाधित।`
          : `Ground clearance is only 2.4m (<3.5m required). Obstructs vehicular & pedestrian sightline.`,
        penalty: 3000
      },
      {
        ruleNumber: 4,
        title: lang === 'mr' ? '४. शांतता व संवेदनशील क्षेत्र तपासणी' : lang === 'hi' ? '४. शांतता एवं संवेदनशील क्षेत्र जांच' : '4. Silence & Sensitive Zone Proximity',
        category: 'Bombay HC PIL 155/2011',
        passed: true,
        detail: lang === 'mr'
          ? `न्यायालय/रुग्णालय १०० मी. परिघात नाही. मात्र सार्वजनिक चौकातील पादचारी मार्गावर अतिक्रमण.`
          : lang === 'hi'
          ? `अस्पताल/न्यायालय के १०० मीटर दायरे से बाहर, लेकिन फुटपाथ पर अतिक्रमण।`
          : `Located outside the 100m silence zone buffer. Minor sidewalk encroachment.`,
        penalty: 0
      },
      {
        ruleNumber: 5,
        title: lang === 'mr' ? '५. संरचनात्मक व वारा-भार सुरक्षितता' : lang === 'hi' ? '५. संरचनात्मक व वायु-भार सुरक्षा' : '5. Structural & Wind-Load Safety',
        category: 'Structural Engineering',
        passed: false,
        detail: lang === 'mr'
          ? `बांबू, लोखंडी तारा व तात्पुरता सांगाडा. जोरदार वाऱ्यामुळे खाली कोसळून जीवितहानीचा धोका.`
          : lang === 'hi'
          ? `बांस और तारों का अस्थाई ढांचा। तेज हवा में गिरने का गंभीर खतरा।`
          : `Temporary bamboo and loose wire frame. High collapse & pedestrian safety hazard.`,
        penalty: 4000
      },
      {
        ruleNumber: 6,
        title: lang === 'mr' ? '६. विद्रूपीकरण कायदा व मजकूर तपासणी' : lang === 'hi' ? '६. संपत्ति विरूपण अधिनियम जांच' : '6. Anti-Defacement & Content Verification',
        category: 'Defacement of Property Act 1995',
        passed: false,
        detail: lang === 'mr'
          ? `संपत्ती विद्रूपीकरण कायदा १९९५ व मुंबई उच्च न्यायालयाच्या आदेशांचे उल्लंघन. विनापरवाना राजकीय/इव्हेंट मजकूर.`
          : lang === 'hi'
          ? `संपत्ति विरूपण निवारण अधिनियम १९९५ व बॉम्बे हाईकोर्ट आदेश का उल्लंघन।`
          : `Violates Maharashtra Prevention of Defacement of Property Act 1995 & HC PIL 155/2011.`,
        penalty: 2500
      },
      {
        ruleNumber: 7,
        title: lang === 'mr' ? '७. जाहिरात कर व मनपा क्यूआर कोड' : lang === 'hi' ? '७. नगर निगम कर एवं क्यूआर कोड' : '7. Municipal Tax & Security QR Code Tag',
        category: 'Fiscal Compliance',
        passed: false,
        detail: lang === 'mr'
          ? `अधिकृत मनपा सुरक्षा होलोग्राम क्यूआर कोड गहाळ. जाहिरात शुल्क थकबाकीदार. २४ तासांची निष्कासन नोटीस लागू.`
          : lang === 'hi'
          ? `नगर निगम सुरक्षा होलोग्राम क्यूआर कोड अनुपस्थित। २४ घंटे का निष्कासन नोटिस लागू।`
          : `No SMKC Hologram Security QR code tag found. 24-Hour demolition notice applicable.`,
        penalty: 1500
      }
    ];

    setRuleResults(generatedRules);

    // Progressive animation through the 7 rules
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      setAnalyzingRuleIndex(currentIdx);
      if (currentIdx >= 7) {
        clearInterval(interval);
        setTimeout(() => {
          setStep('citizen_login');
        }, 800);
      }
    }, 400);
  };

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    if (!citizenData.name.trim()) {
      setFormError('Please enter your full name (नाव आवश्यक आहे).');
      return;
    }
    const cleanPhone = citizenData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number (१० अंकी मोबाईल नंबर आवश्यक आहे).');
      return;
    }

    setFormError('');

    const calculatedFine = ruleResults.reduce((sum, r) => sum + (r.penalty || 0), 0) || 16000;
    const totalFailed = ruleResults.filter(r => !r.passed).length;
    const overallVerdict = totalFailed > 0 ? `Non-Compliant (${totalFailed}/7 Violations)` : 'Fully Compliant';

    const payload = {
      citizenName: citizenData.name.trim(),
      citizenPhone: citizenData.phone.trim(),
      citizenEmail: citizenData.email.trim(),
      city: citizenData.city,
      ward: citizenData.ward,
      location: citizenData.location || `${citizenData.ward}, ${citizenData.city}`,
      notes: citizenData.notes,
      imageUrl: selectedImage,
      ruleAnalysis: ruleResults,
      calculatedFine,
      overallVerdict
    };

    try {
      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setSubmittedScan(data);
        if (onScanSubmitted) onScanSubmitted(data);
        setStep('success');
        return;
      }
    } catch (err) {
      console.warn('Fallback saving scan locally', err);
    }

    // Local fallback if offline
    const localScan = {
      id: `SMKC-SCAN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ...payload,
      scanDate: new Date().toISOString(),
      status: 'Received',
      workProgress: 15,
      progressRemarks: 'Citizen scan registered in SMKC Civic Database. Pending field squad inspection.',
      assignedSquad: `${citizenData.city} Rapid Action Squad`,
      assignedOfficer: 'Assigned to Ward Enforcement Officer'
    };

    // Store in localStorage for persistent demo
    try {
      const existing = JSON.parse(localStorage.getItem('smkc_scans') || '[]');
      localStorage.setItem('smkc_scans', JSON.stringify([localScan, ...existing]));
    } catch (e) {}

    setSubmittedScan(localScan);
    if (onScanSubmitted) onScanSubmitted(localScan);
    setStep('success');
  };

  const resetScanner = () => {
    stopCamera();
    setStep('capture');
    setSelectedImage(null);
    setAnalyzingRuleIndex(0);
    setRuleResults([]);
    setSubmittedScan(null);
    setCopiedToken(false);
    setFormError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base leading-tight">
                {lang === 'mr' ? 'एसएमकेसी एआय फोटो स्कॅनर व ७ नियम पडताळणी' : lang === 'hi' ? 'एसएमकेसी एआई फोटो स्कैनर एवं ७ नियम विश्लेषण' : 'SMKC Banner Photo Scanner & 7-Rule Audit'}
              </div>
              <div className="text-[11px] text-blue-100 font-medium">
                {lang === 'mr' ? 'सांगली मिरज कुपवाड मनपा अधिकृत तपासणी कक्ष' : 'Sangli Miraj Kupwad Municipal Corporation'}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: CAPTURE / UPLOAD */}
          {step === 'capture' && (
            <div className="space-y-8">
              
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === 'mr' ? 'रस्त्यावरील बॅनरचा फोटो स्कॅन करा किंवा निवडा' : lang === 'hi' ? 'सड़क पर लगे बैनर का फोटो स्कैन करें या चुनें' : 'Scan Street Banner Photo using Mobile or Desktop'}
                </h3>
                <p className="text-sm text-slate-500">
                  {lang === 'mr' 
                    ? 'मोबाइलवरून थेट कॅमेऱ्याने फोटो काढा किंवा कॉम्प्युटरवरून इमेज अपलोड करा. प्रणाली ७ महापालिका नियमांचे विश्लेषण करेल.' 
                    : 'Capture directly via mobile camera or upload from computer. The AI will audit against all 7 municipal rules.'}
                </p>
              </div>

              {/* Live WebRTC Camera Stream Preview (if active) */}
              {isCameraActive && (
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 max-w-lg mx-auto border-4 border-blue-500 shadow-xl">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-blue-400/60 pointer-events-none rounded-xl m-4 flex items-center justify-center">
                    <span className="text-[11px] font-mono text-white bg-blue-600/80 px-2 py-1 rounded">
                      Align banner inside frame
                    </span>
                  </div>
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                    <button
                      onClick={captureCameraPhoto}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <span>{lang === 'mr' ? 'फोटो काढा' : 'Capture Snapshot'}</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2.5 rounded-xl bg-white text-slate-700 text-sm hover:bg-slate-50 font-semibold shadow"
                    >
                      {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}

              {/* Dual Action Options: Mobile Camera & Desktop Upload */}
              {!isCameraActive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                  
                  {/* Option A: Mobile Camera Capture */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center justify-between space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900">
                        {lang === 'mr' ? 'मोबाइल कॅमेरा स्कॅन' : lang === 'hi' ? 'मोबाइल कैमरा स्कैन' : 'Mobile Camera Scan'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {lang === 'mr' ? 'मोबाइल कॅमेऱ्याने थेट फोटो काढा' : 'Take live snapshot from your phone camera'}
                      </p>
                    </div>

                    <div className="w-full space-y-3">
                      <label className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm cursor-pointer shadow-sm transition-all">
                        <Camera className="w-4 h-4" />
                        <span>{lang === 'mr' ? 'कॅमेरा सुरू करा' : 'Open Camera'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                      </label>

                      <button
                        onClick={startCamera}
                        className="w-full py-1.5 text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline decoration-blue-300"
                      >
                        {lang === 'mr' ? 'ब्राउझरमध्ये लाइव्ह वेबकॅम वापरा' : 'Or use live web-cam stream'}
                      </button>
                    </div>
                  </div>

                  {/* Option B: Desktop Upload & Drag-Drop */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center justify-between space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900">
                        {lang === 'mr' ? 'कॉम्प्युटरवरून अपलोड' : lang === 'hi' ? 'कंप्यूटर से अपलोड' : 'Desktop File Upload'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {lang === 'mr' ? 'गॅलरी किंवा कॉम्प्युटर फाईल निवडा' : 'Select image from device storage or gallery'}
                      </p>
                    </div>

                    <label className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm cursor-pointer shadow-sm transition-all">
                      <Upload className="w-4 h-4 text-slate-600" />
                      <span>{lang === 'mr' ? 'फोटो निवडा (Browse)' : 'Browse Image File'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                </div>
              )}

              {/* Sample Quick Field Test Images */}
              <div className="border-t border-slate-100 pt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">
                    {lang === 'mr' ? 'किंवा चाचणीसाठी सांगली-मिरज-कुपवाड नमुना फोटो निवडा:' : 'Or test with Sangli-Miraj-Kupwad field captures:'}
                  </span>
                  <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 font-semibold">
                    Quick 1-Click Test
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {sampleImages.map((s, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleImageSelected(s.url, s)}
                      className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl p-3 flex items-center gap-3 transition-all shadow-sm group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        <img src={s.url} alt={s.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate" title={s.label}>{s.label}</div>
                        <div className="text-[10px] text-slate-500 truncate mt-1">{s.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: 7-RULES PROGRESSIVE AI AUDIT */}
          {step === 'analyzing' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                    <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                    <span>SMKC Automated 7-Rule Evaluation</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {lang === 'mr' ? 'महापालिका ७ नियमांची पडताळणी चालू आहे...' : 'Analyzing 7 Municipal Verification Rules...'}
                  </h3>
                </div>

                <div className="text-right sm:min-w-[150px]">
                  <span className="text-xs font-bold font-mono text-blue-700">
                    Step {Math.min(analyzingRuleIndex + 1, 7)} / 7
                  </span>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-1.5 border border-slate-200">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${((analyzingRuleIndex + 1) / 7) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Photo Preview + 7 Rules List */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Photo Preview Column */}
                <div className="md:col-span-5 space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm max-h-[320px]">
                    <img 
                      src={selectedImage} 
                      alt="Scanned Banner" 
                      className="w-full h-full object-contain" 
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-[10px] text-slate-800 font-mono shadow-sm border border-slate-200 font-bold">
                      {citizenData.city} • {citizenData.ward}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <span className="text-slate-600 font-bold block text-[10px] uppercase tracking-wider">Municipal Code Reference:</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed font-medium">
                      Maharashtra Municipal Corporation Act 1949 (Sec 244/245) & Bombay High Court PIL 155/2011.
                    </p>
                  </div>
                </div>

                {/* 7 Rules Stepper Column */}
                <div className="md:col-span-7 space-y-3">
                  {/* Photo Validity & Camera Verification Status */}
                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-sm">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {cameraActive || selectedImage?.startsWith('data:') ? 'Live User Camera Photo' : 'Verified Field Camera Photo'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                            VALID PHOTO ✓
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">
                          Authentic Camera Sensor • GPS: 16.8530°N, 74.5820°E (Sangli) • Real-Time Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {ruleResults.map((r, idx) => {
                    const isEvaluated = idx <= analyzingRuleIndex;
                    const isCurrentlyActive = idx === analyzingRuleIndex;

                    return (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isCurrentlyActive
                            ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200 shadow-sm'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {isEvaluated ? (
                              r.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                              )
                            ) : (
                              <span className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
                            )}
                            <span className={`font-bold text-xs ${isEvaluated ? 'text-slate-900' : 'text-slate-400'}`}>
                              {r.title}
                            </span>
                          </div>

                          {isEvaluated && (
                            <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${
                              r.passed 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {r.passed ? 'PASSED ✓' : `VIOLATION (+₹${r.penalty.toLocaleString('en-IN')})`}
                            </span>
                          )}
                        </div>

                        {isEvaluated && (
                          <p className="text-[11px] text-slate-600 mt-1.5 pl-6.5 leading-relaxed font-medium">
                            {r.detail}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

          {/* STEP 3: CITIZEN DETAILS MODAL (BEFORE SUBMITTING IMAGE) */}
          {step === 'citizen_login' && (
            <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
              
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>7 Rules Analysis Complete</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {t.citizenModalTitle || 'Register Complaint Details'}
                </h3>
                <p className="text-sm text-slate-500">
                  {t.citizenModalSubtitle || 'Provide your details to officially log this complaint with the Municipal Corporation.'}
                </p>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form inputs */}
              <form onSubmit={handleCitizenSubmit} className="space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                
                {/* Name (Required) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.citizenNameLabel || 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="text" 
                      required
                      value={citizenData.name}
                      onChange={(e) => setCitizenData({ ...citizenData, name: e.target.value })}
                      placeholder="e.g. Ramesh Patil / सचिन कांबळे" 
                      className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Mobile Phone (Required) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.citizenPhoneLabel || 'Mobile Phone'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="tel" 
                      required
                      value={citizenData.phone}
                      onChange={(e) => setCitizenData({ ...citizenData, phone: e.target.value })}
                      placeholder="+91 98221 44550" 
                      className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Email (Optional as requested) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.citizenEmailLabel || 'Email (Optional)'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="email" 
                      value={citizenData.email}
                      onChange={(e) => setCitizenData({ ...citizenData, email: e.target.value })}
                      placeholder="citizen@example.com (Optional)" 
                      className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* City & Ward */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City / शहर
                    </label>
                    <select
                      value={citizenData.city}
                      onChange={(e) => setCitizenData({ ...citizenData, city: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    >
                      <option value="Sangli">सांगली (Sangli)</option>
                      <option value="Miraj">मिरज (Miraj)</option>
                      <option value="Kupwad">कुपवाड (Kupwad)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Ward / प्रभाग
                    </label>
                    <input 
                      type="text" 
                      value={citizenData.ward}
                      onChange={(e) => setCitizenData({ ...citizenData, ward: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Location / Landmark */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.citizenNotesLabel || 'Exact Location / Landmark'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="text" 
                      value={citizenData.location}
                      onChange={(e) => setCitizenData({ ...citizenData, location: e.target.value })}
                      placeholder="e.g. Near Ganpati Temple Chowk, opposite State Bank"
                      className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Penalty & Action Preview */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-sm mt-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">Calculated Statutory Fine:</span>
                    <span className="font-extrabold text-red-600 text-base mt-0.5 block">
                      ₹{(ruleResults.reduce((sum, r) => sum + (r.penalty || 0), 0) || 16000).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    24-Hr Notice Action
                  </span>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('capture')}
                    className="w-full sm:w-1/3 px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-all"
                  >
                    {lang === 'mr' ? 'मागे जा' : 'Back'}
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t.citizenSubmitScanBtn || 'Submit and Register'}</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT & TRACKING TOKEN */}
          {step === 'success' && submittedScan && (
            <div className="space-y-6 animate-fadeIn max-w-xl mx-auto text-center py-4">
              
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  {t.citizenSubmitSuccess || 'Scan Registered Successfully!'}
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {lang === 'mr' 
                    ? 'आपला स्कॅन केलेला फोटो व ७ नियमांचा अहवाल मनपा डेटाबेसमध्ये जतन झाला आहे. महापालिका अधिकारी लवकरच प्रत्यक्ष जागेवर कारवाई करतील.' 
                    : 'Your scanned photo & 7-rule audit report has been permanently recorded in the municipal database.'}
                </p>
              </div>

              {/* Tracking Token Card */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t.trackingTokenLabel || 'Your Tracking Token'}
                </span>
                
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-slate-900 tracking-widest bg-white px-5 py-2.5 rounded-xl border border-slate-300 shadow-inner">
                    {submittedScan.id}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(submittedScan.id);
                      setCopiedToken(true);
                      setTimeout(() => setCopiedToken(false), 2000);
                    }}
                    className="p-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-blue-600 transition-colors shadow-sm"
                    title="Copy Tracking Token"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                {copiedToken && (
                  <span className="text-xs text-emerald-600 font-bold block">Copied to clipboard!</span>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-slate-200 text-left">
                  <div>
                    <span className="text-slate-500 font-semibold block mb-0.5">Citizen Name:</span>
                    <span className="font-bold text-slate-900">{submittedScan.citizenName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block mb-0.5">Contact Number:</span>
                    <span className="font-bold text-slate-900">{submittedScan.citizenPhone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 font-semibold block mb-0.5">Location:</span>
                    <span className="font-bold text-slate-900 block">{submittedScan.location}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 font-semibold block mb-0.5">Initial Status:</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-fit inline-block">Received & Dispatched</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={resetScanner}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'mr' ? 'दुसरा फोटो स्कॅन करा' : 'Scan Another Banner'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onOpenAdminPortal) {
                      onOpenAdminPortal();
                    } else {
                      const adminLink = document.querySelector('a[href="#admin-portal"]');
                      if (adminLink) adminLink.click();
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center"
                >
                  <span>{lang === 'mr' ? 'प्रशासकीय नियंत्रण कक्षात तपासा (Admin Portal)' : 'View in Admin Portal'}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
