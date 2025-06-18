// お題のジャンル候補と文字列候補
const genres = ["食べ物", "動物", "場所", "乗り物", "スポーツ"];
const lettersList = [
  "し", "り", "た", "み", "か", "さ", "ん", "こ", "ば", "く",
  "と", "う", "ね", "ま", "よ", "へ", "ふ", "え", "や", "き",
  "うみ", "やま", "かわ", "にわ"
];

// 1文字あたりの得点
const POINT_PER_LETTER = 1;

// プレイヤー情報
let players = [];
let currentPrompt = null;

// DOM要素
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const playerCountSelect = document.getElementById("player-count");
const startButton = document.getElementById("start-button");
const genreSpan = document.getElementById("genre");
const lettersSpan = document.getElementById("letters");
const scoreList = document.getElementById("score-list");
const answerForm = document.getElementById("answer-form");
const submitAnswerBtn = document.getElementById("submit-answer");
const nextPromptBtn = document.getElementById("next-prompt");

// プレイヤー初期化
function initPlayers(count) {
  players = [];
  for(let i = 1; i <= count; i++) {
    players.push({ name: `プレイヤー${i}`, score: 0 });
  }
}

// 得点リストを画面に表示
function updateScoreList() {
  scoreList.innerHTML = "";
  players.forEach((player, i) => {
    const li = document.createElement("li");
    li.textContent = `${player.name} : ${player.score} 点`;
    scoreList.appendChild(li);
  });
}

// 回答フォームのチェックボックスを生成
function updateAnswerForm() {
  answerForm.innerHTML = "";
  players.forEach((player, i) => {
    const label = document.createElement("label");
    label.style.display = "block";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = i;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${player.name}`));
    answerForm.appendChild(label);
  });
}

// お題をランダムに生成して画面に表示
function generatePrompt() {
  const genre = genres[Math.floor(Math.random() * genres.length)];
  const letters = lettersList[Math.floor(Math.random() * lettersList.length)];
  currentPrompt = { genre, letters };
  genreSpan.textContent = genre;
  lettersSpan.textContent = letters;
}

// ゲーム開始処理
startButton.addEventListener("click", () => {
  const count = Number(playerCountSelect.value);
  if(count < 2 || count > 5) {
    alert("プレイヤー人数は2～5人で選択してください。");
    return;
  }
  initPlayers(count);
  updateScoreList();
  updateAnswerForm();
  generatePrompt();

  startScreen.style.display = "none";
  gameScreen.style.display = "block";
});

// 正解登録処理
submitAnswerBtn.addEventListener("click", () => {
  const checkboxes = answerForm.querySelectorAll("input[type=checkbox]");
  let anyChecked = false;
  checkboxes.forEach(cb => {
    if(cb.checked) {
      anyChecked = true;
      players[cb.value].score += currentPrompt.letters.length * POINT_PER_LETTER;
      cb.checked = false; // チェックリセット
    }
  });

  if(!anyChecked) {
    alert("正解者を1人以上選んでください。");
    return;
  }

  updateScoreList();
});

// 次のお題ボタン
nextPromptBtn.addEventListener("click", () => {
  generatePrompt();
});
