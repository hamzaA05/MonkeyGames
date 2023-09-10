const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

let mousePressed = false;
document.addEventListener('mousedown', function(data) {
	mousePressed = true;
});
  
document.addEventListener('mouseup', function(data) {
	mousePressed = false;
});

let openHelper = false;
let fade = 0;
let gameRunning = false;

let mX, mY;
let helpAni = 0;
let rX = -450;
let gX = 720, gY = -70, gS = 100;
let gSwitch = false;

function reload()
{
	location.reload(true);
}

let Up = false;
let Down = false;

let ball = {
	x: canvas.width / 2 - 8,
	y: canvas.height / 12 - 8,
	s: "Left",
	d: "Down"
};

let localScore = 0;
let enemyScore = 0;

let playerY = canvas.height / 2 - 40;
let enemyY = canvas.height / 2 - 40;

init();

function init() {
	help_sprite = new Image();
    help_sprite.src = 'image/pong_help.png';

	score_sprite = new Image();
    score_sprite.src = 'image/score.png';

	gameOver_sprite = new Image();
    gameOver_sprite.src = 'image/gameover.png';

	start();
}

function cords(e) {
	mX = e.pageX - document.getElementById('canvas').offsetLeft;
	mY = e.pageY - document.getElementById('canvas').offsetTop;
}

