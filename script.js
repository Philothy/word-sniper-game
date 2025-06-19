// ジャンル候補（本家寄せ）
const genres = [
  "食べ物","動物","乗り物","スポーツ","人名","地名",
  "映画・ドラマ","音楽","色","ブランド","植物","道具・用品",
  "職業","学校・教育","科学・技術"
];

// 点数ごとの文字列候補（例）
const letterGroups = {
  1: [
    "あ","い","う","え","お","か","き","く","け","こ",
    "さ","し","す","せ","そ","た","ち","つ","て","と",
    "な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ",
    "ま","み","む","め","も","や","ゆ","よ",
    "ら","り","る","れ","ろ","わ"
  ],
  2: ["かん","さん","たい","くら","なか","けい"],
  3: ["ば び ぶ べ ぼ","だ ぢ づ で ど"],
  4: ["ちゃ ちゅ ちょ","しゃ しゅ しょ"],
  5: ["ぎゃ ぎゅ ぎょ","ぴゃ ぴゅ ぴょ"]
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

// プレイヤー初期化
function initPlayers(count) {
  players = [];
  for(let i=1; i<=count; i++){
    players.push({name:`プレイヤー${i}`, score:0});
  }
}

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
    2,2,2,2,              // 2点（4個）
    3,                    // 3点（1個）
    4,                    // 4点（1個）
    5                     // 5点（1個）
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
