window.onload = function () {

    /* Developed by Deepak Tomar */
 
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    /** Ball */
    var x;
    var y;
    var dx;
    var dy;

    var ballRadius = 10;
    var delta = 0;
    var isGameOVer = false;
    var scoreCount = 0;
    var lives = 3;
    var liveScore = 0;

    function resetGame() {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 1;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
    }

    function drawBall() {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "#0095DD";
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    function moveBall() {
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                if (lives > 0) {
                    lives--;
                    resetGame();
                } else {
                    isGameOVer = true;
                }
            }
        }
        x += dx * 3;
        y += dy * 3;
    }

    /** Paddle */

    var paddleWidth = 75;
    var paddleHeight = 10;
    var paddleX;

    var leftPressed = false;
    var rightPressed = false;

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#00DD95";
        ctx.fill();
        ctx.closePath();
    }

    function keyDownHandler(e) {
        if (e.keyCode === 37) {
            leftPressed = true;
        } else if (e.keyCode == 39) {
            rightPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode === 37) {
            leftPressed = false;
        } else if (e.keyCode == 39) {
            rightPressed = false;
        }
    }

    function movePaddle() {
        if (leftPressed && paddleX > 0) {
            paddleX -= 5;
        } else if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 5;
        }
    }
    /** Bricks */

    var brickRowCount = 2;
    var brickColumnCount = 9;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 25;
    var brickColor = "#ff0000";
    var bricks = [];

    for (var col = 0; col < brickColumnCount; col++) {
        bricks[col] = [];
        for (var row = 0; row < brickRowCount; row++) {
            bricks[col][row] = {
                x: 0,
                y: 0,
                status: 1,
                color: brickColor
            };
        }
    }

    function drawBricks() {
        for (var col = 0; col < brickColumnCount; col++) {
            for (var row = 0; row < brickRowCount; row++) {
                var brick = bricks[col][row];
                if (brick.status == 1) {
                    brick.x = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
                    brick.y = (row * (brickHeight + brickPadding)) + brickOffsetTop;

                    ctx.beginPath();
                    ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
                    ctx.fillStyle = brick.color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collision() {
        for (var col = 0; col < brickColumnCount; col++) {
            for (var row = 0; row < brickRowCount; row++) {
                var b = bricks[col][row];
                if (b.status && (x > b.x && x < b.x + brickWidth) && (y > b.y && y < b.y + brickHeight)) {
                    dy *= -1.1;
                    dx *= 1.1;
                    b.status = 0;
                    scoreCount++;
                    liveScore = scoreCount * 100;
                    if (scoreCount == brickColumnCount * brickRowCount) {
                        isGameOVer = true;
                    }
                }
            }
        }
    }

    function showScore() {
        ctx.font = "20px Georgia";
        ctx.fillText("Your Score is : " + liveScore, canvas.width - 200, canvas.height - 100);
    }

    function showLives() {
        ctx.font = "20px Georgia";
        ctx.fillText("Your Life : " + lives, 50, canvas.height - 100);
    }

    function gameOver() {
        if (isGameOVer) {
            if (scoreCount == brickColumnCount * brickRowCount) {
                ctx.font = "50px Georgia";
                ctx.fillText("You Won ", (canvas.width / 2) - 100, canvas.height / 2);
            }
            else {
                ctx.font = "50px Georgia";
                ctx.fillText("You Lose ", (canvas.width / 2) - 100, canvas.height / 2);
            }
        }
    }

    function draw(dt) {
        
        // console.log("Delta time ", dt);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        showScore();
        showLives();

        if (!isGameOVer) {
            requestAnimationFrame(draw);
        }
        else {
            gameOver();
        }
        
        collision();
        
        moveBall();
        movePaddle();
    }
    resetGame();
    draw(delta);
}