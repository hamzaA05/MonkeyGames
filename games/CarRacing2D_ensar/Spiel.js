const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

let mousePressed = false;
document.addEventListener('mousedown', function(data) {
	mousePressed = true;
});
  
document.addEventListener('mouseup', function(data) {
	mousePressed = false;
});

let mX, mY;
let rX = -450;


let roadThickness = canvas.width / 3;
let roadMotion = 0;

let lineThickness = roadThickness / 35;
let lineOffset = 0;
let numberOfLine = 6;
let lineGrid = canvas.height / numberOfLine;
let lineGridSmall = lineGrid / 3;

let carMotion = canvas.width / canvas.width;
let carX = canvas.width / 2 - 29;
let carY = canvas.height / 4 * 3 - 56;
let carSize = Math.round(canvas.width * 0.08);
let carWith = carSize / 2 + carSize / 56;

let LEFT = false;
let UP = false;
let RIGHT = false;
let DOWN = false;

let enemy = [];
let spawnCooldown = false;

let speedEffect = 1;
let lSpeedEffect = 20;
let rSpeedEffect = 20;
let speedAngle = 3;
let speedLength = 25;

let score = 0;
let highscore = 0;

let running = true;



init();
function init() {
    main_sprite = new Image();
    main_sprite.src = 'image/car.png';

    enemy_sprite = new Image();
    enemy_sprite.src = 'image/enemy.png';

    spawnEnemy();
}



// Sobald das Playbutton gedrückt wird, startet das Spiel.
function Play() {
    draw();
    document.getElementById('Playbutton').style.display = 'none';
    document.getElementById('Helpbutton').style.display = 'none';

}

// Unendliche Schlaufe 
function loop() {
    spawnEnemy();

    // Road animation / Auobahn Animation
    if (roadMotion >= lineGrid) roadMotion = 0;

    // Road animation / Autobahn Animation
    if (UP) roadMotion += 6; else if (DOWN) roadMotion += 4; else roadMotion += 5;

    // Direction management / Die Richtung wohin das Auto fahren soll
    if (LEFT && carX > roadThickness) {carX -= carMotion * 4; if(UP && lSpeedEffect > speedAngle) lSpeedEffect--;}
    if (UP && carY > 0) {carY -= carMotion; if (speedEffect < speedLength && !DOWN) speedEffect++;}
    if (RIGHT && carX < canvas.width - roadThickness - carSize / 2 - carSize / 56) {carX += carMotion * 4; if(UP && rSpeedEffect > speedAngle) rSpeedEffect--;}
    if (DOWN && carY < canvas.height - carSize) carY += carMotion;

    if (carY <= canvas.height - carSize * 1.2) carY += carMotion / 8;
    // Speed effect / das Effekt wenn das Auto fährt (Boost)
    if (!UP && speedEffect > 1 || carY <= 0 && speedEffect > 1 || DOWN && speedEffect > 1) speedEffect--;
    if (!LEFT && lSpeedEffect < 20 || carX <= roadThickness && rSpeedEffect < 20) lSpeedEffect++;
    if (!RIGHT && rSpeedEffect < 20 || carX >= canvas.width - roadThickness - carSize / 2 - carSize / 56 && rSpeedEffect < 20) rSpeedEffect++;

    // Move enemy / Gegner Autos Geschwindigkeit
    let speed;
    enemy.forEach(part => {
        if (part.s <= 6) part.s = 1; // 1/16
        if (part.s <= 19 && part.s > 6) speed = 2; // 3/16
        if (part.s <= 69 && part.s > 19) speed = 3; // 7/16
        if (part.s <= 88 && part.s > 69) speed = 4; // 3/16
        if (part.s <= 100 && part.s > 88) speed = 5; // 1/8
        part.y += speed
    });

    let enemyY;
    if (enemy[enemy.length - 1]) enemyY = enemy[enemy.length - 1].y;
    if (enemyY >= carSize) spawnCooldown = false;

    // Delete enemy
    for (let i = 0; i < enemy.length; i++) {
        if (enemy[i].y >= canvas.height + carSize) {enemy.splice(i,1); score++;}
    }

    // Collision for game over  / Die Hitbox bei Game Over 
    enemy.forEach(part => {
        if (carX >= part.x - carWith + carWith / 5 && carX <= part.x + carWith - carWith / 5) if (carY >= part.y - carSize + carWith / 5 && carY <= part.y + carSize - carWith / 5) restart();
    });
}




function draw() {
    loop();
    
    //highscore vom Spiel
    if (score > highscore) highscore = score;

    // Debug für Testfälle & Score and Highscore
    // document.getElementById("debug").innerHTML = enemy.length;
    // document.getElementById("debug_one").innerHTML = spawnCooldown;
    // document.getElementById("score").innerHTML = score;
    // document.getElementById("highscore").innerHTML = highscore;

    // Road / Autobahn
    ctx.globalAlpha = 1;
    
    // Score und Highscore farbe und ort
    ctx.fillStyle = '#33d03b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#5C5C5C';
	ctx.fillRect(roadThickness, 0, canvas.width - 2 * roadThickness, canvas.height);
    
    // Middle Line / das Autospur für das Game
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < numberOfLine + Math.round(numberOfLine / 4); i++) {
        lineOffset = lineGrid * i;
        ctx.fillRect(canvas.width / 2 - lineThickness / 2, roadMotion + lineOffset - lineGrid, lineThickness, Math.round(lineGrid * 0.5625));
    }

    // Outer Line - Left & Right / die äusseren Linien als deko (links und rechts)
    for (let i = 0; i < numberOfLine * 3 + Math.round(numberOfLine) * 3; i++) {
        lineOffset = lineGridSmall * i;
        ctx.fillRect(roadThickness, roadMotion + lineOffset - lineGrid, lineThickness, Math.round(lineGridSmall * 0.5));
        ctx.fillRect(canvas.width - roadThickness - lineThickness, roadMotion + lineOffset - lineGrid, lineThickness, Math.round(lineGridSmall * 0.5));
    }

    // Enemy drawing / zeichnet die Gegner
    enemy.forEach(part => ctx.drawImage(enemy_sprite, part.x, part.y, carSize, carSize))

    // Car / Auto
    let blur = 1;
    for (let i = speedEffect; i > 0; i--) {
        ctx.globalAlpha = 1 / speedEffect * blur;

        let mid = i / 4;
        if (LEFT || lSpeedEffect < 20) ctx.drawImage(main_sprite, carX + mid + i / lSpeedEffect, carY + i, carSize - i, carSize);
        else if (RIGHT || rSpeedEffect < 20) ctx.drawImage(main_sprite, carX + mid - i / rSpeedEffect, carY + i, carSize - i, carSize);
        else ctx.drawImage(main_sprite, carX + mid, carY + i, carSize - i, carSize);
        blur++;
    }

    textHandeling();

    if (running) requestAnimationFrame(draw);
}

