# Kakao Clone 2022

HTML과 CSS만으로 카카오톡 모바일 화면을 따라 만든 첫 번째 프로젝트입니다.

**[라이브 데모 보기](https://doyeong1996.github.io/kakao-clone-2022/)**

## 화면 구성

| 페이지 | 설명 |
| --- | --- |
| `index.html` | 스플래시 화면 + 로그인 |
| `friends.html` | 친구 목록 |
| `chats.html` | 채팅 목록 |
| `chat.html` | 채팅방 (입력창 포커스 애니메이션) |
| `find.html` | 찾기 / 추천 |
| `more.html` | 더보기 |
| `settings.html` | 설정 |

## 사용 기술

- HTML5, CSS3, 바닐라 JavaScript (프레임워크 없음)
- Flexbox 레이아웃, CSS 변수, `@keyframes` 애니메이션, `:focus-within`
- [Font Awesome 6 Free](https://fontawesome.com/) 아이콘
- GitHub Pages 배포

## CSS 구조

```
css/
├── styles.css      # 모든 CSS를 @import 로 모으는 진입점
├── reset.css
├── variables.css   # 색상, 여백, 앱 너비 변수
├── components/     # 상태바, 내비게이션, 배지 등 재사용 컴포넌트
└── screens/        # 화면별 스타일
```

클래스 이름은 BEM 규칙(`block__element--modifier`)을 따릅니다.

## 배운 점

- `position: absolute` 는 가장 가까운 `position: relative` 부모를 기준으로 배치된다.
- `flex-direction: column` 을 쓰면 main axis 와 cross axis 가 바뀐다.
- `animation-fill-mode: forwards` 로 애니메이션이 끝난 상태를 유지할 수 있다.
- `:focus-within` 으로 자식 요소에 포커스가 갔을 때 부모 스타일을 바꿀 수 있다.

## 개선 기록 (2026)

- PC에서 "Your screen is too Big" 으로 막던 화면을, 가운데에 휴대폰 너비(420px)로 보여주도록 변경
- 불필요하게 길던 스크롤(`height: 500vh`) 제거
- 오타 수정 (Welcome, Email, User Name, 클래스 이름 등)
- 만료될 수 있는 Font Awesome Kit 대신 무료 CDN 사용, Pro 전용 `fa-sharp` 제거
- 이미지 `alt`, 아이콘 버튼 `aria-label` 추가 (접근성)

### 2차 개선

- **JavaScript 추가** (`js/app.js`, 바닐라 JS)
  - 채팅방에서 메시지 입력 후 Enter/전송 버튼으로 내 말풍선 추가 (`textContent` 사용으로 XSS 방지)
  - 친구 목록 이름 검색 (입력 즉시 필터링, 결과 없음 안내)
  - 상태바 시계를 현재 시각으로 표시
- **버그 수정**
  - `settings.html` 닫히지 않은 `<div>` 수정
  - 하단 고정 내비게이션바에 마지막 콘텐츠가 가려지던 문제 (`padding-bottom`)
  - 스크롤 시 콘텐츠가 투명한 상태바와 겹쳐 보이던 문제 (배경색 + `z-index`)
  - 로그인 체크박스에 텍스트 입력창 스타일이 적용되던 문제 (`:not([type="checkbox"])`)
  - 2022년 6월 30일 요일 수정 (Tuesday → Thursday), 오타 수정 (Calendar, Version)
  - 더보기 화면에 반복되던 "Kakao Game" 항목을 서로 다른 항목/아이콘으로 교체
- **UX / 접근성**
  - 현재 페이지 탭을 진하게 표시 (`aria-current="page"`)
  - 키보드 사용자를 위한 `:focus-visible` 포커스 테두리
  - `prefers-reduced-motion` 사용자에게 애니메이션 최소화
  - `<meta charset>` 을 `<head>` 맨 앞으로 이동, 입력창 `autocomplete` 속성 추가

## 다음 목표

- 반복되는 상태바 / 내비게이션을 컴포넌트로 분리하기
- 보낸 메시지를 `localStorage` 에 저장해 새로고침 후에도 유지하기
