/*
    ____  ____  ________  __
   / __ \/ __ \/ ____/ / / /
  / /_/ / / / / /   / / / / 
 / ____/ /_/ / /___/ /_/ /  
/_/    \____/\____/\____/   
                            
*/


/* 
Was kommt im Skript vor ? 

 Linie:       Thema: 
 45           Objekte 
 105          Menu 
 251          Spieler
 373          Graden
 468          Gegner
 590          Farbplatscher
 695          Hindernisse
 823          Loop
 909          Eingaben 

 */
//Als start sind die ersten Canvas und Windows funktionen drinn.

var version ='0.0.4';
var is_playing = false;
init();
function init()
{
  bgCanvas = document.getElementById('backgroundCanvas');
  bgCTX = bgCanvas.getContext('2d');
  mainCanvas = document.getElementById('mainCanvas');
  mainCTX = mainCanvas.getContext('2d'); 
  
  
  document.addEventListener("keydown", key_down, false);
  document.addEventListener("keyup", key_up, false);
  
  requestaframe = (function() {
		return window.requestAnimationFrame	||
		  window.webkitRequestAnimationFrame	||
		  window.mozRequestAnimationFrame	||
		  window.oRequestAnimationFrame		||
		  window.msRequestAnimationFrame	||
		  function (callback) {
		    window.setTimeout(callback, 1000 / 60)
		  };
  })();



  //---------------------------------------------------------------------------------------------------------
  /*
   ____  __      _      __   __     
  / __ \/ /_    (_)__  / /__/ /____ 
 / / / / __ \  / / _ \/ //_/ __/ _ \
/ /_/ / /_/ / / /  __/ ,< / /_/  __/
\____/_.___/_/ /\___/_/|_|\__/\___/ 
          /___/                     
 */
 // Hier werden alle Objekte wie der Spieler oder die Farbplatscher erstellt.
  player = new Player();
  graden = new Array(); 
  enemies = new Array();
  splatterG = new splatGreen();
  splatterY = new splatYellow();
  splatterC = new splatCyan();
  barrierGHoriObj = new barrierGHori();
  barrierGVerObj = new barrierGVer();
  barrierYHoriObj = new barrierYHori();
  barrierYVerObj = new barrierYVer();
  load_media();

  // Buttons
  buttonsDrawX = new Array();
  buttonsDrawY = new Array();
  buttonsWidth = new Array();
  buttonsHeight = new Array();
  buttonsStatus = new Array();
  
  isMenu = true;
  menuStatus = "main";
  
  bgSprite.addEventListener("load", start_loop, false);

}

// refreshed die Seite
function timedRefresh(timeoutPeriod) {
	setTimeout("location.reload(true);",timeoutPeriod);
}

var score = 0; 
var tag = 0; 

// Ladet die Bilder
function load_media()
{
  bgSprite = new Image();
  bgSprite.src = 'images/background2.png';

  mainSprite = new Image();
  mainSprite.src = 'images/Main_sprite2.png'; 

  buttonSprite = new Image();
  buttonSprite.src = 'images/buttons.png';
}



//---------------------------------------------------------------------------------------------------------
/*                      
   ____ ___  ___  ____  __  __
  / __ `__ \/ _ \/ __ \/ / / /
 / / / / / /  __/ / / / /_/ / 
/_/ /_/ /_/\___/_/ /_/\__,_/  
                              
 */
// Da sind die Funktionen um das Menu zu erstellen

