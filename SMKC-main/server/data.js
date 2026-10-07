// SMKC Hoardings & Banners Data Store for Sangli Miraj Kupwad Municipal Corporation

export const initialHoardings = [
  {
    id: 'SMKC-HD-101',
    title: {
      en: 'Political Birthday Flex on Traffic Island',
      mr: 'ट्रॅफिक आयलंडवरील अनधिकृत वाढदिवस बॅनर',
      hi: 'ट्रैफिक चौराहे पर अवैध जन्मदिन का बैनर'
    },
    city: 'Sangli',
    ward: 'Prabhag 03 - Vishrambag',
    locationName: 'Vishrambag Chowk near Ganpati Mandir Road',
    lat: 16.8455,
    lng: 74.6015,
    status: 'illegal', // illegal | permitted | expired | critical_hazard
    classification: 'Political Flex',
    dimensions: '18 x 12 ft',
    areaSqFt: 216,
    clearanceHeight: '8 ft (Min req: 15 ft)',
    confidence: 0.96,
    advertiser: 'Sangli Yuva Manch / Mahesh Patil',
    contactNumber: '+91 98221 44550',
    permitNumber: null,
    issueDate: '2026-09-28',
    expiryDate: null,
    detectedDate: '2026-10-02',
    ocrText: 'आमचे मार्गदर्शक व लाडके नेते मा. नामदार साहेब यांना वाढदिवसाच्या लाख लाख शुभेच्छा! शुभेच्छुक: सांगली युवा मंच. संपर्क: ९८२२१ ४४५५०',
    detectedLanguage: 'mr',
    violationReasons: [
      'No SMKC Advertisement License Tag or QR Code',
      'Obstructing traffic signal visibility',
      'Violates Bombay High Court PIL 155/2011 on Public Space Encroachment',
      'Under Section 244 of Maharashtra Municipal Corporation Act 1949'
    ],
    fineAmount: 15000,
    noticeStatus: 'Issued - 24hr Demolition Notice',
    enforcementSquad: 'SMKC Sangli Squad 01',
    imageUrl: '/assets/birthday.jpg',
    bbox: { x: 18, y: 15, width: 62, height: 55 }
  },
  {
    id: 'SMKC-HD-102',
    title: {
      en: 'Commercial Gold Festival Billboard - License Expired',
      mr: 'कमर्शियल ज्वेलरी होर्डिंग - परवाना मुदत संपलेली',
      hi: 'कमर्शियल आभूषण होर्डिंग - लाइसेंस समाप्त'
    },
    city: 'Miraj',
    ward: 'Prabhag 07 - Station Road',
    locationName: 'Miraj Railway Station Main Road',
    lat: 16.8272,
    lng: 74.6469,
    status: 'expired',
    classification: 'Commercial Unipole',
    dimensions: '20 x 10 ft',
    areaSqFt: 200,
    clearanceHeight: '16 ft',
    confidence: 0.98,
    advertiser: 'Ratna Jewellers Miraj',
    contactNumber: '+91 94230 11223',
    permitNumber: 'SMKC-ADV-2024-MRJ-098',
    issueDate: '2024-04-01',
    expiryDate: '2025-03-31',
    detectedDate: '2026-09-15',
    ocrText: 'रत्न ज्वेलर्स मिरज - भव्य दसरा-दिवाळी सुवर्ण महोत्सव! मजुरीवर ५०% सूट. स्टेशन रोड, मिरज. परवाना क्र. SMKC-ADV-2024-MRJ-098',
    detectedLanguage: 'mr',
    violationReasons: [
      'License expired on 31-Mar-2025 (Unpaid municipal advertising tax ₹32,000)',
      'Renewal application not filed within grace period'
    ],
    fineAmount: 8500,
    noticeStatus: 'Final Recovery Notice Sent',
    enforcementSquad: 'SMKC Miraj Squad 02',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    bbox: { x: 25, y: 10, width: 50, height: 60 }
  },
  {
    id: 'SMKC-HD-103',
    title: {
      en: 'Licensed Industrial Unipole - Fully Compliant',
      mr: 'अधिकृत औद्योगिक युनिपोल - नियमांनुसार वैध',
      hi: 'अधिकृत औद्योगिक यूनिपोल - पूर्णतः वैध'
    },
    city: 'Kupwad',
    ward: 'Prabhag 11 - Kupwad MIDC',
    locationName: 'Kupwad MIDC Main Toll Road',
    lat: 16.8778,
    lng: 74.6111,
    status: 'permitted',
    classification: 'Commercial Unipole',
    dimensions: '30 x 15 ft',
    areaSqFt: 450,
    clearanceHeight: '22 ft',
    confidence: 0.99,
    advertiser: 'Mahalaxmi Engineering & Steel Ltd',
    contactNumber: '+91 233 2644200',
    permitNumber: 'SMKC-ADV-2026-KPW-412',
    issueDate: '2026-01-10',
    expiryDate: '2027-01-09',
    detectedDate: '2026-08-20',
    ocrText: 'MAHALAXMI HEAVY FABRICATION & STEEL - Kupwad MIDC. Authorized SMKC Permit: SMKC-ADV-2026-KPW-412. QR Code Verified.',
    detectedLanguage: 'en',
    violationReasons: [],
    fineAmount: 0,
    noticeStatus: 'Verified & Approved',
    enforcementSquad: 'None',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=800&auto=format&fit=crop&q=80',
    bbox: { x: 15, y: 20, width: 70, height: 45 }
  },
  {
    id: 'SMKC-HD-104',
    title: {
      en: 'Coaching Class Banner in Hospital Silence Zone',
      mr: 'रुग्णालय शांतता क्षेत्रातील अनधिकृत क्लासेस बॅनर',
      hi: 'अस्पताल साइलेंस जोन में अनधिकृत कोचिंग बैनर'
    },
    city: 'Sangli',
    ward: 'Prabhag 02 - Civil Hospital',
    locationName: 'Government Civil Hospital Chowk',
    lat: 16.8505,
    lng: 74.5880,
    status: 'critical_hazard',
    classification: 'Educational Flex',
    dimensions: '14 x 8 ft',
    areaSqFt: 112,
    clearanceHeight: '7 ft',
    confidence: 0.94,
    advertiser: 'Apex Science & Medical Academy',
    contactNumber: '+91 94238 99881',
    permitNumber: null,
    issueDate: null,
    expiryDate: null,
    detectedDate: '2026-10-04',
    ocrText: 'APEX MEDICAL ACADEMY NEET / JEE 2026 BATCH. 100% Guaranteed Results! Admissions Open. Call: 94238 99881',
    detectedLanguage: 'en',
    violationReasons: [
      'Placed inside 100-meter prohibited Silence Zone of Sangli Civil Hospital',
      'No SMKC advertising permit',
      'Pedestrian footway obstructed'
    ],
    fineAmount: 20000,
    noticeStatus: 'Urgent Demolition Order Dispatched',
    enforcementSquad: 'SMKC Flying Squad Alpha',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    bbox: { x: 20, y: 25, width: 58, height: 50 }
  },
  {
    id: 'SMKC-HD-105',
    title: {
      en: 'Dangerous Flex Tied to High Voltage Electric Pole',
      mr: 'हाय-व्होल्टेज वीज खांबाला बांधलेला धोकादायक बॅनर',
      hi: 'हाई-वोल्टेज बिजली के खंभे पर बंधा खतरनाक बैनर'
    },
    city: 'Miraj',
    ward: 'Prabhag 08 - Gandhi Chowk',
    locationName: 'Gandhi Chowk near Bus Stand',
    lat: 16.8295,
    lng: 74.6495,
    status: 'critical_hazard',
    classification: 'Event Banner',
    dimensions: '16 x 6 ft',
    areaSqFt: 96,
    clearanceHeight: '9 ft',
    confidence: 0.95,
    advertiser: 'Miraj Utsav Samiti',
    contactNumber: '+91 91580 33441',
    permitNumber: null,
    issueDate: null,
    expiryDate: null,
    detectedDate: '2026-10-03',
    ocrText: 'भव्य निकाली कुस्ती व महादंगल! ऐतिहासिक मिरज मैदान. प्रथम बक्षीस रोख ₹१,००,०००. आयोजक: मिरज उत्सव समिती',
    detectedLanguage: 'mr',
    violationReasons: [
      'Tied directly onto 11kV electrical distribution pole (Severe fire and electrocution risk)',
      'Zero municipal permission or structural safety certification',
      'No indemnity insurance filed'
    ],
    fineAmount: 25000,
    noticeStatus: 'Immediate MSEDCL + SMKC joint removal scheduled',
    enforcementSquad: 'SMKC Miraj Rapid Response',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80',
    bbox: { x: 22, y: 18, width: 56, height: 48 }
  },
  {
    id: 'SMKC-HD-106',
    title: {
      en: 'Authorized Healthcare Public Awareness Gantry',
      mr: 'अधिकृत आरोग्य जनजागृती गॅन्ट्री - सांगली मिरज रोड',
      hi: 'अधिकृत स्वास्थ्य जागरूकता गैन्ट्री - सांगली मिरज रोड'
    },
    city: 'Sangli',
    ward: 'Prabhag 05 - Sangli-Miraj Link Road',
    locationName: 'Sangli-Miraj 100ft Road Junction',
    lat: 16.8390,
    lng: 74.6210,
    status: 'permitted',
    classification: 'Civic Awareness Gantry',
    dimensions: '40 x 8 ft',
    areaSqFt: 320,
    clearanceHeight: '20 ft',
    confidence: 0.99,
    advertiser: 'SMKC Health Dept & Bharati Hospital',
    contactNumber: '0233-2212345',
    permitNumber: 'SMKC-GOV-2026-PUB-014',
    issueDate: '2026-02-01',
    expiryDate: '2027-01-31',
    detectedDate: '2026-07-12',
    ocrText: 'सांगली मिरज कुपवाड महानगरपालिका - स्वच्छ सर्वेक्षण २०२६! प्लास्टिक मुक्त शहर, निरोगी शहर. सहकार्य: भारती हॉस्पिटल',
    detectedLanguage: 'mr',
    violationReasons: [],
    fineAmount: 0,
    noticeStatus: 'Exempted Civic Infrastructure',
    enforcementSquad: 'None',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    bbox: { x: 10, y: 15, width: 80, height: 40 }
  }
];

