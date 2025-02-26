const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Add debug logging
console.log('Canvas:', canvas);
console.log('Context:', ctx);

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameLoop;

// Add debug logging
console.log('Initial snake position:', snake);
console.log('Initial food position:', food);

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function drawGame() {
    clearCanvas();
    moveSnake();
    
    if (hasGameEnded()) {
        gameOver();
        return;
    }
    
    drawFood();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#4CAF50';  // A nicer green
    snake.forEach(segment => {
        ctx.beginPath();
        ctx.roundRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2, 5);
        ctx.fill();
    });
}

function drawFood() {
    ctx.fillStyle = '#F44336';  // A nicer red
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2, 
        food.y * gridSize + gridSize/2, 
        gridSize/2 - 2, 
        0, 
        2 * Math.PI
    );
    ctx.fill();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        generateFood();
        increaseSpeed();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Check if food spawned on snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function hasGameEnded() {
    // Check wall collision
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= tileCount;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= tileCount;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        return true;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return false;
}

function gameOver() {
    clearInterval(gameLoop);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 3, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Restart', canvas.width / 4, canvas.height / 2 + 40);
    
    document.addEventListener('keydown', function restart(event) {
        if (event.code === 'Space') {
            document.removeEventListener('keydown', restart);
            startGame();
        }
    });
}

function increaseSpeed() {
    if (gameSpeed > 50) {
        clearInterval(gameLoop);
        gameSpeed -= 2;
        gameLoop = setInterval(drawGame, gameSpeed);
    }
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    scoreElement.textContent = `Score: ${score}`;
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(drawGame, gameSpeed);
    drawGame(); // Add initial render
}

// Start the game
startGame();
