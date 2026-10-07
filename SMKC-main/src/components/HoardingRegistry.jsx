import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Flame, 
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function HoardingRegistry({ 
  hoardings, 
  onDeleteHoarding, 
  setActiveTab, 
  setSelectedHoardingForNotice, 
  t, 
  lang 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = hoardings.filter(item => {
    const matchesCity = filterCity === 'all' || item.city.toLowerCase() === filterCity.toLowerCase();
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.advertiser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ocrText && item.ocrText.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCity && matchesStatus && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['ID', 'City', 'Ward', 'Location', 'Status', 'Dimensions', 'Advertiser', 'Contact', 'Fine(INR)', 'Notice_Status'];
    const rows = filtered.map(h => [
      h.id,
      h.city,
      h.ward,
      `"${h.locationName}"`,
      h.status,
      h.dimensions,
      `"${h.advertiser}"`,
      h.contactNumber,
      h.fineAmount,
      `"${h.noticeStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SMKC_Hoardings_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'illegal':
        return (
          <span className="badge badge-high flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" />
            {t.statusIllegal || 'Illegal'}
          </span>
        );
      case 'critical_hazard':
        return (
          <span className="badge badge-high flex items-center gap-1 w-fit bg-red-100 border-red-300 text-red-700 animate-pulse">
            <Flame className="w-3 h-3 text-red-600" />
            {t.statusCriticalHazard || 'Critical Hazard'}
          </span>
        );
      case 'expired':
        return (
          <span className="badge badge-pending flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            {t.statusExpired || 'Expired'}
          </span>
        );
      case 'permitted':
        return (
          <span className="badge badge-closed flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3" />
            {t.statusPermitted || 'Permitted'}
          </span>
        );
      case 'notice_issued':
        return (
          <span className="badge badge-notice flex items-center gap-1 w-fit">
            <FileText className="w-3 h-3" />
            Notice Issued
          </span>
        );
      case 'under_action':
        return (
          <span className="badge badge-action flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" />
            Under Action
          </span>
        );
      default:
        return <span className="badge badge-new">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="card p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>SMKC Master Advertising Database & Compliance Audit</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t.registryTitle || 'Hoarding Registry'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {t.registrySubtitle || 'Manage and view all registered and illegal hoardings'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-sm">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder || 'Search registry...'}
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
            />
          </div>

          {/* City Filter */}
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
          >
            <option value="all">All Cities (सांगली, मिरज, कुपवाड)</option>
            <option value="Sangli">सांगली (Sangli)</option>
            <option value="Miraj">मिरज (Miraj)</option>
            <option value="Kupwad">कुपवाड (Kupwad)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
          >
            <option value="all">All Statuses (सर्व स्थिती)</option>
            <option value="illegal">अनधिकृत (Illegal)</option>
            <option value="critical_hazard">धोकादायक (Critical Hazard)</option>
            <option value="expired">मुदत संपलेले (Expired)</option>
            <option value="permitted">अधिकृत (Permitted)</option>
            <option value="notice_issued">नोटीस दिली (Notice Issued)</option>
            <option value="under_action">कारवाई सुरू (Under Action)</option>
          </select>

        </div>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">{t.colId || 'ID'}</th>
                <th className="p-4">{t.colLocation || 'Location'}</th>
                <th className="p-4">{t.colAdvertiser || 'Advertiser'}</th>
                <th className="p-4">{t.colSize || 'Size'}</th>
                <th className="p-4">{t.colStatus || 'Status'}</th>
                <th className="p-4 text-right">{t.colFine || 'Fine'}</th>
                <th className="p-4 text-center">{t.colAction || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium bg-white">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* ID & City */}
                  <td className="p-4 font-mono font-semibold text-blue-700 whitespace-nowrap">
                    <div>{item.id}</div>
                    <span className="text-[11px] text-slate-500 font-sans">{item.city}</span>
                  </td>

                  {/* Location & Ward */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 truncate max-w-[200px]" title={item.locationName}>{item.locationName}</div>
                    <div className="text-[11px] text-slate-500">{item.ward}</div>
                  </td>

                  {/* Advertiser & Contact */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 truncate max-w-[150px]">{item.advertiser}</div>
                    <div className="text-[11px] text-slate-500">{item.contactNumber}</div>
                  </td>

                  {/* Dimensions */}
                  <td className="p-4 font-mono text-slate-700 whitespace-nowrap text-xs">
                    {item.dimensions}
                    <span className="block text-[10px] text-slate-500 mt-0.5">{item.classification}</span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Fine Amount */}
                  <td className="p-4 text-right font-semibold text-amber-700 font-mono text-xs">
                    {item.fineAmount > 0 ? `₹${item.fineAmount.toLocaleString('en-IN')}` : '-'}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      {item.status !== 'permitted' && (
                        <button
                          onClick={() => {
                            setSelectedHoardingForNotice(item);
                            setActiveTab('notice');
                          }}
                          className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors border border-blue-200"
                          title="Generate Legal Notice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteHoarding(item.id)}
                        className="p-1.5 rounded bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-200"
                        title="Mark Demolished & Remove Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p>No records found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing {filtered.length} of {hoardings.length} total records</span>
          <span className="text-blue-600 font-semibold">SMKC Anti-Defacement Squad Database</span>
        </div>
      </div>
    </div>
  );
}
