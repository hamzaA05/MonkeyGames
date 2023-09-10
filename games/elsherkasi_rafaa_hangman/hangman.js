// Die Regeln werden Angezeigt
var modal = document.getElementById("myModal");


var btn = document.getElementById("myBtn");


var span = document.getElementsByClassName("close")[0];

 
btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//definierte wörter die benutzt werden
var programmier_sprache = [
	"python",
	"javascript",
	"mongodb",
	"json",
	"java",
	"html",
	"css",
	"c",
	"csharp",
	"golang",
	"kotlin",
	"php",
	"sql",
	"ruby"
]

let antwort = '';
let maxFehler = 6;
let fehler = 0;
let geraten = [];
let wort_status = null;

// funktion ein wort auswählen
function zuffal_wort() {
  antwort = programmier_sprache[Math.floor(Math.random() * programmier_sprache.length)];
}

//tastatur auf dem bildschirm antzeigen
function button_erstellen() {
  let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
    `
      <button
        class="btn btn-lg btn-primary m-2"
        id='` + letter + `'
        onClick="erratene_buchstabe('` + letter + `')"
      >
        ` + letter + `
      </button>
    `).join('');

  document.getElementById('keyboard').innerHTML = buttonsHTML;
}


//der gewählte buchstabe wird angezeigt
function erratene_buchstabe(gewahlte_buchstabe) {
  geraten.indexOf(gewahlte_buchstabe) === -1 ? geraten.push(gewahlte_buchstabe) : null;
  document.getElementById(gewahlte_buchstabe).setAttribute('disabled', true);

  if (antwort.indexOf(gewahlte_buchstabe) >= 0) {
    wort_gewahlt();
    check_win();
  } else if (antwort.indexOf(gewahlte_buchstabe) === -1) {
    fehler++;
    update_fehler();
    check_lost();
    update_bild();
  }
}

//nach jedem fehler wird das Bild erneuert
function update_bild() {
  document.getElementById('hangmanPic').src = './bilder/' + fehler + '.png';
}

//checken ob gewonnen
function check_win() {
  if (wort_status === antwort) {
    document.getElementById('keyboard').innerHTML = 'You Won!!!';
  }
}

//checken ob verloren
function check_lost() {
  if (fehler === maxFehler) {
    document.getElementById('wordSpotlight').innerHTML = 'The antwort was: ' + antwort;
    document.getElementById('keyboard').innerHTML = 'You Lost!!!';
  }
}


//gewähltes wort
function wort_gewahlt() {
  wort_status = antwort.split('').map(letter => (geraten.indexOf(letter) >= 0 ? letter : " _ ")).join('');

  document.getElementById('wordSpotlight').innerHTML = wort_status;
}


//fehler eines mehr
function update_fehler() {
  document.getElementById('fehler').innerHTML = fehler;
}


// reset funktion
const resetBtn = document.getElementById('resetBtn');

function reset() {
  resetBtn.disabled = true;
  setTimeout(() => {
    resetBtn.disabled = false;
  }, 1000);
  resetGame();
}


document.getElementById('maxFehler').innerHTML = maxFehler;

//neu spielen
zuffal_wort();
button_erstellen();
wort_gewahlt();
