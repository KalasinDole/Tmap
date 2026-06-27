// SHEET ID ของฐานข้อมูล (กรุณาเปลี่ยนเป็น ID ของ Google Sheet ของคุณถ้าจำเป็น)
var SPREADSHEET_ID = '1HP49qt1YW8W6lE3d9Vz7LUqi8NUE1M_V4IdZadCIMy4';
var SHEET_NAME = 'Sheet1';

// ชื่อ Folder ใน Google Drive สำหรับเก็บรูปภาพ (สร้างอัตโนมัติ)
var DRIVE_FOLDER_NAME = 'Kalasin_TMap_Images';

function handleResponse(response) {
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getSheetData') {
    try {
      var data = getSheetData();
      return handleResponse({ status: 'success', data: data });
    } catch (error) {
      return handleResponse({ status: 'error', message: error.toString() });
    }
  }
  
  return handleResponse({ status: 'error', message: 'Invalid or missing action parameter' });
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    
    if (action === 'uploadImageToDrive') {
      var url = uploadImageToDrive(payload.base64Data, payload.fileName);
      return handleResponse({ status: 'success', url: url });
    }
    
    if (action === 'addSheetData') {
      var result = addSheetData(JSON.stringify(payload.data));
      return handleResponse({ status: 'success', success: result });
    }
    
    if (action === 'deleteResource') {
      var result = deleteResource(payload.id);
      return handleResponse({ status: 'success', success: result });
    }

    if (action === 'migrateExistingImages') {
      var result = migrateExistingImages();
      return handleResponse({ status: 'success', success: result });
    }
    
    return handleResponse({ status: 'error', message: 'Invalid action' });
      
  } catch (error) {
    return handleResponse({ status: 'error', message: error.toString() });
  }
}

// --- ฟังก์ชันสำหรับทดสอบระบบ ---
function testSystem() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = _getSheet(ss);
    return "การเชื่อมต่อสมบูรณ์: " + sheet.getName() + " (จำนวนแถว: " + sheet.getLastRow() + ")";
  } catch (e) {
    return "Error: " + e.message;
  }
}

// ฟังก์ชันช่วยเลือก Sheet
function _getSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    if (ss.getSheets().length > 0) {
      sheet = ss.getSheets()[0];
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }
  return sheet;
}

// --- ฟังก์ชันสำหรับหา/สร้าง Folder ใน Google Drive ---
function _getOrCreateFolder() {
  var folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  // สร้าง folder ใหม่ถ้ายังไม่มี
  var folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
  return folder;
}

// --- ฟังก์ชันอัพโหลดรูปภาพไป Google Drive ---
function uploadImageToDrive(base64Data, fileName) {
  try {
    if (!base64Data || base64Data.length < 100) {
      return '';
    }
    
    var folder = _getOrCreateFolder();
    
    // แยก header ออกจาก Base64 data
    var parts = base64Data.split(',');
    var contentType = 'image/jpeg';
    if (parts[0].indexOf('image/png') !== -1) {
      contentType = 'image/png';
    }
    var data = parts.length > 1 ? parts[1] : parts[0];
    
    // แปลง Base64 → Blob
    var blob = Utilities.newBlob(Utilities.base64Decode(data), contentType, fileName);
    
    // สร้างไฟล์ใน Drive
    var file = folder.createFile(blob);
    
    // ตั้งค่าให้ทุกคนดูได้
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // ส่ง URL thumbnail กลับ (โหลดเร็วกว่า direct link)
    var imageUrl = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w800';
    
    return imageUrl;
  } catch (e) {
    Logger.log('Upload error: ' + e.message);
    return '';
  }
}

