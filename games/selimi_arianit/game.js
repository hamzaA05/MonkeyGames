const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

game.width = window.innerWidth;
game.height = window.innerHeight;

// Bild von meinem Charackter und Gegner und bei welcher Funktion sie geladen sein sollten
const image = document.createElement("img");
image.src = "charackter_2dgame.png";
image.onload = this.draw;

const image1 = document.createElement("img");
image1.src = "gegner.png";
image1.onload = this.draw;

// Variabeln
let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

// Event Listeners
document.addEventListener('keydown', function (evt) {
  keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
  keys[evt.code] = false;
});

// Klasse für Player erstellt damit jeder neu erstellter Player gleich ist
class Player {
  
  // c = Color weg nehmen nicht vergessen nur zum testen da
  constructor (x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dy = 0;
    this.jumpForce = 13;
    this.originalHeight = h;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  Animate () {
    // Jump
    if (keys['Space'] || keys['ArrowUp']) {
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }
    this.y += this.dy;

    // Diese Verzweigung dient zur Gravitation
    if (this.y + this.h < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.h;
    }

    this.Draw();
  }

  Jump () {
    if (this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - (this.jumpTimer / 50);
    }
  }
  // Damit das Bild zur Klasse Spieler gemacht wird
  Draw () {
    ctx.drawImage(image, this.x, this.y, this.w, this.h);
  }
}

// Klasse für Hindernis
class Obstacle {
  constructor (x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed;
  }

  Update () {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw () {
    ctx.drawImage(image1, this.x, this.y, this.w, this.h);
  }
}


// Klasse für meinen Score und Highscore
class Text {
  constructor (t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  Draw () {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}

// Funktionen fürs Spiel

function Pause () {
  alert("Du hast das spiel pausiert. Drücke auf Ok um es fortzuführen.");
}

function hilfe () {
  alert("Ziel: Das Ziel ist es, deinen Persönlichen Highscore zu knacken und über die feindlichen Köpfe zu springen. Sobald du einen dieser Köpfe berührst, wirst du sterben und der Score erneuert sich. Um das Spiel zu spielen, drücke bitte den Playbutton. Versuche dein Glück und spiele auch gegen deine Freunde um zu schauen wer der Beste von euch ist. Steuerung: Springe mit der Leertaste oder mit der oberen Pfeiltaste.")
}

// Damit der Playbutton funktioniert
function Play () {
  Start();
}

// Funktion damit ein Hindernis spawnt
function SpawnObstacle () {
  let size = 70;
  let type = 0;
  let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size);

  if (type == 1) {
    obstacle.y -= player.originalHeight - 10;
  }
  obstacles.push(obstacle);
}


function Start () {
  ctx.font = "20px sans-serif";

  gameSpeed = 3;
  gravity = 1;

  score = 0;
  highscore = 0;
  if (localStorage.getItem('highscore')) {
    highscore = localStorage.getItem('highscore');
  }

  player = new Player(25, 0, 70, 70);

  scoreText = new Text("Score: " + score, 25, 25, "left", "#FFFFFF", "20");
  highscoreText = new Text("Highscore: " + highscore, canvas.width - 25, 25, "right", "#FFFFFF", "20");

  requestAnimationFrame(Update);
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;
function Update () {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spawnTimer--;
  if (spawnTimer <= 0) {
    SpawnObstacle();
    console.log(obstacles);
    spawnTimer = initialSpawnTimer - gameSpeed * 8;
    
    if (spawnTimer < 60) {
      spawnTimer = 60;
    }
  }

  // Gegner Spawnen
  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

    if (o.x + o.w < 0) {
      obstacles.splice(i, 1);
    }

    if (
      player.x < o.x + o.w &&
      player.x + player.w > o.x &&
      player.y < o.y + o.h &&
      player.y + player.h > o.y
    ) {
      obstacles = [];
      score = 0;
      spawnTimer = initialSpawnTimer;
      gameSpeed = 3;
      window.localStorage.setItem('highscore', highscore);
    }

    o.Update();
  }

  player.Animate();

  score++;
  scoreText.t = "Score: " + score;
  scoreText.Draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.t = "Highscore: " + highscore;
  }
  
  highscoreText.Draw();

  gameSpeed += 0.02;
}
