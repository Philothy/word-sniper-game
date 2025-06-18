const prompts = ["あで始まる食べ物", "すで始まる生き物", "かっこいい言葉", "小さいもの"];
const promptSpan = document.getElementById("prompt");

function nextPrompt() {
  const index = Math.floor(Math.random() * prompts.length);
  promptSpan.textContent = prompts[index];
}
