// 모든 페이지에서 공통으로 쓰는 스크립트 (defer 로 로드되므로 DOM 이 준비된 뒤 실행된다)

const pad = (n) => String(n).padStart(2, "0");
const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

/* 1. 상태바 시계: 고정된 "18:43" 대신 현재 시각을 보여준다 */
const clocks = document.querySelectorAll(".status-bar__time");
function updateClock() {
  const now = formatTime(new Date());
  clocks.forEach((clock) => (clock.textContent = now));
}
if (clocks.length) {
  updateClock();
  setInterval(updateClock, 10 * 1000);
}

/* 2. 채팅방: 메시지 전송 */
const replyForm = document.querySelector(".reply");
const chatMain = document.querySelector(".main-chat");

function createOwnMessage(text, time) {
  // innerHTML 대신 textContent 를 써서 입력값에 HTML 이 들어와도 안전하게 표시한다
  const row = document.createElement("div");
  row.className = "message-row message-row--own message-row--new";

  const content = document.createElement("div");
  content.className = "message-row__content";

  const info = document.createElement("div");
  info.className = "message__info";

  const bubble = document.createElement("span");
  bubble.className = "message__bubble";
  bubble.textContent = text;

  const timeEl = document.createElement("span");
  timeEl.className = "message__time";
  timeEl.textContent = time;

  info.append(bubble, timeEl);
  content.append(info);
  row.append(content);
  return row;
}

// 상대방(doyeong) 말풍선: 프로필 사진 + 이름 + 흰 말풍선
// content 에 Node 를 넘기면 그대로 넣고(입력 중 표시용), 문자열이면 textContent 로 넣는다
function createFriendMessage(content, time) {
  const row = document.createElement("div");
  row.className = "message-row message-row--new";

  const avatar = document.createElement("img");
  avatar.src = "screenshots/kakao-profile.jpg";
  avatar.alt = "Profile picture";

  const body = document.createElement("div");
  body.className = "message-row__content";

  const author = document.createElement("span");
  author.className = "message__author";
  author.textContent = "doyeong";

  const info = document.createElement("div");
  info.className = "message__info";

  const bubble = document.createElement("span");
  bubble.className = "message__bubble";
  if (typeof content === "string") bubble.textContent = content;
  else bubble.append(content);
  info.append(bubble);

  if (time) {
    const timeEl = document.createElement("span");
    timeEl.className = "message__time";
    timeEl.textContent = time;
    info.append(timeEl);
  }

  body.append(author, info);
  row.append(avatar, body);
  return row;
}

/* 자동 응답 규칙: 위에서부터 순서대로 검사해서 처음 맞는 규칙의 답 중 하나를 고른다.
   답변을 바꾸거나 늘리고 싶으면 이 배열만 수정하면 된다. */
const REPLY_RULES = [
  { keywords: ["안녕", "하이", "hi", "hello", "헬로"], replies: ["안녕하세요! 반가워요 😊", "하이~ 오늘 하루 어때요?", "Hi! Nice to meet you!"] },
  { keywords: ["이름", "누구", "who"], replies: ["저는 doyeong이에요! 이 카카오톡 클론을 만든 사람이죠 😎"] },
  { keywords: ["뭐해", "뭐 해", "what are you doing"], replies: ["코딩 공부 중이에요 💻", "카카오톡 클론 다듬고 있어요!", "방금 커피 한 잔 했어요 ☕"] },
  { keywords: ["밥", "점심", "저녁", "배고"], replies: ["저는 아직이요! 뭐 먹을지 고민 중이에요 🍜", "오늘은 김치찌개 땡기네요 🤤"] },
  { keywords: ["고마", "감사", "thank"], replies: ["별말씀을요! 😄", "천만에요~"] },
  { keywords: ["ㅋㅋ", "ㅎㅎ", "lol", "haha"], replies: ["ㅋㅋㅋㅋ", "ㅎㅎ 웃기네요 😆"] },
  { keywords: ["잘자", "굿밤", "good night", "bye", "잘 가", "안녕히"], replies: ["잘 자요! 좋은 꿈 꾸세요 🌙", "다음에 또 이야기해요! 👋"] },
  { keywords: ["코딩", "개발", "html", "css", "javascript", "js"], replies: ["이 페이지는 HTML, CSS, 바닐라 JS로 만들었어요!", "요즘 JavaScript 공부가 제일 재밌어요 🔥"] },
];
const QUESTION_REPLIES = ["음… 좋은 질문이네요 🤔", "글쎄요, 저도 궁금해요!", "그건 다음에 만나서 얘기해요 ㅎㅎ"];
const DEFAULT_REPLIES = ["오 그렇군요!", "정말요? 더 얘기해 주세요 👀", "ㅎㅎ 맞아요", "좋아요 👍", "그거 재밌네요!"];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

