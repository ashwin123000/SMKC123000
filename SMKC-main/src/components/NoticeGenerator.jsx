import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Building,
  Scale
} from 'lucide-react';

export default function NoticeGenerator({ 
  hoardings, 
  selectedHoarding, 
  setSelectedHoarding, 
  t, 
  lang 
}) {
  const defaultItem = selectedHoarding || hoardings.find(h => h.status !== 'permitted') || hoardings[0];
  const [activeItem, setActiveItem] = useState(defaultItem);

  const [recipientName, setRecipientName] = useState(activeItem?.advertiser || 'Proprietor / Party President');
  const [recipientPhone, setRecipientPhone] = useState(activeItem?.contactNumber || '+91 98221 44550');
  const [fineAmount, setFineAmount] = useState(activeItem?.fineAmount || 15000);
  const [noticeRef] = useState(`SMKC/ENF/ADV/2026/${Math.floor(10000 + Math.random() * 90000)}`);
  const [currentDate] = useState(new Date().toLocaleDateString('en-GB'));

  const handleSelectHoarding = (id) => {
    const item = hoardings.find(h => h.id === id);
    if (item) {
      setActiveItem(item);
      setRecipientName(item.advertiser || 'Proprietor / Party Representative');
      setRecipientPhone(item.contactNumber || 'Contact On File');
      setFineAmount(item.fineAmount || 15000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold mb-3">
              <Scale className="w-3.5 h-3.5 text-rose-600" />
              <span>Statutory Legal Enforcement Suite • MMC Act 1949 Sec 244/245</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t.noticeTitle || 'Legal Notice Generator'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {t.noticeSubtitle || 'Generate and print official municipal enforcement notices'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printNoticeBtn || 'Print Notice'}</span>
            </button>
          </div>
        </div>

        {/* Hoarding Picker */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-600 font-semibold">{t.generateNoticeFor || 'Generate notice for:'}</span>
          <select
            value={activeItem?.id}
            onChange={(e) => handleSelectHoarding(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
          >
            {hoardings.map(h => (
              <option key={h.id} value={h.id}>
                [{h.id}] {h.city} - {h.locationName} ({h.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Official Legal Notice Document Preview */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-lg shadow-md p-8 sm:p-12 border border-slate-300 font-serif space-y-6 printable-notice">
        
        {/* Emblem & Corporation Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
          <div className="flex items-center justify-center mb-3">
            <img src="/smkc_logo.png" alt="SMKC Emblem" className="w-16 h-16 object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-wide uppercase text-slate-900">
            सांगली मिरज आणि कुपवाड शहर महानगरपालिका
          </h2>
          <h3 className="text-sm font-bold text-slate-700 tracking-wider uppercase">
            SANGLI MIRAJ KUPWAD CITY MUNICIPAL CORPORATION
          </h3>
          <p className="text-xs text-slate-600 font-sans mt-2">
            आकाशचिन्हे व परवाना विभाग (Sky Signs, Advertising & Anti-Defacement Department)
          </p>
          <p className="text-xs text-slate-600 font-sans">
            मुख्यालय: राम मंदिर रोड, सांगली - ४१६४१६ | दूरध्वनी: ०२३३-२२१२३४५
          </p>
        </div>

        {/* Notice Meta Details */}
        <div className="flex justify-between items-start text-xs font-sans border-b border-slate-200 pb-3">
          <div>
            <span className="font-bold text-slate-700">नोटीस जा.क्र. / Notice Ref:</span>{' '}
            <span className="font-mono font-bold text-slate-900">{noticeRef}</span>
          </div>
          <div>
            <span className="font-bold text-slate-700">दिनांक / Date:</span>{' '}
            <span className="font-semibold text-slate-900">{currentDate}</span>
          </div>
        </div>

        {/* Recipient Details */}
        <div className="text-xs font-sans space-y-1 bg-slate-50 p-4 rounded border border-slate-200">
          <span className="font-bold text-slate-900 text-sm block mb-1">प्रति (To):</span>
          <div className="font-bold text-slate-900 text-sm">{recipientName}</div>
          <div className="text-slate-700">संपर्क / Phone: {recipientPhone}</div>
          <div className="text-slate-700">ठिकाण / Location: {activeItem?.locationName}, {activeItem?.ward}, {activeItem?.city}</div>
        </div>

        {/* Subject */}
        <div className="text-sm sm:text-base font-bold bg-amber-50 p-3 rounded border-l-4 border-amber-500 text-slate-900 leading-snug">
          {t.noticeSubject || 'विषय: विनापरवाना अनधिकृत जाहिरात फलक/होर्डिंग उभारल्याबाबत कारणे दाखवा नोटीस (Show Cause Notice for Unauthorized Hoarding).'}
        </div>

        {/* Body Paragraphs with Exact Legal Sections */}
        <div className="text-xs sm:text-sm leading-relaxed text-slate-800 space-y-4 font-sans text-justify">
          <p>
            आपणांस याद्वारे कळविण्यात येते की, सांगली मिरज कुपवाड महानगरपालिका कार्यक्षेत्रात{' '}
            <strong>{activeItem?.locationName} ({activeItem?.ward}, {activeItem?.city})</strong> येथे{' '}
            <strong>"{activeItem?.title[lang] || activeItem?.title?.en || 'Illegal Hoarding'}"</strong> आकाराचा (
            <strong>{activeItem?.dimensions}</strong>) जाहिरात फलक/बॅनर/फ्लेक्स आपल्यामार्फत मनपाच्या विनापरवाना लावल्याचे एआय मोबाइल मॅपिंग सर्व्हेक्षण व तपासणीत निष्पन्न झाले आहे.
          </p>

          <p>
            सदर कृत्य हे <strong>महाराष्ट्र महानगरपालिका अधिनियम, १९४९ च्या कलम २४४ व २४५</strong> तसेच{' '}
            <strong>मा. मुंबई उच्च न्यायालय जनहित याचिका क्र. १५५/२०११</strong> च्या आदेशांचा आणि{' '}
            <strong>महाराष्ट्र मालमत्तेच्या विद्रूपीकरणास प्रतिबंधक कायदा, १९९५</strong> चे उघड उल्लंघन आहे.
          </p>

          {/* Evidence Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-200">
            <div className="space-y-1.5">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1 mb-2">
                तांत्रिक पुरावा व ओसीआर विश्लेषण:
              </span>
              <div className="text-xs text-slate-700">
                <strong>आढळलेला मजकूर:</strong> "{activeItem?.ocrText || 'N/A'}"
              </div>
              <div className="text-xs text-slate-700">
                <strong>भौगोलिक स्थान:</strong> {activeItem?.lat?.toFixed(5)}° N, {activeItem?.lng?.toFixed(5)}° E
              </div>
              <div className="text-xs text-slate-700">
                <strong>संरचना प्रकार:</strong> {activeItem?.classification || 'Hoarding'}
              </div>
            </div>
            
            <div className="relative h-28 rounded overflow-hidden border border-slate-300 bg-slate-200">
              {activeItem?.imageUrl ? (
                <img 
                  src={activeItem?.imageUrl} 
                  alt="Evidence" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
              )}
              <div className="absolute top-1 right-1 bg-red-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm">
                EVIDENCE TIMESTAMP
              </div>
            </div>
          </div>

          {/* Penalty Calculation Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="border border-slate-300 p-2 font-bold text-slate-800">बाब / Violation Description</th>
                  <th className="border border-slate-300 p-2 font-bold text-slate-800">कलम / Statute</th>
                  <th className="border border-slate-300 p-2 text-right font-bold text-slate-800">दंड रक्कम / Penalty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2">विनापरवाना सार्वजनिक जागेत फलक लावणे</td>
                  <td className="border border-slate-300 p-2 font-mono text-slate-600">MMC Act Sec 244</td>
                  <td className="border border-slate-300 p-2 text-right font-semibold text-slate-800">₹{(fineAmount * 0.7).toFixed(0)}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">निष्कासन पथक व वाहन प्रशासकीय आकार</td>
                  <td className="border border-slate-300 p-2 font-mono text-slate-600">MMC Act Sec 245</td>
                  <td className="border border-slate-300 p-2 text-right font-semibold text-slate-800">₹{(fineAmount * 0.3).toFixed(0)}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td colSpan="2" className="border border-slate-300 p-2 font-bold text-slate-900">एकूण देय दंड (Total Amount Payable)</td>
                  <td className="border border-slate-300 p-2 text-right font-bold text-slate-900 text-sm">₹{fineAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Warning Block */}
          <div className="p-4 rounded bg-rose-50 border-l-4 border-rose-600 text-xs text-rose-900 mt-4">
            <strong>२४ तासांची अंतिम मुदत (24-Hour Final Deadline):</strong> {t.noticeWarning || 'सदर नोटीस मिळाल्यापासून २४ तासांच्या आत अनाधिकृत फलक स्वखर्चाने काढून घ्यावा व दंडाची रक्कम मनपा कोषागारात जमा करावी, अन्यथा मनपामार्फत फौजदारी कारवाई व साहित्य जप्त केले जाईल.'}
          </div>
        </div>

        {/* Signature & Seal Block */}
        <div className="pt-10 flex justify-between items-end text-xs font-sans">
          <div className="space-y-1">
            <div className="w-20 h-20 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] text-slate-500 text-center p-1 font-bold">
              SMKC
              <br/>OFFICIAL
              <br/>SEAL
            </div>
            <div className="text-[11px] text-slate-600 mt-2">प्रत माहितीस्तव: पोलीस उपअधीक्षक, सांगली शहर</div>
          </div>

          <div className="text-right space-y-1">
            <div className="border-b border-slate-400 w-40 ml-auto mb-2"></div>
            <div className="font-bold text-slate-900 text-sm">डॉ. एस. के. महाजन (भा.प्र.से.)</div>
            <div className="text-slate-700">उपायुक्त (अतिक्रमण व आकाशचिन्हे)</div>
            <div className="text-slate-600">सांगली मिरज आणि कुपवाड शहर महानगरपालिका</div>
          </div>
        </div>

      </div>
    </div>
  );
}
