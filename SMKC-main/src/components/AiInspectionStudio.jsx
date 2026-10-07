import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Cpu, 
  MapPin, 
  Layers, 
  FileSearch, 
  ShieldAlert, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  Upload, 
  Sparkles, 
  FileText, 
  AlertTriangle, 
  Crosshair, 
  Eye, 
  EyeOff, 
  Phone, 
  User, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Scan
} from 'lucide-react';

export default function AiInspectionStudio({ 
  presets, 
  onRunInspection, 
  currentResult, 
  isLoading, 
  setActiveTab, 
  setSelectedHoardingForNotice, 
  t, 
  lang 
}) {
  const [selectedPresetId, setSelectedPresetId] = useState(presets[0]?.id || 'preset-1');
  const [activeStageStep, setActiveStageStep] = useState(7); // Show all if already run, or progress
  const [showBbox, setShowBbox] = useState(true);
  const [showOcrOverlay, setShowOcrOverlay] = useState(true);
  const [showLidarGrid, setShowLidarGrid] = useState(false);
  const [customFile, setCustomFile] = useState(null);
  const [customPreviewUrl, setCustomPreviewUrl] = useState(null);
  const [customWard, setCustomWard] = useState('Prabhag 03 - Vishrambag');
  const [customCity, setCustomCity] = useState('Sangli');
  const [terminalLogs, setTerminalLogs] = useState([]);

  // Default to preset 1 on first load
  useEffect(() => {
    if (!currentResult && presets.length > 0) {
      handleSelectPreset(presets[0].id);
    }
  }, [presets]);

  const handleSelectPreset = async (presetId) => {
    setSelectedPresetId(presetId);
    setCustomPreviewUrl(null);
    setCustomFile(null);
    runSelectedInspection(presetId);
  };

  const runSelectedInspection = async (presetId) => {
    setTerminalLogs([
      `[INIT] Initializing 2026 Mobile Mapping & Smart Scanner...`,
      `[SYS] Hardware: Velodyne VLP-16 LiDAR + 360° Spherical Sensor + RTK-GNSS`,
      `[AI] Models: YOLOv8x-Hoarding-SMKC-v2 & PaddleOCR Multilingual Devanagari`
    ]);

    const result = await onRunInspection({ presetId });
    if (result && result.stages) {
      animateInspectionStages(result);
    }
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomFile(file);
      const url = URL.createObjectURL(file);
      setCustomPreviewUrl(url);
      setSelectedPresetId('custom');

      // Trigger custom scan run
      onRunInspection({
        customImage: url,
        customMeta: {
          city: customCity,
          ward: customWard,
          location: `${customCity} Field Inspection Spot`
        }
      }).then(res => {
        if (res) animateInspectionStages(res);
      });
    }
  };

  const animateInspectionStages = (data) => {
    setActiveStageStep(1);
    const stages = [
      `[STAGE 1] Mobile Mapping: GNSS RTK position (${data.lat?.toFixed(4)}°N, ${data.lng?.toFixed(4)}°E) - Speed: ${data.stages.mobileMapping.vehicleSpeed}`,
      `[STAGE 2] CNN Detection: YOLOv8x identified ${data.stages.detection.detectedClass} with ${(data.stages.detection.confidence * 100).toFixed(1)}% confidence`,
      `[STAGE 3] 3D Localization: Projected LiDAR depth -> Est. Dimensions: ${data.stages.localization.dimensionsEst} at ${data.stages.localization.heightFromGround}`,
      `[STAGE 4] Classification: Category -> ${data.stages.classification.type} | Risk Level: ${data.stages.classification.riskLevel}`,
      `[STAGE 5] Multilingual OCR: Extracted text: "${data.stages.ocr.extractedRawText?.slice(0, 50)}..."`,
      `[STAGE 6] SMKC GIS Registry: ${data.stages.compliance.registryMatch} | Violations: ${data.stages.compliance.highCourtViolation}`,
      `[STAGE 7] Administrative Action: Issued ${data.stages.action.noticeType} | Fine: ₹${data.stages.compliance.penaltyProposed?.toLocaleString('en-IN')}`
    ];

    let current = 1;
    const interval = setInterval(() => {
      current++;
      setActiveStageStep(current);
      setTerminalLogs(prev => [...prev, stages[current - 2] || '']);
      if (current >= 7) {
        clearInterval(interval);
      }
    }, 450);
  };

  const data = currentResult;
  const stages = data?.stages;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Architecture Diagram Header */}
      <div className="card p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
              <Scan className="w-3.5 h-3.5 text-blue-600" />
              <span>Full-Stack Deep Learning & Spatial Inspection Studio</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t.scannerTitle || 'AI Inspection Studio'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-4xl">
              {t.scannerSubtitle || 'Run comprehensive 7-stage AI audits on hoardings'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => runSelectedInspection(selectedPresetId === 'custom' ? null : selectedPresetId)}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 shadow-sm text-xs"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isLoading ? (t.runningScanner || 'Running...') : (t.runScannerBtn || 'Run Scanner')}</span>
            </button>
          </div>
        </div>

        {/* 7-Step Inspection Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-4 border-t border-slate-100 text-xs">
          {[
            { step: 1, name: 'Mobile Mapping', icon: Camera, color: 'text-blue-600' },
            { step: 2, name: 'CNN Detection', icon: Cpu, color: 'text-amber-600' },
            { step: 3, name: '3D Localization', icon: Crosshair, color: 'text-emerald-600' },
            { step: 4, name: 'Classification', icon: Layers, color: 'text-purple-600' },
            { step: 5, name: 'Trilingual OCR', icon: FileSearch, color: 'text-pink-600' },
            { step: 6, name: 'GIS Compliance', icon: MapPin, color: 'text-orange-600' },
            { step: 7, name: 'Admin Action', icon: ShieldAlert, color: 'text-red-600' },
          ].map((item) => {
            const Icon = item.icon;
            const isCompleted = activeStageStep >= item.step;
            const isCurrent = activeStageStep === item.step;
            return (
              <div 
                key={item.step}
                className={`p-2.5 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50 border-slate-300 text-slate-800'
                    : 'bg-slate-50/50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold">STAGE 0{item.step}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 font-semibold truncate">
                  <Icon className={`w-3.5 h-3.5 ${isCurrent || isCompleted ? item.color : 'text-slate-400'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Selector: Sangli-Miraj-Kupwad Presets + Custom Upload */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            {t.selectPreset || 'Select Preset:'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPresetId === p.id
                    ? 'bg-blue-600 text-white shadow font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {p.city} • {p.name?.[lang] || p.name?.en || p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Upload Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-blue-700 border border-slate-300 text-xs font-semibold cursor-pointer transition-all shadow-sm">
            <Upload className="w-4 h-4" />
            <span>{t.uploadCustom || 'Upload Custom Image'}</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleCustomUpload}
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Main Viewport & Telemetry Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Interactive Image Canvas & Overlays (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group min-h-[420px] flex items-center justify-center">
            
            {/* Base Street View Image */}
            {customPreviewUrl || data?.image || presets[0]?.image ? (
              <img 
                src={customPreviewUrl || data?.image || presets[0]?.image} 
                alt="Street View Mobile Mapping"
                className="w-full h-auto max-h-[500px] object-cover"
              />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
            )}

            {/* Simulated LiDAR Grid Overlay */}
            {showLidarGrid && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px]"
              />
            )}

            {/* CNN Bounding Box Overlay */}
            {showBbox && stages?.detection?.bbox && (
              <div 
                className={`absolute border-2 rounded transition-all duration-300 ${
                  stages.compliance?.isPermitted 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-red-500 bg-red-500/15 animate-pulse'
                }`}
                style={{
                  left: `${stages.detection.bbox.x}%`,
                  top: `${stages.detection.bbox.y}%`,
                  width: `${stages.detection.bbox.width}%`,
                  height: `${stages.detection.bbox.height}%`
                }}
              >
                {/* Confidence & Classification Pill */}
                <div className={`absolute -top-7 left-0 px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1 shadow-sm ${
                  stages.compliance?.isPermitted 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}>
                  <span>{stages.detection.detectedClass}</span>
                  <span>•</span>
                  <span>{(stages.detection.confidence * 100).toFixed(1)}%</span>
                </div>

                {/* 3D Dimensions Callout Bottom */}
                <div className="absolute -bottom-7 left-0 bg-white text-slate-900 px-2 py-1 rounded text-[10px] font-mono border border-slate-300 flex items-center gap-1.5 shadow-sm font-semibold">
                  <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                  <span>{stages.localization.dimensionsEst}</span>
                  <span className="text-slate-500">({stages.localization.heightFromGround})</span>
                </div>
              </div>
            )}

            {/* OCR Live Text Overlay Banner */}
            {showOcrOverlay && stages?.ocr?.extractedRawText && (
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-4 rounded-lg border border-slate-200 shadow-lg text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-blue-700 font-bold">
                  <div className="flex items-center gap-1.5">
                    <FileSearch className="w-4 h-4 text-blue-600" />
                    <span>{t.detectedTextHeader || 'Extracted OCR Text'}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono ml-1 bg-slate-100 px-1.5 py-0.5 rounded">
                      [Devanagari OCR v2.4]
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                    Language: {stages.ocr.languagesDetected?.join(', ')}
                  </span>
                </div>
                <p className="text-slate-900 font-medium font-serif leading-relaxed line-clamp-2 text-sm bg-slate-50 p-2 rounded border border-slate-100">
                  "{stages.ocr.extractedRawText}"
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-700 pt-1">
                  {stages.ocr.entities?.advertiser && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <strong className="text-slate-500">Advertiser:</strong> {stages.ocr.entities.advertiser}
                    </span>
                  )}
                  {stages.ocr.entities?.phoneNumbers?.[0] && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <strong className="text-slate-500">Phone:</strong> {stages.ocr.entities.phoneNumbers[0]}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Canvas Viewport Controls Overlay Top Right */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur p-1 rounded border border-slate-200 text-xs shadow-sm">
              <button
                onClick={() => setShowBbox(!showBbox)}
                className={`p-1.5 rounded transition-colors ${showBbox ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                title="Toggle CNN Bounding Box"
              >
                {showBbox ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setShowOcrOverlay(!showOcrOverlay)}
                className={`px-2 py-1 rounded transition-colors text-[11px] font-semibold ${showOcrOverlay ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                title="Toggle OCR Text Overlay"
              >
                OCR
              </button>
              <button
                onClick={() => setShowLidarGrid(!showLidarGrid)}
                className={`px-2 py-1 rounded transition-colors text-[11px] font-semibold ${showLidarGrid ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                title="Toggle LiDAR Point Cloud Mesh"
              >
                LiDAR
              </button>
            </div>

            {/* Geotag Chip Top Left */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded border border-slate-200 text-[11px] font-mono text-slate-700 flex items-center gap-1.5 shadow-sm font-bold">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{data?.city || customCity}</span>
              <span className="text-slate-400">•</span>
              <span>{data?.ward || customWard}</span>
            </div>

          </div>

          {/* Real-time Hardware & Model Logs Terminal */}
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 shadow-inner">
            <div className="flex items-center justify-between text-slate-500 pb-1.5 border-b border-slate-700 text-[10px] uppercase font-bold tracking-wider">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Mobile Mapping & Smart Vision Telemetry Log</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>LIVE FEED</span>
            </div>
            <div className="space-y-0.5 max-h-28 overflow-y-auto scrollbar-thin pt-1">
              {terminalLogs.map((log, index) => (
                <div key={index} className="leading-tight">
                  <span className="text-blue-400 mr-1.5">›</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Deep Stage-by-Stage Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Compliance & Action Summary Card */}
          <div className={`p-5 rounded-lg border shadow-sm transition-all ${
            stages?.compliance?.isPermitted
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                AI Compliance Verdict
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                stages?.compliance?.isPermitted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
              }`}>
                {stages?.compliance?.isPermitted ? (t.statusPermitted || 'Permitted') : (t.statusIllegal || 'Illegal Violation')}
              </span>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="text-xl font-bold">
                {stages?.compliance?.isPermitted ? (
                  <span className="text-emerald-700">SMKC Licensed Display</span>
                ) : (
                  <span className="text-red-700">Unauthorized Display Detected</span>
                )}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {stages?.compliance?.highCourtViolation}
              </p>
            </div>

            {/* Fine and Legal Section */}
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wide">{t.legalSectionLabel || 'Violated Section'}</span>
                <span className="font-bold text-slate-900 block mt-1">
                  {stages?.compliance?.actSection || 'MMC Act 1949 Sec 244'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wide">{t.proposedFine || 'Proposed Fine'}</span>
                <span className="font-bold text-red-600 text-base block mt-0.5">
                  ₹{stages?.compliance?.penaltyProposed?.toLocaleString('en-IN') || 0}
                </span>
              </div>
            </div>

            {/* Notice & Enforcement Action Trigger */}
            {!stages?.compliance?.isPermitted && (
              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => {
                    const noticeItem = {
                      id: `SMKC-HD-${Math.floor(100 + Math.random() * 900)}`,
                      title: data?.name || { en: 'Detected Banner' },
                      city: data?.city || customCity,
                      ward: data?.ward || customWard,
                      locationName: data?.location || 'Inspection Spot',
                      lat: data?.lat || 16.8524,
                      lng: data?.lng || 74.6050,
                      advertiser: stages?.ocr?.entities?.advertiser || 'Proprietor',
                      contactNumber: stages?.ocr?.entities?.phoneNumbers?.[0] || '+91 98221 44550',
                      dimensions: stages?.localization?.dimensionsEst || '10x10 ft',
                      ocrText: stages?.ocr?.extractedRawText || 'Unreadable text',
                      fineAmount: stages?.compliance?.penaltyProposed || 15000,
                      imageUrl: customPreviewUrl || data?.image || presets[0]?.image
                    };
                    setSelectedHoardingForNotice(noticeItem);
                    setActiveTab('notice');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t.generateNoticeBtn || 'Generate Legal Notice'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Stage Details Breakdown */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-100 pb-2">
              Inspection Telemetry Details
            </h3>

            {/* Stage 1 */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                <span>{t.stage1Name || '1. Mobile Mapping Data'}</span>
                <span className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">RTK-GNSS</span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium">
                {stages?.mobileMapping?.sensor || 'Awaiting telemetry...'}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Accuracy: {stages?.mobileMapping?.gnssAccuracy || '-'}</span>
                <span>Speed: {stages?.mobileMapping?.vehicleSpeed || '-'}</span>
              </div>
            </div>

            {/* Stage 2 & 3 */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>{t.stage2Name || '2. CNN'} & {t.stage3Name || '3. LiDAR'}</span>
                <span className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">YOLOv8</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-700 pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">Model:</span>
                  <span className="font-bold truncate block">YOLOv8x-Hoarding</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">Dimensions:</span>
                  <span className="font-bold block">{stages?.localization?.dimensionsEst || '-'}</span>
                </div>
              </div>
            </div>

            {/* Stage 5 OCR */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-purple-700">
                <span>{t.stage5Name || '5. Optical Character Rec'}</span>
                <span className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">OCR</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-700 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Advertiser:</span>
                  <span className="font-bold text-slate-900">{stages?.ocr?.entities?.advertiser || 'Not identified'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Contact:</span>
                  <span className="font-bold text-blue-600">{stages?.ocr?.entities?.phoneNumbers?.join(', ') || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">Municipal QR Tag:</span>
                  <span className={`font-bold ${stages?.ocr?.entities?.qrCodeFound ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stages?.ocr?.entities?.qrCodeFound ? 'Found & Verified' : 'MISSING (Unregistered)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 6 & 7 Administrative */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-orange-700">
                <span>{t.stage7Name || '7. Administrative'}</span>
                <span className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">Admin</span>
              </div>
              <div className="text-[11px] text-slate-700 space-y-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Notice Type:</span>
                  <span className="font-bold text-slate-900">{stages?.action?.noticeType || '-'}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">Assigned Squad:</span>
                  <span className="font-bold text-orange-700">{stages?.action?.assignedSquad || '-'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