function textHandeling() {
    let fontOffset = Math.round(canvas.height / 16);
    
    //ctx.fillText("text", x, y);

    ctx.font = "250% Roboto, sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, Math.round(fontOffset / 5), fontOffset);
    ctx.textAlign = "right";
    ctx.fillText("Highscore: ", canvas.width - Math.round(2 * fontOffset), fontOffset);
    ctx.textAlign = "left";
    ctx.fillText(highscore, canvas.width - Math.round(2 * fontOffset), fontOffset);
}

// lässt Feindliche Autos generieren

function spawnEnemy() {
    let rndPlace = Math.round(Math.random() * (2 - 1) + 1);
    let rndSpeed = Math.round(Math.random() * (100 - 1) + 1);
    if (!spawnCooldown) {
        switch (rndPlace) {
            case 1: enemy.push({x: canvas.width / 2 - roadThickness / 4 - carWith / 2, y: 0 - carSize, s: rndSpeed}); break;
            case 2: enemy.push({x: canvas.width / 2 + roadThickness / 4 - carWith / 2, y: 0 - carSize, s: rndSpeed}); break;
        }
        spawnCooldown = true;
    }
}

// Die Events für Steuerung vom Spiel

function keyDown(e) {
	switch (e.keyCode) {
		case 37: LEFT = true; break;
        case 65: LEFT = true; break;
		case 38: UP = true; break;
        case 87: UP = true; break;
		case 39: RIGHT = true; break
		case 68: RIGHT = true; break
		case 40: DOWN = true; break
		case 83: DOWN = true; break
    }
}

function keyUp(e) {
	switch (e.keyCode) {
		case 37: LEFT = false; break;
        case 65: LEFT = false; break;
		case 38: UP = false; break;
        case 87: UP = false; break;
		case 39: RIGHT = false; break
		case 68: RIGHT = false; break
        case 40: DOWN = false; break
        case 83: DOWN = false; break
    }
}

// Help Button zeigt die Anleitung an

function help() {

    document.getElementById('Playbutton').style.display = 'none'
    document.getElementById('Anleitungbild').style.display = 'block'
    document.getElementById('GoBackButton').style.display = 'block'
    layout.drawImage(img, 100, 100)
}

 // Nachdem GameOver nochmal Spiel starten Button
function playagain()
{
    document.getElementById('Playbutton').style.display = 'block'
    document.getElementById('Helpbutton').style.dsiplay = 'block'
}

function cords(e) {
	mX = e.pageX - document.getElementById('canvas').offsetLeft;
	mY = e.pageY - document.getElementById('canvas').offsetTop;
}

function GoBack()
{
    document.getElementById('GoBackButton').style.display = 'none'
    document.getElementById('Anleitungbild').style.display = 'none'
    document.getElementById('Playbutton').style.display = 'block'
    document.getElementById('HelpButton').style.display = 'block'
    
}

//Falls ein Feindliches Auto berührt wird --> Gameover und Playagain button

function restart() {
    let fontSize = canvas.width / 48;
	running = false;

    ctx.fillStyle = '#33d03b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.fillRect(roadThickness + roadThickness / 3.5, canvas.height / 2.25, roadThickness / 2.4, canvas.height / 12);

    ctx.fillStyle = '#16C6FF';
    ctx.fillRect(roadThickness + roadThickness / 3.5 + 2.5, canvas.height / 2.25 + 2.5, roadThickness / 2.4 - 5, canvas.height / 12 - 5);

    ctx.fillStyle = '#000000';
	ctx.font = fontSize + "Arial";
    ctx.textAlign = "center";
	ctx.fillText("Play Again", canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = '#ff0000';
	ctx.font = fontSize + "Arial";
    ctx.fontSize = 48;
    ctx.textAlign = "center";
	ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 4);

    if (mX <= roadThickness + roadThickness / 3 * 2 && mX >= roadThickness + roadThickness / 3 && mY <= canvas.height / 2.25 + canvas.height / 12 && mY >= canvas.height / 2.25) if (mousePressed) reset();

	window.setTimeout(() => {
		if (!running) requestAnimationFrame(restart);
	}, 1000 / 60);
}

function reset() {
    carX = canvas.width / 2 - 29;
    carY = canvas.height / 4 * 3 - 56;
    
    LEFT = false;
    UP = false;
    RIGHT = false;
    DOWN = false;

    enemy = [];
    spawnCooldown = false;

    speedEffect = 1;
    lSpeedEffect = 20;
    rSpeedEffect = 20;
    
    score = 0;

    running = true;

    draw();
}