export const scannerPresets = [
  {
    id: 'preset-1',
    name: {
      en: 'Ganpati Chowk, Sangli - Unapproved Political Flex',
      mr: 'गणपती चौक, सांगली - अनधिकृत राजकीय बॅनर',
      hi: 'गणपति चौक, सांगली - अवैध राजनीतिक बैनर'
    },
    city: 'Sangli',
    ward: 'Prabhag 01 - Ganpati Peth',
    location: 'Ganpati Mandir Main Chowk, Sangli',
    lat: 16.8530,
    lng: 74.5820,
    image: '/assets/birthday.jpg',
    stages: {
      mobileMapping: {
        sensor: 'Ladybug 360° Spherical Camera + Velodyne VLP-16 LiDAR',
        gnssAccuracy: '±0.04m (RTK-GNSS)',
        timestamp: '2026-10-05 11:42:18 IST',
        vehicleSpeed: '22 km/h'
      },
      detection: {
        model: 'YOLOv8x-Hoarding-SMKC-v2 (Fine-tuned on 18,400 Indian urban billboards)',
        confidence: 0.972,
        detectedClass: 'billboard_flex',
        bbox: { x: 16, y: 18, width: 66, height: 52 }
      },
      localization: {
        spatial3D: { x: -3.42, y: 14.85, z: 2.80 },
        heightFromGround: '2.4 meters (Violates min 4.5m safety norm)',
        dimensionsEst: '18.2 ft x 11.8 ft (214.7 sq.ft)',
        orientation: 'East-facing (Obstructs right turn visibility)'
      },
      classification: {
        type: 'Political & Congratulatory Flex (राजकीय सत्कार बॅनर)',
        structureType: 'Bamboo & G.I. wire framework on municipal street pole',
        riskLevel: 'HIGH - Traffic Obstruction'
      },
      ocr: {
        engine: 'PaddleOCR + EasyOCR Devanagari Multilingual',
        languagesDetected: ['mr', 'en'],
        extractedRawText: 'सांगली शहराचे लाडके नेते मा. नामदार साहेब यांना वाढदिवसाच्या हार्दिक शुभेच्छा! शुभेच्छुक: सांगली विकास युवा मंच. संपर्क: ९८२२१ ४४५५०, ९४२०० ३३११२. मुद्रक: समर्थ फ्लेक्स सांगली',
        entities: {
          advertiser: 'सांगली विकास युवा मंच (Sangli Vikas Yuva Manch)',
          phoneNumbers: ['+91 98221 44550', '+91 94200 33112'],
          printerName: 'समर्थ फ्लेक्स सांगली (Samarth Flex)',
          qrCodeFound: false,
          permitNumberFound: false
        }
      },
      compliance: {
        isPermitted: false,
        registryMatch: 'NO MATCH in SMKC Central Advertising Registry',
        highCourtViolation: 'Bombay HC Order in PIL 155/2011 (Strict ban on political hoardings on public streets)',
        actSection: 'Section 244 & 245 of Maharashtra Municipal Corporation Act 1949',
        penaltyProposed: 15000
      },
      action: {
        noticeType: 'Instant 24-Hour Removal Notice',
        assignedSquad: 'Sangli Central Demolition Squad 01',
        policeIntimation: 'Sangli City Police Station',
        status: 'Action Initiated'
      }
    }
  },
  {
    id: 'preset-2',
    name: {
      en: 'Miraj Railway Station Road - Expired Commercial Billboard',
      mr: 'मिरज रेल्वे स्टेशन रोड - मुदत संपलेले व्यावसायिक होर्डिंग',
      hi: 'मिरज रेलवे स्टेशन रोड - एक्सपायर्ड व्यावसायिक होर्डिंग'
    },
    city: 'Miraj',
    ward: 'Prabhag 07 - Station Road',
    location: 'Near Miraj Railway Junction, Station Road',
    lat: 16.8272,
    lng: 74.6469,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop&q=80',
    stages: {
      mobileMapping: {
        sensor: 'Ladybug 360° Spherical Camera + Livox LiDAR',
        gnssAccuracy: '±0.03m (RTK-GNSS)',
        timestamp: '2026-10-05 12:15:02 IST',
        vehicleSpeed: '18 km/h'
      },
      detection: {
        model: 'YOLOv8x-Hoarding-SMKC-v2',
        confidence: 0.985,
        detectedClass: 'billboard_unipole',
        bbox: { x: 22, y: 12, width: 56, height: 62 }
      },
      localization: {
        spatial3D: { x: 1.15, y: 18.20, z: 5.40 },
        heightFromGround: '5.2 meters (Compliant clearance)',
        dimensionsEst: '20.0 ft x 10.0 ft (200.0 sq.ft)',
        orientation: 'South-facing Unipole'
      },
      classification: {
        type: 'Commercial Retail / Jewelry (व्यावसायिक जाहिरात)',
        structureType: 'Heavy MS Steel Unipole with lighting',
        riskLevel: 'MEDIUM - Tax Default & Expired Permit'
      },
      ocr: {
        engine: 'PaddleOCR + EasyOCR Devanagari Multilingual',
        languagesDetected: ['mr', 'hi'],
        extractedRawText: 'रत्न ज्वेलर्स मिरज. भव्य दसरा सुवर्ण महोत्सव ५०% सूट मजुरीवर. संपर्क: ०२३३ २२४४५५ / ९४२३० ११२२३. परवाना क्र: SMKC-ADV-2024-MRJ-098',
        entities: {
          advertiser: 'रत्न ज्वेलर्स मिरज (Ratna Jewellers)',
          phoneNumbers: ['+91 94230 11223', '0233-224455'],
          printerName: 'साई प्रिंटर्स मिरज',
          qrCodeFound: true,
          permitNumberFound: true,
          extractedPermitNumber: 'SMKC-ADV-2024-MRJ-098'
        }
      },
      compliance: {
        isPermitted: false,
        registryMatch: 'MATCHED - STATUS: EXPIRED (Expired on 31-03-2025)',
        highCourtViolation: 'Unauthorized display beyond validity without municipal fee payment',
        actSection: 'Section 245 of MMC Act 1949 (Failure to pay advertisement tax)',
        penaltyProposed: 8500
      },
      action: {
        noticeType: 'Commercial Tax Demand & Seizure Notice',
        assignedSquad: 'Miraj Recovery Division',
        policeIntimation: 'N/A (Civil Recovery)',
        status: 'Fine Levied'
      }
    }
  },
  {
    id: 'preset-3',
    name: {
      en: 'Kupwad MIDC Road - Permitted Compliant Unipole',
      mr: 'कुपवाड एमआयडीसी रोड - अधिकृत व वैध युनिपोल',
      hi: 'कुपवाड एमआईडीसी रोड - वैध एवं अधिकृत यूनिपोल'
    },
    city: 'Kupwad',
    ward: 'Prabhag 11 - Kupwad MIDC',
    location: 'Plot D-14, Kupwad Industrial Area, Sangli',
    lat: 16.8778,
    lng: 74.6111,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=900&auto=format&fit=crop&q=80',
    stages: {
      mobileMapping: {
        sensor: 'Ladybug 360° Spherical Camera + Livox LiDAR',
        gnssAccuracy: '±0.02m (RTK-GNSS)',
        timestamp: '2026-10-05 13:05:44 IST',
        vehicleSpeed: '30 km/h'
      },
      detection: {
        model: 'YOLOv8x-Hoarding-SMKC-v2',
        confidence: 0.991,
        detectedClass: 'billboard_unipole',
        bbox: { x: 14, y: 18, width: 72, height: 48 }
      },
      localization: {
        spatial3D: { x: 4.80, y: 22.10, z: 6.80 },
        heightFromGround: '6.5 meters',
        dimensionsEst: '30.0 ft x 15.0 ft (450.0 sq.ft)',
        orientation: 'North-East Unipole'
      },
      classification: {
        type: 'Industrial Corporate Display',
        structureType: 'Engineered Certified Steel Truss',
        riskLevel: 'NONE - FULLY COMPLIANT'
      },
      ocr: {
        engine: 'PaddleOCR + EasyOCR Devanagari Multilingual',
        languagesDetected: ['en'],
        extractedRawText: 'MAHALAXMI HEAVY FABRICATION & STEEL - Kupwad MIDC. Authorized SMKC Permit: SMKC-ADV-2026-KPW-412. QR Code Verified. Valid till 31-12-2026',
        entities: {
          advertiser: 'Mahalaxmi Heavy Fabrication Ltd',
          phoneNumbers: ['0233-2644200'],
          printerName: 'Kupwad Signages',
          qrCodeFound: true,
          permitNumberFound: true,
          extractedPermitNumber: 'SMKC-ADV-2026-KPW-412'
        }
      },
      compliance: {
        isPermitted: true,
        registryMatch: 'MATCHED - STATUS: ACTIVE & PAID (Expires 31-12-2026)',
        highCourtViolation: 'None. Meets all setback, structural stability & safety standards.',
        actSection: 'Complies with Section 244 of MMC Act 1949',
        penaltyProposed: 0
      },
      action: {
        noticeType: 'None - Certificate of Compliance Verified',
        assignedSquad: 'N/A',
        policeIntimation: 'N/A',
        status: 'Compliant'
      }
    }
  }
];

