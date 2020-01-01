var canvas;
var canvasContext;

var ballX = 400;
var ballY = 300;
var ballSpeedX = 5;
var ballSpeedY = 5;

var userScore = 0;
var compScore = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

let GameOver = new Image();
GameOver.src = "GameOver.png";
let YouWin = new Image();
YouWin.src = "YouWin.png";
let YouLose = new Image();
YouLose.src = "YouLose.png";

//Main Function
window.onload = function(){
  //Initialising the canvas
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  //The game loop
  var framesPerSecond = 60;
  setInterval(
    function(){
      drawEverything();
      moveEverything();
    }, 1000/framesPerSecond);
  
  //User input (Mouse detection)
  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', 
  function(evt){
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
  });
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return { 
    x:mouseX,
    y:mouseY
  };
}

function handleMouseClick(evt) {
  if(showingWinScreen) {
    userScore = 0;
    compScore = 0;
    showingWinScreen = false;
  }
}

//Brings ball to center and flips the x direction
function ballReset() {
  winCheck();
  ballSpeedX = 5;
  ballSpeedY = 0;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function drawNet() {
  for (var i=0; i<canvas.height; i+=40) {
    colorRect(canvas.width/2-1, i, 2, 20, 'white');
  }
}

function drawEverything(){ 
  //Canvas background
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  //Win Screen
  if (showingWinScreen) {
    canvasContext.fillStyle = 'white';
    canvasContext.drawImage(GameOver, 100, 100);
    if(userScore >= WINNING_SCORE) {
      canvasContext.drawImage(YouWin, 265, 200);
    } else if (compScore >= WINNING_SCORE){
      canvasContext.drawImage(YouLose, 260, 200);
    }
    canvasContext.fillText("Click To Continue", 350, 500);
    return;
  }
  //The Net
  drawNet();
  //The ball
  colorCircle(ballX, ballY, 10, 'white');
  //The left side paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  //The right side paddle
  colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  canvasContext.font = "15px Arial";
  //User score
  canvasContext.fillText('Your Score: ' + userScore, 100, 100);
  //Computer score
  canvasContext.fillText("Computer Score: " + compScore, canvas.width-200, 100);
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function moveEverything(){

  //Moving the ball in the x and y co-ordiante
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  computerMovement();

  //Logic for deciding speed and direction of ball
  //When it hits the left side
  if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT && ballX < 15) { //If it hits the paddle
    //bounce!
    ballSpeedX = -ballSpeedX;
    //depending on where it hits the paddle:
    var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
    ballSpeedY = deltaY * 0.35
  } else if(ballX < 5) { 
    // If it misses the paddle
    compScore++;
    ballReset();
  }
  //When it hits the right side
  if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT && ballX > canvas.width-15) { //If it hits the paddle
      //bounce!
      ballSpeedX = -ballSpeedX;
      //depending on where it hits the paddle:
      var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.05
    } else if (ballX > canvas.width-5) { 
    // If it misses the paddle
    userScore++;
    ballReset();
    
  }
  //When it hits the bottom or top
  if(ballY < 5 || ballY > canvas.height-5){
    ballSpeedY = -ballSpeedY;

  }
}

function computerMovement(){
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if(paddle2YCenter < ballY-35){
    paddle2Y += 4.5;
  } else if (paddle2YCenter > ballY+35){
    paddle2Y -= 4.5;
  }
}

function winCheck(){
  if(userScore >= WINNING_SCORE || compScore >= WINNING_SCORE){
    showingWinScreen = true;
  }
}