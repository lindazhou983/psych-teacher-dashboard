const SPREADSHEET_ID = '1MOfg1CpTSydQy0DEAWryEKms7qFipElj0A7VrSb7Om8';

function doGet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const payload = {
    classes: sanitizeClasses_(readSheet_(ss, '课程进度矩阵')),
    courses: readSheet_(ss, '课程资源库'),
    weekly: sanitizeWeekly_(readSheet_(ss, '本周重点')),
    meetings: sanitizeMeetings_(readSheet_(ss, '会议教研')),
    appointments: [],
    cases: [],
    calendar: []
  };
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitizeClasses_(rows) {
  return rows.map(r => ({
    '班级': r['班级'] || '',
    '当前课题': r['当前课题'] || '',
    '实际进度': r['实际进度'] || '',
    '下节衔接': r['下节衔接'] || '',
    '最近上课日期': r['最近上课日期'] || '',
    '班主任': r['班主任'] || '',
    '心理委员': r['心理委员'] || '',
    '重点关注学生': '',
    '特殊备注': ''
  }));
}

function sanitizeWeekly_(rows) {
  return rows.map(r => ({
    '事项': r['事项'] || '',
    '类别': r['类别'] || '',
    '截止日期': r['截止日期'] || '',
    '状态': r['状态'] || '',
    '优先级': r['优先级'] || ''
  }));
}

function sanitizeMeetings_(rows) {
  return rows.map(r => ({
    '日期': r['日期'] || '',
    '类型': r['类型'] || '',
    '主题': r['主题'] || '',
    '组织/地点': r['组织/地点'] || '',
    '待跟进': r['待跟进'] || '',
    '自己的思考/心得': ''
  }));
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
