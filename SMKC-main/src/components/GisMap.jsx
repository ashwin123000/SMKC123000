import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Layers, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Flame, 
  FileText, 
  Sparkles, 
  ExternalLink,
  X
} from 'lucide-react';

export default function GisMap({ hoardings, setActiveTab, setSelectedHoardingForNotice, t, lang }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedHoarding, setSelectedHoarding] = useState(null);
  const [mapTileType, setMapTileType] = useState('hybrid');
  const tileLayerRef = useRef(null);

  const filteredHoardings = hoardings.filter(h => {
    const matchesCity = selectedCity === 'all' || h.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || h.status === selectedStatus;
    return matchesCity && matchesStatus;
  });

  const updateTileLayer = (map, tileType) => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    let newLayer;
    if (tileType === 'google') {
      newLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Maps &copy; Sangli Miraj Kupwad Municipal Corporation',
        maxZoom: 20,
      });
    } else {
      newLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Satellite &copy; SMKC GIS',
        maxZoom: 20,
      });
    }
    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.8524, 74.6050],
        zoom: 13,
        zoomControl: true,
      });

      updateTileLayer(map, mapTileType);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 300);
    } else {
      updateTileLayer(mapInstanceRef.current, mapTileType);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [mapTileType]);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const bounds = [];

    filteredHoardings.forEach(item => {
      if (!item.lat || !item.lng) return;

      const latLng = [item.lat, item.lng];
      bounds.push(latLng);

      let markerBg = '#ef4444';
      let pulseAnim = '';
      if (item.status === 'permitted') markerBg = '#10b981';
      else if (item.status === 'expired') markerBg = '#f59e0b';
      else if (item.status === 'critical_hazard') {
        markerBg = '#dc2626';
        pulseAnim = 'animate-ping';
      }

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            ${item.status === 'critical_hazard' ? `<span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: ${markerBg}; opacity: 0.75;" class="${pulseAnim}"></span>` : ''}
            <div style="width: 22px; height: 22px; border-radius: 50%; background: ${markerBg}; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
              ${item.status === 'permitted' ? '✓' : '!'}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker(latLng, { icon: customIcon });

      marker.on('click', () => {
        setSelectedHoarding(item);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; min-width: 200px;">
          <strong style="display: block; font-size: 13px; margin-bottom: 2px;">${item.title[lang] || item.title?.en || 'Hoarding'}</strong>
          <span style="color: #64748b; font-size: 11px;">${item.locationName} (${item.ward})</span>
          <div style="margin-top: 6px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 700; color: ${markerBg}; text-transform: uppercase; font-size: 10px;">${item.status}</span>
            <span style="font-weight: 600;">₹${item.fineAmount > 0 ? item.fineAmount.toLocaleString('en-IN') : '0'}</span>
          </div>
        </div>
      `);

      markersLayerRef.current.addLayer(marker);
    });

    if (bounds.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [filteredHoardings, lang]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Filter Controls */}
      <div className="card p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>SMKC Geo-Spatial Ward Intelligence System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t.mapTitle || 'Full GIS View'}
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              {t.mapSubtitle || 'Live tracking of all municipal hoarding points'}
            </p>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded border border-slate-200 flex items-center gap-2">
            <span>{t.totalOnMap || 'Showing Locations:'}</span>
            <span className="font-bold text-blue-700 text-sm">
              {filteredHoardings.length}
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 text-sm">
          
          {/* Map Layer Switcher */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Layer:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setMapTileType('hybrid')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  mapTileType === 'hybrid'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🛰️ Satellite
              </button>
              <button
                onClick={() => setMapTileType('google')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  mapTileType === 'google'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🗺️ Street Map
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">{t.filterStatus || 'Status:'}</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              {[
                { id: 'all', label: t.filterAll || 'All' },
                { id: 'illegal', label: t.statusIllegal || 'Illegal' },
                { id: 'critical_hazard', label: t.statusCriticalHazard || 'Hazard' },
                { id: 'expired', label: t.statusExpired || 'Expired' },
                { id: 'permitted', label: t.statusPermitted || 'Permitted' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    selectedStatus === s.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Map + Detail Side Sheet */}
      <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50 min-h-[580px]">
        {/* Leaflet DOM container */}
        <div ref={mapContainerRef} className="w-full h-[580px] z-10" />

        {/* Legend Overlay Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur p-4 rounded-lg border border-slate-200 shadow-lg text-sm space-y-3 pointer-events-auto">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block border-b border-slate-100 pb-2">
            GIS Map Legend
          </span>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-sm" />
              <span className="text-slate-700 font-medium">{t.statusIllegal || 'Illegal'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm animate-pulse" />
              <span className="text-slate-700 font-medium">{t.statusCriticalHazard || 'Critical Hazard'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
              <span className="text-slate-700 font-medium">{t.statusExpired || 'Expired'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
              <span className="text-slate-700 font-medium">{t.statusPermitted || 'Permitted'}</span>
            </div>
          </div>
        </div>

        {/* Selected Hoarding Inspection Drawer */}
        {selectedHoarding && (
          <div className="absolute top-4 right-4 z-20 w-80 sm:w-96 max-h-[530px] overflow-y-auto bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 shadow-xl p-5 text-sm space-y-4 pointer-events-auto scrollbar-thin">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  {selectedHoarding.id} • {selectedHoarding.city}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-2 leading-snug">
                  {selectedHoarding.title?.[lang] || selectedHoarding.title?.en || 'Location Info'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHoarding(null)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail */}
            <div className="relative h-40 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              {selectedHoarding.imageUrl ? (
                <img 
                  src={selectedHoarding.imageUrl} 
                  alt="Hoarding"
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-mono shadow-sm">
                {selectedHoarding.dimensions}
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-slate-600 text-xs bg-slate-50 p-3 rounded border border-slate-100">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Location:</span>
                <span className="font-semibold text-slate-900 text-right max-w-[200px] truncate">{selectedHoarding.locationName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Ward:</span>
                <span className="font-semibold text-slate-900">{selectedHoarding.ward}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Advertiser:</span>
                <span className="font-semibold text-slate-900">{selectedHoarding.advertiser}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Contact:</span>
                <span className="font-semibold text-blue-600">{selectedHoarding.contactNumber}</span>
              </div>
              {selectedHoarding.fineAmount > 0 && (
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-medium">Proposed Fine:</span>
                  <span className="font-bold text-amber-600 text-sm">
                    ₹{selectedHoarding.fineAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Violations */}
            {selectedHoarding.violationReasons?.length > 0 && (
              <div className="bg-red-50 border border-red-100 p-3 rounded space-y-1.5 text-red-700">
                <span className="font-bold text-[10px] uppercase tracking-wider block text-red-800">
                  Violations
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {selectedHoarding.violationReasons.map((v, idx) => (
                    <li key={idx} className="leading-tight">{v}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Drawer Actions */}
            <div className="pt-2 flex items-center gap-2">
              {selectedHoarding.status !== 'permitted' && (
                <button
                  onClick={() => {
                    setSelectedHoardingForNotice(selectedHoarding);
                    setActiveTab('notice');
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all text-xs shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t.generateNoticeBtn || 'Generate Notice'}</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab('scanner')}
                className="px-4 py-2.5 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition-all shadow-sm"
                title="Inspect in Smart Scanner"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
