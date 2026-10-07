import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Truck,
  MapPin,
  ShieldAlert,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Globe,
  ChevronDown,
  Clock,
  X,
  Menu,
  Search
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  t,
  onOpenScannerModal,
  searchQuery,
  setSearchQuery
}) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getFormattedDateTime = (d, l) => {
    try {
      const locale = l === 'mr' ? 'mr-IN' : l === 'hi' ? 'hi-IN' : 'en-IN';
      const date = d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
      const time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });
      return { date, time };
    } catch {
      return { date: d.toDateString(), time: d.toLocaleTimeString() };
    }
  };

  const { date: fmtDate, time: fmtTime } = getFormattedDateTime(currentDateTime, lang);

  const navItems = [
    { id: 'dashboard', label: lang === 'mr' ? 'डॅशबोर्ड' : 'Dashboard',          icon: LayoutDashboard },
    { id: 'citizen',   label: lang === 'mr' ? 'नागरिक तक्रारी' : 'Citizen Reports',    icon: MessageSquareWarning },
    { id: 'scanner',   label: lang === 'mr' ? 'ट्रक तपासणी' : 'Truck Detects',    icon: Truck },
    { id: 'map',       label: lang === 'mr' ? 'नकाशा दृश्य' : 'Map View',          icon: MapPin },
    { id: 'notice',    label: lang === 'mr' ? 'अंमलबजावणी' : 'Enforcement',        icon: ShieldAlert },
    { id: 'registry',  label: lang === 'mr' ? 'अहवाल' : 'Reports',                 icon: BarChart3 },
  ];

  const sidebarContent = (
    <>
      {/* Logo/Brand */}
      <div
        onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
        className="cursor-pointer select-none"
        style={{ padding: '20px 16px 16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 8,
            background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
          }}>
            <img
              src="/smkc_logo.png"
              alt="SMKC"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span style="font-size:18px;font-weight:800;color:#1A2A4A">S</span>';
              }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'white', letterSpacing: '-0.3px', lineHeight: 1.2 }}>SMKC</div>
            <div style={{ fontSize: 10, color: '#93C5FD', lineHeight: 1.3, maxWidth: 150 }}>
              Sangli · Miraj · Kupwad<br />Municipal Corporation
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 14,
          padding: '8px 10px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 6,
          borderLeft: '3px solid #3B82F6',
        }}>
          <div style={{ fontSize: 10, color: '#93C5FD', fontWeight: 500, marginBottom: 1 }}>SYSTEM</div>
          <div style={{ fontSize: 11, color: 'white', fontWeight: 600, lineHeight: 1.35 }}>
            Illegal Hoarding &amp; Encroachment<br />Monitoring System
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 12px 8px' }} />

      {/* Nav Items */}
      <nav style={{ padding: '0 8px', flex: 1 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', background: isActive ? '#2A4A8A' : 'transparent', marginBottom: 2 }}
            >
              <Icon size={17} style={{ flexShrink: 0, color: isActive ? '#93C5FD' : '#8BA8D4' }} />
              <span>{item.label}</span>
              {isActive && (
                <span style={{
                  marginLeft: 'auto',
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: '#60A5FA',
                  flexShrink: 0
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: Language Switcher + Live Clock */}
      <div style={{ padding: '12px 12px 16px' }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 12 }} />

        {/* Language Switcher */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#8BA8D4', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Globe size={10} style={{ display: 'inline', marginRight: 4 }} />
            Language
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['mr', 'मराठी'], ['hi', 'हिंदी'], ['en', 'EN']].map(([code, label]) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                style={{
                  flex: 1,
                  padding: '4px 0',
                  borderRadius: 4,
                  border: 'none',
                  background: lang === code ? '#2C5AAE' : 'rgba(255,255,255,0.08)',
                  color: lang === code ? 'white' : '#93C5FD',
                  fontSize: 11,
                  fontWeight: lang === code ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  fontFamily: 'inherit'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Clock */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 6,
          padding: '8px 10px',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Clock size={13} style={{ color: '#60A5FA', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{fmtTime}</div>
            <div style={{ fontSize: 10, color: '#8BA8D4' }}>{fmtDate}</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ---- DESKTOP SIDEBAR (fixed left) ---- */}
      <aside
        className="no-print"
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: 224,
          background: '#1A2A4A',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
        }}
        // Hide below lg via inline media handled in App wrapper
        id="smkc-sidebar-desktop"
      >
        {sidebarContent}
      </aside>

      {/* ---- MOBILE SIDEBAR OVERLAY ---- */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            style={{
              position: 'absolute',
              top: 0, left: 0, bottom: 0,
              width: 240,
              background: '#1A2A4A',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: 6,
                color: 'white', padding: '4px 6px', cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ---- TOP HEADER ---- */}
      <header
        className="no-print"
        style={{
          position: 'fixed',
          top: 0,
          left: 224,
          right: 0,
          height: 56,
          background: 'white',
          borderBottom: '1px solid #E2E8F0',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px 0 20px',
          boxShadow: '0 1px 4px rgba(15,32,68,0.07)',
        }}
        id="smkc-header"
      >
        {/* Left: Mobile menu + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: 'none',
              color: '#4A5568', cursor: 'pointer',
              padding: '4px', borderRadius: 4,
              display: 'none',
            }}
            id="mobile-menu-btn"
            className="mobile-only"
          >
            <Menu size={20} />
          </button>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0F2044', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Illegal Hoarding &amp; Encroachment Monitoring System
            </div>
            <div style={{ fontSize: 11, color: '#718096', lineHeight: 1 }}>
              Administrative Control Room &nbsp;|&nbsp; Officer Dashboard
            </div>
          </div>
        </div>

        {/* Right: Search, Bell, Profile, Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

          {/* Search (desktop) */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#F7FAFC', border: '1px solid #E2E8F0',
              borderRadius: 6, padding: '5px 10px',
              width: 200,
            }}
            className="header-search"
          >
            <Search size={14} style={{ color: '#A0AEC0', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={e => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search cases, locations..."
              style={{
                background: 'none', border: 'none',
                fontSize: 12, color: '#4A5568',
                width: '100%', fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              style={{
                background: '#F7FAFC', border: '1px solid #E2E8F0',
                borderRadius: 6, padding: '6px 8px',
                cursor: 'pointer', position: 'relative',
                display: 'flex', alignItems: 'center'
              }}
            >
              <Bell size={16} style={{ color: '#4A5568' }} />
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 7, height: 7, borderRadius: '50%',
                background: '#DC2626', border: '1.5px solid white'
              }} />
            </button>

            {notifOpen && (
              <div style={{
                position: 'absolute', top: 40, right: 0,
                width: 280, background: 'white',
                border: '1px solid #E2E8F0', borderRadius: 8,
                boxShadow: '0 8px 24px rgba(15,32,68,0.12)',
                zIndex: 300, overflow: 'hidden'
              }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid #F0F4F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 12, color: '#0F2044' }}>Notifications</span>
                  <span style={{ fontSize: 10, color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>Mark all read</span>
                </div>
                {[
                  { msg: 'New complaint: Vishrambag Main Chowk', time: '11:24 AM', dot: '#DC2626' },
                  { msg: 'Notice issued: Gandhi Chowk, Miraj', time: '10:15 AM', dot: '#059669' },
                  { msg: 'Reinspection due: Station Road case', time: 'Yesterday', dot: '#D97706' },
                ].map((n, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid #F7FAFC', display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F7FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.dot, marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, color: '#0F2044', lineHeight: 1.4 }}>{n.msg}</div>
                      <div style={{ fontSize: 11, color: '#A0AEC0', marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Officer Profile */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#F7FAFC', border: '1px solid #E2E8F0',
                borderRadius: 6, padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#1A2A4A',
                color: 'white', fontWeight: 700,
                fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                SK
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F2044', lineHeight: 1.2 }}>Municipal Officer</div>
                <div style={{ fontSize: 10, color: '#718096', lineHeight: 1 }}>Administrative access</div>
              </div>
              <ChevronDown size={13} style={{ color: '#A0AEC0', marginLeft: 2 }} />
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute', top: 44, right: 0,
                width: 200, background: 'white',
                border: '1px solid #E2E8F0', borderRadius: 8,
                boxShadow: '0 8px 24px rgba(15,32,68,0.12)',
                zIndex: 300, overflow: 'hidden'
              }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #F0F4F8' }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#0F2044' }}>Municipal Officer</div>
                  <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>Restricted municipal account</div>
                </div>
                <div
                  style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#DC2626', fontSize: 13, fontWeight: 500 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <LogOut size={14} />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Click outside dropdowns */}
      {(notifOpen || profileOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 250 }}
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }}
        />
      )}

      {/* Global mobile styles */}
      <style>{`
        @media (max-width: 1023px) {
          #smkc-sidebar-desktop { display: none !important; }
          #smkc-header { left: 0 !important; }
          #mobile-menu-btn { display: flex !important; }
          .header-search { display: none !important; }
          #smkc-main-layout { margin-left: 0 !important; }
        }
        @media (max-width: 640px) {
          .header-search { display: none !important; }
        }
      `}</style>
    </>
  );
}
