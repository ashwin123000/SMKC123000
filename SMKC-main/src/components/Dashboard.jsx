import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle,
  ShieldCheck,
  Clock,
  Flame,
  MapPin,
  IndianRupee,
  Truck,
  Activity,
  ChevronRight,
  FileText,
  Search,
  ExternalLink,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  XCircle,
  Layers,
  User,
  Calendar,
  Copy,
  CheckCheck
} from 'lucide-react';

// Status badge helper
function StatusBadge({ status }) {
  const map = {
    illegal:        { label: 'High Priority',        cls: 'badge badge-high'    },
    critical_hazard:{ label: 'Critical Hazard',      cls: 'badge badge-high'    },
    expired:        { label: 'Under Verification',   cls: 'badge badge-pending' },
    permitted:      { label: 'Permitted',             cls: 'badge badge-closed'  },
    notice_issued:  { label: 'Notice Issued',         cls: 'badge badge-notice'  },
    under_action:   { label: 'Under Action',          cls: 'badge badge-action'  },
    closed:         { label: 'Closed',                cls: 'badge badge-closed'  },
  };
  const b = map[status] || { label: status, cls: 'badge badge-new' };
  return <span className={b.cls}>{b.label}</span>;
}

export default function Dashboard({ stats, hoardings, setActiveTab, setSelectedHoardingForNotice, t, lang }) {
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');
  const [mapTileType, setMapTileType] = useState('google');
  const [selectedCase, setSelectedCase] = useState(null);
  const [coordCopied, setCoordCopied] = useState(false);

  const mapContainerRef = useRef(null);
  const detailMapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const detailMapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  const filteredHoardings = hoardings.filter(h => {
    if (selectedCityFilter === 'all') return true;
    return h.city.toLowerCase() === selectedCityFilter.toLowerCase();
  });

  // Set first hoarding as selected by default
  useEffect(() => {
    if (hoardings.length > 0 && !selectedCase) {
      setSelectedCase(hoardings[0]);
    }
  }, [hoardings]);

  // Dashboard map
  const updateTileLayer = (map, tileType) => {
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    const newLayer = L.tileLayer(
      tileType === 'google'
        ? 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
        : 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      { subdomains: ['0','1','2','3'], attribution: '© Google Maps © SMKC', maxZoom: 20 }
    );
    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  };

  const cityCentroids = {
    all:    { center: [16.8524, 74.6050], zoom: 12.5 },
    sangli: { center: [16.8524, 74.5815], zoom: 14   },
    miraj:  { center: [16.8272, 74.6469], zoom: 14   },
    kupwad: { center: [16.8778, 74.6111], zoom: 14   },
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.8524, 74.6050], zoom: 12.5, zoomControl: true, scrollWheelZoom: true
      });
      updateTileLayer(map, mapTileType);
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 300);
    } else {
      updateTileLayer(mapInstanceRef.current, mapTileType);
    }
    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, [mapTileType]);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();
    const bounds = [];

    filteredHoardings.forEach(item => {
      if (!item.lat || !item.lng) return;
      bounds.push([item.lat, item.lng]);
      let pinColor = '#DC2626';
      if (item.status === 'permitted')       pinColor = '#059669';
      else if (item.status === 'expired')    pinColor = '#D97706';
      else if (item.status === 'critical_hazard') pinColor = '#991B1B';

      const icon = L.divIcon({
        className: 'custom-hoarding-pin',
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${pinColor};border:2.5px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:bold;cursor:pointer;">📍</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14]
      });
      const titleText = (item.title && (item.title[lang] || item.title.mr || item.title.en)) || 'Hoarding';
      const marker = L.marker([item.lat, item.lng], { icon });
      marker.bindPopup(`
        <div style="font-size:12px;min-width:200px;color:#0F2044;line-height:1.4;">
          <strong style="color:#DC2626;font-size:12px;display:block;margin-bottom:2px;">${item.locationName}</strong>
          <div style="color:#718096;font-size:11px;margin-bottom:4px;">${titleText} — ${item.ward || item.city}</div>
          ${item.imageUrl ? `<img src="${item.imageUrl}" style="width:100%;height:80px;object-fit:cover;border-radius:5px;margin-bottom:5px;" alt="Preview"/>` : ''}
          <div style="display:flex;justify-content:space-between;border-top:1px solid #E2E8F0;padding-top:4px;">
            <span style="font-weight:600;text-transform:uppercase;color:${pinColor};font-size:10px;">${item.status}</span>
            <span style="font-weight:600;color:#B45309;">₹${(item.fineAmount||0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      `);
      marker.on('click', () => setSelectedCase(item));
      markersLayerRef.current.addLayer(marker);
    });

    if (bounds.length > 0 && selectedCityFilter === 'all') {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14.5 });
    }
  }, [filteredHoardings, lang, selectedCityFilter]);

  // Summary stats
  const summaryCards = [
    { label: 'Total Cases',           value: stats?.totalHoardings || 24,    color: '#2563EB', bg: '#EFF6FF', icon: <ClipboardList size={18} color="#2563EB" /> },
    { label: 'Pending Verification',  value: stats?.illegalCount || 8,       color: '#D97706', bg: '#FFFBEB', icon: <Clock        size={18} color="#D97706" /> },
    { label: 'Notices Issued',        value: stats?.expiredCount || 6,       color: '#059669', bg: '#ECFDF5', icon: <FileText     size={18} color="#059669" /> },
    { label: 'Under Action',          value: stats?.activeEnforcementSquads || 7, color: '#7C3AED', bg: '#EDE9FE', icon: <Truck size={18} color="#7C3AED" /> },
    { label: 'Closed',                value: stats?.permittedCount || 3,     color: '#10B981', bg: '#F0FDF4', icon: <CheckCircle2 size={18} color="#10B981" /> },
  ];

  const caseHistory = [
    { time: '5 Oct 2026, 11:24 AM', event: 'New complaint received', by: 'Citizen',       done: true  },
    { time: '5 Oct 2026, 12:10 PM', event: 'Preliminary review completed', by: 'System', done: true  },
    { time: '6 Oct 2026, 9:30 AM',  event: 'Assigned to Ward Officer',   by: 'Admin',     done: true  },
    { time: '6 Oct 2026, 11:00 AM', event: 'Notice issued',              by: 'Officer',   done: false },
  ];

  const enforcementSteps = [
    { label: 'Notice Issued',         date: '6 Oct 2026',  done: true  },
    { label: 'Compliance Deadline',   date: '13 Oct 2026', done: false },
    { label: 'Reinspection',          date: 'Pending',     done: false },
    { label: 'Action Taken',          date: 'Pending',     done: false },
    { label: 'Case Closure',          date: 'Pending',     done: false },
  ];

  const sc = selectedCase;
  const lat = sc?.lat || 16.8524;
  const lng = sc?.lng || 74.5815;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
    setCoordCopied(true);
    setTimeout(() => setCoordCopied(false), 2000);
  };

  // Section header
  const SectionHeader = ({ title, count, actionLabel, onAction }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#0F2044' }}>{title}</span>
        {count !== undefined && (
          <span style={{ fontSize: 11, fontWeight: 600, background: '#EFF6FF', color: '#2563EB', padding: '1px 8px', borderRadius: 10, border: '1px solid #BFDBFE' }}>
            {count}
          </span>
        )}
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          style={{ fontSize: 11, color: '#2563EB', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
        >
          {actionLabel} <ChevronRight size={11} />
        </button>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fadeIn">

      {/* ========== SUMMARY CARDS ========== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {summaryCards.map((card, i) => (
          <div key={i} style={{
            background: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            padding: '14px 16px',
            boxShadow: '0 1px 3px rgba(15,32,68,0.07)',
            display: 'flex', alignItems: 'flex-start', gap: 12
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8,
              background: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: 11, color: '#718096', marginTop: 3, lineHeight: 1.3 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ========== LEADERSHIP GALLERY ========== */}
      <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 16px', boxShadow: '0 1px 3px rgba(15,32,68,0.07)' }}>
        <SectionHeader title="Municipal Leadership" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {[
            { title: 'महापौर',                name: 'श्री. धीरज सूर्यवंशी',           role: 'प्रथम नागरिक',          img: '/assets/dhiraj.png'  },
            { title: 'उपमहापौर',              name: 'श्री. गजानन मगदूम',              role: 'उपमहापौर',              img: '/assets/gajanan.png' },
            { title: 'महापालिका आयुक्त',     name: 'श्रीम. संजीता मोहपात्रा (IAS)', role: 'प्रशासक व आयुक्त',     img: '/assets/sanjita.png' },
            { title: 'अतिरिक्त आयुक्त-१',   name: 'श्री. राहुल रोकडे',             role: 'प्रशासन',               img: '/assets/rahul.png'   },
            { title: 'अतिरिक्त आयुक्त-२',   name: 'श्री. नीलेश देशमुख',            role: 'अतिक्रमण व आकाशचिन्हे', img: '/assets/nilesh.png'  },
          ].map((lead, idx) => (
            <div key={idx} style={{
              border: '1px solid #E2E8F0',
              borderRadius: 7,
              padding: '10px 8px',
              textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#BFDBFE'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
            >
              <div style={{ width: 56, height: 64, borderRadius: 6, overflow: 'hidden', background: '#F0F4F8', border: '1px solid #E2E8F0' }}>
                <img
                  src={lead.img}
                  alt={lead.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  onError={(e) => {
                    const fn = lead.img.split('/').pop();
                    const tried = parseInt(e.target.dataset.tried || '0', 10);
                    if (tried === 0) { e.target.dataset.tried = '1'; e.target.src = './assets/' + fn; }
                    else { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(lead.name) + '&background=1A2A4A&color=fff&size=120'; }
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#2563EB' }}>{lead.title}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#0F2044', lineHeight: 1.3 }}>{lead.name}</div>
                <div style={{ fontSize: 10, color: '#718096' }}>{lead.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== MAIN 3-COLUMN WORKSPACE ========== */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: 14, alignItems: 'start' }}>

        {/* ---- LEFT: REPORTED CASES ---- */}
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 1px 3px rgba(15,32,68,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#0F2044' }}>Reported Cases</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'sangli', 'miraj', 'kupwad'].map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCityFilter(city)}
                  style={{
                    padding: '2px 7px', borderRadius: 4, border: '1px solid',
                    fontSize: 10, fontWeight: 600, cursor: 'pointer',
                    background: selectedCityFilter === city ? '#1A2A4A' : 'transparent',
                    color:      selectedCityFilter === city ? 'white'   : '#718096',
                    borderColor: selectedCityFilter === city ? '#1A2A4A' : '#E2E8F0',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit'
                  }}
                >
                  {city === 'all' ? 'All' : city.charAt(0).toUpperCase() + city.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ maxHeight: 560, overflowY: 'auto' }}>
            {filteredHoardings.map((item) => {
              const isSelected = sc?.id === item.id;
              const statusColors = {
                illegal:        '#DC2626',
                critical_hazard:'#DC2626',
                expired:        '#D97706',
                permitted:      '#059669',
              };
              const dotColor = statusColors[item.status] || '#6B7280';
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid #F0F4F8',
                    cursor: 'pointer',
                    background: isSelected ? '#EFF6FF' : 'white',
                    borderLeft: isSelected ? '3px solid #2563EB' : '3px solid transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#F7FAFC'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'white'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {/* Thumbnail */}
                    <div style={{ width: 44, height: 44, borderRadius: 5, overflow: 'hidden', background: '#F0F4F8', flexShrink: 0, border: '1px solid #E2E8F0' }}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📋</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F2044', fontFamily: 'monospace' }}>{item.id}</span>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                      </div>
                      <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 600, marginBottom: 2 }}>
                        <StatusBadge status={item.status} />
                      </div>
                      <div style={{ fontSize: 11, color: '#718096', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <MapPin size={10} style={{ color: '#A0AEC0', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.locationName}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#A0AEC0', marginTop: 2 }}>{item.city}</div>
                    </div>
                    <ChevronRight size={13} style={{ color: '#A0AEC0', flexShrink: 0, marginTop: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- CENTER: CASE DETAILS ---- */}
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 1px 3px rgba(15,32,68,0.07)', overflow: 'hidden' }}>
          {sc ? (
            <>
              {/* Case Header */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#0F2044' }}>{sc.id}</span>
                    <StatusBadge status={sc.status} />
                  </div>
                  <div style={{ fontSize: 11, color: '#718096', marginTop: 3 }}>{sc.locationName}, {sc.city}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => { setSelectedHoardingForNotice(sc); setActiveTab('notice'); }}
                    className="btn-danger"
                    style={{ fontSize: 12, padding: '5px 12px' }}
                  >
                    Generate Notice
                  </button>
                </div>
              </div>

              {/* Main photo */}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ borderRadius: 7, overflow: 'hidden', border: '1px solid #E2E8F0', height: 200, background: '#F0F4F8', marginBottom: 12 }}>
                  {sc.imageUrl ? (
                    <img src={sc.imageUrl} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0AEC0', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 40 }}>🖼️</span>
                      <span style={{ fontSize: 12 }}>No evidence photo available</span>
                    </div>
                  )}
                </div>

                {/* Case Information Table */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid #E2E8F0', borderRadius: 7, overflow: 'hidden', marginBottom: 12 }}>
                  {[
                    { label: 'Citizen',        value: sc.advertiser || 'Rahul Shinde'     },
                    { label: 'Location',       value: sc.locationName                    },
                    { label: 'Date & Time',    value: '5 Oct 2026, 11:24 AM'             },
                    { label: 'Source',         value: 'Citizen Report'                   },
                    { label: 'Category',       value: sc.title?.[lang] || sc.title?.en || 'Illegal Hoarding' },
                    { label: 'Est. Size',      value: sc.dimensions || 'Approx. 18ft × 12ft' },
                    { label: 'Preliminary Review', value: 'High Suspicion', highlight: '#DC2626' },
                    { label: 'Fine Levied',    value: sc.fineAmount ? `₹${sc.fineAmount.toLocaleString('en-IN')}` : '—', highlight: '#B45309' },
                  ].map((row, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      borderBottom: i < 6 ? '1px solid #F0F4F8' : 'none',
                      borderRight: i % 2 === 0 ? '1px solid #F0F4F8' : 'none',
                      background: 'white'
                    }}>
                      <div style={{ fontSize: 10, color: '#A0AEC0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 2 }}>{row.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: row.highlight || '#0F2044' }}>{row.value}</div>
                    </div>
                  ))}
                </div>

                {/* Note / Description */}
                {sc.violationReasons?.[0] && (
                  <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#92400E', marginBottom: 3, textTransform: 'uppercase' }}>Officer Note</div>
                    <div style={{ fontSize: 12, color: '#78350F', lineHeight: 1.5 }}>{sc.violationReasons[0]}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    onClick={() => alert('Verification logged.')}
                  >
                    <CheckCircle2 size={13} />
                    Verify
                  </button>
                  <button
                    onClick={() => { setSelectedHoardingForNotice(sc); setActiveTab('notice'); }}
                    className="btn-secondary"
                    style={{ flex: 1, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                  >
                    <FileText size={13} />
                    Generate Notice
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    onClick={() => alert('Assign officer dialog.')}
                  >
                    <User size={13} />
                    Assign Officer
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: '#A0AEC0' }}>
              <ClipboardList size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
              <div style={{ fontSize: 13 }}>Select a case from the left panel</div>
            </div>
          )}
        </div>

        {/* ---- RIGHT: GIS + HISTORY + ENFORCEMENT ---- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Location & GIS */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 1px 3px rgba(15,32,68,0.07)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: '#0F2044', display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={13} color="#2563EB" />
                Location &amp; GIS
              </span>
              <button
                onClick={() => setMapTileType(mapTileType === 'google' ? 'hybrid' : 'google')}
                style={{ fontSize: 10, color: '#2563EB', fontWeight: 600, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 4, padding: '2px 7px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {mapTileType === 'google' ? '🛰️ Satellite' : '🗺️ Street'}
              </button>
            </div>

            {/* Small GIS map for selected case */}
            <div style={{ height: 180, background: '#E8EDF2', position: 'relative' }}>
              {sc?.lat && sc?.lng ? (
                <iframe
                  title="Case Map"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${sc.lat},${sc.lng}&z=16&output=embed&t=m`}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#A0AEC0', fontSize: 12, flexDirection: 'column', gap: 6 }}>
                  <MapPin size={24} style={{ opacity: 0.4 }} />
                  <span>Select a case to view map</span>
                </div>
              )}
              {sc?.lat && (
                <a
                  href={`https://www.google.com/maps?q=${sc.lat},${sc.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    position: 'absolute', bottom: 8, right: 8,
                    background: 'white', border: '1px solid #E2E8F0', borderRadius: 5,
                    padding: '4px 8px', fontSize: 10, color: '#2563EB', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <ExternalLink size={10} /> Open in Google Maps
                </a>
              )}
            </div>

            {sc?.lat && (
              <div style={{ padding: '8px 14px', borderTop: '1px solid #F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#A0AEC0', fontWeight: 600, textTransform: 'uppercase', marginBottom: 1 }}>Coordinates</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#0F2044', fontFamily: 'monospace' }}>
                    {sc.lat.toFixed(4)}° N, {sc.lng.toFixed(4)}° E
                  </div>
                </div>
                <button
                  onClick={handleCopyCoords}
                  style={{ background: '#F0F4F8', border: '1px solid #E2E8F0', borderRadius: 5, padding: '4px 8px', cursor: 'pointer', fontSize: 10, color: '#4A5568', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit', fontWeight: 500 }}
                >
                  {coordCopied ? <><CheckCheck size={11} color="#059669" /> Copied!</> : <><Copy size={11} /> Copy</>}
                </button>
              </div>
            )}
          </div>

          {/* Case History */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 1px 3px rgba(15,32,68,0.07)', padding: '12px 14px' }}>
            <SectionHeader title="Case History" />
            <div style={{ paddingLeft: 4 }}>
              {caseHistory.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${item.done ? 'done' : ''}`}>
                    {item.done ? '✓' : ''}
                  </div>
                  <div style={{ paddingTop: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0F2044', lineHeight: 1.3 }}>{item.event}</div>
                    <div style={{ fontSize: 10, color: '#A0AEC0', marginTop: 2 }}>{item.time} · {item.by}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enforcement Tracking */}
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 1px 3px rgba(15,32,68,0.07)', padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #E2E8F0' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#0F2044' }}>Enforcement Tracking</span>
              <span style={{ fontSize: 10, fontWeight: 600, background: '#ECFDF5', color: '#065F46', padding: '2px 8px', borderRadius: 4, border: '1px solid #A7F3D0' }}>
                Notice Issued
              </span>
            </div>
            <div style={{ paddingLeft: 4 }}>
              {enforcementSteps.map((step, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${step.done ? 'done' : ''}`}>
                    {step.done ? '✓' : ''}
                  </div>
                  <div style={{ paddingTop: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: step.done ? 700 : 500, color: step.done ? '#065F46' : '#4A5568', lineHeight: 1.3 }}>{step.label}</div>
                    <div style={{ fontSize: 10, color: '#A0AEC0', marginTop: 1 }}>{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========== FULL GIS MAP ========== */}
      <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 1px 3px rgba(15,32,68,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0F2044', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={14} color="#2563EB" />
              {t.mapTitle || 'SMKC Tri-City GIS Map — Sangli · Miraj · Kupwad'}
            </div>
            <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>
              Live geo-tagged hoarding locations across the municipal corporation area
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Tile Switcher */}
            <div style={{ display: 'flex', background: '#F0F4F8', borderRadius: 6, padding: 2, border: '1px solid #E2E8F0' }}>
              {[['google','🗺️ Street'],['hybrid','🛰️ Satellite']].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setMapTileType(v)}
                  style={{
                    padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: mapTileType === v ? 700 : 500,
                    background: mapTileType === v ? '#1A2A4A' : 'transparent',
                    color: mapTileType === v ? 'white' : '#4A5568',
                    transition: 'all 0.15s', fontFamily: 'inherit'
                  }}
                >{l}</button>
              ))}
            </div>
            {/* City Filter */}
            <div style={{ display: 'flex', background: '#F0F4F8', borderRadius: 6, padding: 2, border: '1px solid #E2E8F0' }}>
              {[['all', `All (${hoardings.length})`], ['sangli', 'Sangli'], ['miraj', 'Miraj'], ['kupwad', 'Kupwad']].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedCityFilter(id);
                    if (mapInstanceRef.current) {
                      const target = cityCentroids[id] || cityCentroids.all;
                      mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
                    }
                  }}
                  style={{
                    padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: selectedCityFilter === id ? 700 : 500,
                    background: selectedCityFilter === id ? '#1A2A4A' : 'transparent',
                    color: selectedCityFilter === id ? 'white' : '#4A5568',
                    transition: 'all 0.15s', fontFamily: 'inherit'
                  }}
                >{label}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', height: 420 }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 16, right: 16, zIndex: 20,
            background: 'white', border: '1px solid #E2E8F0',
            borderRadius: 7, padding: '10px 12px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F0F4F8', paddingBottom: 5, marginBottom: 7 }}>
              GIS Legend
            </div>
            {[
              { color: '#DC2626', label: 'Illegal / High Priority' },
              { color: '#D97706', label: 'Under Verification'      },
              { color: '#059669', label: 'Permitted / Compliant'   },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, border: '1.5px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#4A5568' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== CITY SUMMARY CARDS ========== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { id: 'sangli', title: 'Sangli', sub: 'Ward Hub', label: 'Ganpati Peth / Vishrambag', detail: 'High Political Flexes Detected', index: '68% Non-Compliant', indexColor: '#DC2626', barColor: '#DC2626', barW: 68 },
          { id: 'miraj',  title: 'Miraj',  sub: 'Junction', label: 'Station Road & Gandhi Chowk', detail: 'Expired Commercial Permits', index: '55% Tax Default', indexColor: '#D97706', barColor: '#D97706', barW: 55 },
          { id: 'kupwad', title: 'Kupwad', sub: 'MIDC Industrial', label: 'MIDC Heavy Corridors', detail: 'Licensed Corporate Unipoles', index: '25% (Mostly Compliant)', indexColor: '#059669', barColor: '#059669', barW: 25 },
        ].map(city => (
          <div
            key={city.id}
            onClick={() => {
              setSelectedCityFilter(city.id);
              if (mapInstanceRef.current) {
                const target = cityCentroids[city.id];
                mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
              }
            }}
            style={{
              background: 'white',
              border: selectedCityFilter === city.id ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
              borderRadius: 8, padding: '14px 16px',
              boxShadow: '0 1px 3px rgba(15,32,68,0.07)',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: city.indexColor, textTransform: 'uppercase', marginBottom: 2 }}>{city.sub}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F2044' }}>{city.title}</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#F0F4F8', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={14} style={{ color: city.indexColor }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#4A5568', marginBottom: 4 }}>{city.label}: <span style={{ fontWeight: 600, color: city.indexColor }}>{city.detail}</span></div>
            <div style={{ background: '#F0F4F8', borderRadius: 4, height: 6, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{ width: `${city.barW}%`, height: '100%', background: city.barColor, borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#A0AEC0' }}>
              <span>Encroachment Index</span>
              <span style={{ fontWeight: 700, color: city.indexColor }}>{city.index}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ========== RESPONSIVE STYLES ========== */}
      <style>{`
        @media (max-width: 1200px) {
          /* 3-col workspace becomes single col */
        }
        @media (max-width: 900px) {
          .smkc-workspace { grid-template-columns: 1fr !important; }
          .smkc-summary-cards { grid-template-columns: repeat(2, 1fr) !important; }
          .smkc-city-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