function menu()
{
  
  mainButtons = new Array("Neues Spiel");
  gameOverButtonsArray = new Array("Zum Anfang");
  
 //Entweder das Anfangmenu oder gameOver Menu
  if (menuStatus == "main")
  var menuButtons = mainButtons;
  else (menuStatus == "game_over")
   var menuButtons = gameOverButtonsArray;
 
   //Texte für die Menus
   if(menuStatus == "game_over" && score != graden.length)
   {
     mainCTX.textBaseline = "middle"; 
     mainCTX.textAlign = "center"; 
     mainCTX.font = "50px Arial"; 
     mainCTX.fillStyle = "red"; 
     mainCTX.fillText("game over", 1600 / 2, 100);

     mainCTX.textBaseline = "middle"; 
     mainCTX.textAlign = "center"; 
     mainCTX.font = "50px Arial"; 
     mainCTX.fillStyle = "green"; 
     mainCTX.fillText("Anzahl gesammelte Graden: " + score, 1600 / 2, 600);
   }
   else if(menuStatus == "game_over" && score == graden.length)
   {
    mainCTX.textBaseline = "middle"; 
    mainCTX.textAlign = "center"; 
    mainCTX.font = "50px Arial"; 
    mainCTX.fillStyle = "yellow"; 
    mainCTX.fillText("Du hast es geschafft", 1600 / 2, 100);
   }

  
  for(var i = 0; i < menuButtons.length; i++)
  {
    var drawX = 1360 / 2;
    var drawY = 400 + i*150;
    var height = 75;
    var width = 200; 
    
    var srcX = 0; 
    var srcY = 0;

    if(buttonsStatus[i] == undefined)
    {
      buttonsStatus[i] = "normal";
      buttonsDrawX[i] = drawX; 
      buttonsDrawY[i] = drawY;
      buttonsHeight[i] = height;
      buttonsWidth[i] = width; 
      
    }

    //Verzweigungen wenn der Button geklickt wird und dann gehovert. 
    if(buttonsStatus[i] == "click" )
    {
      if (i == 0 && menuStatus == "main")
      {
        new_Game();
      }

      if(i == 0 && menuStatus == "game_over")
      {
        gameOver();
      }
   
    }
    if (buttonsStatus[i] == "hover")
    {
      srcY += height;
    }
    

    //die Buttons für das Menu.
    if( menuStatus == "main")
    {
      mainCTX.drawImage(buttonSprite, srcX, srcY, 200, 75, drawX, drawY, width, height);
      mainCTX.fillStyle = "black"; 
      mainCTX.font = "30px Arial"; 
      mainCTX.textBaseline = 'middle'; 
      mainCTX.fillText(mainButtons[i], drawX + 2 , drawY  + height / 2);  
    }
  
    if(menuStatus == "game_over")
    {
      mainCTX.drawImage(buttonSprite, srcX, srcY, 200, 75, drawX, drawY, width, height);
      mainCTX.fillStyle = "black"; 
      mainCTX.font = "25px Arial"; 
      mainCTX.textBaseline = 'middle'; 
      mainCTX.fillText(gameOverButtonsArray[i], drawX + 100 , drawY  + height / 2); 
    }
    

  }
  bgCTX.drawImage(bgSprite, 0, 1000, 1600, 800, 0, 0, 1600, 800);
  
}

//Funktion das das Spiel refreshed;
function gameOver () 
{
    timedRefresh(1);
}

//Die Funktion der Maus = Buttons
function mouse(type, e)
{
  var x = e.pageX - document.getElementById('game_object').offsetLeft;
  var y = e.pageY - document.getElementById('game_object').offsetTop;
  
  for (var i = 0; i < buttonsStatus.length; i++)
    {
      if (x <= buttonsDrawX[i] + buttonsWidth[i] && x >= buttonsDrawX[i] && 
	    y <= buttonsDrawY[i] + buttonsHeight[i] && y >= buttonsDrawY[i])
      {
        if(type == 'move' && buttonsStatus[i] != "click")
      	buttonsStatus[i] = "hover";
        else 
        buttonsStatus[i] = 'click';
      }
      else
	    buttonsStatus[i] = "normal";
    }
  
  
}



//---------------------------------------------------------------------------------------------------------
/*
   _____       _      __         
  / ___/____  (_)__  / /__  _____
  \__ \/ __ \/ / _ \/ / _ \/ ___/
 ___/ / /_/ / /  __/ /  __/ /    
/____/ .___/_/\___/_/\___/_/     
    /_/                          

 */
