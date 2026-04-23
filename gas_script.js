/**
 * 대한작업치료학회 보수교육 신청 - Google Apps Script
 * 
 * 사용법:
 * 1. Google Sheets 열기 → 확장 프로그램 → Apps Script
 * 2. 이 코드 전체 붙여넣기 후 저장
 * 3. 배포 → 새 배포 → 웹 앱 → 액세스: 모든 사용자 → 배포
 * 4. 웹 앱 URL을 index.html의 GAS_URL 상수에 입력
 */

const SHEET_NAME = '신청목록';
const HEADERS = [
  '타임스탬프', '이름', '소속기관', '임상경력', '임상분야',
  '연락처', '이메일',
  '회원유형', '협회아이디', '회원번호', '협회회원등급',
  '오전신청', '오후신청', '신청교육목록', '납부예정액'
];

function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    // 헤더 행 자동 생성
    if (sheet.getLastRow() === 0) {
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setValues([HEADERS]);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1A355E');
      headerRange.setFontColor('#FFFFFF');
    }

    const data = JSON.parse(e.postData.contents);

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

    // 중복 신청 체크 (같은 이메일+교육 조합)
    // 필요 시 활성화
    // checkDuplicate(sheet, data);

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
