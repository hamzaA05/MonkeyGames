const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.addEventListener('keydown', keyDown);

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

function reload()
{
	location.reload(true);
}

let rows = 20;
let cols = 20;
let cellWidth = canvas.width / cols;
let cellHeight = canvas.height / rows;

let snake = 
[
    {x: Math.round(rows/2), y: Math.round(cols/2), d: "RIGHT"},
    {x: Math.round(rows/2) - 1, y: Math.round(cols/2), d: "RIGHT"},
    {x: Math.round(rows/2) - 2, y: Math.round(cols/2), d: "RIGHT"}
];
let corner = [];
let food = {x: 3, y: 2};

let inputDirection = "RIGHT";
let direction = "RIGHT";

let localScore = 0;

let mX, mY;
let helpAni = 0;
let rX = -450;
let gX = 720, gY = -70, gS = 100;
let gSwitch = false;

init();

function init() {
	help_sprite = new Image();
    help_sprite.src = 'image/snake_help.png';

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
			window.location.href="game_index.html";
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
			//ctx.canvas.width  = window.innerWidth - window.innerWidth / 50;
			//ctx.canvas.height = window.innerHeight - window.innerHeight / 50;
			gameRunning = true;
			draw();
		}
	}

	if (!gameRunning) window.setTimeout(() => {
		requestAnimationFrame(start);
	}, 1000 / 120);
}

function loop() {
	let died = false;

	//### Grid check ###
	if(snake[0].x % 1 == 0 && snake[0].y % 1 == 0) {
		direction = inputDirection;
		snake[0].d = inputDirection;
		if (snake[0].d != snake[1].d)
		corner.push({ // makes corner
			x: snake[0].x,
			y: snake[0].y
		});
	}

	//### Snake checks ###
    for(let i = snake.length - 1; i >= 0; i--) { // detect if out of bounds
        if (snake[0].x < 0 || snake[0].x > rows - 1 || snake[0].y < 0 || snake[0].y > cols - 1) died = true;
        else if (i != 0 && snake[0].x == snake[i].x && snake[0].y == snake[i].y) died = true;
    }

	localScore = snake.length - 3;
	if (died) gameOver(); // reset

	//### Food related stuff ###
    if(snake[0].x == food.x && snake[0].y == food.y) { // spawns new food after it's been eaten
        placeApple();
		snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y, d: snake[snake.length - 1].d, t: 20});
    }
}

function directionHandler() {
	//### Snake motion handling ###
    for(let i = snake.length - 1; i >= 0; i--) {
		if (i == snake.length - 1 && snake[i].t == 0) delete snake[i].t;
		if (i == snake.length - 1 && snake[i].t > 0) {
			snake[i].t--;
			switch (snake[i].d) {
				case "LEFT": snake[i].x -= 0.05; break;
				case "RIGHT": snake[i].x += 0.05; break;
				case "UP": snake[i].y -= 0.05; break;
				case "DOWN": snake[i].y += 0.05; break;
			}
		} else {
			switch (snake[i].d) {
				case "LEFT": snake[i].x -= 0.1; break;
				case "RIGHT": snake[i].x += 0.1; break;
				case "UP": snake[i].y -= 0.1; break;
				case "DOWN": snake[i].y += 0.1; break;
			}
		}
	
		// rounding
		snake[i].y = Math.round((snake[i].y + Number.EPSILON) * 100) / 100;
		snake[i].x = Math.round((snake[i].x + Number.EPSILON) * 100) / 100;

		for (let j = 0; j < corner.length; j++) { // change direction
			if (snake[i].x == corner[j].x && snake[i].y == corner[j].y && i != 0) snake[i].d = snake[i - 1].d;
			if (snake[snake.length - 1].x == corner[j].x && snake[snake.length - 1].y == corner[j].y) corner.splice(j,1);
		}
	}
}

function draw() {
	directionHandler();
	loop();

	//### Drawing functions ###
	ctx.fillStyle = '#111111';
	ctx.fillRect(0, 0, canvas.width, canvas.height); // draw background

	ctx.fillStyle = '#cc3333';
	add(food.x, food.y); // draw food

	ctx.fillStyle = '#339933';
	snake.forEach(part => add(part.x, part.y)); // draw snake

	//### Debugging ###
	ctx.fillStyle = '#339933';
	corner.forEach(part => add(part.x, part.y)); // draw corner

	window.setTimeout(() => {
		if (gameRunning) requestAnimationFrame(draw);
	}, 1000 / 120);
}

function add(x, y) { // draw's a cube
	ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
}

function placeApple() {
	let rndX = Math.floor(Math.random() * cols);
	let rndY = Math.floor(Math.random() * rows);

	let check = true;
	for(let i = snake.length - 1; i >= 0; i--) {
        if (food.x == snake[i].x && food.y == snake[i].y) check = true;
    }

	if (check == true) { // place food
        food = {x: rndX, y: rndY};
    } else placeApple();
}

function keyDown(e) { // input management
	switch (e.keyCode) {
		case 37: if(direction != "RIGHT") inputDirection = 'LEFT'; break;
		case 65: if(direction != "RIGHT") inputDirection = 'LEFT'; break;
		case 38: if(direction != "DOWN") inputDirection = 'UP'; break;
		case 87: if(direction != "DOWN") inputDirection = 'UP'; break;
		case 39: if(direction != "LEFT") inputDirection = 'RIGHT'; break;
		case 68: if(direction != "LEFT") inputDirection = 'RIGHT'; break;
		case 40: if(direction != "UP") inputDirection = 'DOWN'; break;
		case 83: if(direction != "UP") inputDirection = 'DOWN'; break;
	}
}

function gameOver() {
	gameRunning = false;
	let size = 60;

	if (gS <= 0) gSwitch = true;

	gX -= 1 * gS / 10;
	if (!gSwitch) gY += 5;
	else gY -= 2.5;
	if (!gSwitch) gS--;
	else gS++;

	ctx.drawImage(gameOver_sprite, gX, gY, Math.round(size * 6.22), size);

	if (gX <= -350) restart();

	window.setTimeout(() => {
		if (gX > -350) requestAnimationFrame(gameOver);
	}, 1000 / 60);
}

function restart() {
	gameRunning = false;

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

function reset() { // complete reset
	snake = 
	[
		{x: Math.round(rows/2), y: Math.round(cols/2), d: "RIGHT"},
		{x: Math.round(rows/2) - 1, y: Math.round(cols/2), d: "RIGHT"},
		{x: Math.round(rows/2) - 2, y: Math.round(cols/2), d: "RIGHT"}
	];
	corner = [];
	food = {x: 3, y: 2}
	inputDirection = "RIGHT";
	direction = "RIGHT";
	localScore = 0;
	rX = -450;

	gX = 720;
	gY = -70;
	gS = 100;
	gSwitch = false;
}