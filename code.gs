/**
 * 대한작업치료학회 보수교육 신청 - Google Apps Script
 *
 * 사용법:
 * 1. Google Sheets 열기 -> 확장 프로그램 -> Apps Script
 * 2. 이 코드 전체 붙여넣기 후 저장
 * 3. 배포 -> 배포 관리 -> 새 버전 배포
 * 4. 웹 앱 URL을 index.html의 GAS_URL 상수에 입력
 */

const SHEET_NAME = '신청목록';
const HEADERS = [
  '타임스탬프', '이름', '소속기관', '임상경력', '임상분야',
  '연락처', '이메일',
  '회원유형', '협회아이디', '회원번호', '협회회원등급',
  '오전신청', '오후신청', '신청교육목록', '납부예정액'
];

function ensureSheetSchema(sheet) {
  if (sheet.getLastRow() === 0) {
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);
    styleHeader(headerRange);
    return;
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const hasExperience = currentHeaders.includes('임상경력');
  const hasClinicalField = currentHeaders.includes('임상분야');

  // 기존 신청목록에 새 수집 항목이 없으면 소속기관 뒤에 컬럼을 추가해 기존 데이터 위치를 보존합니다.
  if (!hasExperience && !hasClinicalField) {
    sheet.insertColumnsAfter(3, 2);
  } else if (!hasExperience) {
    sheet.insertColumnAfter(3);
  } else if (!hasClinicalField) {
    sheet.insertColumnAfter(4);
  }

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  styleHeader(headerRange);
}

function styleHeader(headerRange) {
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1A355E');
  headerRange.setFontColor('#FFFFFF');
}

function parsePostData(e) {
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // form-urlencoded 전송은 e.parameter로 처리합니다.
    }
  }

  return e.parameter || {};
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    ensureSheetSchema(sheet);

    const data = parsePostData(e);

    sheet.appendRow([
      data.timestamp     || new Date().toLocaleString('ko-KR'),
      data.name          || '',
      data.org           || '',
      data.experience    || '',
      data.clinicalField || '',
      data.phone         || '',
      data.email         || '',
      data.memberType    || '',
      data.memberLoginId || '',
      data.memberId      || '',
      data.memberGrade   || '',
      data.morning       || 'N',
      data.afternoon     || 'N',
      data.eduList       || '',
      data.totalAmt      || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: '신청이 완료되었습니다.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 요청 테스트용 (브라우저에서 URL 직접 접속 시)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'GAS 연결 정상' }))
    .setMimeType(ContentService.MimeType.JSON);
}