function getReply(text) {
  const lower = text.toLowerCase();
  const rule = REPLY_RULES.find((r) => r.keywords.some((k) => lower.includes(k)));
  if (rule) return pick(rule.replies);
  if (/[?？]$/.test(text)) return pick(QUESTION_REPLIES);
  return pick(DEFAULT_REPLIES);
}

// "입력 중…" 점 3개
function createTypingDots() {
  const dots = document.createElement("span");
  dots.className = "typing";
  dots.setAttribute("aria-label", "doyeong is typing");
  dots.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
  return dots;
}

// 사용자가 대화 영역의 맨 아래 근처를 보고 있는지 (위로 올려 지난 대화를 읽는 중이면 false)
const isNearBottom = (el) => el.scrollHeight - el.scrollTop - el.clientHeight < 80;

if (replyForm && chatMain) {
  const input = replyForm.querySelector("input");
  let typingRow = null; // 지금 화면에 떠 있는 "입력 중" 말풍선
  let typingTimer = null;
  let replyTimer = null;

  // 새 말풍선을 추가하고, 맨 아래를 보고 있었다면 대화 영역만 따라 내려간다
  // (페이지 전체가 아니라 .main-chat 만 스크롤 / 지난 대화를 읽는 중이면 그대로 둔다)
  const appendMessage = (row, force = false) => {
    const shouldFollow = force || isNearBottom(chatMain);
    chatMain.append(row);
    // smooth 스크롤은 연달아 보낼 때 애니메이션 도중 위치를 잘못 판단해서 즉시 이동한다
    // (새 말풍선에는 fadeIn 애니메이션이 있어서 충분히 자연스럽다)
    if (shouldFollow) chatMain.scrollTop = chatMain.scrollHeight;
  };

  const scheduleReply = (text) => {
    // 연달아 보내면 이전 답장 예약을 취소하고 마지막 메시지에만 답한다
    clearTimeout(replyTimer);
    if (!typingRow) {
      typingRow = createFriendMessage(createTypingDots());
      typingRow.classList.add("message-row--typing");
      // 0.6초 정도 '읽는' 시간 뒤에 입력 중 표시
      typingTimer = setTimeout(() => appendMessage(typingRow), 600);
    }
    const delay = 1400 + Math.random() * 1200; // 1.4 ~ 2.6초 뒤 답장
    replyTimer = setTimeout(() => {
      clearTimeout(typingTimer);
      const wasNearBottom = isNearBottom(chatMain);
      typingRow.remove();
      typingRow = null;
      appendMessage(createFriendMessage(getReply(text), formatTime(new Date())), wasNearBottom);
    }, delay);
  };

  replyForm.addEventListener("submit", (event) => {
    event.preventDefault(); // 페이지 새로고침 방지
    const text = input.value.trim();
    if (!text) return;

    // 입력 중 표시가 떠 있으면 내 메시지가 그 아래로 가지 않도록 잠시 떼었다가 다시 붙인다
    const typingShown = typingRow && typingRow.isConnected;
    if (typingShown) typingRow.remove();
    appendMessage(createOwnMessage(text, formatTime(new Date())));
    if (typingShown) appendMessage(typingRow);

    input.value = "";
    input.focus({ preventScroll: true });
    scheduleReply(text);
  });
}

/* 3. 친구 목록: 이름 검색 */
const searchForm = document.querySelector(".screen-search");
if (searchForm) {
  const input = searchForm.querySelector(".screen-search__text");
  const empty = document.querySelector(".screen-search__empty");
  const friends = document.querySelectorAll(".friends-screen .user-component");

  const filterFriends = () => {
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    friends.forEach((friend) => {
      const name = friend.querySelector(".user-component__title").textContent.toLowerCase();
      const match = name.includes(query);
      friend.hidden = !match;
      if (match) visible++;
    });
    if (empty) empty.hidden = visible > 0;
  };

  input.addEventListener("input", filterFriends);
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterFriends();
  });
}
