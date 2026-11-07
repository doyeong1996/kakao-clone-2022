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

if (replyForm && chatMain) {
  const input = replyForm.querySelector("input");
  replyForm.addEventListener("submit", (event) => {
    event.preventDefault(); // 페이지 새로고침 방지
    const text = input.value.trim();
    if (!text) return;
    chatMain.append(createOwnMessage(text, formatTime(new Date())));
    input.value = "";
    input.focus();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
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