// Da wird der Spieler erstellt und die benötigten Kollisionen und Transformationen
function Player()
{
  this.drawX = 400;
  this.drawY = 500 - 110;
  this.srcX = 99;
  this.srcY= 212;
  this.width = 70;
  this.height = 70;
  this.speed = 5;
  this.isNOTCollided = true;
}
Player.prototype.draw = function()
{
  this.checkKeys();

 // Erstellt die verschiedenen Formen vom Spieler wegen den Farbplatscher
  if(this.isNOTCollided == true && tag == 0)
  mainCTX.drawImage(mainSprite,this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height); 
  
  else if(this.isNOTCollided == true && tag == 1)
  mainCTX.drawImage(mainSprite,90,435, 100, 100, this.drawX, this.drawY, this.width, this.height); 

  else if(this.isNOTCollided == true && tag == 2)
  mainCTX.drawImage(mainSprite,0,0, 100, 100, this.drawX, this.drawY, this.width, this.height); 

  else if(this.isNOTCollided == true && tag == 3)
  mainCTX.drawImage(mainSprite,102,312, 100, 100, this.drawX, this.drawY, this.width, this.height); 


  //Wenn der Spieler nicht mit einer gleichen Farbe kollidiert beendet sich das Spiel
  for (var i = 0; i < enemies.length; i++)
  {
    if (this.drawX <= enemies[i].drawX + enemies[i].width && this.drawX + this.width >= enemies[i].drawX && 
      this.drawY <= enemies[i].drawY + enemies[i].height && this.drawY + this.height >= enemies[i].drawY && tag != 3)
      { 
        this.isNOTCollided = false;   
        menuStatus = "game_over";
        isMenu = true;
      }
  
  }

    if (this.drawX <= barrierGHoriObj.drawX + barrierGHoriObj.width && this.drawX + this.width >= barrierGHoriObj.drawX && 
      this.drawY <= barrierGHoriObj.drawY + barrierGHoriObj.height && this.drawY + this.height >= barrierGHoriObj.drawY && tag != 1)
      {
        
        this.isNOTCollided = false;   
        menuStatus = "game_over";
        isMenu = true;
        
       
      } 

      if (this.drawX <= barrierGVerObj.drawX + barrierGVerObj.width && this.drawX + this.width >= barrierGVerObj.drawX && 
        this.drawY <= barrierGVerObj.drawY + barrierGVerObj.height && this.drawY + this.height >= barrierGVerObj.drawY && tag != 1)
        {
          
          this.isNOTCollided = false;   
          menuStatus = "game_over";
          isMenu = true;
          
         
        } 

        if (this.drawX <= barrierYHoriObj.drawX + barrierYHoriObj.width && this.drawX + this.width >= barrierYHoriObj.drawX && 
          this.drawY <= barrierYHoriObj.drawY + barrierYHoriObj.height && this.drawY + this.height >= barrierYHoriObj.drawY && tag != 2)
          {
            
            this.isNOTCollided = false;   
            menuStatus = "game_over";
            isMenu = true;
            
           
          } 
          if (this.drawX <= barrierYVerObj.drawX + barrierYVerObj.width && this.drawX + this.width >= barrierYVerObj.drawX && 
            this.drawY <= barrierYVerObj.drawY + barrierYVerObj.height && this.drawY + this.height >= barrierYVerObj.drawY && tag != 2)
            {
              
              this.isNOTCollided = false;   
              menuStatus = "game_over";
              isMenu = true;
              
             
            } 
   
};



// Dies kontrolliert den Input von den Pfeiltasten.
Player.prototype.checkKeys = function()
{
    
  if (this.isDownkey == true)
    this.drawY += this.speed; 


  if (this.isUpkey == true)
  {
    this.drawY = this.drawY - 5; 
  }

  if (this.isLeftkey == true)
    this.drawX -= this.speed;
  if (this.isRightkey == true)
    this.drawX += this.speed;
}




//---------------------------------------------------------------------------------------------------------
/* 
   ______               __         
  / ____/________ _____/ /__  ____ 
 / / __/ ___/ __ `/ __  / _ \/ __ \
/ /_/ / /  / /_/ / /_/ /  __/ / / /
\____/_/   \__,_/\__,_/\___/_/ /_/ 
                                   
*/
//Graden sind dafür da, sodass der Spieler ein Ziel hat. Der Spieler sammelt dann die Graden.

