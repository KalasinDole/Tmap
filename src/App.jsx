import React, { useState, useEffect, useMemo, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import L from "leaflet";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";

    const IconMap = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>;
    const IconBarChart = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
    const IconSettings = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    const IconLogOut = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
    const IconUser = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    const IconPrinter = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;
    const IconTrash = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
    const IconChevronLeft = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6" /></svg>;
    const IconChevronRight = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6" /></svg>;
    const IconShare2 = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
    const IconQrCode = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>;
    const IconNavigation = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>;
    const IconMapPin = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
    const IconFilter = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
    const IconChevronDown = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>;
    const IconImage = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
    const IconSearch = ({ size = 20, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
    const LOGO_URL = "https://img2.pic.in.th/kalasin.jpeg";
    const ResourceType = { PERSON: "แหล่งเรียนรู้ประเภทบุคคล (ปราชญ์ชาวบ้าน)", INNOVATION: "แหล่งเรียนรู้ประเภทสื่อ นวัตกรรม เทคโนโลยีและสิ่งประดิษฐ์", PLACE: "แหล่งเรียนรู้ประเภทสถานที่" };
    const KALASIN_LOCATIONS = [
      { district: "สกร.ระดับอำเภอเมืองกาฬสินธุ์", subDistricts: ["ศกร.ระดับตำบลกาฬสินธุ์", "ศกร.ระดับตำบลเหนือ", "ศกร.ระดับตำบลหลุบ", "ศกร.ระดับตำบลไผ่", "ศกร.ระดับตำบลลำปาว", "ศกร.ระดับตำบลลำพาน", "ศกร.ระดับตำบลเชียงเครือ", "ศกร.ระดับตำบลบึงวิชัย", "ศกร.ระดับตำบลห้วยโพธิ์", "ศกร.ระดับตำบลภูปอ", "ศกร.ระดับตำบลภูดิน", "ศกร.ระดับตำบลหนองกุง", "ศกร.ระดับตำบลกลางหมื่น", "ศกร.ระดับตำบลขมิ้น", "ศกร.ระดับตำบลโพนทอง", "ศกร.ระดับตำบลนาจารย์", "ศกร.ระดับตำบลลำคลอง"] },
      { district: "สกร.ระดับอำเภอนามน", subDistricts: ["ศกร.ระดับตำบลนามน", "ศกร.ระดับตำบลยอดแกง", "ศกร.ระดับตำบลสงเปลือย", "ศกร.ระดับตำบลหลักเหลี่ยม", "ศกร.ระดับตำบลหนองบัว"] },
      { district: "สกร.ระดับอำเภอกมลาไสย", subDistricts: ["ศกร.ระดับตำบลกมลาไสย", "ศกร.ระดับตำบลหลักเมือง", "ศกร.ระดับตำบลโพนงาม", "ศกร.ระดับตำบลดงลิง", "ศกร.ระดับตำบลธัญญา", "ศกร.ระดับตำบลหนองแปน", "ศกร.ระดับตำบลเจ้าท่า", "ศกร.ระดับตำบลโคกสมบูรณ์"] },
      { district: "สกร.ระดับอำเภอร่องคำ", subDistricts: ["ศกร.ระดับตำบลร่องคำ", "ศกร.ระดับตำบลสามัคคี", "ศกร.ระดับตำบลเหล่าอ้อย"] },
      { district: "สกร.ระดับอำเภอกุฉินารายณ์", subDistricts: ["ศกร.ระดับตำบลบัวขาว", "ศกร.ระดับตำบลแจนแลน", "ศกร.ระดับตำบลเหล่าใหญ่", "ศกร.ระดับตำบลจุมจัง", "ศกร.ระดับตำบลนาโก", "ศกร.ระดับตำบลสามขา", "ศกร.ระดับตำบลกุดหว้า", "ศกร.ระดับตำบลกุดค้าว", "ศกร.ระดับตำบลหนองห้าง", "ศกร.ระดับตำบลนาขาม", "ศกร.ระดับตำบลเหล่าไฮงาม", "ศกร.ระดับตำบลสมสะอาด"] },
      { district: "สกร.ระดับอำเภอเขาวง", subDistricts: ["ศกร.ระดับตำบลคุ้มเก่า", "ศกร.ระดับตำบลสงเปลือย", "ศกร.ระดับตำบลหนองผือ", "ศกร.ระดับตำบลกุดสิมคุ้ม", "ศกร.ระดับตำบลสระพังทอง", "ศกร.ระดับตำบลกุดปลาค้าว"] },
      { district: "สกร.ระดับอำเภอยางตลาด", subDistricts: ["ศกร.ระดับตำบลยางตลาด", "ศกร.ระดับตำบลหัวงัว", "ศกร.ระดับตำบลอุ่มเม่า", "ศกร.ระดับตำบลนาเชือก", "ศกร.ระดับตำบลอิตื้อ", "ศกร.ระดับตำบลหัวนาคำ", "ศกร.ระดับตำบลโนนสูง", "ศกร.ระดับตำบลหนองอิเฒ่า", "ศกร.ระดับตำบลดอนสมบูรณ์", "ศกร.ระดับตำบลนาดี", "ศกร.ระดับตำบลบัวบาน", "ศกร.ระดับตำบลหนองตอกแป้น", "ศกร.ระดับตำบลเว่อ", "ศกร.ระดับตำบลเขาพระนอน", "ศกร.ระดับตำบลคลองขาม"] },
      { district: "สกร.ระดับอำเภอห้วยเม็ก", subDistricts: ["ศกร.ระดับตำบลห้วยเม็ก", "ศกร.ระดับตำบลคำใหญ่", "ศกร.ระดับตำบลกุดโดน", "ศกร.ระดับตำบลบึงนาเรียง", "ศกร.ระดับตำบลหัวหิน", "ศกร.ระดับตำบลพิมูล", "ศกร.ระดับตำบลคำเหมือดแก้ว", "ศกร.ระดับตำบลโนนสะอาด", "ศกร.ระดับตำบลทรายทอง"] },
      { district: "สกร.ระดับอำเภอสหัสขันธ์", subDistricts: ["ศกร.ระดับตำบลภูสิงห์", "ศกร.ระดับตำบลสหัสขันธ์", "ศกร.ระดับตำบลนามะเขือ", "ศกร.ระดับตำบลโนนบุรี", "ศกร.ระดับตำบลโนนศิลา", "ศกร.ระดับตำบลนิคม", "ศกร.ระดับตำบลโนนน้ำเกลี้ยง", "ศกร.ระดับตำบลโนนแหลมทอง"] },
      { district: "สกร.ระดับอำเภอคำม่วง", subDistricts: ["ศกร.ระดับตำบลทุ่งคลอง", "ศกร.ระดับตำบลโพน", "ศกร.ระดับตำบลดินจี่", "ศกร.ระดับตำบลเนินยาง", "ศกร.ระดับตำบลนาบอน", "ศกร.ระดับตำบลนาทัน"] },
      { district: "สกร.ระดับอำเภอท่าคันโท", subDistricts: ["ศกร.ระดับตำบลท่าคันโท", "ศกร.ระดับตำบลกุงเก่า", "ศกร.ระดับตำบลยางอู้ม", "ศกร.ระดับตำบลกุดจิก", "ศกร.ระดับตำบลนาตาล", "ศกร.ระดับตำบลดงสมบูรณ์"] },
      { district: "สกร.ระดับอำเภอหนองกุงศรี", subDistricts: ["ศกร.ระดับตำบลหนองกุงศรี", "ศกร.ระดับตำบลหนองบัว", "ศกร.ระดับตำบลโคกเครือ", "ศกร.ระดับตำบลหนองสรวง", "ศกร.ระดับตำบลเสาเล้า", "ศกร.ระดับตำบลหนองใหญ่", "ศกร.ระดับตำบลดงมูล", "ศกร.ระดับตำบลลำหนองแสน", "ศกร.ระดับตำบลหนองหิน"] },
      { district: "สกร.ระดับอำเภอสมเด็จ", subDistricts: ["ศกร.ระดับตำบลสมเด็จ", "ศกร.ระดับตำบลหนองแวง", "ศกร.ระดับตำบลแซงบาดาล", "ศกร.ระดับตำบลมหาไชย", "ศกร.ระดับตำบลหมูม่น", "ศกร.ระดับตำบลผาเสวย", "ศกร.ระดับตำบลศรีสมเด็จ", "ศกร.ระดับตำบลลำห้วยหลัว"] },
      { district: "สกร.ระดับอำเภอห้วยผึ้ง", subDistricts: ["ศกร.ระดับตำบลคำบง", "ศกร.ระดับตำบลไค้นุ่น", "ศกร.ระดับตำบลนิคมห้วยผึ้ง", "ศกร.ระดับตำบลหนองอีบุตร"] },
      { district: "สกร.ระดับอำเภอสามชัย", subDistricts: ["ศกร.ระดับตำบลสำราญ", "ศกร.ระดับตำบลสำราญใต้", "ศกร.ระดับตำบลคำสร้างเที่ยง", "ศกร.ระดับตำบลหนองช้าง"] },
      { district: "สกร.ระดับอำเภอนาคู", subDistricts: ["ศกร.ระดับตำบลนาคู", "ศกร.ระดับตำบลสายนาวัง", "ศกร.ระดับตำบลโนนนาจาน", "ศกร.ระดับตำบลบ่อแก้ว", "ศกร.ระดับตำบลภูแล่นช้าง"] },
      { district: "สกร.ระดับอำเภอดอนจาน", subDistricts: ["ศกร.ระดับตำบลดอนจาน", "ศกร.ระดับตำบลสะอาดไชยศรี", "ศกร.ระดับตำบลดงพยุง", "ศกร.ระดับตำบลม่วงนา", "ศกร.ระดับตำบลนาจำปา"] },
      { district: "สกร.ระดับอำเภอฆ้องชัย", subDistricts: ["ศกร.ระดับตำบลฆ้องชัยพัฒนา", "ศกร.ระดับตำบลเหล่ากลาง", "ศกร.ระดับตำบลโคกสะอาด", "ศกร.ระดับตำบลโนนศิลาเลิง", "ศกร.ระดับตำบลลำชี"] }
    ];
    const MARKER_COLORS = {
      [ResourceType.PERSON]: { fill: '#7c3aed', label: 'บุคคล (ปราชญ์ชาวบ้าน)' },
      [ResourceType.INNOVATION]: { fill: '#f59e0b', label: 'สื่อ นวัตกรรม เทคโนโลยี' },
      [ResourceType.PLACE]: { fill: '#10b981', label: 'สถานที่' },
    };
    const createColoredMarkerIcon = (type) => {
      const config = MARKER_COLORS[type] || { fill: '#6b7280', label: 'อื่นๆ' };
      return L.divIcon({ className: '', html: '<div style="position:relative;width:30px;height:42px;"><svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));"><path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 27 15 27s15-15.75 15-27C30 6.716 23.284 0 15 0z" fill="' + config.fill + '" stroke="white" stroke-width="2"/><circle cx="15" cy="14" r="6" fill="white" opacity="0.9"/></svg></div>', iconSize: [30, 42], iconAnchor: [15, 42], popupAnchor: [0, -42] });
    };
    // --- 3. SERVICES ---
    const API_URL = 'https://script.google.com/macros/s/AKfycbzrhGl2CR5ZumRpgbG0KAcAlOnpwVclyaAcSluGq7YLutuSu8USYpreK7yDBa4nbdqi/exec';
    const getResources = async () => {
      const response = await fetch(`${API_URL}?action=getSheetData`);
      const result = await response.json();
      if (result.status === 'success') return result.data;
      throw new Error(result.message);
    };
    const addResource = async (resource) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'addSheetData', data: resource })
      });
      const result = await response.json();
      if (result.status === 'success') return result.success;
      throw new Error(result.message);
    };
    const deleteResource = async (id) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'deleteResource', id })
      });
      const result = await response.json();
      if (result.status === 'success') return result.success;
      throw new Error(result.message);
    };
    const uploadImageToDrive = async (base64Data, fileName) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'uploadImageToDrive', base64Data, fileName })
      });
      const result = await response.json();
      if (result.status === 'success') return result.url;
      throw new Error(result.message);
    };
    // 4.1 PDPAModal
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
    const MapTab = ({ resources }) => {
      const mapContainerRef = useRef(null);
      const mapInstanceRef = useRef(null);
      const markersRef = useRef([]);
      const [filterType, setFilterType] = useState('all');
      const [filterDistrict, setFilterDistrict] = useState('all');
      const [filteredResources, setFilteredResources] = useState(resources);
      const [showFilters, setShowFilters] = useState(false);
      useEffect(() => { delete L.Icon.Default.prototype._getIconUrl; L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png', iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png' }); }, []);
      useEffect(() => { let temp = resources; if (filterType !== 'all') temp = temp.filter(r => r.type === filterType); if (filterDistrict !== 'all') temp = temp.filter(r => r.district === filterDistrict); setFilteredResources(temp); }, [filterType, filterDistrict, resources]);
      const displayResources = useMemo(() => { const positionCounts = {}; return filteredResources.map(r => { const key = `${r.latitude},${r.longitude}`; const offsetIndex = positionCounts[key] || 0; positionCounts[key] = offsetIndex + 1; let displayLat = Number(r.latitude); let displayLng = Number(r.longitude); if (offsetIndex > 0) { const radius = 0.00025 * (1 + Math.floor(offsetIndex / 8)); const angle = (offsetIndex % 8) * (Math.PI / 4); displayLat += radius * Math.sin(angle); displayLng += radius * Math.cos(angle); } return { ...r, displayLat, displayLng }; }); }, [filteredResources]);
      useEffect(() => { if (!mapContainerRef.current) return; if (mapInstanceRef.current) return; const map = L.map(mapContainerRef.current).setView([16.4322, 103.5061], 9); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map); mapInstanceRef.current = map; return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } }; }, []);
      useEffect(() => {
        if (!mapInstanceRef.current) return;
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        displayResources.forEach(r => {
          const marker = L.marker([r.displayLat, r.displayLng], { icon: createColoredMarkerIcon(r.type) }).addTo(mapInstanceRef.current);
          const popupContent = document.createElement('div');
          const googleMapsUrl = `https://www.google.com/maps?q=${r.latitude},${r.longitude}`;
          popupContent.innerHTML = `<div class="p-1 min-w-[220px] font-sans"><h3 class="font-bold text-purple-900 text-lg mb-2 leading-tight border-b border-purple-100 pb-2">${r.name}</h3>${r.imageUrl ? `<img src="${fixDriveImageUrl(r.imageUrl)}" crossorigin="anonymous" class="w-full h-40 object-cover rounded-xl mb-3 shadow-md border border-gray-100" onerror="this.style.display='none'" />` : ''}<div class="text-xs text-gray-500 mb-2 flex items-center gap-1">📍 ${r.subDistrict}, ${r.district}</div><span class="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full border border-purple-200 inline-block mb-3 font-semibold shadow-sm">${r.type.replace('แหล่งเรียนรู้ประเภท', '')}</span><p class="text-sm mb-3 text-gray-700 line-clamp-3 bg-gray-50 p-2 rounded-lg border border-gray-100">${r.description || '-'}</p>${r.contactInfo ? `<p class="text-sm font-semibold text-green-700 mb-3 flex items-center gap-1 bg-green-50 p-2 rounded-lg border border-green-100">📞 ${r.contactInfo}</p>` : ''}<div class="grid grid-cols-3 gap-2 mt-2"><button id="btn-share-${r.id}" class="bg-amber-500 text-white p-2 rounded-lg text-[10px] flex items-center justify-center gap-1 font-bold shadow-sm w-full">แชร์พิกัด</button><button id="btn-qr-${r.id}" class="bg-blue-600 text-white p-2 rounded-lg text-[10px] flex items-center justify-center gap-1 font-bold shadow-sm w-full">QR Code</button><a href="${googleMapsUrl}" target="_blank" class="bg-purple-700 text-white p-2 rounded-lg text-[10px] flex items-center justify-center gap-1 font-bold shadow-sm w-full no-underline">นำทาง</a></div></div>`;
          marker.bindPopup(popupContent).on('popupopen', () => { const btnShare = document.getElementById(`btn-share-${r.id}`); if (btnShare) { btnShare.onclick = () => handleShareResource(r); } const btnQr = document.getElementById(`btn-qr-${r.id}`); if (btnQr) { btnQr.onclick = () => showQRCode(r); } });
          markersRef.current.push(marker);
        });
      }, [displayResources]);
      const handleShareResource = (r) => { const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${r.latitude},${r.longitude}`; const text = `แนะนำแหล่งเรียนรู้: ${r.name}\n📍 ${r.subDistrict}, ${r.district}`; if (navigator.share) { navigator.share({ title: 'Kalasin Learning T-Map', text: text, url: googleMapsUrl }).catch(console.error); } else { Swal.fire({ title: 'แชร์พิกัดนำทาง', html: `<div class="p-2 space-y-4"><button onclick="navigator.clipboard.writeText('${googleMapsUrl}'); Swal.fire('คัดลอกลิงก์แผนที่แล้ว','','success')" class="w-full bg-purple-700 text-white p-3 rounded-xl font-bold shadow-lg">คัดลอกลิงก์ Google Maps</button></div>`, showConfirmButton: false, showCloseButton: true }); } };
      const showQRCode = (resource) => { const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${resource.latitude},${resource.longitude}`; const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(googleMapsUrl)}`; Swal.fire({ html: `<div class="flex flex-col items-center pt-2"><h3 class="text-xl font-bold text-blue-900 mb-2">QR Code นำทาง</h3><div class="bg-white p-3 border-4 border-blue-50 rounded-2xl shadow-sm mb-4"><img src="${qrUrl}" alt="QR Code" class="w-48 h-48" /></div><p class="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">${resource.name}</p><p class="text-xs text-gray-400">สแกนเพื่อเปิดแผนที่นำทาง (Google Maps)</p></div>`, showConfirmButton: true, confirmButtonText: 'ปิด', confirmButtonColor: '#1e3a8a', showCloseButton: true }); };
      const handleShareApp = () => { const url = "https://script.google.com/macros/s/AKfycbzrhGl2CR5ZumRpgbG0KAcAlOnpwVclyaAcSluGq7YLutuSu8USYpreK7yDBa4nbdqi/exec"; const text = 'Kalasin Learning T-Map: ระบบสารสนเทศภูมิศาสตร์แหล่งเรียนรู้ชุมชน'; if (navigator.share) { navigator.share({ title: 'Kalasin Learning T-Map', text: text, url: url }).catch(console.error); } else { Swal.fire({ title: 'แชร์ระบบสารสนเทศ', html: `<div class="p-2 space-y-4"><button onclick="navigator.clipboard.writeText('${url}'); Swal.fire('คัดลอกลิงก์แล้ว','','success')" class="w-full bg-purple-700 text-white p-3 rounded-xl font-bold shadow-lg">คัดลอกลิงก์</button></div>`, showConfirmButton: false, showCloseButton: true }); } };
      return (
        <div className="flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-160px)] gap-3 lg:gap-6">
          <div className="lg:hidden bg-white p-3 rounded-2xl shadow-md border border-purple-50 flex items-center justify-between gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm font-bold text-purple-800 bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-200 active:scale-95 transition-all flex-shrink-0"><IconFilter size={16} /> ตัวกรอง <span className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}><IconChevronDown size={16} /></span></button>
            <button onClick={handleShareApp} className="bg-white border border-purple-200 text-purple-700 px-3 py-2.5 rounded-xl font-bold shadow-sm hover:bg-purple-50 flex items-center gap-1.5 text-xs flex-shrink-0"><IconShare2 size={14} /> แชร์</button>
            <div className="bg-purple-100 px-3 py-2 rounded-xl border border-purple-200 flex items-center flex-shrink-0"><span className="font-extrabold text-purple-700 text-lg mr-1">{filteredResources.length}</span><span className="text-purple-600 font-medium text-xs">แห่ง</span></div>
          </div>
          {showFilters && (<div className="lg:hidden bg-white p-4 rounded-2xl shadow-md border border-purple-50 animate-fade-in-up space-y-3"><div><label className="block text-xs font-bold text-purple-900 mb-1">ประเภทแหล่งเรียนรู้</label><select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full appearance-none border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2.5 bg-gray-50 text-sm font-medium border"><option value="all">ทั้งหมด</option>{Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}</select></div><div><label className="block text-xs font-bold text-purple-900 mb-1">พื้นที่ (สกร.อำเภอ)</label><select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="w-full appearance-none border-gray-200 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2.5 bg-gray-50 text-sm font-medium border"><option value="all">ทั้งหมด</option>{KALASIN_LOCATIONS.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}</select></div></div>)}
          <div className="hidden lg:grid bg-white p-5 lg:p-6 rounded-3xl shadow-xl shadow-purple-900/5 border border-purple-50 grid-cols-3 gap-5">
            <div><label className="block text-sm font-bold text-purple-900 mb-2">ประเภทแหล่งเรียนรู้</label><select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full appearance-none border-gray-200 rounded-2xl shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 bg-gray-50 text-sm font-medium transition-colors hover:bg-white border"><option value="all">ทั้งหมด</option>{Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-bold text-purple-900 mb-2">พื้นที่ (สกร.อำเภอ)</label><select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="w-full appearance-none border-gray-200 rounded-2xl shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 bg-gray-50 text-sm font-medium transition-colors hover:bg-white border"><option value="all">ทั้งหมด</option>{KALASIN_LOCATIONS.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}</select></div>
            <div className="flex items-end justify-end pb-1 text-sm text-gray-500 gap-2"><button onClick={handleShareApp} className="bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-2xl font-bold shadow-sm hover:bg-purple-50 flex items-center gap-2 h-[46px]"><IconShare2 size={18} /> แชร์หน้านี้</button><div className="bg-purple-100 px-4 py-2 rounded-2xl border border-purple-200 h-[46px] flex items-center"><span className="font-extrabold text-purple-700 text-2xl mr-1">{filteredResources.length}</span> <span className="text-purple-600 font-medium">แห่ง</span></div></div>
          </div>
          <div className="flex-grow rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative ring-1 ring-black/5">
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200" style={{ pointerEvents: 'auto' }}>
              <div className="px-3 py-2 hidden lg:block"><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">คำอธิบายสัญลักษณ์</div><div className="space-y-1">{Object.entries(MARKER_COLORS).map(([key, val]) => (<div key={key} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: val.fill }}></span><span className="text-xs text-gray-700 font-medium whitespace-nowrap">{val.label}</span></div>))}</div></div>
              <div className="px-2.5 py-1.5 lg:hidden flex items-center gap-3">{Object.entries(MARKER_COLORS).map(([key, val]) => (<div key={key} className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: val.fill }}></span><span className="text-[10px] text-gray-600 font-semibold whitespace-nowrap">{val.label.split(' ')[0]}</span></div>))}</div>
            </div>
          </div>
        </div>
      );
    };
    // 4.3 DashboardTab
    const DashboardTab = ({ resources }) => {
      const [filterDistrict, setFilterDistrict] = useState('all');
      const [filterSubDistrict, setFilterSubDistrict] = useState('all');
      const [searchQuery, setSearchQuery] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const [isPrinting, setIsPrinting] = useState(false);
      const [showComparison, setShowComparison] = useState(false);
      const itemsPerPage = 10;
      const COLORS = ['#7c3aed', '#f59e0b', '#ec4899'];
      if (!BarChart || !PieChart) return <div className="p-12 text-center text-purple-500 bg-white rounded-3xl shadow-lg border border-purple-50">กำลังโหลดกราฟ...</div>;
      const filteredData = useMemo(() => { let data = resources; if (filterDistrict !== 'all') data = data.filter(r => r.district === filterDistrict); if (filterSubDistrict !== 'all') data = data.filter(r => r.subDistrict === filterSubDistrict); if (searchQuery.trim()) { const q = searchQuery.trim().toLowerCase(); data = data.filter(r => r.name.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q)) || (r.contactInfo && r.contactInfo.includes(q))); } return data; }, [resources, filterDistrict, filterSubDistrict, searchQuery]);
      const comparisonData = useMemo(() => { return KALASIN_LOCATIONS.map(loc => { const dItems = resources.filter(r => r.district === loc.district); const shortName = loc.district.replace('สกร.ระดับอำเภอ', ''); const person = dItems.filter(r => r.type === ResourceType.PERSON).length; const innovation = dItems.filter(r => r.type === ResourceType.INNOVATION).length; const place = dItems.filter(r => r.type === ResourceType.PLACE).length; return { name: shortName, total: dItems.length, person, innovation, place, subDistrictCount: loc.subDistricts.length, coverage: loc.subDistricts.filter(sd => dItems.some(r => r.subDistrict === sd)).length }; }).sort((a, b) => b.total - a.total); }, [resources]);
      const subDistrictData = useMemo(() => { if (filterDistrict === 'all') return []; const dItems = filteredData; const counts = {}; dItems.forEach(r => { const shortSub = r.subDistrict.replace('ศกร.ระดับตำบล', ''); counts[shortSub] = (counts[shortSub] || 0) + 1; }); const found = KALASIN_LOCATIONS.find(d => d.district === filterDistrict); if (found) { found.subDistricts.forEach(sd => { const shortSub = sd.replace('ศกร.ระดับตำบล', ''); if (!counts[shortSub]) counts[shortSub] = 0; }); } return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).sort((a, b) => b.value - a.value); }, [filteredData, filterDistrict]);
      useEffect(() => { setCurrentPage(1); }, [filteredData]);
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = isPrinting ? filteredData : filteredData.slice(indexOfFirstItem, indexOfLastItem);
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      const typeData = useMemo(() => { const counts = {}; Object.values(ResourceType).forEach(t => counts[t] = 0); filteredData.forEach(r => { if (counts[r.type] !== undefined) counts[r.type]++; }); return Object.keys(counts).map(key => ({ name: key.replace('แหล่งเรียนรู้ประเภท', ''), fullName: key, value: counts[key] })); }, [filteredData]);
      const districtData = useMemo(() => { const counts = {}; KALASIN_LOCATIONS.forEach(d => { const shortName = d.district.replace('สกร.ระดับอำเภอ', ''); counts[shortName] = 0; }); filteredData.forEach(r => { const shortName = r.district.replace('สกร.ระดับอำเภอ', ''); counts[shortName] = (counts[shortName] || 0) + 1; }); return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).sort((a, b) => b.value - a.value); }, [filteredData]);
      const availableSubDistricts = useMemo(() => { if (filterDistrict === 'all') return []; const found = KALASIN_LOCATIONS.find(d => d.district === filterDistrict); return found ? found.subDistricts : []; }, [filterDistrict]);
      const handlePrint = () => { setIsPrinting(true); setTimeout(() => { window.print(); setIsPrinting(false); }, 500); };
      const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
      const handleShare = (resource) => { const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${resource.latitude},${resource.longitude}`; const text = `แนะนำแหล่งเรียนรู้: ${resource.name}\n📍 ${resource.subDistrict}, ${resource.district}`; if (navigator.share) { navigator.share({ title: 'Kalasin Learning T-Map', text: text, url: googleMapsUrl }).catch(console.error); } else { Swal.fire({ title: 'แชร์พิกัดนำทาง', html: `<div class="p-2 space-y-4"><button onclick="navigator.clipboard.writeText('${googleMapsUrl}'); Swal.fire('คัดลอกลิงก์แผนที่แล้ว','','success')" class="w-full bg-purple-700 text-white p-3 rounded-xl font-bold shadow-lg">คัดลอกลิงก์ Google Maps</button></div>`, showConfirmButton: false, showCloseButton: true }); } };
      const showQRCode = (resource) => { const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${resource.latitude},${resource.longitude}`; const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(googleMapsUrl)}`; Swal.fire({ html: `<div class="flex flex-col items-center pt-2"><h3 class="text-xl font-bold text-blue-900 mb-2">QR Code นำทาง</h3><div class="bg-white p-3 border-4 border-blue-50 rounded-2xl shadow-sm mb-4"><img src="${qrUrl}" alt="QR Code" class="w-48 h-48" /></div><p class="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">${resource.name}</p><p class="text-xs text-gray-400">สแกนเพื่อเปิดแผนที่นำทาง (Google Maps)</p></div>`, showConfirmButton: true, confirmButtonText: 'ปิด', confirmButtonColor: '#1e3a8a', showCloseButton: true }); };
      return (
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-50 no-print flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full"><label className="block text-xs font-bold text-purple-400 uppercase mb-1">เลือกพื้นที่อำเภอ</label><div className="relative"><select className="w-full appearance-none border-gray-200 rounded-2xl shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 bg-gray-50 text-sm font-medium transition-colors hover:bg-white border" value={filterDistrict} onChange={(e) => { setFilterDistrict(e.target.value); setFilterSubDistrict('all'); }}><option value="all">แสดงทุกอำเภอ</option>{KALASIN_LOCATIONS.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div>
              <div className="flex-1 w-full"><label className="block text-xs font-bold text-purple-400 uppercase mb-1">ศกร.ระดับตำบล</label><div className="relative"><select className="w-full appearance-none border-gray-200 rounded-2xl shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 bg-gray-50 text-sm font-medium transition-colors hover:bg-white border" value={filterSubDistrict} onChange={(e) => setFilterSubDistrict(e.target.value)} disabled={filterDistrict === 'all'}><option value="all">ทั้งหมด</option>{availableSubDistricts.map(s => <option key={s} value={s}>{s}</option>)}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div>
              <button onClick={handlePrint} className="w-full md:w-auto bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-purple-900 px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold text-sm border border-yellow-300"><IconPrinter size={20} /> พิมพ์รายงานทางการ</button>
            </div>
            <div className="relative"><IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="🔍 ค้นหาชื่อแหล่งเรียนรู้..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-sm font-medium focus:border-purple-500 focus:ring-purple-500 focus:bg-white transition-colors" /></div>
          </div>
          <div className="bg-white p-6 md:p-12 rounded-[2rem] shadow-xl shadow-gray-200/50 print:shadow-none print:w-full print:p-0 print:rounded-none border border-gray-100 print:border-none">
            <div className="hidden print:flex flex-row items-center gap-4 mb-4 pb-4 border-b border-gray-300"><img src={LOGO_URL} className="h-20 w-20 object-cover rounded-full border border-gray-200" alt="Logo" /><div className="text-left flex-1"><h1 className="text-xl font-bold text-black leading-tight">สรุปแผนที่แหล่งเรียนรู้ชุมชน Kalasin Learning T-Map</h1><h2 className="text-sm font-semibold text-gray-600 mt-1">สำนักงานส่งเสริมการเรียนรู้ประจำจังหวัดกาฬสินธุ์</h2><div className="mt-2 text-xs text-gray-500">ข้อมูล ณ วันที่: {new Date().toLocaleDateString('th-TH')} {filterDistrict !== 'all' ? `(เฉพาะ: ${filterDistrict})` : ''}</div></div></div>
            <div className="print:hidden flex flex-col items-center mb-8 text-center border-b border-gray-100 pb-8"><img src={LOGO_URL} alt="Logo" className="h-28 w-28 object-cover rounded-full mb-6 drop-shadow-xl border-4 border-white shadow-purple-200" /><h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-800 print-text-primary mb-2">สรุปข้อมูลแหล่งเรียนรู้ชุมชน (Learning T-Map)</h1><h2 className="text-lg md:text-xl text-gray-500 font-semibold tracking-wide">สำนักงานส่งเสริมการเรียนรู้ประจำจังหวัดกาฬสินธ์ุ</h2><div className="mt-6 px-6 py-2 bg-purple-50 text-purple-900 rounded-full text-sm font-bold border border-purple-100 inline-block shadow-sm">ข้อมูล: {filterDistrict !== 'all' ? filterDistrict : 'ทุกอำเภอ'} {filterSubDistrict !== 'all' && ` - ${filterSubDistrict}`}</div></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 no-print">
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl text-center border border-purple-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-10"><IconBarChart size={64} className="text-purple-500" /></div><h3 className="text-gray-500 font-bold mb-2 uppercase tracking-wider text-xs">ทั้งหมด</h3><p className="text-5xl md:text-6xl font-black text-purple-700 tracking-tighter">{filteredData.length}</p><p className="text-sm text-gray-400 mt-2 font-medium">แห่ง</p></div>
              {typeData.map((t) => (<div key={t.name} className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"><div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div><h3 className="text-gray-600 font-bold mb-2 truncate px-2 text-sm">{t.name}</h3><p className="text-4xl md:text-5xl font-extrabold text-gray-800">{t.value}</p><p className="text-sm text-gray-400 mt-2 font-medium">แห่ง</p></div>))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 break-inside-avoid no-print">
              <div className="h-96 w-full border border-gray-100 rounded-3xl p-6 shadow-sm bg-white"><h3 className="text-center font-bold text-gray-700 mb-6 text-lg flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> สัดส่วนตามประเภท</h3><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={typeData} cx="50%" cy="50%" labelLine={true} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={90} fill="#8884d8" dataKey="value">{typeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart></ResponsiveContainer></div>
              <div className="h-96 w-full border border-gray-100 rounded-3xl p-6 shadow-sm bg-white"><h3 className="text-center font-bold text-gray-700 mb-6 text-lg flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> จำนวนแยกตามพื้นที่</h3><ResponsiveContainer width="100%" height="100%"><BarChart data={districtData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f0f0f0" /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="name" type="category" width={100} style={{ fontSize: '0.7rem', fontWeight: 600, fill: '#6b7280' }} /><Bar dataKey="value" fill="#7c3aed" radius={[0, 6, 6, 0]} label={{ position: 'right', fill: '#6b7280', fontSize: 12, fontWeight: 600 }} barSize={20} /></BarChart></ResponsiveContainer></div>
            </div>
            {filterDistrict !== 'all' && subDistrictData.length > 0 && (<div className="mb-12 break-inside-avoid no-print"><div className="h-auto w-full border border-gray-100 rounded-3xl p-6 shadow-sm bg-white"><h3 className="text-center font-bold text-gray-700 mb-6 text-lg flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> จำนวนแยกตาม ศกร.ตำบล — {filterDistrict.replace('สกร.ระดับอำเภอ', '')}</h3><ResponsiveContainer width="100%" height={Math.max(200, subDistrictData.length * 35)}><BarChart data={subDistrictData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="name" type="category" width={120} style={{ fontSize: '0.7rem', fontWeight: 600, fill: '#6b7280' }} /><Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} label={{ position: 'right', fill: '#6b7280', fontSize: 12, fontWeight: 600 }} barSize={18} /></BarChart></ResponsiveContainer></div></div>)}
            <div className="mb-8 no-print"><button onClick={() => setShowComparison(!showComparison)} className={`w-full py-4 rounded-2xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${showComparison ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/30' : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'}`}><IconBarChart size={20} /> {showComparison ? '🔼 ซ่อนตารางเปรียบเทียบ' : '📊 แสดงตารางเปรียบเทียบข้อมูลระหว่างอำเภอ'}</button></div>
            {showComparison && (<div className="mb-12 overflow-hidden rounded-3xl border border-purple-200 shadow-lg no-print animate-fade-in-up"><div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4"><h3 className="text-white font-bold text-lg flex items-center gap-2">📊 เปรียบเทียบข้อมูลระหว่างอำเภอ</h3></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-100 text-sm"><thead className="bg-purple-50"><tr><th className="px-4 py-3 text-left font-bold text-purple-900 text-xs">อำเภอ</th><th className="px-4 py-3 text-center font-bold text-purple-900 text-xs">ทั้งหมด</th><th className="px-4 py-3 text-center font-bold text-purple-900 text-xs">บุคคล</th><th className="px-4 py-3 text-center font-bold text-purple-900 text-xs">สื่อ/นวัตกรรม</th><th className="px-4 py-3 text-center font-bold text-purple-900 text-xs">สถานที่</th><th className="px-4 py-3 text-center font-bold text-purple-900 text-xs">ตำบลที่ครอบคลุม</th></tr></thead><tbody className="bg-white divide-y divide-gray-100">{comparisonData.map((d, idx) => (<tr key={d.name} className={`hover:bg-purple-50/50 transition-colors ${idx === 0 ? 'bg-amber-50/50' : ''}`}><td className="px-4 py-3 font-bold text-gray-800 flex items-center gap-2">{idx === 0 && <span className="text-amber-500">🏆</span>}{d.name}</td><td className="px-4 py-3 text-center font-extrabold text-purple-700 text-lg">{d.total}</td><td className="px-4 py-3 text-center text-gray-600">{d.person}</td><td className="px-4 py-3 text-center text-gray-600">{d.innovation}</td><td className="px-4 py-3 text-center text-gray-600">{d.place}</td><td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold ${d.coverage === d.subDistrictCount ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{d.coverage}/{d.subDistrictCount}</span></td></tr>))}</tbody></table></div></div>)}
            <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm print:rounded-none print:border-none">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-white print:bg-gray-100 print:text-black"><tr><th className="px-4 py-3 text-center font-bold text-gray-700 w-[5%] uppercase tracking-wider text-xs bg-gray-50/50 print:border-b print:border-gray-300">ลำดับ</th><th className="px-4 py-3 text-center font-bold text-gray-700 w-[45%] uppercase tracking-wider text-xs bg-gray-50/50 print:border-b print:border-gray-300">ชื่อแหล่งเรียนรู้</th><th className="px-4 py-3 text-center font-bold text-gray-700 w-[20%] hidden md:table-cell print:table-cell uppercase tracking-wider text-xs bg-gray-50/50 print:border-b print:border-gray-300">ประเภท</th><th className="px-4 py-3 text-center font-bold text-gray-700 w-[10%] uppercase tracking-wider text-xs bg-gray-50/50 print:border-b print:border-gray-300 no-print">การเข้าถึง</th><th className="px-4 py-3 text-center font-bold text-gray-700 w-[30%] uppercase tracking-wider text-xs bg-gray-50/50 print:border-b print:border-gray-300">ที่ตั้ง (ตำบล, อำเภอ)</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentItems.map((item, idx) => (<tr key={item.id} className="group hover:bg-purple-50/50 transition-colors print:break-inside-avoid"><td className="px-4 py-3 text-center text-gray-500 font-mono group-hover:text-purple-600 font-medium print:border-b print:border-gray-200 print:text-black">{isPrinting ? idx + 1 + indexOfFirstItem : indexOfFirstItem + idx + 1}</td><td className="px-4 py-3 font-semibold text-gray-800 group-hover:text-purple-900 print:border-b print:border-gray-200 print:text-black">{item.name}<div className="md:hidden print:hidden text-xs text-purple-500 mt-1 font-normal bg-purple-50 inline-block px-2 py-0.5 rounded-md border border-purple-100">{item.type.replace('แหล่งเรียนรู้ประเภท', '')}</div></td><td className="px-4 py-3 text-center text-gray-600 hidden md:table-cell print:table-cell print:border-b print:border-gray-200 print:text-black"><span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200 group-hover:bg-white group-hover:shadow-sm transition-all print:bg-transparent print:border-none print:shadow-none print:p-0">{item.type.replace('แหล่งเรียนรู้ประเภท', '')}</span></td><td className="px-4 py-3 text-center no-print"><div className="flex justify-center gap-2"><button onClick={() => handleShare(item)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-50 active:scale-90" title="แชร์พิกัด"><IconShare2 size={16} /></button><button onClick={() => showQRCode(item)} className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-all border border-amber-50 active:scale-90" title="QR Code"><IconQrCode size={16} /></button></div></td><td className="px-4 py-3 text-left text-gray-500 group-hover:text-gray-700 print:border-b print:border-gray-200 print:text-black">{item.subDistrict}, <br className="md:hidden print:hidden" />{item.district.replace('สกร.ระดับอำเภอ', '')}</td></tr>))}
                  {currentItems.length === 0 && <tr><td colSpan="5" className="px-6 py-16 text-center text-gray-400 bg-gray-50/30">ไม่พบข้อมูล</td></tr>}
                </tbody>
              </table>
            </div>
            {!isPrinting && totalPages > 1 && (<div className="flex items-center justify-center gap-3 p-5 bg-gray-50 border-t border-gray-200 no-print"><button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 shadow-sm transition-all hover:border-purple-300 text-gray-600"><IconChevronLeft size={20} /></button><span className="text-sm font-bold text-gray-700 px-4 bg-white py-2 rounded-xl border border-gray-200 shadow-sm">หน้า {currentPage} / {totalPages}</span><button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 shadow-sm transition-all hover:border-purple-300 text-gray-600"><IconChevronRight size={20} /></button></div>)}
          </div>
        </div>
      );
    };
    // 4.4 AdminTab (แก้ไข: อัพโหลดรูปไป Google Drive แทนเก็บ Base64)
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
            finalImageUrl = await uploadImageToDrive(imageBase64, imgFileName);
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
