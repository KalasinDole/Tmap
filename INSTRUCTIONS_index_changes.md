# วิธีแก้ไข index.html — เก็บรูปใน Google Drive แทน Base64

## จุดที่ต้องแก้ไขมี 2 จุดเท่านั้น

---

## จุดที่ 1: เพิ่ม uploadImageToDrive ใน runServerFunction (mock)

ค้นหาบรรทัดนี้ใน index.html:
```
else if (functionName === 'deleteSheetData') {
```

แล้วเพิ่มโค้ดนี้ **ก่อนหน้า** บรรทัดนั้น:
```javascript
          else if (functionName === 'uploadImageToDrive') {
            setTimeout(() => resolve(args[0]), 500); // mock: return base64 as-is for local testing
          }
```

---

## จุดที่ 2: แก้ handleSubmit ใน AdminTab

ค้นหาส่วน handleSubmit ของ AdminTab แล้ว **แทนที่ทั้งฟังก์ชัน** ด้วยโค้ดนี้:

```javascript
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.district || !formData.subDistrict || !formData.latitude || !formData.longitude) { Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน', 'warning'); return; }
        if (isCompressing) { Swal.fire('รอสักครู่', 'กำลังประมวลผลรูปภาพ...', 'info'); return; }
        setIsSubmitting(true);
        Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
          // ถ้ามีรูปภาพ ให้อัพโหลดไป Google Drive ก่อน
          let finalImageUrl = '';
          if (imageBase64) {
            Swal.fire({ title: 'กำลังอัพโหลดรูปภาพ...', text: 'อัพโหลดรูปไป Google Drive', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const imgFileName = 'tmap_' + Date.now() + '.jpg';
            finalImageUrl = await runServerFunction('uploadImageToDrive', imageBase64, imgFileName);
            if (!finalImageUrl) {
              Swal.fire('แจ้งเตือน', 'อัพโหลดรูปภาพไม่สำเร็จ ข้อมูลจะถูกบันทึกโดยไม่มีรูป', 'warning');
            }
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
```

---

## สรุปสิ่งที่เปลี่ยน

| ก่อน | หลัง |
|------|------|
| รูปภาพ Base64 ส่งตรงเข้า Sheet | รูปภาพถูกอัพโหลดไป Google Drive ก่อน เก็บแค่ URL ใน Sheet |
| `imageUrl: imageBase64` (100,000+ ตัวอักษร) | `imageUrl: "https://drive.google.com/thumbnail?id=xxx"` (~70 ตัวอักษร) |
| Sheet ขนาดใหญ่มาก โหลดช้า | Sheet ขนาดเล็ก โหลดเร็ว |