function Grade()
{
  this.drawX = Math.round(Math.random()*1500);
  this.drawY = Math.round(Math.random()*700);
  this.srcX = 180;
  this.srcY= 213;
  this.width = 100;
  this.height = 85;
  this.speed = 5; 
}

//Ein paar Graden sind im spiel exakt positioniert und andere werden zufällig positioniert

//exakt
graden[0] = new Grade();
graden[0].drawX = 1400; 
graden[0].drawY = 700;

graden[1] = new Grade();
graden[1].drawX = 150; 
graden[1].drawY = 400;

graden[2] = new Grade();
graden[2].drawX = 500; 
graden[2].drawY = 600;

graden[3] = new Grade();
graden[3].drawX = 330; 
graden[3].drawY = 40;

graden[4] = new Grade();
graden[4].drawX = 1000; 
graden[4].drawY = 500;

graden[5] = new Grade();
graden[5].drawX = 530; 
graden[5].drawY = 40;

graden[6] = new Grade();
graden[6].drawX = 630; 
graden[6].drawY = 40

//Zufällig
graden[7] = new Grade();
graden[8] = new Grade();
graden[9] = new Grade();
graden[10] = new Grade();
graden[11] = new Grade();
graden[12] = new Grade();
graden[13] = new Grade();
graden[14] = new Grade();


var isNOTCollidedGA = [4]; 

//Graden anzeigen
Grade.prototype.draw = function()
{
  for(var i = 0; i < graden.length; i++)
  {
    if(isNOTCollidedGA[i] = true)
    mainCTX.drawImage(mainSprite,graden[i].srcX, graden[i].srcY, graden[i].width, graden[i].height, graden[i].drawX, graden[i].drawY, graden[i].width, graden[i].height); 
  }
  // Wenn der Grad vom Spieler getroffen wird, verschwindet er und die Punkteanzeige wird + 1
  for(var i = 0; i < graden.length; i++)
  {
    if (graden[i].drawX <= player.drawX + player.width && graden[i].drawX + graden[i].width >= player.drawX && 
      graden[i].drawY <= player.drawY + player.height && graden[i].drawY + graden[i].height >= player.drawY)
      {
        isNOTCollidedGA[i] = false;
        
        graden[i].drawX = 1000; 
        graden[i].drawY = 1000; 
        score += 1;
        
      }
  }
  
   
    
};




//---------------------------------------------------------------------------------------------------------
/* 
   ______                          
  / ____/__  ____ _____  ___  _____
 / / __/ _ \/ __ `/ __ \/ _ \/ ___/
/ /_/ /  __/ /_/ / / / /  __/ /    
\____/\___/\__, /_/ /_/\___/_/     
          /____/                   
*/

// Gegner behindern den Spieler, sodass es schwieriger wird durchzuspielen
function Enemy()
{
  this.drawX = 5;
  this.drawY = 500 - 110;
  this.srcX = 102;
  this.srcY= 312;
  this.width = 90;
  this.height = 100;
  this.speed = 5;
  this.BorderRight = false; 
  this.BorderLeft = true;

  this.BorderDown = false;
  this.BorderUp = true; 

}

var isNOTCollidedGE = [1];

enemies[0] = new Enemy();

enemies[1] = new Enemy();
enemies[1].drawX = 1150;
enemies[1].drawY = 10;

//Gegner zeichnen
Enemy.prototype.draw = function() 
{
  for(var i = 0; i < enemies.length; i++)
  {
    if(isNOTCollidedGE[i] = true)
    mainCTX.drawImage(mainSprite,enemies[i].srcX, enemies[i].srcY, enemies[i].width, enemies[i].height, enemies[i].drawX, enemies[i].drawY, enemies[i].width, enemies[i].height); 

  }

 
        
    if (enemies[0].drawX <= player.drawX + player.width && enemies[0].drawX + enemies[0].width >= player.drawX && 
      enemies[0].drawY <= player.drawY + player.height && enemies[0].drawY + enemies[0].height >= player.drawY && tag == 3)
      {
        
        isNOTCollidedGE[0] = false;   
        enemies[0].drawX = 10000; 
        enemies[0].drawY = 10000;
      } 
  
             
    if (enemies[1].drawX <= player.drawX + player.width && enemies[1].drawX + enemies[1].width >= player.drawX && 
      enemies[1].drawY <= player.drawY + player.height && enemies[1].drawY + enemies[1].height >= player.drawY && tag == 3)
      {
        
        isNOTCollidedGE[1] = false;   
        enemies[1].drawX = 10000; 
        enemies[1].drawY = 10000;
      }  
};

