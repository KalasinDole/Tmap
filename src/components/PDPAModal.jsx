import React, { useState, useEffect } from "react";
import { IconUser } from "../constants";

    const PDPAModal = () => {
      const [isOpen, setIsOpen] = useState(false);
      useEffect(() => { if (!localStorage.getItem('PDPA_CONSENT')) setIsOpen(true); }, []);
      const handleAccept = () => { localStorage.setItem('PDPA_CONSENT', 'true'); setIsOpen(false); };
      if (!isOpen) return null;
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 no-print">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up border border-purple-100">
            <div className="flex justify-center mb-4"><div className="bg-purple-100 p-3 rounded-full"><IconUser size={32} className="text-purple-700" /></div></div>
            <h2 className="text-xl font-bold text-center text-purple-900 mb-2">ข้อตกลงการคุ้มครองข้อมูลส่วนบุคคล</h2>
            <p className="text-center text-gray-500 text-sm mb-6 border-b border-purple-50 pb-4">PDPA Consent Agreement</p>
            <div className="text-sm text-gray-600 space-y-4 mb-6 max-h-60 overflow-y-auto leading-relaxed px-2">
              <p>เว็บไซต์นี้จัดทำขึ้นโดย <strong>สำนักงานส่งเสริมการเรียนรู้ประจำจังหวัดกาฬสินธ์ุ</strong> เพื่อเป็นฐานข้อมูลแหล่งเรียนรู้ชุมชน</p>
              <p>ข้อมูลที่ปรากฏ (ชื่อ-นามสกุล, เบอร์โทรศัพท์, ภาพถ่าย) ได้รับความยินยอมเพื่อการศึกษาและสาธารณประโยชน์เท่านั้น</p>
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-semibold flex gap-2"><span>⚠️</span><span>ห้ามนำข้อมูลไปใช้ในทางที่ผิดกฎหมาย หรือละเมิดสิทธิส่วนบุคคล</span></div>
            </div>
            <div className="flex justify-center">
              <button onClick={handleAccept} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-500/30 transform hover:scale-[1.02] transition-all text-sm">รับทราบและยอมรับ</button>
            </div>
          </div>
        </div>
      );
    };
    // 4.2 MapTab

export default PDPAModal;