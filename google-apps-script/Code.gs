const SPREADSHEET_ID = '1MOfg1CpTSydQy0DEAWryEKms7qFipElj0A7VrSb7Om8';

function doGet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const payload = {
    classes: readSheet_(ss, '课程进度矩阵'),
    courses: readSheet_(ss, '课程资源库'),
    classProfiles: readSheet_(ss, '班级档案'),
    weekly: readSheet_(ss, '本周重点'),
    meetings: readSheet_(ss, '会议教研'),
    appointments: readSheet_(ss, '咨询预约'),
    cases: readSheet_(ss, '个案索引')
  };
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function readSheet_(ss, name) {
  const sh = ss.getSheetByName(name);
  if (!sh) return [];
  const values = sh.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  const headers = values[0].map(x => String(x).trim());
  return values.slice(1)
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => Object.fromEntries(headers.map((h, i) => [h || `col${i+1}`, row[i] || ''])));
}