export const citizenComplaints = [
  {
    id: 'CMP-2026-891',
    citizenName: 'Amit Deshmukh',
    citizenPhone: '+91 98230 45678',
    city: 'Sangli',
    ward: 'Prabhag 04 - Rajwada',
    location: 'Rajwada Chowk near Maruti Temple',
    description: 'Huge political flex installed overnight on pedestrian crossing, completely blocking view for school buses.',
    status: 'Pending Verification',
    filedDate: '2026-10-04 15:30',
    assignedOfficer: 'K. S. Shinde (Junior Engineer, Ward 4)'
  },
  {
    id: 'CMP-2026-892',
    citizenName: 'Snehal Kulkarni',
    citizenPhone: '+91 97654 32109',
    city: 'Miraj',
    ward: 'Prabhag 06 - Mission Compound',
    location: 'Wanless Hospital Main Gate Road',
    description: 'Coaching classes banner covering ambulance emergency exit directional signboard.',
    status: 'In Enforcement Queue',
    filedDate: '2026-10-05 09:15',
    assignedOfficer: 'P. V. Patil (Enforcement Inspector, Miraj)'
  }
];

export const pipelinePresets = scannerPresets;

// Citizen Scanned Submissions Store for SMKC Officer Review & Progress Tracking
export const initialScannedSubmissions = [
  {
    id: 'SMKC-SCAN-2026-7841',
    citizenName: 'Rahul Shinde',
    citizenPhone: '+91 98224 55120',
    citizenEmail: 'rahul.shinde@gmail.com',
    city: 'Sangli',
    ward: 'Prabhag 03 - Vishrambag',
    location: 'Vishrambag Main Road near Ganpati Temple',
    notes: 'Large political birthday flex hanging on street light pole, blocking traffic view.',
    imageUrl: '/assets/birthday.jpg',
    scanDate: '2026-10-05T14:22:00.000Z',
    status: 'In Progress', // 'Received', 'Site Inspection Assigned', 'In Progress', 'Notice Issued', 'Resolved & Cleared'
    workProgress: 65,
    progressRemarks: 'Squad 01 dispatched to Vishrambag. 24-hr removal notice issued to organizer.',
    assignedSquad: 'Sangli Enforcement Squad 01',
    assignedOfficer: 'S. K. Mahajan (Ward Officer, Sangli)',
    ruleAnalysis: [
      { ruleNumber: 1, title: 'Location & Geo-Boundary Validity', passed: true, detail: 'Location verified inside SMKC Prabhag 03 (Sangli). GPS accuracy ±0.03m.' },
      { ruleNumber: 2, title: 'Sky-Signs Bye-laws (MMC Act Sec 244)', passed: false, detail: 'NO prior municipal permit found in SMKC central licensing database.' },
      { ruleNumber: 3, title: 'Setback & Right-of-Way (RoW) Clearance', passed: false, detail: 'Ground clearance only 2.4m (<3.5m required). Obstructs pedestrian & vehicle line-of-sight.' },
      { ruleNumber: 4, title: 'Silence & Sensitive Zone Proximity', passed: true, detail: 'Located 350m outside declared silence/hospital zone.' },
      { ruleNumber: 5, title: 'Structural & Wind-Load Safety', passed: false, detail: 'Temporary bamboo & loose wire framework on street light pole. Fall hazard.' },
      { ruleNumber: 6, title: 'Content & Anti-Defacement Audit', passed: false, detail: 'Political flex violating Bombay HC PIL 155/2011 & Defacement of Property Act.' },
      { ruleNumber: 7, title: 'Municipal Tax & Hologram QR Code', passed: false, detail: 'Zero advertisement tax paid. No valid SMKC security QR code tag.' }
    ],
    calculatedFine: 15000,
    overallVerdict: 'Illegal / High Hazard'
  },
  {
    id: 'SMKC-SCAN-2026-7842',
    citizenName: 'Priyanka Kadam',
    citizenPhone: '+91 94220 88714',
    citizenEmail: '',
    city: 'Miraj',
    ward: 'Prabhag 08 - Gandhi Chowk',
    location: 'Gandhi Chowk near Bus Stand',
    notes: 'Commercial banner tied to high-voltage electric transformer pole.',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80',
    scanDate: '2026-10-06T09:10:00.000Z',
    status: 'Notice Issued',
    workProgress: 40,
    progressRemarks: 'Joint inspection with MSEDCL electricity board. Statutory notice pasted on site.',
    assignedSquad: 'Miraj Rapid Response Squad',
    assignedOfficer: 'V. B. Kulkarni (Junior Engineer, Miraj)',
    ruleAnalysis: [
      { ruleNumber: 1, title: 'Location & Geo-Boundary Validity', passed: true, detail: 'Verified within SMKC Miraj municipal jurisdiction.' },
      { ruleNumber: 2, title: 'Sky-Signs Bye-laws (MMC Act Sec 244)', passed: false, detail: 'Unpermitted commercial banner.' },
      { ruleNumber: 3, title: 'Setback & Right-of-Way (RoW) Clearance', passed: false, detail: 'Direct contact with 11kV electrical infrastructure.' },
      { ruleNumber: 4, title: 'Silence & Sensitive Zone Proximity', passed: true, detail: 'Not in silent zone.' },
      { ruleNumber: 5, title: 'Structural & Wind-Load Safety', passed: false, detail: 'Critical hazard - electrocution risk.' },
      { ruleNumber: 6, title: 'Content & Anti-Defacement Audit', passed: true, detail: 'Standard commercial event text.' },
      { ruleNumber: 7, title: 'Municipal Tax & Hologram QR Code', passed: false, detail: 'Unpaid municipal advertisement duty.' }
    ],
    calculatedFine: 25000,
    overallVerdict: 'Critical Hazard - Immediate Action'
  }
];
