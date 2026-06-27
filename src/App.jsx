import React, { useState, useEffect } from "react";
import { IconMap, IconBarChart, IconSettings, IconLogOut, LOGO_URL } from "./constants";
import { getResources } from "./api";
import PDPAModal from "./components/PDPAModal";
import MapTab from "./components/MapTab";
import DashboardTab from "./components/DashboardTab";
import AdminTab from "./components/AdminTab";
import GalleryTab from "./components/GalleryTab";
import Swal from "sweetalert2";

    const App = () => {
      const [activeTab, setActiveTab] = useState('map');
      const [resources, setResources] = useState([]);
      const [isAdmin, setIsAdmin] = useState(false);
      const [loading, setLoading] = useState(false);
      useEffect(() => { refreshData(); }, []);
      const refreshData = async () => { setLoading(true); try { const data = await getResources(); setResources(data); } catch (error) { Swal.fire('Error', 'โหลดข้อมูลไม่สำเร็จ', 'error'); } finally { setLoading(false); } };
      const handleAdminAccess = async () => {
        if (isAdmin) { setActiveTab('admin'); return; }
        const { value: password } = await Swal.fire({ title: 'เข้าสู่ระบบเจ้าหน้าที่', input: 'password', inputPlaceholder: 'กรอกรหัสผ่าน', confirmButtonText: 'เข้าสู่ระบบ', confirmButtonColor: '#4c1d95', background: '#fff', customClass: { popup: 'rounded-3xl shadow-2xl', input: 'rounded-xl border-gray-300', confirmButton: 'rounded-xl px-6 py-3 font-bold' } });
        if (password === 'admin0') { setIsAdmin(true); setActiveTab('admin'); const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: '#ecfccb', color: '#365314' }); Toast.fire({ icon: 'success', title: 'เข้าสู่ระบบสำเร็จ' }); } else if (password) { Swal.fire('รหัสผ่านผิด', '', 'error'); }
      };
      return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
          <PDPAModal />
          <header className="bg-white/95 backdrop-blur-xl shadow-sm z-30 print:hidden sticky top-0 border-b border-purple-100">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-1 bg-gradient-to-br from-purple-100 to-amber-100 rounded-full shadow-inner border border-white"><img src={LOGO_URL} alt="Logo" className="h-12 w-12 md:h-14 md:w-14 object-cover rounded-full drop-shadow-sm" /></div>
                <div><h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-indigo-800 tracking-tight leading-none">Kalasin Learning T-Map</h1><p className="text-xs text-gray-500 font-bold tracking-wide mt-1">สำนักงานส่งเสริมการเรียนรู้ประจำจังหวัดกาฬสินธ์ุ</p></div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white shadow-xl shadow-purple-900/20">
              <div className="container mx-auto px-2 md:px-4 flex space-x-2 overflow-x-auto py-1">
                <button onClick={() => setActiveTab('map')} className={`flex-shrink-0 px-6 py-3 rounded-t-xl flex items-center space-x-2 transition-all duration-300 relative overflow-hidden group ${activeTab === 'map' ? 'bg-white/10 text-amber-300 font-bold border-b-4 border-amber-400' : 'text-purple-200 hover:bg-white/5 hover:text-white'}`}><span className="relative z-10 flex items-center gap-2"><IconMap size={20} /> แผนที่</span></button>
                <button onClick={() => setActiveTab('gallery')} className={`flex-shrink-0 px-6 py-3 rounded-t-xl flex items-center space-x-2 transition-all duration-300 relative overflow-hidden group ${activeTab === 'gallery' ? 'bg-white/10 text-amber-300 font-bold border-b-4 border-amber-400' : 'text-purple-200 hover:bg-white/5 hover:text-white'}`}><span className="relative z-10 flex items-center gap-2"><IconImage size={20} /> แกลเลอรี</span></button>
                <button onClick={() => setActiveTab('dashboard')} className={`flex-shrink-0 px-6 py-3 rounded-t-xl flex items-center space-x-2 transition-all duration-300 relative overflow-hidden group ${activeTab === 'dashboard' ? 'bg-white/10 text-amber-300 font-bold border-b-4 border-amber-400' : 'text-purple-200 hover:bg-white/5 hover:text-white'}`}><span className="relative z-10 flex items-center gap-2"><IconBarChart size={20} /> รายงาน</span></button>
                <div className="flex-grow"></div>
                <button onClick={handleAdminAccess} className={`flex-shrink-0 px-6 py-3 rounded-t-xl flex items-center space-x-2 transition-all duration-300 relative overflow-hidden group ${activeTab === 'admin' ? 'bg-white/10 text-amber-300 font-bold border-b-4 border-amber-400' : 'text-purple-200 hover:bg-white/5 hover:text-white'}`}><span className="relative z-10 flex items-center gap-2">{isAdmin ? <IconSettings size={20} /> : <IconUser size={20} />} {isAdmin ? 'จัดการข้อมูล' : 'เจ้าหน้าที่'}</span></button>
                {isAdmin && <button onClick={() => { setIsAdmin(false); setActiveTab('map'); }} className="px-4 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-200 hover:text-white transition-colors rounded-lg mx-2 my-1"><IconLogOut size={20} /></button>}
              </div>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-6 md:py-8 relative">
            {loading && <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm rounded-3xl"><div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-800"></div></div>}
            <div className="animate-fade-in-up">
              {activeTab === 'map' && <MapTab resources={resources} />}
              {activeTab === 'gallery' && <GalleryTab resources={resources} />}
              {activeTab === 'dashboard' && <DashboardTab resources={resources} />}
              {activeTab === 'admin' && <AdminTab onDataUpdate={refreshData} resources={resources} />}
            </div>
          </main>
          <footer className="bg-gradient-to-r from-purple-950 to-indigo-950 text-white py-10 mt-auto print:hidden">
            <div className="container mx-auto px-4 text-center">
              <p className="font-bold text-lg md:text-xl mb-2 tracking-wide text-amber-400">สำนักงานส่งเสริมการเรียนรู้ประจำจังหวัดกาฬสินธ์ุ</p>
              <p className="text-sm text-purple-200 opacity-60 font-light">Kalasin Learning T-Map ระบบสารสนเทศภูมิศาสตร์แหล่งเรียนรู้ชุมชน</p>
              <div className="mt-8 text-xs text-purple-800 font-bold uppercase tracking-widest opacity-30">Kalasin</div>
            </div>
          </footer>
        </div>
      );
    };

export default App;