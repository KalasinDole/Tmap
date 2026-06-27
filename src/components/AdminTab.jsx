import React, { useState, useEffect } from "react";
import { IconImage, IconTrash, ResourceType, KALASIN_LOCATIONS } from "../constants";
import Swal from "sweetalert2";
import { addSheetData, deleteResource, uploadImageToDrive, migrateExistingImages } from "../api";

    const AdminTab = ({ onDataUpdate, resources }) => {
      const [formData, setFormData] = useState({ name: '', district: '', subDistrict: '', type: ResourceType.PERSON, description: '', latitude: '', longitude: '', contactInfo: '' });
      const [imageBase64, setImageBase64] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isCompressing, setIsCompressing] = useState(false);
      const currentSubDistricts = useMemo(() => { const d = KALASIN_LOCATIONS.find(l => l.district === formData.district); return d ? d.subDistricts : []; }, [formData.district]);
      const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          if (file.size > 10 * 1024 * 1024) { Swal.fire('Error', 'ขนาดไฟล์รูปภาพต้องไม่เกิน 10MB', 'error'); return; }
          setIsCompressing(true);
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1200; const MAX_HEIGHT = 1200;
              let width = img.width; let height = img.height;
              if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } }
              else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
              canvas.width = width; canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) { ctx.drawImage(img, 0, 0, width, height); const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); setImageBase64(compressedDataUrl); setIsCompressing(false); }
              else { setIsCompressing(false); Swal.fire('Error', 'ไม่สามารถประมวลผลภาพได้', 'error'); }
            };
            img.onerror = () => { setIsCompressing(false); Swal.fire('Error', 'ไฟล์รูปภาพไม่ถูกต้อง', 'error'); };
            if (event.target?.result) { img.src = event.target.result; }
          };
          reader.readAsDataURL(file);
        }
      };
      const handleGeolocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => { setFormData({ ...formData, latitude: position.coords.latitude.toString(), longitude: position.coords.longitude.toString() }); Swal.fire({ icon: 'success', title: 'พิกัดปัจจุบัน', text: `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`, timer: 1500 }); },
            () => Swal.fire('Error', 'ไม่สามารถดึงพิกัด GPS ได้', 'error')
          );
        } else { Swal.fire('Error', 'Browser นี้ไม่รองรับ Geolocation', 'error'); }
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.district || !formData.subDistrict || !formData.latitude || !formData.longitude) { Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน', 'warning'); return; }
        if (isCompressing) { Swal.fire('รอสักครู่', 'กำลังประมวลผลรูปภาพ...', 'info'); return; }
        setIsSubmitting(true);
        Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
          let finalImageUrl = '';
          if (imageBase64) {
            Swal.fire({ title: 'กำลังอัพโหลดรูปภาพ...', text: 'อัพโหลดรูปไป Google Drive', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const imgFileName = 'tmap_' + Date.now() + '.jpg';
            finalImageUrl = await runServerFunction('uploadImageToDrive', imageBase64, imgFileName);
            if (!finalImageUrl) { Swal.fire('แจ้งเตือน', 'อัพโหลดรูปภาพไม่สำเร็จ ข้อมูลจะถูกบันทึกโดยไม่มีรูป', 'warning'); }
          }
          Swal.fire({ title: 'กำลังบันทึกข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
          const newResource = { id: Date.now().toString(), name: formData.name, district: formData.district, subDistrict: formData.subDistrict, type: formData.type, description: formData.description, latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude), contactInfo: formData.contactInfo, imageUrl: finalImageUrl || undefined, timestamp: Date.now() };
          await addResource(newResource);
          onDataUpdate();
          setFormData({ name: '', district: '', subDistrict: '', type: ResourceType.PERSON, description: '', latitude: '', longitude: '', contactInfo: '' });
          setImageBase64('');
          Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: finalImageUrl ? 'รูปภาพถูกเก็บใน Google Drive' : '' });
        } catch (error) { Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error'); }
        finally { setIsSubmitting(false); }
      };
      const handleDelete = (id) => {
        Swal.fire({ title: 'ยืนยันการลบ?', text: "คุณไม่สามารถกู้คืนข้อมูลนี้ได้", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'ลบข้อมูล', cancelButtonText: 'ยกเลิก' }).then(async (result) => {
          if (result.isConfirmed) { Swal.fire({ title: 'กำลังลบ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() }); try { await deleteResource(id); onDataUpdate(); Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว', 'success'); } catch (error) { Swal.fire('ผิดพลาด', 'ไม่สามารถลบข้อมูลได้', 'error'); } }
        });
      };
      const inputClass = "mt-1 block w-full rounded-2xl border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-3.5 transition-all text-sm font-medium focus:bg-white";
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-t-8 border-purple-600">
            <h2 className="text-2xl font-bold mb-6 text-purple-900 flex items-center gap-3"><span className="bg-purple-100 p-2 rounded-lg"><IconSettings size={24} /></span> เพิ่มข้อมูลแหล่งเรียนรู้</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">ชื่อแหล่งเรียนรู้ <span className="text-red-500">*</span></label><input type="text" required disabled={isSubmitting} className={inputClass} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="เช่น ศูนย์การเรียนรู้บ้าน..." /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-gray-700 mb-1">อำเภอ <span className="text-red-500">*</span></label><select required disabled={isSubmitting} className={inputClass} value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value, subDistrict: '' })}><option value="">-- เลือก --</option>{KALASIN_LOCATIONS.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}</select></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">ตำบล <span className="text-red-500">*</span></label><select required className={inputClass} value={formData.subDistrict} onChange={e => setFormData({ ...formData, subDistrict: e.target.value })} disabled={!formData.district || isSubmitting}><option value="">-- เลือก --</option>{currentSubDistricts.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">ประเภท <span className="text-red-500">*</span></label><select className={inputClass} disabled={isSubmitting} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>{Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">รายละเอียด</label><textarea rows={3} disabled={isSubmitting} className={inputClass} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="รายละเอียดเบื้องต้น..." /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">เบอร์โทรศัพท์</label><input type="text" disabled={isSubmitting} className={inputClass} value={formData.contactInfo} onChange={e => setFormData({ ...formData, contactInfo: e.target.value })} placeholder="0xx-xxx-xxxx" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="col-span-full text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ตำแหน่งที่ตั้ง</div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Latitude <span className="text-red-500">*</span></label><input type="text" required readOnly disabled={isSubmitting} className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`} value={formData.latitude} placeholder="กดปุ่มดึงพิกัด..." /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Longitude <span className="text-red-500">*</span></label><input type="text" required readOnly disabled={isSubmitting} className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`} value={formData.longitude} placeholder="กดปุ่มดึงพิกัด..." /></div>
                <button type="button" disabled={isSubmitting} onClick={handleGeolocation} className="col-span-full w-full bg-white text-indigo-600 py-3 rounded-xl text-sm font-bold border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm flex items-center justify-center gap-2">📍 ดึงพิกัดปัจจุบัน (GPS)</button>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">รูปภาพ</label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl bg-white transition-colors ${isCompressing ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}>
                  <div className="space-y-1 text-center">
                    {isCompressing ? (<div className="flex flex-col items-center text-amber-600 py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-2"></div><span className="text-sm font-bold">กำลังประมวลผลรูปภาพ...</span><span className="text-xs text-amber-500 mt-1">กรุณารอสักครู่ ระบบกำลังย่อขนาดไฟล์</span></div>) : (<><input type="file" accept="image/*" onChange={handleImageUpload} disabled={isSubmitting || isCompressing} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition-all cursor-pointer" /><p className="text-xs text-gray-400 mt-2">รองรับไฟล์ JPG, PNG สูงสุด 10MB (รูปจะถูกเก็บใน Google Drive)</p></>)}
                  </div>
                </div>
                {imageBase64 && !isCompressing && (<div className="mt-3 p-2 bg-white rounded-xl border border-gray-200 shadow-sm inline-block"><img src={imageBase64} alt="Preview" className="h-32 w-auto rounded-lg" /></div>)}
              </div>
              <button type="submit" disabled={isSubmitting || isCompressing} className={`w-full text-white font-bold py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-green-500/30 transform hover:-translate-y-1 transition-all text-lg flex items-center justify-center gap-2 ${(isSubmitting || isCompressing) ? 'opacity-50 cursor-not-allowed' : ''}`}>{isSubmitting ? 'กำลังบันทึก...' : (isCompressing ? 'กำลังย่อรูปภาพ...' : 'บันทึกข้อมูล')}</button>
            </form>
          </div>
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-5 border-b border-gray-200"><h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">📋 ข้อมูลล่าสุด</h3></div>
            <div className="flex-grow overflow-y-auto max-h-[800px]"><table className="min-w-full divide-y divide-gray-100"><thead className="bg-gray-50"><tr><th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">ชื่อ</th><th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">พื้นที่</th><th className="px-6 py-4 text-right">จัดการ</th></tr></thead><tbody className="bg-white divide-y divide-gray-100">{resources.slice().reverse().map((r) => (<tr key={r.id} className="hover:bg-purple-50/50 transition-colors"><td className="px-6 py-4 text-sm font-bold text-gray-800">{r.name}</td><td className="px-6 py-4 text-sm text-gray-500">{r.subDistrict}</td><td className="px-6 py-4 text-right"><button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2.5 rounded-xl transition-colors shadow-sm border border-red-100"><IconTrash size={18} /></button></td></tr>))}</tbody></table></div>
          </div>
        </div>
      );
    };
    // Helper: แปลง Google Drive URL ให้ใช้งานได้ทุก browser
    const fixDriveImageUrl = (url) => {
      if (!url) return '';
      // drive.google.com/thumbnail?id=XXX&sz=w800 → lh3.googleusercontent.com/d/XXX=w800
      const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?id=([^&]+)/);
      if (thumbMatch) return 'https://lh3.googleusercontent.com/d/' + thumbMatch[1] + '=w800';
      // drive.google.com/uc?id=XXX → lh3.googleusercontent.com/d/XXX
      const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
      if (ucMatch) return 'https://lh3.googleusercontent.com/d/' + ucMatch[1];
      // drive.google.com/file/d/XXX/view → lh3.googleusercontent.com/d/XXX
      const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
      if (fileMatch) return 'https://lh3.googleusercontent.com/d/' + fileMatch[1];
      return url;
    };

export default AdminTab;