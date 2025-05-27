const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bird = {
  x: 60,
  y: 200,
  radius: 15,
  gravity: 0.5,
  lift: -8,
  velocity: 0
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 120;
let pipeSpeed = 2;
let score = 0;
let highScore = 0;
let isGameRunning = false;
let bounce = true;
let frame = 0;
let difficulty = "medium";

const difficultySettings = {
  easy: { gap: 160, speed: 2 },
  medium: { gap: 120, speed: 3.5 },
  hard: { gap: 100, speed: 5 }
};

// UI Elements
const startScreen = document.getElementById("startScreen");
const difficultyMenu = document.getElementById("difficultyMenu");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

// Buttons
document.getElementById("startGameBtn").onclick = () => {
  startScreen.style.display = "none";
  difficultyMenu.style.display = "block";
};

document.querySelectorAll(".difficulty").forEach(button => {
  button.onclick = () => {
    difficulty = button.dataset.level;
    difficultyMenu.style.display = "none";
    startGame();
  };
});

document.getElementById("restartBtn").onclick = () => {
  gameOverScreen.style.display = "none";
  startGame();
};

document.getElementById("homeBtn").onclick = () => {
  gameOverScreen.style.display = "none";
  startScreen.style.display = "block";
};

// Start game
function startGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  pipeSpeed = difficultySettings[difficulty].speed;
  pipeGap = difficultySettings[difficulty].gap;
  bounce = true;
  isGameRunning = true;
  frame = 0;
  requestAnimationFrame(gameLoop);
}

// Game loop
function gameLoop() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds();

  if (bounce) {
    bird.y += Math.sin(frame / 10) * 2;
    frame++;
    drawBird();
    drawScore();
    requestAnimationFrame(gameLoop);
    return;
  }

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  drawBird();

  if (frame % 90 === 0) {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 20;
    pipes.push({ x: canvas.width, y: pipeHeight });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;
    drawPipes(pipe);

    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.radius > pipe.x &&
      (bird.y < pipe.y || bird.y + bird.radius > pipe.y + pipeGap)
    ) {
      endGame();
    }

    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
      if (score > highScore) highScore = score;
    }
  });

  if (bird.y + bird.radius > canvas.height || bird.y < 0) {
    endGame();
  }

  drawScore();
  frame++;
  requestAnimationFrame(gameLoop);
}

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
  ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap));
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);
  ctx.fillText("High Score: " + highScore, 10, 45);
}

function drawClouds() {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(80, 60, 20, 0, Math.PI * 2);
  ctx.arc(100, 60, 25, 0, Math.PI * 2);
  ctx.arc(120, 60, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(300, 100, 25, 0, Math.PI * 2);
  ctx.arc(320, 100, 30, 0, Math.PI * 2);
  ctx.arc(340, 100, 25, 0, Math.PI * 2);
  ctx.fill();
}

function endGame() {
  isGameRunning = false;
  finalScore.textContent = score;
  gameOverScreen.style.display = "block";
}

window.addEventListener("keydown", (e) => {
  if (["PageUp", "PageDown", "Space"].includes(e.code)) {
    bird.velocity = bird.lift;
    bounce = false;
  }
});