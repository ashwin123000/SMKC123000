import express from 'express';
import cors from 'cors';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync } from 'node:fs';
import { initialHoardings, scannerPresets, citizenComplaints, initialScannedSubmissions } from './data.js';

const envFile = new URL('../.env', import.meta.url);
if (existsSync(envFile)) process.loadEnvFile(envFile);

const app = express();
const PORT = process.env.PORT || 5001;
const adminSessions = new Map();
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const secretsMatch = (provided, expected) => {
  if (typeof provided !== 'string' || typeof expected !== 'string') return false;
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(providedHash, expectedHash);
};

const requireAdmin = (req, res, next) => {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  const session = token && adminSessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    if (token) adminSessions.delete(token);
    return res.status(401).json({ error: 'Admin authentication required.' });
  }
  req.adminSession = session;
  next();
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/admin/login', (req, res) => {
  const configuredId = process.env.SMKC_ADMIN_ID;
  const configuredPassword = process.env.SMKC_ADMIN_PASSWORD;
  if (!configuredId || !configuredPassword || configuredId.startsWith('replace-with-') || configuredPassword.startsWith('replace-with-')) {
    return res.status(503).json({ error: 'Admin sign-in is not configured on this server.' });
  }

  const { id, password } = req.body || {};
  if (!secretsMatch(id, configuredId) || !secretsMatch(password, configuredPassword)) {
    return res.status(401).json({ error: 'Unable to sign in. Check your credentials or contact the system administrator.' });
  }

  const token = randomBytes(32).toString('hex');
  const officer = { id: configuredId, name: 'Authorized Officer', role: 'Municipal Officer' };
  adminSessions.set(token, { expiresAt: Date.now() + ADMIN_SESSION_TTL_MS, officer });
  res.json({ token, officer });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  adminSessions.delete(req.get('authorization').replace(/^Bearer\s+/i, ''));
  res.sendStatus(204);
});

// In-memory working state
let hoardings = [...initialHoardings];
let complaints = [...citizenComplaints];
let scannedSubmissions = [...initialScannedSubmissions];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SMKC Drishti-Banner AI & Legal Compliance Engine',
    corporation: 'Sangli Miraj Kupwad Municipal Corporation (SMKC)',
    version: '2026.4.1',
    activeModels: [
      'YOLOv8x-Hoarding-SMKC-v2 (CNN Object Detection)',
      'PaddleOCR + EasyOCR Devanagari Multilingual (Marathi/Hindi/English)',
      'SMKC-GIS-Spatial Compliance Analyzer (MMC Act 1949 Sec 244/245)'
    ],
    timestamp: new Date().toISOString()
  });
});

