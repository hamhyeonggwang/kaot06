# 대한작업치료학회 보수교육 신청 페이지

대한작업치료학회 보수교육 온라인 신청 웹페이지입니다.  
Google Apps Script(GAS)와 연동하여 신청 정보를 Google Sheets에 저장합니다.

---

## 📁 파일 구조

```
ksot-edu-apply/
├── public/
│   └── index.html      ← 신청 페이지 본체
├── vercel.json         ← Vercel 배포 설정
├── .gitignore
└── README.md
```

---

## 🚀 배포 방법 (GitHub → Vercel)

### 1단계. GitHub 레포 생성 및 업로드

```bash
# 로컬에서 실행
git init
git add .
git commit -m "feat: 보수교육 신청 페이지 초기 배포"
git remote add origin https://github.com/hamhyeonggwang/ksot-edu-apply.git
git branch -M main
git push -u origin main
```

### 2단계. Vercel 연결

1. [vercel.com](https://vercel.com) 로그인
2. **Add New Project** → GitHub 레포 선택 (`ksot-edu-apply`)
3. 설정 그대로 → **Deploy** 클릭
4. 배포 완료 후 URL 확인 (예: `ksot-edu-apply.vercel.app`)

---

## 🔧 GAS 연동 설정

### 1단계. Google Sheets 준비

새 스프레드시트 생성 후 시트 이름을 `신청목록`으로 변경.

### 2단계. GAS 스크립트 작성

스프레드시트 상단 메뉴 → **확장 프로그램 → Apps Script** → 아래 코드 붙여넣기:

```javascript
const SHEET_NAME = '신청목록';
const HEADERS = [
  '타임스탬프', '이름', '소속기관', '임상경력', '임상분야',
  '연락처', '이메일',
  '회원유형', '협회아이디', '회원번호', '협회회원등급',
  '오전신청', '오후신청', '신청교육목록', '납부예정액'
];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  // 헤더가 없으면 자동 생성
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }

  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.org,
    data.experience || '',
    data.clinicalField || '',
    data.phone,
    data.email,
    data.memberType,
    data.memberLoginId || '',
    data.memberId || '',
    data.memberGrade || '',
    data.morning,
    data.afternoon,
    data.eduList,
    data.totalAmt,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 3단계. GAS 배포

1. 저장 후 **배포 → 새 배포**
2. 유형: **웹 앱**
3. 실행 계정: **나(본인)**
4. 액세스 권한: **모든 사용자**
5. **배포** → 웹 앱 URL 복사

### 4단계. index.html에 GAS URL 입력

`public/index.html` 파일에서 아래 줄을 찾아 교체:

```javascript
// 변경 전
const GAS_URL = 'https://script.google.com/macros/s/YOUR_GAS_DEPLOYMENT_ID/exec';

// 변경 후
const GAS_URL = 'https://script.google.com/macros/s/실제배포ID/exec';
```

저장 후 git push → Vercel 자동 재배포 완료.

---

## 📋 수집 데이터 항목

| 컬럼 | 내용 |
|------|------|
| 타임스탬프 | 신청 일시 |
| 이름 | 신청자 이름 |
| 소속기관 | 근무처 |
| 임상경력 | 연(年) 단위 숫자 |
| 임상분야 | 아동센터 / 대학병원&종합병원 / 재활병원 / 요양병원 / 복지관&보건소 / 어린이집 / 기타 |
| 연락처 | 010-xxxx-xxxx |
| 이메일 | 이메일 주소 |
| 회원유형 | 정회원 / 준회원 (보수교육 요금 구분) |
| 협회아이디 | 협회 홈페이지 로그인 아이디 (필수) |
| 회원번호 | 협회 회원번호 (필수) |
| 협회회원등급 | 평생회원 / 정회원 / 준회원 / 인증완료회원 / 기타 |
| 오전신청 | Y / N |
| 오후신청 | Y / N |
| 신청교육목록 | 오전반(발달평가), 오후반(감각통합) |
| 납부예정액 | 60,000원 등 |

---

## 📞 문의

대한작업치료학회 · ksotoffice@naver.com