// --- API Functions ---
function getSheetData() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = _getSheet(ss);

  if (sheet.getLastRow() <= 1) {
    if (sheet.getLastRow() === 0) {
       var header = ['id', 'name', 'district', 'subDistrict', 'type', 'description', 'latitude', 'longitude', 'contactInfo', 'imageUrl', 'timestamp'];
       sheet.appendRow(header);
    }
    // เพิ่มข้อมูลตัวอย่างถ้าว่างเปล่า
    var sampleData = [
      'sample-001',
      'พิพิธภัณฑ์สิรินธร (ข้อมูลตัวอย่าง)',
      'สกร.ระดับอำเภอสหัสขันธ์',
      'ศกร.ระดับตำบลโนนบุรี',
      'แหล่งเรียนรู้ประเภทสถานที่',
      'พิพิธภัณฑ์ไดโนเสาร์ที่ดีที่สุดในอาเซียน',
      16.7088,
      103.5230,
      '043-871-014',
      'https://thai.tourismthailand.org/images/attraction_gallery/1024x768/3371-11883-1.jpg',
      new Date().getTime()
    ];
    sheet.appendRow(sampleData);
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = data.slice(1);

  return rows.map(function(row) {
    var obj = {};
    headers.forEach(function(header, i) {
      obj[header] = row[i];
    });
    return obj;
  }).filter(function(item) { return item && item.id && item.name; });
}

function addSheetData(jsonData) {
  if (!jsonData) return false;
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = _getSheet(ss);
  var data = JSON.parse(jsonData);

  var row = [
    data.id,
    data.name,
    data.district,
    data.subDistrict,
    data.type,
    data.description,
    data.latitude,
    data.longitude,
    data.contactInfo,
    data.imageUrl,
    data.timestamp
  ];

  sheet.appendRow(row);
  return true;
}

function deleteSheetData(id) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = _getSheet(ss);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

// ============================================================
// ฟังก์ชัน MIGRATION — รันครั้งเดียวเพื่อแปลง Base64 เดิมเป็น Google Drive URL
// ============================================================
// วิธีใช้: ใน Apps Script Editor กด Run → เลือก migrateExistingImages
// ถ้าข้อมูลเยอะ (>50 แถว) ให้รันซ้ำจนกว่าจะขึ้น "เสร็จสมบูรณ์"
// ============================================================