// Hoardings List with Filtering
app.get('/api/hoardings', (req, res) => {
  const { city, ward, status, search } = req.query;
  let filtered = [...hoardings];

  if (city && city !== 'all') {
    filtered = filtered.filter(h => h.city.toLowerCase() === city.toLowerCase());
  }

  if (ward && ward !== 'all') {
    filtered = filtered.filter(h => h.ward.toLowerCase().includes(ward.toLowerCase()));
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(h => h.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(h =>
      h.locationName.toLowerCase().includes(q) ||
      h.advertiser.toLowerCase().includes(q) ||
      (h.ocrText && h.ocrText.toLowerCase().includes(q)) ||
      h.id.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// Single Hoarding
app.get('/api/hoardings/:id', (req, res) => {
  const item = hoardings.find(h => h.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Hoarding not found' });
  res.json(item);
});

// Add new detected/reported hoarding
app.post('/api/hoardings', (req, res) => {
  const newHoarding = {
    id: `SMKC-HD-${Math.floor(100 + Math.random() * 900)}`,
    title: req.body.title || {
      en: 'Newly Detected Street Banner',
      mr: 'नवीन आढळलेला रस्ता बॅनर',
      hi: 'नया पहचाना गया सड़क बैनर'
    },
    city: req.body.city || 'Sangli',
    ward: req.body.ward || 'Prabhag 01 - Sangli City',
    locationName: req.body.locationName || 'Main Road',
    lat: req.body.lat || 16.8524,
    lng: req.body.lng || 74.5815,
    status: req.body.status || 'illegal',
    classification: req.body.classification || 'Commercial Flex',
    dimensions: req.body.dimensions || '15 x 10 ft',
    areaSqFt: req.body.areaSqFt || 150,
    clearanceHeight: req.body.clearanceHeight || '10 ft',
    confidence: req.body.confidence || 0.95,
    advertiser: req.body.advertiser || 'Unknown Advertiser',
    contactNumber: req.body.contactNumber || 'Not Visible',
    permitNumber: req.body.permitNumber || null,
    issueDate: null,
    expiryDate: null,
    detectedDate: new Date().toISOString().split('T')[0],
    ocrText: req.body.ocrText || '',
    detectedLanguage: req.body.detectedLanguage || 'mr',
    violationReasons: req.body.violationReasons || ['Unregistered Display'],
    fineAmount: req.body.fineAmount || 10000,
    noticeStatus: 'Pending Review',
    enforcementSquad: req.body.enforcementSquad || 'SMKC Rapid Response',
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    bbox: req.body.bbox || { x: 20, y: 20, width: 60, height: 50 }
  };

  hoardings.unshift(newHoarding);
  res.status(201).json(newHoarding);
});

// Update Hoarding Status
app.patch('/api/hoardings/:id/status', (req, res) => {
  const item = hoardings.find(h => h.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Hoarding not found' });

  if (req.body.status) item.status = req.body.status;
  if (req.body.noticeStatus) item.noticeStatus = req.body.noticeStatus;
  if (req.body.enforcementSquad) item.enforcementSquad = req.body.enforcementSquad;

  res.json(item);
});

// Delete Hoarding (when demolished)
app.delete('/api/hoardings/:id', (req, res) => {
  const index = hoardings.findIndex(h => h.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Hoarding not found' });
  const removed = hoardings.splice(index, 1)[0];
  res.json({ message: 'Hoarding removed / demolished successfully', item: removed });
});

// Presets
app.get('/api/presets', (req, res) => {
  res.json(scannerPresets);
});

// Run AI Detection & Compliance Scanner
const handleRunInspection = (req, res) => {
  const { presetId, customImage, customMeta } = req.body;

  if (presetId) {
    const preset = scannerPresets.find(p => p.id === presetId);
    if (preset) {
      return res.json({
        success: true,
        source: 'preset',
        presetId: preset.id,
        name: preset.name,
        city: preset.city,
        ward: preset.ward,
        location: preset.location,
        lat: preset.lat,
        lng: preset.lng,
        image: preset.image,
        stages: preset.stages,
        summary: {
          status: preset.stages.compliance.isPermitted ? 'Permitted' : 'Illegal / Non-compliant',
          confidence: `${(preset.stages.detection.confidence * 100).toFixed(1)}%`,
          penalty: `₹${preset.stages.compliance.penaltyProposed.toLocaleString('en-IN')}`,
          actSection: preset.stages.compliance.actSection
        }
      });
    }
  }

  // Handle custom uploaded image or custom location pipeline simulation
  const detectedTextsMarathi = [
    'भव्य उद्घाटन समारंभ - प्रमुख उपस्थिती मा. आमदार साहेब. संपर्क: ९८२२१ ३३४४५',
    'सोन्याच्या दागिन्यांवर ४०% मजुरी माफी - सांगली सराफ कट्टा. फोन: ९४२०१ ४४७७२',
    'कुपवाड युवा प्रतिष्ठान आयोजित रक्तदान शिबीर व आरोग्य तपासणी'
  ];

  const randomText = detectedTextsMarathi[Math.floor(Math.random() * detectedTextsMarathi.length)];
  const isIllegal = Math.random() > 0.3; // 70% chance illegal in field capture test
  const city = customMeta?.city || 'Sangli';
  const ward = customMeta?.ward || 'Prabhag 03 - Vishrambag';

  const simulatedResult = {
    success: true,
    source: 'custom_upload',
    name: {
      en: `Field Scan - ${city} Street View Frame`,
      mr: `फील्ड स्कॅन - ${city} रस्ता दृश्य फ्रेम`,
      hi: `फील्ड स्कैन - ${city} सड़क दृश्य फ्रेम`
    },
    city,
    ward,
    location: customMeta?.location || `${city} Main Arterial Road`,
    lat: customMeta?.lat || 16.8524 + (Math.random() - 0.5) * 0.04,
    lng: customMeta?.lng || 74.5815 + (Math.random() - 0.5) * 0.04,
    image: customImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900',
    stages: {
      mobileMapping: {
        sensor: 'Ladybug 360° Spherical Camera + Livox LiDAR',
        gnssAccuracy: '±0.03m (RTK-GNSS)',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        vehicleSpeed: '24 km/h'
      },
      detection: {
        model: 'YOLOv8x-Hoarding-SMKC-v2 (Deep CNN)',
        confidence: 0.964,
        detectedClass: 'billboard_flex',
        bbox: { x: 20, y: 15, width: 60, height: 55 }
      },
      localization: {
        spatial3D: { x: -2.15, y: 16.40, z: 3.10 },
        heightFromGround: '2.7 meters (Safety violation)',
        dimensionsEst: '16.5 ft x 10.2 ft (168.3 sq.ft)',
        orientation: 'Road Facing'
      },
      classification: {
        type: isIllegal ? 'Unauthorized Event Flex (अनधिकृत बॅनर)' : 'Standard Commercial Display',
        structureType: 'Temporary Bamboo & Steel Wire Framework',
        riskLevel: isIllegal ? 'HIGH - Obstruction' : 'LOW'
      },
      ocr: {
        engine: 'PaddleOCR + EasyOCR Devanagari Multilingual',
        languagesDetected: ['mr', 'en'],
        extractedRawText: randomText,
        entities: {
          advertiser: 'स्थानिक आयोजक / लोकल फ्लेक्स बोर्ड',
          phoneNumbers: ['+91 98221 33445'],
          printerName: 'सांगली आर्ट्स प्रिंटर्स',
          qrCodeFound: !isIllegal,
          permitNumberFound: !isIllegal
        }
      },
      compliance: {
        isPermitted: !isIllegal,
        registryMatch: isIllegal ? 'NO MATCH in SMKC Central Advertising Registry' : 'MATCHED & VALID',
        highCourtViolation: isIllegal ? 'Bombay High Court PIL 155/2011 compliance failure' : 'None',
        actSection: isIllegal ? 'Section 244 & 245 MMC Act 1949' : 'Complies with MMC Act',
        penaltyProposed: isIllegal ? 12000 : 0
      },
      action: {
        noticeType: isIllegal ? 'Instant Demolition Notice' : 'Certificate Valid',
        assignedSquad: isIllegal ? `${city} Enforcement Squad` : 'None',
        policeIntimation: isIllegal ? `${city} Police Station` : 'N/A',
        status: isIllegal ? 'Action Initiated' : 'Verified'
      }
    },
    summary: {
      status: isIllegal ? 'Illegal / Non-compliant' : 'Permitted',
      confidence: '96.4%',
      penalty: isIllegal ? '₹12,000' : '₹0',
      actSection: isIllegal ? 'Section 244 MMC Act' : 'Section 244 (Compliant)'
    }
  };

  res.json(simulatedResult);
};

app.post('/api/scanner/run', handleRunInspection);
app.post('/api/pipeline/run', handleRunInspection);

// Statistics
app.get('/api/stats', (req, res) => {
  const total = hoardings.length;
  const illegal = hoardings.filter(h => h.status === 'illegal').length;
  const critical = hoardings.filter(h => h.status === 'critical_hazard').length;
  const expired = hoardings.filter(h => h.status === 'expired').length;
  const permitted = hoardings.filter(h => h.status === 'permitted').length;

  const totalFines = hoardings.reduce((sum, h) => sum + (h.fineAmount || 0), 0);
  const totalAreaSqFt = hoardings.reduce((sum, h) => sum + (h.areaSqFt || 0), 0);

  // City breakdown
  const sangliCount = hoardings.filter(h => h.city === 'Sangli').length;
  const mirajCount = hoardings.filter(h => h.city === 'Miraj').length;
  const kupwadCount = hoardings.filter(h => h.city === 'Kupwad').length;

  res.json({
    totalHoardings: total,
    illegalCount: illegal,
    criticalHazardCount: critical,
    expiredCount: expired,
    permittedCount: permitted,
    illegalRatePct: total > 0 ? (((illegal + critical + expired) / total) * 100).toFixed(1) : 0,
    totalFinesLevied: totalFines,
    totalAreaSqFt,
    visualPollutionIndex: '74.2 / 100 (High Alert)',
    cityBreakdown: {
      Sangli: { total: sangliCount, illegal: hoardings.filter(h => h.city === 'Sangli' && h.status !== 'permitted').length },
      Miraj: { total: mirajCount, illegal: hoardings.filter(h => h.city === 'Miraj' && h.status !== 'permitted').length },
      Kupwad: { total: kupwadCount, illegal: hoardings.filter(h => h.city === 'Kupwad' && h.status !== 'permitted').length }
    },
    activeEnforcementSquads: 5,
    pendingNotices: hoardings.filter(h => h.noticeStatus && h.noticeStatus.includes('Notice')).length
  });
});

// Citizen Complaints
app.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

app.post('/api/complaints', (req, res) => {
  const newComplaint = {
    id: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    citizenName: req.body.citizenName || 'Concerned Citizen',
    citizenPhone: req.body.citizenPhone || 'N/A',
    city: req.body.city || 'Sangli',
    ward: req.body.ward || 'Prabhag 01',
    location: req.body.location || 'Reported Location',
    description: req.body.description || 'Illegal hoarding observed',
    imageUrl: req.body.imageUrl || null,
    status: 'Complaint Logged & Dispatched to Ward Officer',
    filedDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    assignedOfficer: 'Assigned to Ward Junior Engineer'
  };

  complaints.unshift(newComplaint);
  res.status(201).json(newComplaint);
});

// Generate Official Legal Demolition & Fine Notice
app.post('/api/notice/generate', (req, res) => {
  const { hoardingId, recipientName, recipientPhone, fineAmount } = req.body;
  const item = hoardings.find(h => h.id === hoardingId) || hoardings[0];

  const notice = {
    noticeNumber: `SMKC/ENF/ADV/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toLocaleDateString('en-GB'),
    authority: 'Sangli Miraj Kupwad City Municipal Corporation (SMKC)',
    department: 'Department of Sky Signs and Advertisement Licensing & Enforcement',
    subject: `Notice for Demolition of Unauthorized Advertising Hoarding / Banner under Section 244 & 245 of Maharashtra Municipal Corporation Act 1949`,
    recipient: {
      name: recipientName || item.advertiser || 'Proprietor / Party Responsible',
      phone: recipientPhone || item.contactNumber || 'Contact On File',
      address: item.locationName + ', ' + item.ward + ', ' + item.city
    },
    hoardingDetails: {
      id: item.id,
      dimensions: item.dimensions,
      location: item.locationName,
      lat: item.lat,
      lng: item.lng,
      ocrDetectedText: item.ocrText,
      photoUrl: item.imageUrl
    },
    legalSections: [
      'Maharashtra Municipal Corporation Act, 1949 - Section 244 (Prohibition of Advertisements without written permission)',
      'Maharashtra Municipal Corporation Act, 1949 - Section 245 (Removal of unauthorized advertisements & recovery of expenses)',
      'Honourable Bombay High Court Order in Public Interest Litigation (PIL) No. 155 of 2011',
      'The Prevention of Defacement of Property Act, 1995'
    ],
    fineDemanded: fineAmount || item.fineAmount || 15000,
    deadlineHours: 24,
    consequence: 'Failure to remove within 24 hours will result in forcible removal by SMKC Demolition Squad, seizure of iron/bamboo materials, registration of FIR under IPC 188 / Defacement Act, and recovery of removal cost with 18% penal interest.',
    signatory: {
      name: 'Dr. S. K. Mahajan, IAS',
      designation: 'Deputy Commissioner (Enforcement & Sky Signs), SMKC',
      office: 'SMKC Headquarters, Ram Mandir Road, Sangli - 416416'
    }
  };

  res.json(notice);
});

// ----------------------------------------------------------------------
// Citizen Scanned Photo Submissions & Officer Work Progress Database Endpoints
// ----------------------------------------------------------------------

// Fetch all scanned submissions
app.get('/api/scans', requireAdmin, (req, res) => {
  res.json(scannedSubmissions);
});

// Save a new scanned photo submission by citizen
app.post('/api/scans', (req, res) => {
  const {
    citizenName,
    citizenPhone,
    citizenEmail,
    city,
    ward,
    location,
    notes,
    imageUrl,
    ruleAnalysis,
    calculatedFine,
    overallVerdict
  } = req.body;

  const newScan = {
    id: `SMKC-SCAN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    citizenName: citizenName || 'Anonymous Citizen',
    citizenPhone: citizenPhone || 'N/A',
    citizenEmail: citizenEmail || '',
    city: city || 'Sangli',
    ward: ward || 'Prabhag 01 - Sangli Central',
    location: location || 'Field Scan Location',
    notes: notes || '',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    scanDate: new Date().toISOString(),
    status: 'Received', // 'Received', 'Site Inspection Assigned', 'In Progress', 'Notice Issued', 'Resolved & Cleared'
    workProgress: 15,
    progressRemarks: 'Citizen scan registered in SMKC Civic Enforcement Database. Awaiting field officer inspection.',
    assignedSquad: `${city || 'Sangli'} Rapid Action Squad`,
    assignedOfficer: 'Assigned to Ward Enforcement Officer',
    ruleAnalysis: ruleAnalysis || [],
    calculatedFine: calculatedFine || 12000,
    overallVerdict: overallVerdict || 'Under Verification'
  };

  scannedSubmissions.unshift(newScan);
  res.status(201).json(newScan);
});

// Municipal Officer updates work progress for a submission
app.patch('/api/scans/:id/progress', requireAdmin, (req, res) => {
  const item = scannedSubmissions.find(s => s.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Scanned submission not found' });
  }

  const { status, workProgress, progressRemarks, assignedSquad, assignedOfficer } = req.body;
  if (status !== undefined) item.status = status;
  if (workProgress !== undefined) item.workProgress = Number(workProgress);
  if (progressRemarks !== undefined) item.progressRemarks = progressRemarks;
  if (assignedSquad !== undefined) item.assignedSquad = assignedSquad;
  if (assignedOfficer !== undefined) item.assignedOfficer = assignedOfficer;
  item.lastUpdated = new Date().toISOString();

  res.json(item);
});

app.listen(PORT, () => {
  console.log(`SMKC Drishti-Banner API Server running on port ${PORT}`);
});
