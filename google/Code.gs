/**
 * فضاء آفاق — Google Apps Script backend.
 * The app (file "index") is served as a web app; every record is one row in this spreadsheet.
 * The team code is read from sheet «الإعدادات», cell B1.
 */
const COLS = ['children', 'records', 'goals', 'activities', 'plan'];
const SHEET_NAMES = { children: 'الأطفال', records: 'السجلات', goals: 'الأهداف', activities: 'الأنشطة', plan: 'الخطة السنوية' };
const HEADERS = ['id', 'التاريخ', 'الطفل', 'الوصف', 'سجّله', 'آخر تعديل', 'json'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('فضاء آفاق')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

/** Run once from the editor: creates the sheets. */
function setup() {
  settings_();
  COLS.forEach(sheet_);
}

function settings_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName('الإعدادات');
  if (!sh) {
    sh = ss.insertSheet('الإعدادات', 0);
    sh.getRange('A1:A2').setValues([['رمز الفريق'], ['اكتب في الخانة B1 رمزًا سريًا، ثم أعطه لأعضاء الفريق.']]);
    sh.setColumnWidth(1, 160);
    sh.setColumnWidth(2, 220);
  }
  return sh;
}

function sheet_(col) {
  if (COLS.indexOf(col) < 0) throw new Error('BAD_COLLECTION');
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET_NAMES[col]);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAMES[col]);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setRightToLeft(true);
  }
  return sh;
}

function auth_(code) {
  const want = String(settings_().getRange('B1').getValue()).trim();
  if (!want) throw new Error('NO_CODE');
  if (String(code || '').trim() !== want) throw new Error('BAD_CODE');
}

function rowFor_(obj) {
  const label = obj.title || obj.text || (obj.code ? obj.code + ' ' + (obj.name || '') : '') || obj.type || '';
  return [obj.id, obj.date || '', obj.childId || '', label, obj.byName || '', new Date(), JSON.stringify(obj)];
}

function findRow_(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return 0;
  const hit = sh.getRange(2, 1, last - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

function apiList(code) {
  auth_(code);
  const out = {};
  COLS.forEach(function (col) {
    const sh = sheet_(col), last = sh.getLastRow();
    out[col] = last < 2 ? [] : sh.getRange(2, 7, last - 1, 1).getValues()
      .map(function (r) { try { return JSON.parse(r[0]); } catch (e) { return null; } })
      .filter(Boolean);
  });
  return JSON.stringify(out);
}

function apiPut(code, col, json) {
  auth_(code);
  const obj = JSON.parse(json);
  if (!obj.id) throw new Error('NO_ID');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_(col), row = findRow_(sh, obj.id), values = [rowFor_(obj)];
    if (row) sh.getRange(row, 1, 1, HEADERS.length).setValues(values);
    else sh.getRange(sh.getLastRow() + 1, 1, 1, HEADERS.length).setValues(values);
  } finally { lock.releaseLock(); }
  return true;
}

function apiRemove(code, col, id) {
  auth_(code);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_(col), row = findRow_(sh, id);
    if (row) sh.deleteRow(row);
  } finally { lock.releaseLock(); }
  return true;
}

/** Deletes a child and every record and goal that belongs to them. */
function apiDeleteChild(code, id) {
  auth_(code);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    ['records', 'goals'].forEach(function (col) {
      const sh = sheet_(col), last = sh.getLastRow();
      if (last < 2) return;
      const kids = sh.getRange(2, 3, last - 1, 1).getValues();
      for (let i = kids.length - 1; i >= 0; i--) if (kids[i][0] === id) sh.deleteRow(i + 2);
    });
    const sh = sheet_('children'), row = findRow_(sh, id);
    if (row) sh.deleteRow(row);
  } finally { lock.releaseLock(); }
  return true;
}
