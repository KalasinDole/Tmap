import React, { useState, useEffect, useMemo } from "react";
import { IconSearch, IconChevronLeft, IconChevronRight, IconImage, ResourceType, KALASIN_LOCATIONS } from "../constants";

    // 4.5 GalleryTab
    const GalleryTab = ({ resources }) => {
      const [filterType, setFilterType] = useState('all');
      const [filterDistrict, setFilterDistrict] = useState('all');
      const [searchQuery, setSearchQuery] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const [selectedItem, setSelectedItem] = useState(null);
      const itemsPerPage = 15;
      // สุ่มลำดับรูปภาพ (เปลี่ยนทุกครั้งที่เข้าเว็บ)
      const shuffledResources = useMemo(() => {
        const data = resources.filter(r => r.imageUrl && r.imageUrl.length > 10);
        for (let i = data.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[data[i], data[j]] = [data[j], data[i]]; }
        return data;
      }, [resources]);
      const filteredResources = useMemo(() => {
        let data = shuffledResources;
        if (filterType !== 'all') data = data.filter(r => r.type === filterType);
        if (filterDistrict !== 'all') data = data.filter(r => r.district === filterDistrict);
        if (searchQuery.trim()) { const q = searchQuery.trim().toLowerCase(); data = data.filter(r => r.name.toLowerCase().includes(q)); }
        return data;
      }, [shuffledResources, filterType, filterDistrict, searchQuery]);
      const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
      const currentItems = filteredResources.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      useEffect(() => { setCurrentPage(1); }, [filterType, filterDistrict, searchQuery]);
      const goToPage = (page) => { if (page >= 1 && page <= totalPages) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
      const openDetail = (r) => { setSelectedItem(r); window.scrollTo({ top: 0, behavior: 'smooth' }); };
      const closeDetail = () => { setSelectedItem(null); };
      // --- Detail View (หน้าย่อย) ---
      if (selectedItem) {
        const r = selectedItem;
        const googleMapsUrl = `https://www.google.com/maps?q=${r.latitude},${r.longitude}`;
        return (
          <div className="animate-fade-in-up space-y-4">
            <button onClick={closeDetail} className="flex items-center gap-2 text-purple-700 font-bold bg-white px-5 py-3 rounded-2xl shadow-sm border border-purple-200 hover:bg-purple-50 transition-colors"><IconChevronLeft size={20} /> กลับไปแกลเลอรี</button>
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <img src={fixDriveImageUrl(r.imageUrl)} crossOrigin="anonymous" alt={r.name} className="w-full max-h-[50vh] object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              <div className="p-5 md:p-8 space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-purple-900">{r.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full font-semibold border border-purple-200">{r.type.replace('แหล่งเรียนรู้ประเภท', '')}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">📍 {r.subDistrict}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">{r.district.replace('สกร.ระดับอำเภอ', 'อ.')}</span>
                </div>
                {r.description && <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">{r.description}</p>}
                {r.contactInfo && <div className="text-green-700 font-semibold text-sm bg-green-50 p-3 rounded-2xl border border-green-100 flex items-center gap-2">📞 {r.contactInfo}</div>}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a href={googleMapsUrl} target="_blank" className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg no-underline text-sm flex items-center justify-center gap-1">🗺️ นำทาง</a>
                  <button onClick={() => { const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(googleMapsUrl)}`; Swal.fire({ html: `<div class="flex flex-col items-center"><img src="${qrUrl}" alt="QR" class="w-48 h-48 mb-2" /><p class="text-xs text-gray-400">สแกนเพื่อนำทาง</p></div>`, showCloseButton: true, showConfirmButton: false }); }} className="text-center bg-white text-purple-700 font-bold py-3 rounded-2xl shadow-sm border-2 border-purple-200 text-sm flex items-center justify-center gap-1">📱 QR Code</button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      // --- Grid View ---
      return (
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-purple-50 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1"><select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full appearance-none border-gray-200 rounded-2xl shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 bg-gray-50 text-sm font-medium border"><option value="all">ทุกประเภท</option>{Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div className="flex-1"><select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="w-full appearance-none border-gray-200 rounded-2xl shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 bg-gray-50 text-sm font-medium border"><option value="all">ทุกอำเภอ</option>{KALASIN_LOCATIONS.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}</select></div>
            </div>
            <div className="relative"><IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="🔍 ค้นหาชื่อ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-sm font-medium focus:border-purple-500 focus:ring-purple-500 focus:bg-white transition-colors" /></div>
            <div className="flex items-center justify-between"><div className="bg-purple-100 px-4 py-2 rounded-xl border border-purple-200"><span className="font-extrabold text-purple-700 text-xl mr-1">{filteredResources.length}</span><span className="text-purple-600 font-medium text-sm">ภาพ</span></div><div className="text-xs text-gray-400">สุ่มแสดงผลใหม่ทุกครั้ง • หน้า {currentPage}/{totalPages || 1}</div></div>
          </div>
          {currentItems.length === 0 ? (<div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center"><IconImage size={64} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-400 font-medium text-lg">ไม่พบรูปภาพที่ตรงกับตัวกรอง</p></div>) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {currentItems.map(r => (
                <div key={r.id} onClick={() => openDetail(r)} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 active:scale-95">
                  <div className="relative overflow-hidden aspect-square"><img src={fixDriveImageUrl(r.imageUrl)} crossOrigin="anonymous" alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">📷</div>'; }} /></div>
                  <div className="p-2.5"><h3 className="font-bold text-gray-800 text-xs truncate">{r.name}</h3><p className="text-[10px] text-gray-400 mt-0.5 truncate">{r.subDistrict}</p></div>
                </div>
              ))}
            </div>)}
          {totalPages > 1 && (<div className="flex items-center justify-center gap-3 py-4">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 shadow-sm text-gray-600"><IconChevronLeft size={20} /></button>
            <div className="flex gap-1">{Array.from({ length: Math.min(totalPages, 7) }, (_, i) => { let page; if (totalPages <= 7) { page = i + 1; } else if (currentPage <= 4) { page = i + 1; } else if (currentPage >= totalPages - 3) { page = totalPages - 6 + i; } else { page = currentPage - 3 + i; } return (<button key={page} onClick={() => goToPage(page)} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === page ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white text-gray-600 border border-gray-200 hover:bg-purple-50'}`}>{page}</button>); })}</div>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 shadow-sm text-gray-600"><IconChevronRight size={20} /></button>
          </div>)}
        </div>
      );
    };
    // --- 5. MAIN APP ---

export default GalleryTab;