// Dies macht die Bewegung der Gegner horizontal und vertikal
Enemy.prototype.MotionHor = function()
{
 
    if(enemies[0].drawX == 5)
    {
      this.BorderLeft = true;
      this.BorderRight = false;
    }
    if(enemies[0].drawX < 1000 && this.BorderLeft == true)
    {
      enemies[0].drawX += enemies[0].speed; 
      this.BorderRight = false;
    }
    if(enemies[0].drawX == 1000)
    {
      this.BorderRight = true; 
      this.BorderLeft = false;
    }
    if(this.BorderRight == true && enemies[0].drawX > 5)
    {
      enemies[0].drawX -= enemies[0].speed;
      this.BorderLeft = false;
    }

}

Enemy.prototype.MotionVer = function()
{
  if(enemies[1].drawY == 10)
  {
  this.BorderUp = true;
  this.BorderDown = false;
  }
  if(enemies[1].drawY < 725 && this.BorderUp == true)
  {
  enemies[1].drawY += enemies[1].speed; 
  this.BorderDown = false;
  }
  if(enemies[1].drawY == 725)
  {
  this.BorderDown = true; 
  this.BorderUp = false;
  }
  if(this.BorderDown == true && enemies[1].drawX > 5)
  {
  enemies[1].drawY -= enemies[1].speed;
  this.BorderUp = false;
  }
}




//---------------------------------------------------------------------------------------------------------
/* 

    ______           __          __      __            __             
   / ____/___ ______/ /_  ____  / /___ _/ /___________/ /_  ___  _____
  / /_  / __ `/ ___/ __ \/ __ \/ / __ `/ __/ ___/ ___/ __ \/ _ \/ ___/
 / __/ / /_/ / /  / /_/ / /_/ / / /_/ / /_(__  ) /__/ / / /  __/ /    
/_/    \__,_/_/  /_.___/ .___/_/\__,_/\__/____/\___/_/ /_/\___/_/     
                      /_/                                             
*/
// Farbplatscher transformieren den Spieler um Hindernisse und Gegner zu löschen.

//grünen Farbplatscher
function splatGreen()
{
  this.drawX = 80;
  this.drawY = 120;
  this.srcX = 211;
  this.srcY= 306;
  this.width = 111;
  this.height = 111;
  this.isNOTCollidedSplatG = true;
}

splatGreen.prototype.draw = function()
{
  if(this.isNOTCollidedSplatG == true)
  mainCTX.drawImage(mainSprite,this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height); 

  if (this.drawX <= player.drawX + player.width && this.drawX + this.width >= player.drawX && 
    this.drawY <= player.drawY + player.height && this.drawY + this.height >= player.drawY)
    {
      
      this.isNOTCollidedSplatG = false;   
      splatterG.drawX = 10000; 
      splatterG.drawY = 10000;
      
      tag = 1;
     
    } 
}


//gelber Farbplatscher
function splatYellow() 
{
  this.drawX = 1400;
  this.drawY = 10;
  this.srcX = 96;
  this.srcY= 99;
  this.width = 111;
  this.height = 111;
  this.isNOTCollidedSplatY = true;
}

splatYellow.prototype.draw = function()
{
  if(this.isNOTCollidedSplatY == true)
  mainCTX.drawImage(mainSprite,this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height); 

  if (this.drawX <= player.drawX + player.width && this.drawX + this.width >= player.drawX && 
    this.drawY <= player.drawY + player.height && this.drawY + this.height >= player.drawY)
    {
      
      this.isNOTCollidedSplatY = false;   
      splatterY.drawX = 10000; 
      splatterY.drawY = 10000;
      
      tag = 2;
    } 
} 


