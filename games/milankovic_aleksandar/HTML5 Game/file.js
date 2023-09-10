let container = document.querySelector("#container");
let samurai = document.querySelector("#samurai");
let block = document.querySelector("#block");
let score = document.querySelector("#score");
let gameOver = document.querySelector("#gameOver");

//Pause und Hilfe Knopf
function hilfe(){
    alert("In Sekiro Run musst du über Gegner springen und versuchen immer weiter zu kommen. Du spielst den Samurai, der sich auf der linken Seite vom Spielbereich befindet. Damit das Spiel startet drücke auf die Leertaste. Damit der Samurai in die Luft springt, musst du die obere Pfeiltaste drücken. Falls du mal aufs WC gehen musst, findest du unter dem Spielbereich einen Pauseknopf mit dem du das Spiel pausieren kannst. Viel spass!")
}

function pause() {
    alert("Um mit dem Spiel fortzufahren eine beliebige Taste drücken")
}


//score variabel
let interval = null;
let playerScore = 0;




//score
function scoreCounter() {
    playerScore++;
    score.innerHTML = `Score <b>${playerScore}</b>`;
}


//spiel starten
window.addEventListener("keydown", (start) => {
    //    console.log(start);
    if (start.code == "Space") {
        gameOver.style.display = "none";
        block.classList.add("blockActive");
            

        //score
        let playerScore = 0;
        interval = setInterval(scoreCounter, 200);
    }
});


//samurai springen
window.addEventListener("keydown", (e) => {
    //    console.log(e);

    if (e.key == "ArrowUp")
        if (samurai.classList != "samuraiActive") {
            samurai.classList.add("samuraiActive");

            //                remove class after 0.5 seconds
            setTimeout(() => {
                samurai.classList.remove("samuraiActive");
            }, 500);
        }
});

//"game over" "wenn samurai gegner berührt" 
let result = setInterval(() => {
    let samuraiBottom = parseInt(getComputedStyle(samurai).getPropertyValue("bottom"));
    //    console.log("samuraiBottom" + samuraiBottom);

    let blockLeft = parseInt(getComputedStyle(block).getPropertyValue("left"));
    //    console.log("BlockLeft" + blockLeft);

    if (samuraiBottom <= 90 && blockLeft >= 20 && blockLeft <= 60) {
        //        console.log("Game Over");

        gameOver.style.display = "block";
        block.classList.remove("blockActive"); 
        clearInterval(interval);
        playerScore = 0;
    }
}, 10);