function migrateExistingImages() {
  var BATCH_SIZE = 30; // จำนวนแถวต่อรอบ (น้อยลง = ปลอดภัยกว่า)
  var IMAGE_COL = 10;  // คอลัมน์ J (imageUrl) = คอลัมน์ที่ 10
  var MAX_RUNTIME_MS = 5 * 60 * 1000; // หยุดก่อน 5 นาที (จำกัด GAS 6 นาที)
  
  var startTime = new Date().getTime();
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = _getSheet(ss);
  var lastRow = sheet.getLastRow();
  
  // ดึงแถวที่เริ่มต้น (จากรอบก่อน หรือแถวที่ 2)
  var props = PropertiesService.getScriptProperties();
  var startRow = parseInt(props.getProperty('MIGRATE_START_ROW') || '2');
  
  if (startRow > lastRow) {
    Logger.log('✅ การย้ายข้อมูลเสร็จสมบูรณ์แล้ว! (ไม่มีแถวเหลือ)');
    props.deleteProperty('MIGRATE_START_ROW');
    return '✅ เสร็จสมบูรณ์! ไม่มีข้อมูล Base64 เหลือ';
  }
  
  var folder = _getOrCreateFolder();
  var converted = 0;
  var skipped = 0;
  var errors = 0;
  var currentRow = startRow;
  
  Logger.log('🚀 เริ่ม Migration จากแถว ' + startRow + ' ถึง ' + lastRow);
  
  for (var i = startRow; i <= lastRow && i < startRow + BATCH_SIZE; i++) {
    // เช็คเวลา - หยุดก่อนหมดเวลา
    if (new Date().getTime() - startTime > MAX_RUNTIME_MS) {
      Logger.log('⏱️ หมดเวลา — หยุดที่แถว ' + i + ' กรุณารันอีกครั้ง');
      props.setProperty('MIGRATE_START_ROW', String(i));
      return '⏱️ หมดเวลา: แปลงได้ ' + converted + ' รูป, ข้าม ' + skipped + ', error ' + errors + ' — กรุณารันอีกครั้ง (จะเริ่มต่อจากแถว ' + i + ')';
    }
    
    currentRow = i;
    
    try {
      var cellValue = sheet.getRange(i, IMAGE_COL).getValue();
      
      // ข้ามถ้าไม่ใช่ Base64
      if (!cellValue || typeof cellValue !== 'string' || cellValue.indexOf('data:image') !== 0) {
        skipped++;
        continue;
      }
      
      // ข้ามถ้าเป็น URL อยู่แล้ว
      if (cellValue.indexOf('http') === 0) {
        skipped++;
        continue;
      }
      
      // แปลง Base64 → Google Drive
      var fileName = 'migrate_row' + i + '_' + Date.now() + '.jpg';
      var parts = cellValue.split(',');
      var contentType = 'image/jpeg';
      if (parts[0].indexOf('image/png') !== -1) {
        contentType = 'image/png';
        fileName = fileName.replace('.jpg', '.png');
      }
      var data = parts.length > 1 ? parts[1] : parts[0];
      
      var blob = Utilities.newBlob(Utilities.base64Decode(data), contentType, fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      var imageUrl = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w800';
      
      // เขียน URL กลับลง Sheet แทน Base64
      sheet.getRange(i, IMAGE_COL).setValue(imageUrl);
      
      converted++;
      Logger.log('✅ แถว ' + i + ': แปลงสำเร็จ → ' + imageUrl);
      
    } catch (e) {
      errors++;
      Logger.log('❌ แถว ' + i + ': Error — ' + e.message);
    }
  }
  
  // บันทึกตำแหน่งสำหรับรอบถัดไป
  var nextRow = currentRow + 1;
  if (nextRow > lastRow) {
    props.deleteProperty('MIGRATE_START_ROW');
    Logger.log('🎉 การย้ายข้อมูลเสร็จสมบูรณ์!');
    return '🎉 เสร็จสมบูรณ์! แปลง ' + converted + ' รูป, ข้าม ' + skipped + ', error ' + errors;
  } else {
    props.setProperty('MIGRATE_START_ROW', String(nextRow));
    Logger.log('📋 รอบนี้เสร็จ — รันอีกครั้งเพื่อทำต่อจากแถว ' + nextRow);
    return '📋 แปลง ' + converted + ' รูป, ข้าม ' + skipped + ', error ' + errors + ' — กรุณารันอีกครั้ง (เหลืออีก ' + (lastRow - nextRow + 1) + ' แถว)';
  }
}

// ฟังก์ชันรีเซ็ต — ใช้ถ้าอยากเริ่ม Migration ใหม่ตั้งแต่แถวแรก
function resetMigration() {
  PropertiesService.getScriptProperties().deleteProperty('MIGRATE_START_ROW');
  Logger.log('🔄 รีเซ็ตแล้ว — จะเริ่มจากแถว 2 ในรอบถัดไป');
  return '🔄 รีเซ็ตแล้ว';
}

// ฟังก์ชันเช็คสถานะ Migration
function checkMigrationStatus() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = _getSheet(ss);
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(2, 10, lastRow - 1, 1).getValues();
  
  var base64Count = 0;
  var urlCount = 0;
  var emptyCount = 0;
  
  for (var i = 0; i < data.length; i++) {
    var val = String(data[i][0]);
    if (val.indexOf('data:image') === 0) base64Count++;
    else if (val.indexOf('http') === 0) urlCount++;
    else emptyCount++;
  }
  
  var result = '📊 สถานะ Migration:\n' +
    '- ทั้งหมด: ' + data.length + ' แถว\n' +
    '- Base64 (ยังไม่แปลง): ' + base64Count + '\n' +
    '- URL (แปลงแล้ว): ' + urlCount + '\n' +
    '- ไม่มีรูป: ' + emptyCount;
  
  Logger.log(result);
  return result;
}
