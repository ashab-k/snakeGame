const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const resetButton = document.querySelector("#resetBtn");
const scoreText = document.querySelector("#scoreText");

const boardBackground = "black";
const snakeColor = "darkgreen";
const foodColor = "red";
const snakeBorder = "white";
let gameHeight = gameBoard.height;
let gameWidth = gameBoard.width;
let unitSize = 20;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);

gameStart();

function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 100);
  } else {
    displayGameOver();
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min)) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(20, gameWidth - unitSize);
  foodY = randomFood(20, gameWidth - unitSize);
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

  // Check if the head hits the boundary
  if (head.x < 0) {
    head.x = gameWidth - unitSize; // Teleport to the right side
  } else if (head.x >= gameWidth) {
    head.x = 0; // Teleport to the left side
  }

  if (head.y < 0) {
    head.y = gameHeight - unitSize; // Teleport to the bottom
  } else if (head.y >= gameHeight) {
    head.y = 0; // Teleport to the top
  }

  // Add the new head to the front of the snake
  snake.unshift(head);

  // Check if the head is on the food
  if (head.x === foodX && head.y === foodY) {
    // Handle food eating logic
    score += 1;
    scoreText.textContent = score;
    createFood();
  } else {
    // Remove the last element if the snake didn't eat food
    snake.pop();
  }
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 65;
  const RIGHT = 68;
  const UP = 87;
  const DOWN = 83;

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;
  const goingRight = xVelocity == unitSize;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}
function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }

  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  running = false;
}
function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
}
