const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let mousePressed = false;
document.addEventListener('mousedown', function(data) {
	mousePressed = true;
});
  
document.addEventListener('mouseup', function(data) {
	mousePressed = false;
});

function reload()
{
	location.reload(true);
}

let mX, mY;
let selGame = "Snake Game";
let game = 0;
let change = 0;

init();

function init() {
	bg_sprite = new Image();
    bg_sprite.src = 'image/background.png';

	gamePrev_sprite = new Image();
    gamePrev_sprite.src = 'image/gamePrev.png';

	btn_sprite = new Image();
    btn_sprite.src = 'image/buttons.png';

	draw();
}

function cords(e) {
	mX = e.pageX - document.getElementById('canvas').offsetLeft;
	mY = e.pageY - document.getElementById('canvas').offsetTop;
}

function buttonHandeling() {
	if (mX <= 473 && mX >= 120 && mY <= 515 && mY >= 162) if (mousePressed) {
		if (game == 0) window.location.href="snake_game.html";
		else window.location.href="pong.html";
	}

	if (mX <= 86 && mX >= 30 && mY <= 374 && mY >= 280 && game == 1) if (mousePressed) {
		game++;
		if (game >= 2) game = 0;
	}

	if (mX <= 570 && mX >= 514 && mY <= 374 && mY >= 280 && game == 0) if (mousePressed) {
		game++;
		if (game >= 2) game = 0;
	}

	if (game == 0) selGame = "Snake Game";
	else selGame = "Pong";
}

function draw() {
	buttonHandeling();

	ctx.drawImage(bg_sprite, 0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = '#000000';
	ctx.font = "30px Arial";
	if (selGame == "Snake Game") ctx.fillText(selGame, 210, 140);
	else ctx.fillText(selGame, 260, 140);

	ctx.drawImage(gamePrev_sprite, game * 800 + change, 0, 800, 800, canvas.width / 5, canvas.height / 3.7, canvas.width / 1.7, canvas.height / 1.7);

	if (game == 1) ctx.drawImage(btn_sprite, 0, 0, 56, 94, 30, 280, 56, 94);
	else ctx.drawImage(btn_sprite, 56, 0, 56, 94, canvas.width - 86, 280, 56, 94);

	window.setTimeout(() => {
		requestAnimationFrame(draw);
	}, 1000 / 120);
}