//türkiser Farbplatscher
function splatCyan()
{
  this.drawX = 800;
  this.drawY = 50;
  this.srcX = 250;
  this.srcY= 97;
  this.width = 111;
  this.height = 111;
  this.isNOTCollidedSplatC = true;
}


splatCyan.prototype.draw = function()
{
  if(this.isNOTCollidedSplatC == true)
  mainCTX.drawImage(mainSprite,this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height); 

  if (this.drawX <= player.drawX + player.width && this.drawX + this.width >= player.drawX && 
    this.drawY <= player.drawY + player.height && this.drawY + this.height >= player.drawY)
    {
      
      this.isNOTCollidedSplatC = false;   
      splatterC.drawX = 10000; 
      splatterC.drawY = 10000;
      
      tag = 3;
     
    } 
} 



//---------------------------------------------------------------------------------------------------------
/* 

    __  ___           __                _              
   / / / (_)___  ____/ /__  _________  (_)____________ 
  / /_/ / / __ \/ __  / _ \/ ___/ __ \/ / ___/ ___/ _ \
 / __  / / / / / /_/ /  __/ /  / / / / (__  |__  )  __/
/_/ /_/_/_/ /_/\__,_/\___/_/  /_/ /_/_/____/____/\___/ 
                                                       
*/
// Hindernisse behindern den Spieler das Spiel schneller durchspielen zu können.


//Grüne Barrieren
function barrierGHori() 
{
  this.drawX = 1325;
  this.drawY = 235;
  this.srcX = 93;
  this.srcY= 437;
  this.width = 300;
  this.height = 70;
  this.isNOTCollidedbaGH = true;
}

//Zeichnen der grünen Horizontalen Barriere
barrierGHori.prototype.draw = function() 
{
  if(this.isNOTCollidedbaGH == true)
  mainCTX.drawImage(mainSprite,this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height); 
  

  if (this.drawX <= player.drawX + player.width && this.drawX + this.width >= player.drawX && 
    this.drawY <= player.drawY + player.height && this.drawY + this.height >= player.drawY && tag == 1)
    {
      
      this.isNOTCollidedbaGH = false;   
      barrierGHoriObj.drawX = 10000; 
      barrierGHoriObj.drawY = 10000;
    }
}

// Grüne vertikale Barriere
function barrierGVer() 
{
  this.drawX = 1270;
  this.drawY = 0;
  this.srcX = 5;
  this.srcY= 131;
  this.width = 70;
  this.height = 300;
  this.isNOTCollidedbaGV = true;
}

barrierGVer.prototype.draw = function() 
{
  if(this.isNOTCollidedbaGV == true)
  mainCTX.drawImage(mainSprite,this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height); 
  

  if (this.drawX <= player.drawX + player.width && this.drawX + this.width >= player.drawX && 
    this.drawY <= player.drawY + player.height && this.drawY + this.height >= player.drawY && tag == 1)
    {
      
      this.isNOTCollidedbaGV = false;   
      barrierGVerObj.drawX = 10000; 
      barrierGVerObj.drawY = 10000;
    }
}



//Gelbe Barrieren 
function barrierYHori() 
{
  this.drawX = 1300;
  this.drawY = 600;
  this.srcX = 5;
  this.srcY= 8;
  this.width = 300;
  this.height = 70;
  this.isNOTCollidedbaYH = true;
}

//Gelbe Barriere Horizontal zeichnen
barrierYHori.prototype.draw = function() 
{
  if(this.isNOTCollidedbaYH == true)
  mainCTX.drawImage(mainSprite,this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height); 
  

  if (this.drawX <= player.drawX + player.width && this.drawX + this.width >= player.drawX && 
    this.drawY <= player.drawY + player.height && this.drawY + this.height >= player.drawY && tag == 2)
    {
      
      this.isNOTCollidedbaYH = false;   
      barrierYHoriObj.drawX = 10000; 
      barrierYHoriObj.drawY = 10000;
    } 
}

