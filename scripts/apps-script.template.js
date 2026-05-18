/**
 * Adnovara hiring pipeline — Google Apps Script.
 *
 * Deploy as Web App:
 *   - "Execute as": Me (the Drive/Sheet owner)
 *   - "Who has access": Anyone
 *
 * Replace the three constants below before deploying.
 *
 * SHEET_ID is the long ID in the spreadsheet URL between /d/ and /edit:
 *   https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit
 * Using openById works whether the script is standalone or container-bound.
 */

const SHEET_ID = 'PASTE_SPREADSHEET_ID_HERE';
const DRIVE_FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE';
const READ_SECRET = 'PASTE_LONG_RANDOM_STRING_HERE';

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheets()[0];
}

const HEADERS = [
  'submittedAt', 'id', 'fullName', 'email', 'country', 'phone',
  'portfolioUrl', 'currentCompany', 'yearsExperience', 'expectedSalary',
  'noticePeriod', 'coverNote', 'clientIp', 'userAgent', 'forwarded',
  'cvDriveUrl', 'testAnswerDriveUrl',
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const driveUrls = { cv: '', testAnswer: '' };

    if (Array.isArray(body.files)) {
      for (const f of body.files) {
        if (f.field !== 'cv' && f.field !== 'testAnswer') continue;
        const blob = Utilities.newBlob(
          Utilities.base64Decode(f.base64),
          f.contentType || 'application/octet-stream',
          (body.id || 'app') + '-' + f.field + '-' + (f.filename || 'file'),
        );
        const file = folder.createFile(blob);
        driveUrls[f.field] = file.getUrl();
      }
    }

    const sheet = getSheet_();
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    sheet.appendRow([
      body.submittedAt, body.id, body.fullName, body.email, body.country, body.phone,
      body.portfolioUrl, body.currentCompany, body.yearsExperience, body.expectedSalary,
      body.noticePeriod, body.coverNote, body.clientIp, body.userAgent, body.forwarded,
      driveUrls.cv, driveUrls.testAnswer,
    ]);

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  const secret = (e && e.parameter && e.parameter.secret) || '';
  if (!constantTimeEqual(secret, READ_SECRET)) {
    return jsonOut({ ok: false, error: 'forbidden' });
  }
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length === 0) return jsonOut({ headers: HEADERS, rows: [] });
  const headers = values[0].map(String);
  const rows = values.slice(1).map(r => r.map(v => (v == null ? '' : String(v))));
  return jsonOut({ headers, rows });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) {
    let z = 0;
    for (let i = 0; i < a.length; i++) z |= a.charCodeAt(i) ^ a.charCodeAt(i);
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