function start() {
	let text = "?  Do you Need Help  ?";

	ctx.fillStyle = '#111111';
	ctx.fillRect(0, 0, canvas.width, canvas.height); // draw background

	ctx.fillStyle = '#242424';
	ctx.fillRect(canvas.width - 21, canvas.height - 22, -40 - helpAni * 4, -40); // button background's
	ctx.fillRect(Math.round(canvas.width / 3), canvas.height / 2 - 45, Math.round(canvas.width / 3), 75);
	
	ctx.fillStyle = '#242424';
	ctx.fillRect(canvas.width / 3.4, canvas.height / 1.7, canvas.width - (canvas.width / 3.4) * 2, 423 - (canvas.height / 1.7));

	ctx.fillStyle = '#d6d6d6';
	ctx.font = "30px Arial";
	ctx.fillText("" + text, canvas.width - 50 - helpAni * 4, canvas.height - 30); // draw help text
	ctx.font = "60px Arial";
	ctx.fillText("Play", Math.round(canvas.width / 2) - 60, canvas.height / 2 + 10); // draw start text
	ctx.fillStyle = '#111111';
	ctx.fillRect(canvas.width - 21, canvas.height - 22, 40, -40); // hides text

	ctx.fillStyle = '#d6d6d6';
	ctx.font = "70px Arial";
	ctx.fillText("Quit", 230, canvas.height / 2 + 110);

	if (mX <= (canvas.width / 3.4) + canvas.width - (canvas.width / 3.4) * 2 && mX >= canvas.width / 3.4 && mY <= (canvas.height / 1.7) + 423 - (canvas.height / 1.7) && mY >= canvas.height / 1.7) {
		ctx.fillStyle = '#343434';
		ctx.fillRect(canvas.width / 3.4, canvas.height / 1.7, canvas.width - (canvas.width / 3.4) * 2, 423 - (canvas.height / 1.7));
		ctx.fillStyle = '#d6d6d6';
		ctx.font = "70px Arial";
		ctx.fillText("Quit", 230, canvas.height / 2 + 110);
		if (mousePressed) {
			window.location.href="../../index.html"
		}
	}

	if (openHelper) {
		if (fade < 100) fade += 4;
		ctx.globalAlpha = fade / 100;
		ctx.drawImage(help_sprite, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = '#242424';
		ctx.fillRect(canvas.width - 20, 59, -40, -40);

		ctx.fillStyle = '#d6d6d6';
		ctx.font = "30px Arial";
		ctx.fillText("X", canvas.width - 50, 50);

		if (mX <= canvas.width - 20 && mX >= canvas.width - 60 && mY <= 59 && mY >= 19) if (mousePressed) openHelper = false;
	} else ctx.globalAlpha = 1;

	if (mX <= canvas.height - 22 && mX >= canvas.height - 62 && mY <= canvas.width - 21 && mY >= canvas.height - 61) {
		if (helpAni < 75) helpAni += 1;
		if (mousePressed) {openHelper = true; fade = 0;}
	} else if (helpAni > 0) helpAni -= 1;

	if (mX <= Math.round((canvas.width / 3) * 2) && mX >= Math.round(canvas.width / 3) && mY <= canvas.height / 2 + 30 && mY >= canvas.height / 2 - 45) {
		if (!openHelper) {
			ctx.fillStyle = '#343434';
			ctx.fillRect(Math.round(canvas.width / 3), canvas.height / 2 - 45, Math.round(canvas.width / 3), 75);
			ctx.fillStyle = '#d6d6d6';
			ctx.font = "60px Arial";
			ctx.fillText("Play", Math.round(canvas.width / 2) - 60, canvas.height / 2 + 10); // draw start text
		}
		if (mousePressed) {
			gameRunning = true;
			draw();
		}
	}

	if (!gameRunning) window.setTimeout(() => {
		requestAnimationFrame(start);
	}, 1000 / 120);
}

function loop() {
	if (ball.x <= -16) {spawnBall(); enemyScore++;}
	if (ball.x >= canvas.width) {spawnBall(); localScore++;}
	if (ball.y <= canvas.height / 30) ball.d = "Down";
	if (ball.y >= canvas.height - canvas.height / 30 - 16) ball.d = "Up";

	if (ball.x == 32 && ball.y <= playerY + 96 && ball.y >= playerY - 16) ball.s = "Right";
	if (ball.x == canvas.width - 48 && ball.y <= enemyY + 96 && ball.y >= enemyY - 16) ball.s = "Left";

	switch (ball.d) {
		case "Up": ball.y -= 2; break;
		case "Down": ball.y += 2; break;
	}

	switch (ball.s) {
		case "Left": ball.x -= 2; break;
		case "Right": ball.x += 2; break;
	}

	if (enemyScore >= 3) gameOver(true);
	if (localScore >= 3) gameOver(false);
}

function directionHandler() {
	if (Up && playerY >= canvas.height / 30) playerY -= 2.5;
	if (Down && playerY + 80 <= canvas.height - canvas.height / 30) playerY += 2.5;

	playerY = Math.round((playerY + Number.EPSILON) * 100) / 100;

	if (ball.y < enemyY + 40 && playerY >= canvas.height / 30) enemyY -= 1.65;
	if (ball.y > enemyY + 40 && playerY + 80 <= canvas.height - canvas.height / 30) enemyY += 1.65;

	enemyY = Math.round((enemyY + Number.EPSILON) * 100) / 100;
}

function draw() {
	directionHandler();
	loop();

	ctx.fillStyle = '#111111';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#cccccc';
	ctx.fillRect(0, 0, canvas.width, canvas.height / 30);
	ctx.fillRect(0, canvas.height - canvas.height / 30, canvas.width, canvas.height);

    for (let i = 0; i < 19; i++) {
        let lineOffset = canvas.height / 20 * i + 52.5;
        ctx.fillRect(canvas.width / 2 - canvas.width / 80, lineOffset - canvas.height / 20, canvas.width / 40, Math.round(canvas.height / 20 * 0.5));
    }

	ctx.fillRect(ball.x, ball.y, 16, 16);

	ctx.fillRect(16, playerY, 16, 80);

	ctx.fillRect(canvas.width - 32, enemyY, 16, 80);
	scoreHandler();

	window.setTimeout(() => {
		if (gameRunning) requestAnimationFrame(draw);
	}, 1000 / 120);
}

function add(x, y) {
	ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
}

function spawnBall() {
	let rndSide = Math.round(Math.random() * (2 - 1) + 1);
	let rndY = Math.round(Math.random() * (2 - 1) + 1);

	if (rndSide == 1) ball.s = "Left";
	else ball.s = "Right";
	if (rndY == 1) ball.d = "Up";
	else ball.d = "Down";

	ball.y = Math.round(Math.random() * (canvas.height - 0) + 0);
	ball.x = canvas.width / 2 - 8;
}

function scoreHandler() {
	let offset = canvas.width / 2 - 140;
	let enemyOffset = canvas.width / 2 + 20;
	let scoreSize = 60;
	let localsinlge = localScore;
	let localsecond = localScore;
	let enemysinlge = enemyScore;
	let enemysecond = enemyScore;

	while (localsinlge >= 10) localsinlge -= 10;
	while (localsecond % 10 != 0) localsecond--;
	localsecond /= 10;

	if (localsinlge < 5) ctx.drawImage(score_sprite, localsinlge * 40, 0, 40, 56, offset + scoreSize, 24, scoreSize, scoreSize * 1.4);
	else ctx.drawImage(score_sprite, (localsinlge - 5) * 40, 56, 40, 56, offset + scoreSize, 24, scoreSize, scoreSize * 1.4);

	if (localsecond < 5) ctx.drawImage(score_sprite, localsecond * 40, 0, 40, 56, offset, 24, scoreSize, scoreSize * 1.4);
	else ctx.drawImage(score_sprite, (localsecond - 5) * 40, 56, 40, 56, 0, offset, 24, scoreSize * 1.4);

	while (enemysinlge >= 10) enemysinlge -= 10;
	while (enemysecond % 10 != 0) enemysecond--;
	enemysecond /= 10;

	if (enemysinlge < 5) ctx.drawImage(score_sprite, enemysinlge * 40, 0, 40, 56, enemyOffset + scoreSize, 24, scoreSize, scoreSize * 1.4);
	else ctx.drawImage(score_sprite, (enemysinlge - 5) * 40, 56, 40, 56, enemyOffset + scoreSize, 24, scoreSize, scoreSize * 1.4);

	if (enemysecond < 5) ctx.drawImage(score_sprite, enemysecond * 40, 0, 40, 56, enemyOffset, 24, scoreSize, scoreSize * 1.4);
	else ctx.drawImage(score_sprite, (enemysecond - 5) * 40, 56, 40, 56, enemyOffset, 24, scoreSize, scoreSize * 1.4);
}

function keyDown(e) {
	switch (e.keyCode) {
		case 38: Up = true; break;
		case 87: Up = true; break;
		case 40: Down = true; break;
		case 83: Down = true; break;
	}
}

function keyUp(e) {
	switch (e.keyCode) {
		case 38: Up = false; break;
		case 87: Up = false; break;
		case 40: Down = false; break;
		case 83: Down = false; break;
	}
}

function gameOver(fail) {
	gameRunning = false;
	let size = 60;

	if (gS <= 0) gSwitch = true;

	gX -= 1 * gS / 10;
	if (!gSwitch) gY += 5;
	else gY -= 2.5;
	if (!gSwitch) gS--;
	else gS++;

	if (!fail) restart();
	else {
		ctx.drawImage(gameOver_sprite, gX, gY, Math.round(size * 6.22), size);
	}

	if (gX <= -350) restart();

	window.setTimeout(() => {
		if (gX > -350) requestAnimationFrame(gameOver);
	}, 1000 / 60);
}

function restart() {

	ctx.fillStyle = '#111111';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#242424';
	
	ctx.fillStyle = '#242424';
	ctx.fillRect(canvas.width / 6, canvas.height / 2.7, canvas.width - (canvas.width / 6) * 2, 314 - (canvas.height / 2.7));
	
	if (mX <= (canvas.width / 6) + canvas.width - (canvas.width / 6) * 2 && mX >= canvas.width / 6 && mY <= (canvas.height / 2.7) + 314 - (canvas.height / 2.7) && mY >= canvas.height / 2.7) {
	ctx.fillStyle = '#343434';
	ctx.fillRect(canvas.width / 6, canvas.height / 2.7, canvas.width - (canvas.width / 6) * 2, 314 - (canvas.height / 2.7));
		if (mousePressed) {
			gameRunning = true;
			reset();
			draw();
		}
	}
	
	ctx.fillStyle = '#242424';
	ctx.fillRect(canvas.width / 3.4, canvas.height / 1.7, canvas.width - (canvas.width / 3.4) * 2, 423 - (canvas.height / 1.7));
	
	if (mX <= (canvas.width / 3.4) + canvas.width - (canvas.width / 3.4) * 2 && mX >= canvas.width / 3.4 && mY <= (canvas.height / 1.7) + 423 - (canvas.height / 1.7) && mY >= canvas.height / 1.7) {
	ctx.fillStyle = '#343434';
	ctx.fillRect(canvas.width / 3.4, canvas.height / 1.7, canvas.width - (canvas.width / 3.4) * 2, 423 - (canvas.height / 1.7));
		if (mousePressed) {
			window.location.href="game_index.html";
		}
	}

	ctx.fillStyle = '#d6d6d6';
	ctx.font = "80px Arial";
	ctx.fillText("Restart", 160, canvas.height / 2 - 5);

	ctx.fillStyle = '#d6d6d6';
	ctx.font = "70px Arial";
	ctx.fillText("Quit", 230, canvas.height / 2 + 110);

	ctx.font = "40px Arial";
	ctx.fillText("Your score was: " + localScore, rX, 45);

	rX += 3;
	if (rX >= 650) rX = -450;

	window.setTimeout(() => {
		if (!gameRunning) requestAnimationFrame(restart);
	}, 1000 / 60);
}

function reset() {
	enemyScore = 0;
	localScore = 0;
	rX = -450;

	Up = false;
	Down = false;

	ball = {
		x: canvas.width / 2 - 8,
		y: canvas.height / 12 - 8,
		s: "Left",
		d: "Down"
	};

	playerY = canvas.height / 2 - 40;
	enemyY = canvas.height / 2 - 40;

	gX = 720;
	gY = -70;
	gS = 100;
	gSwitch = false;
}