// Gelbe vertikale Barriere
function barrierYVer()
{
   this.drawX = 1300;
  this.drawY = 600;
  this.srcX = 426;
  this.srcY= 9;
  this.width = 70;
  this.height = 300;
  this.isNOTCollidedbaYV = true;
}

barrierYVer.prototype.draw = function() 
{
  if(this.isNOTCollidedbaYV == true)
  mainCTX.drawImage(mainSprite,this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height); 
  
  
  if (this.drawX <= player.drawX + player.width && this.drawX + this.width >= player.drawX && 
    this.drawY <= player.drawY + player.height && this.drawY + this.height >= player.drawY && tag == 2)
    {
      
      this.isNOTCollidedbaYV = false;   
      barrierYVerObj.drawX = 10000; 
      barrierYVerObj.drawY = 10000;
    } 
}



//---------------------------------------------------------------------------------------------------------
/*
__                    
/ /   ____  ____  ____ 
/ /   / __ \/ __ \/ __ \
/ /___/ /_/ / /_/ / /_/ /
/_____/\____/\____/ .___/ 
              /_/      
*/
//Die Loop funktion ist dafür da, das die verschiedene Objekte sich bewegen können und immer noch angezeigt werden.
function loop()
{
  mainCTX.clearRect(0,0,1600,800);
   
  
  if (isMenu == false)
  {
    //Elemente werden im Loop gezeigt
    bgCTX.drawImage(bgSprite, 0, 0); 
    player.draw();
    splatterG.draw();
    splatterY.draw();
    splatterC.draw();
    barrierGHoriObj.draw();
    barrierGVerObj.draw();
    barrierYHoriObj.draw();
    barrierYVerObj.draw();

  
    enemies[1].MotionVer();
    enemies[0].MotionHor();
   

       enemies[0].draw();
       enemies[1].draw();
    
   
    
    for(var i = 0; i < graden.length; i++)
    {
      graden[i].draw();
    }
    

    // Der Score von den Graden
     mainCTX.fillStyle = "white"; 
     mainCTX.font = "80px Arial"; 
     mainCTX.textBaseline = 'middle'; 
     mainCTX.fillText(score, 15, 50);
     if(score == graden.length)
    {
      isMenu = true;
      menuStatus = "game_over";
    }
  }
  else
  menu();

  if (is_playing)
    requestaframe(loop);
}

function new_Game()
{
  bgCTX.drawImage(bgSprite, 0, 0);
  isMenu = false; 
  
}

// Was als erstes im Spiel passiert.
function start_loop()
{
  is_playing = true;
  
  loop();
  
}

function stop_loop()
{
  is_playing = false;
}



//---------------------------------------------------------------------------------------------------------
/*
    _______                   __             
   / ____(_)___  ____ _____ _/ /_  ___  ____ 
  / __/ / / __ \/ __ `/ __ `/ __ \/ _ \/ __ \
 / /___/ / / / / /_/ / /_/ / /_/ /  __/ / / /
/_____/_/_/ /_/\__, /\__,_/_.___/\___/_/ /_/ 
              /____/                         
 */
// Dort werden die Eingaben von den Pfeiltasten erkennt, mit KeyCodes.
function key_down(e)
{
  var key_id = e.keyCode || e.which;
  if (key_id == 40) //down key
  {
    player.isDownkey = true;
    e.preventDefault();
  }
  if (key_id == 38) //up key
  {
    player.isUpkey = true;
    e.preventDefault();
  }
  if (key_id == 37) //left key
  {
    player.isLeftkey = true;
    e.preventDefault();
  }
  if (key_id == 39) //right key
  {
    player.isRightkey = true;
    e.preventDefault();
  }
}
function key_up(e)
{
  var key_id = e.keyCode || e.which;
  if (key_id == 40) //down key
  {
    player.isDownkey = false;
    e.preventDefault();
  }
  if (key_id == 38) //up key
  {
    player.isUpkey = false;
    e.preventDefault();
  }
  if (key_id == 37) //left key
  {
    player.isLeftkey = false;
    e.preventDefault();
  }
  if (key_id == 39) //right key
  {
    player.isRightkey = false;
    e.preventDefault();
  }
}
