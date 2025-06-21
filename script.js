// ジャンル候補（本家寄せ）
const genres = [
  "細長いもの","目に見えないもの","人間の体の一部","楽器","防災用品",
  "飲み物","学校で使うもの","和食","乗り物","ことわざ","とがったもの",
  "鳥","植物","動作を表す言葉","四字熟語","県庁所在地","学校で使うもの",
  "部首","首都","調味料","黒いもの","硬いもの","レジャー用品","動物園の生き物",
  "スイーツ","生きるために必要なもの","海の生き物","赤いもの","四角いもの",
  "キッチン用品","身につけるもの","白い物","食べ物","動物","スポーツ","人名",
  "映画・ドラマ","音楽","色","ブランド","職業","科学・技術"
];

// 点数ごとの文字列候補（例）
const letterGroups = {
  1: [
    "あ","い","う","え","お","か","き","く","け","こ",
    "さ","し","す","せ","そ","た","ち","つ","て","と",
    "な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ",
  ],
  2: [
    "ま","み","む","め","も","や","ゆ","よ",
    "ら","り","る","れ","ろ","わ",
    "が ぎ ぐ げ ご","ざ じ ず ぜ ぞ","だ ぢ づ で ど",
    "ば び ぶ べ ぼ","ぱ ぴ ぷ ぺ ぽ"
  ],
  3: [
    "きゃ きゅ きょ","しゃ しゅ しょ","ちゃ ちゅ ちょ",
    "にゃ にゅ にょ","ひゃ ひゅ ひょ","みゃ みゅ みょ",
    "りゃ りゅ りょ"
  ],
  4: [
    "ぎゃ ぎゅ ぎょ","じゃ じゅ じょ",
    "びゃ びゅ びょ","ぴゃ ぴゅ ぴょ"
  ],
  5: [
    "しん","こう","さい","かん","せい","けん","とう","きん","さん",
    "ちゅう","じん","てん","ほう","ほん","はん","かく","ちょう","ぎん","そう",
    "かい","きゃく","しゅう","じょう","さく","じゅう","きょく","けつ",
    "ちょく","しょく","しき","せん","さつ","との","しゅん","せっ","しつ","せき","きょう"
  ]
};

// プレイヤー情報を保持
let players = [];
let currentPrompt = null; // {genre, letters, points}

// DOM要素取得
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const playerCountSelect = document.getElementById("player-count");
const startButton = document.getElementById("start-button");
const genreSpan = document.getElementById("genre");
const lettersSpan = document.getElementById("letters");
const scoreList = document.getElementById("score-list");
const answerForm = document.getElementById("answer-form");
const nextPromptBtn = document.getElementById("next-prompt");
const playerNamesDiv = document.getElementById("player-names"); // 追加

// プレイヤー名入力欄を生成
function buildPlayerNameInputs(count) {
  playerNamesDiv.innerHTML = "";
  for(let i=1; i<=count; i++){
    const label = document.createElement("label");
    label.textContent = `プレイヤー${i}: `;
    const input = document.createElement("input");
    input.type = "text";
    input.value = `プレイヤー${i}`;
    input.id = `player-name-${i}`;
    input.required = true;
    label.appendChild(input);
    playerNamesDiv.appendChild(label);
    playerNamesDiv.appendChild(document.createElement("br"));
  }
}

// プレイヤー初期化（名前入力対応）
function initPlayers(count) {
  players = [];
  for(let i=1; i<=count; i++){
    const input = document.getElementById(`player-name-${i}`);
    const name = input ? input.value.trim() || `プレイヤー${i}` : `プレイヤー${i}`;
    players.push({name, score:0});
  }
}

// 人数変更時に入力欄を再生成
playerCountSelect.addEventListener("change", () => {
  buildPlayerNameInputs(Number(playerCountSelect.value));
});

// ゲーム開始時に入力欄から名前取得
function startGame() {
  const count = Number(playerCountSelect.value);
  initPlayers(count);
  updateScoreList();
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  showPrompt();
  buildAnswerForm();
}

// 初期表示
buildPlayerNameInputs(Number(playerCountSelect.value));

// スコア表示更新
function updateScoreList() {
  scoreList.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} : ${p.score}点`;
    scoreList.appendChild(li);
  });
}

// お題をランダム生成
function getRandomPrompt() {
  // 重み付き配列
  const pointsArray = [
    1,1,1,1,1,1,1,1,1,1, // 1点（10個）
    2,2,2,2,2,           // 2点（5個）
    3,3,3,               // 3点（3個）
    4,4,                 // 4点（2個）
    5                    // 5点（1個）
  ];
  const genre = genres[Math.floor(Math.random()*genres.length)];
  const randomPoint = pointsArray[Math.floor(Math.random()*pointsArray.length)];
  const lettersArr = letterGroups[randomPoint];
  const letters = lettersArr[Math.floor(Math.random()*lettersArr.length)];
  return {genre, letters, points: Number(randomPoint)};
}

// お題表示
function showPrompt() {
  currentPrompt = getRandomPrompt();
  genreSpan.textContent = currentPrompt.genre;
  lettersSpan.textContent = `${currentPrompt.letters}（${currentPrompt.points}点）`;
}

// プレイヤーボタンを作成
function buildAnswerForm() {
  answerForm.innerHTML = "";
  players.forEach((p,i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = p.name;
    btn.dataset.index = i;
    btn.classList.remove("selected");
    btn.addEventListener("click", () => {
      [...answerForm.children].forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
    answerForm.appendChild(btn);
  });
}

// 「次のお題」ボタン処理
function nextPrompt() {
  const selectedBtn = [...answerForm.children].find(b => b.classList.contains("selected"));
  if(selectedBtn){
    const playerIndex = Number(selectedBtn.dataset.index);
    players[playerIndex].score += currentPrompt.points;
    updateScoreList();
  }
  // 正答者がいなくても次のお題へ進む
  showPrompt();
  buildAnswerForm();
}

// ゲーム開始処理
function startGame() {
  const count = Number(playerCountSelect.value);
  initPlayers(count);
  updateScoreList();
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  showPrompt();
  buildAnswerForm();
}

// イベント登録
startButton.addEventListener("click", startGame);
nextPromptBtn.addEventListener("click", nextPrompt);

// 初期状態ボタン設定
