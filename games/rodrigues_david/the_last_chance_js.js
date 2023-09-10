var version = "0.0.1";
var is_playing = false;
init();
function init()
{
	background_canvas = document.getElementById("background_canvas");
	background_ctx = background_canvas.getContext("2d");
	main_canvas = document.getElementById("main_canvas");
	main_ctx = main_canvas.getContext("2d");
	
	document.addEventListener("keydown", key_down, false);
	document.addEventListener("keyup", key_up, false);

	requestaframe = (function() {
		return window.requestAnimationFrame	  ||
		  window.webkitRequestAnimationFrame  ||
		  window.mozRequestAnimationFrame	  ||
		  window.oRequestAnimationFrame		  ||
		  window.msRequestAnimationFrame	  ||	
		  function (callback) {
		    window.setTimeout(callback, 1000 / 60);
		  };
  })();

  load_media();

  buttons_drawX = [];
  buttons_drawY = [];
  buttons_width = [];
  buttons_height = [];
  buttons_status = [];
  is_menu = true;
  menu_status = "main";
  bg_sprite.addEventListener("load", start_loop, false);

  sfx = true;
  musik = true;
}

//----------music/sounds----------//

function play_background_music()
{
	background_music = theme_song_audio.play();
	if (musik == false)
	{
		try {theme_song_audio.currentTime = 0;} catch(e){}
		background_music.loop;
	}
}

function load_media()
{
	bg_sprite = new Image();
	bg_sprite.src = "images/background.png";

	main_sprite = new Image();
	main_sprite.src = "images/main_sprite.png";

	shoot_audio = new Audio();
	shoot_audio.autobuffer = true;

	var can_play_mp3 = shoot_audio.canPlayType('audio/mpeg');
	if (can_play_mp3.match(/maybe|probably/i))
	{
		shoot_audio.src = 'sounds/shooting.mp3.mp3';
		shoot_audio.type = 'audio/mpeg';
	}
	else
	{
		shoot_audio.src = 'sounds/shooting.wav.wav';
		shoot_audio.type = 'audio/x-wav';
	}

	hurt_audio = new Audio();
	hurt_audio.autobuffer = true;

	can_play_mp3 = hurt_audio.canPlayType('audio/mpeg');
	if (can_play_mp3.match(/maybe|probably/i))
	{
		hurt_audio.src = 'sounds/hurt.mp3.mp3';
		hurt_audio.type = 'audio/mpeg';
	}
	else
	{
		hurt_audio.src = 'sounds/hurt.wav.wav';
		hurt_audio.type = 'audio/x-wav';
	}

	theme_song_audio = new Audio();
	theme_song_audio.autobuffer = true;

	can_play_mp3 = theme_song_audio.canPlayType('audio/mpeg');
	if (can_play_mp3.match(/maybe|probably/i))
	{
		theme_song_audio.src = 'sounds/game_theme_song.mp3.mp3';
		theme_song_audio.type = 'audio/mpeg';
	}
	else
	{
		theme_song_audio.src = 'sounds/game_theme_song.wav.wav';
		theme_song_audio.type = 'audio/x-wav';
	}
}

//----------music/sounds----------//
//----------Menus----------//

function menu()
{
	main_menu_buttons = new Array("Start", "Wie spielen", "Optionen");
	pause_menu_buttons = new Array("Zurück tum Spiel", "Spiel neu starten", "Optionen", "Spiel verlassen");
	options_pause_menu_buttons = new Array("Zurück", "SFX", "Musik");
	options_main_menu_buttons = new Array("Zurück", "SFX", "Musik");
	shop_menu_buttons = new Array("Verbessern", "Verbessern", "Verbessern", "Zurück");
	hilfe_menu_buttons = new Array("Zurück");
	game_over_menu_buttons = main_menu_buttons;

	switch(menu_status) 
	{
		case "main":
			var menu_buttons = main_menu_buttons;
		  break;
		case "pause":
			menu_buttons = pause_menu_buttons;
		  break;
		case "options_pause":
			menu_buttons = options_pause_menu_buttons;
		  break;
		case "options_main":
			menu_buttons = options_main_menu_buttons;
		  break;
		case "hilfe":
			menu_buttons = hilfe_menu_buttons;
			main_ctx.drawImage(main_sprite, 0, 949, 756, 505, 225, 290, 756, 505);
		  break;
		case "game_over":
			menu_buttons = game_over_menu_buttons;
			is_menu = true;

			main_ctx.fillStyle = "red";
			main_ctx.textAlign = "center";
			main_ctx.textBaseline = "top";
			main_ctx.font = "30px Maiandra GD";
			main_ctx.fillText("Punktzahl von letzer Runde:", 250, 225);

			main_ctx.fillStyle = "orange";
			main_ctx.textAlign = "center";
			main_ctx.textBaseline = "top";
			main_ctx.font = "30px Maiandra GD";	
			main_ctx.fillText("Runden: " + wave, 250, 300);
			main_ctx.fillText("Punkte: " + score, 250, 350);
		  break;
		case "shop":
			menu_buttons = shop_menu_buttons;

			main_ctx.fillStyle = "white";
			main_ctx.textAlign = "center";
			main_ctx.textBaseline = "middle";
			main_ctx.font = "30px Maiandra GD";
	
			if (level_move_speed != 6)
			{
				main_ctx.fillText("Kosten "+ price_move_speed, 325, 250);
			}
			main_ctx.fillText("Level "+ level_move_speed, 325, 200);
	
			if (level_damage != 5)
			{
				main_ctx.fillText("Kosten "+ price_damage, 325, 400);
			}
			main_ctx.fillText("Level "+ level_damage, 325, 350);
	
			if (level_shoot_speed != 6)
			{
				main_ctx.fillText("Kosten "+ price_shoot_speed, 325, 550);
			}
			main_ctx.fillText("Level "+ level_shoot_speed, 325, 500);
		  break;
		default:
			menu_buttons = main_menu_buttons;
	} 
	for (var i = 0; i < menu_buttons.length; i++)
	{
		drawX = 600 - 125;
		drawY = 180 + i*150;
		height = 100;
		width = 250;
		var scrY = 449;
			
		if (menu_status == "shop")
		{
			scrY = 649;
		}
		
		if (buttons_status[i] == undefined)
		{
			buttons_status[i] = "normal";
			buttons_drawX[i] = drawX;
			buttons_drawY[i] = drawY;
			buttons_height[i] = height;
			buttons_width[i] = width;
		}

		//----------buttons----------//

		if (buttons_status[i] == "click")
		{
			if(i == 0 && menu_status == "main" || i == 0 && menu_status == "game_over")		//start
				new_game();

			if(i == 1 && menu_status == "main" || i == 1 && menu_status == "game_over")		//hilfe
				menu_status = "hilfe";

			if(i == 0 && menu_status == "hilfe")	//hilfe
				menu_status = "main";
			
			if(i == 2 && menu_status == "main" || i == 2 && menu_status == "game_over")		//optionen main
				menu_status = "options_main";

			if(i == 0 && menu_status == "pause")	//zurück zum spiel
				is_menu = false;

			if(i == 1 && menu_status == "pause")	//neues Spiel
				new_game();

			if(i == 2 && menu_status == "pause")	//optionen pause
				menu_status = "options_pause";

			if(i == 3 && menu_status == "pause")	//spiel verlassen
				menu_status = "main";

			if (i == 0 && menu_status == "options_pause")	//zurück pause
				menu_status = "pause";

			if (i == 0 && menu_status == "options_main")	//zurück main
				menu_status = "main";
			
				
			if (i == 1 && menu_status == "options_main" && sfx == true)		//sfx off main
			{
				sfx = false;
			}
			else if (i == 1 && menu_status == "options_main" && sfx == false)	//sfx on main
			{
				sfx = true;
			}
				

			if (i == 2 && menu_status == "options_main" && musik == true)	//musik off main
			{
				musik = false;
			}
			else if (i == 2 && menu_status == "options_main" && musik == false)		//musik on main
			{
				musik = true;
			}
					

			if (i == 1 && menu_status == "options_pause" && sfx == true)	//sfx off pause
			{
				sfx = false;
			}
			else if (i == 1 && menu_status == "options_pause" && sfx == false)	//sfx off pause
			{
				sfx = true;
			}
				

			if (i == 2 && menu_status == "options_pause" && musik == true)		//musik off pause
			{
				musik = false;
			}
			else if (i == 2 && menu_status == "options_pause" && musik == false)	//musik on pause
			{
				musik = true;
			}

			if (i == 0 && menu_status == "shop" && player.coin >= price_move_speed && level_move_speed != 6)
			{
				player.coin -= price_move_speed;
				level_move_speed++;
				price_move_speed += 50;
				player.speed += 0.2;
			}
			
			if (i == 1 && menu_status == "shop" && player.coin >= price_damage && level_damage != 5)
			{
				player.coin -= price_damage;
				level_damage++;
				price_damage += 50;
				player.gun_damage += 5;
			}
			
			if (i == 2 && menu_status == "shop" && player.coin >= price_shoot_speed && level_shoot_speed != 6)
			{
				player.coin -= price_shoot_speed;
				level_shoot_speed++;
				price_shoot_speed += 50;
				bullet_speed += 0.5;
			}
			
			if (i == 3 && menu_status == "shop")
				is_menu = false;
				

			buttons_status[i] = "hover";
		}

		//----------buttons----------//

		if (menu_status == "shop" && level_move_speed == 6)
		{
			main_ctx.drawImage(main_sprite, 0, 849, 250, 100, 475, 180, 250, 100);
			main_ctx.fillText("Max", 600, 230);
		}

		if (menu_status == "shop" && level_damage == 5)
		{
			main_ctx.drawImage(main_sprite, 0, 849, 250, 100, 475, 330, 250, 100);
			main_ctx.fillText("Max", 600, 380);
		}

		if (menu_status == "shop" && level_shoot_speed == 6)
		{
			main_ctx.drawImage(main_sprite, 0, 849, 250, 100, 475, 480, 250, 100);
			main_ctx.fillText("Max", 600, 530);
		}

		if (buttons_status[i] == "hover")
			scrY += height;

		main_ctx.drawImage(main_sprite, 0, scrY, width, height, drawX, drawY, width, height);

		main_ctx.fillStyle = "white";
   		main_ctx.font = "30px Maiandra GD";
		main_ctx.textAlign = "center";
   		main_ctx.textBaseline = 'middle';
		main_ctx.fillText(menu_buttons[i], drawX + width / 2, drawY + height / 2);		
	}

	if (menu_status == "options_pause" || menu_status == "options_main")
	{
		if (sfx == false)
			main_ctx.drawImage(main_sprite, 250, 549, 250, 100, 200, 330, 250, 100);

		if (sfx == true)
			main_ctx.drawImage(main_sprite, 250, 449, 250, 100, 200, 330, 250, 100);

		if (musik == false)
			main_ctx.drawImage(main_sprite, 250, 549, 250, 100, 200, 480, 250, 100);

		if (musik == true)
			main_ctx.drawImage(main_sprite, 250, 449, 250, 100, 200, 480, 250, 100);
	}

	if (menu_status == "shop")
	{
		background_ctx.drawImage(bg_sprite, 0, 2400, 1200, 800, 0, 0, 1200, 800);

		main_ctx.drawImage(main_sprite, 152, 20, 66, 66, 525, 70, 66, 66);		//coin
		main_ctx.fillText(player.coin, 640, 105);
	}
	else
	{
		background_ctx.drawImage(bg_sprite, 0, 800, 1200, 800, 0, 0, 1200, 800);
	}
}

//----------Menus----------//
//----------Mouse movement----------//

function mouse(type, e)
{
	var x = e.pageX - document.getElementById("game_object").offsetLeft;
	var y = e.pageY - document.getElementById("game_object").offsetTop;

	for (var i = 0; i < buttons_status.length; i++)
	{
		if (x <= buttons_drawX[i] + buttons_width[i] && x >= buttons_drawX[i] && 
			y <= buttons_drawY[i] + buttons_height[i] && y >= buttons_drawY[i])
		{
		  	if (type == 'move' && buttons_status[i] != "click")
			{
				buttons_status[i] = "hover";
			}
			else
			{
				buttons_status[i] = "click";
			}	
		}
		else
		{
			buttons_status[i] = "normal";
		}
		
	}

	if (type == "click" && is_menu == false)
	{
		player.is_allowed_to_shoot = true;	//shoot
	}

	else if (type != "click" && is_menu == false)
	{
		player.is_allowed_to_shoot = false;	//don't shoot
	}

	document.getElementById("x").innerHTML = x;
	document.getElementById("y").innerHTML = y;
}

//----------Mouse movement----------//
//----------player----------//

function Player()
{
	this.drawX = 585;
	this.drawY = 325;

	this.srcX = 44;
	this.srcY = 109;

	this.width = 51;
	this.height = 104;

	this.speed = 1;

	this.is_downkey = false;
	this.is_upkey = false;
	this.is_leftkey = false;
	this.is_rightkey = false;

	this.look_left = false;
	this.look_right = false;
	this.look_up = false;
	this.look_down = false;

	this.look_up_left = false;
	this.look_up_right = false;
	this.look_down_left = false;
	this.look_down_right = false;

	this.is_allowed_to_shoot = false;
	this.shoot_wait = 0;
	this.gun_damage = 10;

	this.life = 30;

	this.coin = 0;
}

Player.prototype.draw = function()
{
	main_ctx.drawImage(main_sprite, 152, 20, 66, 66, 1000, 10, 66, 66);	//coin sprite
	main_ctx.fillStyle = "white";
   	main_ctx.font = "30px Maiandra GD";
	main_ctx.textBaseline = 'top';
	main_ctx.fillText(this.coin, 1120, 30);

	if (this.life > 0)
	{
		this.check_keys();

		// main_ctx.drawImage(main_sprite, 0, 302, 75, 147, this.drawX + 3, this.drawY - 18, 75, 147); // animation to point gun towards cursor position. Image helper
		
		//----------game over screen----------//

		if (this.life == 30)
		{
			main_ctx.drawImage(main_sprite, 300, 0, 164, 48, 15, 15, 164, 48);	//health bar 3/3
		}
		else if (this.life == 20)
		{
			main_ctx.drawImage(main_sprite, 467, 0, 164, 48, 15, 15, 164, 48);	//health bar 2/3
		}
		else if (this.life == 10)
		{
			main_ctx.drawImage(main_sprite, 634, 0, 164, 48, 15, 15, 164, 48);	//health bar 1/3
		}

		if (this.life == 20 && Enemy.wait > 0)
		{
			background_ctx.drawImage(bg_sprite, 0, 1600, 1200, 800, 0, 0, 1200, 800);	//red screen (to inform the player that he took damage)
			Enemy.wait--;
		}

		if (this.life == 10 && Enemy.wait > 0)
		{
			background_ctx.drawImage(bg_sprite, 0, 1600, 1200, 800, 0, 0, 1200, 800);	//red screen (to inform the player that he took damage)
			Enemy.wait--;
		}

		//----------look to mouse position----------//

		if (document.getElementById("x").innerHTML <= this.drawX + 39 && document.getElementById("y").innerHTML >= this.drawY + 15 && document.getElementById("y").innerHTML <= this.drawY + 69 && this.look_down == false && this.look_up == false)	// look left
		{
			main_ctx.drawImage(main_sprite, 97, 109, this.width, this.height, this.drawX + 1, this.drawY, this.width, this.height);
			this.look_left = true;
		}
		else
		{
			this.look_left = false;
		}

		if (document.getElementById("x").innerHTML >= this.drawX + 40 && document.getElementById("y").innerHTML >= this.drawY + 5 && document.getElementById("y").innerHTML <= this.drawY + 60 && this.look_down == false && this.look_up == false)	// look right
		{
			main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX + 30, this.drawY, this.width, this.height);
			this.look_right = true;
		}
		else
		{
			this.look_right = false;
		}



		if (document.getElementById("y").innerHTML <= this.drawY + 20 && document.getElementById("x").innerHTML >= this.drawX + 25 && document.getElementById("x").innerHTML <= this.drawX + 50)	// look up
		{
			main_ctx.drawImage(main_sprite, 332, 105, 22, 108, this.drawX + 30, this.drawY - 4, 22, 108);
			this.look_up = true;
		}
		else
		{
			this.look_up = false;
		}

		if (document.getElementById("y").innerHTML - 100 >= this.drawY && document.getElementById("x").innerHTML >= this.drawX + 30 && document.getElementById("x").innerHTML <= this.drawX + 50)	// look down
		{
			main_ctx.drawImage(main_sprite, 356, 109, 22, 104, this.drawX + 30, this.drawY, 22, 104);
			this.look_down = true;
		}
		else
		{
			this.look_down = false;
		}

	

		if (document.getElementById("x").innerHTML <= this.drawX + 24 && document.getElementById("y").innerHTML <= this.drawY + 14 && this.look_right == false)	// look up left
		{
			main_ctx.drawImage(main_sprite, 244, 109, 43, 104, this.drawX + 9, this.drawY , 43, 104);
			this.look_up_left = true;
		}
		else
		{
			this.look_up_left = false;
		}

		if (document.getElementById("x").innerHTML >= this.drawX + 51 && document.getElementById("y").innerHTML <= this.drawY +4)	// look up right
		{
			main_ctx.drawImage(main_sprite, 289, 109, 43, 104, this.drawX + 30, this.drawY, 43, 104);
			this.look_up_right = true;
		}
		else
		{
			this.look_up_right = false;
		}


	
		if (document.getElementById("x").innerHTML - 39 <= this.drawX && document.getElementById("y").innerHTML >= this.drawY + 70 && this.look_down == false)	// look down left
		{
			main_ctx.drawImage(main_sprite, 149, 109, 46, 106, this.drawX + 6, this.drawY, 46, 106);
			this.look_down_left = true;
		}
		else
		{
			this.look_down_left = false;
		}

		if (document.getElementById("x").innerHTML - 40 >= this.drawX && document.getElementById("y").innerHTML >= this.drawY + 10 && this.look_down == false && this.look_right == false && this.look_up == false)	// look down right
		{
			main_ctx.drawImage(main_sprite, 197, 109, 46, 106, this.drawX + 30, this.drawY, 46, 106);
			this.look_down_right = true;
		}
		else
		{
			this.look_down_right = false;
		}

		main_ctx.drawImage(main_sprite, 0, 233, 68, 68, document.getElementById("x").innerHTML - 33, document.getElementById("y").innerHTML - 33, 68, 68);	// cursor / pointer

		//----------look to mouse position----------//
	}
	else
	{
		//----------game over screen----------//

		background_ctx.drawImage(bg_sprite, 0, 1600, 1200, 800, 0, 0, 1200, 800);
		main_ctx.drawImage(main_sprite, 801, 0, 164, 48, 10, 10, 164, 48);

		main_ctx.fillStyle = "black";
		main_ctx.globalAlpha = 0.6;
		main_ctx.fillRect(1200 / 2 - 500 / 2, 800 / 2 - 150 / 2 , 500, 150);		//kann man mit grafik ersetzen
		main_ctx.globalAlpha = 1;

		main_ctx.textBaseline = "middle";
		main_ctx.textAlign = "center";
		main_ctx.font = "80px Maiandra GD";
		main_ctx.fillStyle = "white";
		main_ctx.fillText("Game Over!", 1200 / 2, 800 / 2);

		window.setTimeout(function()  {is_menu = true; menu_status = "game_over";}, 1500);

		//----------game over screen----------//
	}
};

Player.prototype.check_keys = function()
{
	//----------movement----------//
	if (this.is_downkey == true && this.drawY + 104 != 799)
		this.drawY += this.speed;	//move down
		

	if (this.is_upkey == true && this.drawY != 0)
		this.drawY -= this.speed;	//move up
		

	if (this.is_leftkey == true && this.drawX + 30 != 0)
		this.drawX -= this.speed;	//move left
		

	if (this.is_rightkey == true && this.drawX + 52 != 1199)
		this.drawX += this.speed;	//move right
	//----------movement----------//	
	//----------confirm bullet shot----------//

	if (this.look_left == true && this.is_allowed_to_shoot == true && this.shoot_wait < 0)
	{
		bullets[bullets.length] = new Bullet_left(this.drawX - 10, this.drawY + 30);	//draw new bullet
		if (sfx == true)
		{
			try {shoot_audio.currentTime = 0;} catch(e){}	//sfx abspielen
			shoot_audio.play();
		}
		this.shoot_wait = 800;
	}
	else
	{
		this.shoot_wait--;
	}
	
	if (this.look_right == true && this.is_allowed_to_shoot == true && this.shoot_wait < 0)
	{
		bullets[bullets.length] = new Bullet_right(this.drawX + 80, this.drawY + 30);	//draw new bullet
		if (sfx == true)
		{
			try {shoot_audio.currentTime = 0;} catch(e){}	//sfx abspielen
			shoot_audio.play();
		}
		this.shoot_wait = 800;
	}
	else
	{
		this.shoot_wait--;
	}

	if (this.look_up == true && this.is_allowed_to_shoot == true && this.shoot_wait < 0)
	{
		bullets[bullets.length] = new Bullet_up(this.drawX + 38, this.drawY - 10);	//draw new bullet
		if (sfx == true)
		{
			try {shoot_audio.currentTime = 0;} catch(e){}	//sfx abspielen
			shoot_audio.play();
		}
		this.shoot_wait = 800;
	}
	else
	{
		this.shoot_wait--;
	}

	if (this.look_down == true && this.is_allowed_to_shoot == true && this.shoot_wait < 0)
	{
		bullets[bullets.length] = new Bullet_down(this.drawX + 38, this.drawY + 80);	//draw new bullet
		if (sfx == true)
		{
			try {shoot_audio.currentTime = 0;} catch(e){}	//sfx abspielen
			shoot_audio.play();
		}
		this.shoot_wait = 800;
	}
	else
	{
		this.shoot_wait--;
	}

	if (this.look_up_left == true && this.is_allowed_to_shoot == true && this.shoot_wait < 0)
	{
		bullets[bullets.length] = new Bullet_up_left(this.drawX, this.drawY);	//draw new bullet
		if (sfx == true)
		{
			try {shoot_audio.currentTime = 0;} catch(e){}	//sfx abspielen
			shoot_audio.play();
		}
		this.shoot_wait = 800;
	}
	else
	{
		this.shoot_wait--;
	}

	if (this.look_up_right == true && this.is_allowed_to_shoot == true && this.shoot_wait < 0)
	{
		bullets[bullets.length] = new Bullet_up_right(this.drawX + 70, this.drawY);	//draw new bullet
		if (sfx == true)
		{
			try {shoot_audio.currentTime = 0;} catch(e){}	//sfx abspielen
			shoot_audio.play();
		}
		this.shoot_wait = 800;
	}
	else
	{
		this.shoot_wait--;
	}

	if (this.look_down_left == true && this.is_allowed_to_shoot == true && this.shoot_wait < 0)
	{
		bullets[bullets.length] = new Bullet_down_left(this.drawX, this.drawY + 60);	//draw new bullet
		if (sfx == true)
		{
			try {shoot_audio.currentTime = 0;} catch(e){}	//sfx abspielen
			shoot_audio.play();
		}
		this.shoot_wait = 800;
	}
	else
	{
		this.shoot_wait--;
	}

	if (this.look_down_right == true && this.is_allowed_to_shoot == true && this.shoot_wait < 0)
	{
		bullets[bullets.length] = new Bullet_down_right(this.drawX + 70, this.drawY + 60);	//draw new bullet
		if (sfx == true)
		{
			try {shoot_audio.currentTime = 0;} catch(e){}	//sfx abspielen
			shoot_audio.play();
		}
		this.shoot_wait = 800;
	}
	else
	{
		this.shoot_wait--;
	}
};
//----------confirm bullet shot----------//
//----------player----------//
//--------player bullets-------//

function Bullet_left(x, y)
{
	this.drawX = x;
	this.drawY = y;

	this.srcX = 173;
	this.srcY = 0;

	this.width = 20;
	this.height = 9;

	this.collided = false;
	this.wait = 0;
}

Bullet_left.prototype.draw = function()
{
	if (this.collided == false)
	{
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 14, 6);	//bullet sprite
		this.drawX -= bullet_speed;	//movement direction
	}

	for (var i = 0; i < enemies.length; i++)
	{
		if (this.drawX + 25 <= enemies[i].drawX + enemies[i].width && this.drawX - 25 + this.width >= enemies[i].drawX &&
			this.drawY + 10 <= enemies[i].drawY + enemies[i].height && this.drawY - 10 + this.height >= enemies[i].drawY && this.collided == false && enemies[i].is_dead == false)	//collider
		{
			this.collided = true;
			this.wait = 150;
			enemies[i].life -= player.gun_damage;
			score++;
			if (sfx == true)
			{
				try {hurt_audio.currentTime = 0;} catch(e){}	//sfx abspielen
				hurt_audio.play();
			}
		}

		if (this.collided == true && this.wait > 0)
		{
			main_ctx.drawImage(main_sprite, 0, 107, 9, 9, this.drawX, this.drawY, 9, 9);	//hit animation
			this.wait--;
		}
	}
};

//----------------------------//

function Bullet_right(x, y)
{
	this.drawX = x;
	this.drawY = y;

	this.srcX = 152;
	this.srcY = 0;

	this.width = 20;
	this.height = 9;

	this.collided = false;
	this.wait = 0;
}

Bullet_right.prototype.draw = function()
{
	if (this.collided == false)
	{
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 14, 6);	//bullet sprite
		this.drawX += bullet_speed;	//movement direction
	}

	for (var i = 0; i < enemies.length; i++)
	{
		if (this.drawX + 25 <= enemies[i].drawX + enemies[i].width && this.drawX - 25 + this.width >= enemies[i].drawX &&
			this.drawY + 10 <= enemies[i].drawY + enemies[i].height && this.drawY - 10 + this.height >= enemies[i].drawY && this.collided == false && enemies[i].is_dead == false)	//collider
		{
			this.collided = true;
			this.wait = 150;
			enemies[i].life -= player.gun_damage;
			score++;
			if (sfx == true)
			{
				try {hurt_audio.currentTime = 0;} catch(e){}	//sfx abspielen
				hurt_audio.play();
			}
		}

		if (this.collided == true && this.wait > 0)
		{
			main_ctx.drawImage(main_sprite, 0, 107, 9, 9, this.drawX, this.drawY, 9, 9);	//hit animation
			this.wait--;
		}
	}
};

//----------------------------//

function Bullet_up(x, y)
{
	this.drawX = x;
	this.drawY = y;

	this.srcX = 194;
	this.srcY = 0;

	this.width = 9;
	this.height = 20;

	this.collided = false;
	this.wait = 0;
}

Bullet_up.prototype.draw = function()
{
	if (this.collided == false)
	{
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 6, 14);	//bullet sprite
		this.drawY -= bullet_speed;	//movement direction
	}
	
	for (var i = 0; i < enemies.length; i++)
	{
		if (this.drawX <= enemies[i].drawX + enemies[i].width && this.drawX + this.width >= enemies[i].drawX &&
			this.drawY + 15 <= enemies[i].drawY + enemies[i].height && this.drawY - 5 + this.height >= enemies[i].drawY && this.collided == false && enemies[i].is_dead == false)	//collider
		{
			this.collided = true;
			this.wait = 150;
			enemies[i].life -= player.gun_damage;
			score++;
			if (sfx == true)
			{
				try {hurt_audio.currentTime = 0;} catch(e){}	//sfx abspielen
				hurt_audio.play();
			}
		}

		if (this.collided == true && this.wait > 0)
		{
			main_ctx.drawImage(main_sprite, 0, 107, 9, 9, this.drawX, this.drawY, 9, 9);	//hit animation
			this.wait--;
		}
	}
};

//----------------------------//

function Bullet_down(x, y)
{
	this.drawX = x;
	this.drawY = y;

	this.srcX = 204;
	this.srcY = 0;

	this.width = 9;
	this.height = 20;

	this.collided = false;
	this.wait = 0;
}

Bullet_down.prototype.draw = function()
{
	if (this.collided == false)
	{
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 6, 14);	//bullet sprite
		this.drawY += bullet_speed;	//movement direction
	}
	
	for (var i = 0; i < enemies.length; i++)
	{
		if (this.drawX <= enemies[i].drawX + enemies[i].width && this.drawX + this.width >= enemies[i].drawX &&
			this.drawY + 15 <= enemies[i].drawY + enemies[i].height && this.drawY - 5 + this.height >= enemies[i].drawY && this.collided == false && enemies[i].is_dead == false)	//collider
		{
			this.collided = true;
			this.wait = 150;
			enemies[i].life -= player.gun_damage;
			score++;
			if (sfx == true)
			{
				try {hurt_audio.currentTime = 0;} catch(e){}	//sfx abspielen
				hurt_audio.play();
			}
		}

		if (this.collided == true && this.wait > 0)
		{
			main_ctx.drawImage(main_sprite, 0, 107, 9, 9, this.drawX, this.drawY, 9, 9);	//hit animation
			this.wait--;
		}
	}
};

//----------------------------//

function Bullet_up_left(x, y)
{
	this.drawX = x;
	this.drawY = y;

	this.srcX = 214;
	this.srcY = 0;

	this.width = 20;
	this.height = 20;

	this.collided = false;
	this.wait = 0;
}

Bullet_up_left.prototype.draw = function()
{
	if (this.collided == false)
	{
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 12, 12);	//bullet sprite
		this.drawX -= bullet_speed;	//movement direction
		this.drawY -= bullet_speed;	//movement direction
	}
	
	for (var i = 0; i < enemies.length; i++)
	{
		if (this.drawX + 25 <= enemies[i].drawX + enemies[i].width && this.drawX - 25 + this.width >= enemies[i].drawX &&
			this.drawY + 10 <= enemies[i].drawY + enemies[i].height && this.drawY - 10 + this.height >= enemies[i].drawY && this.collided == false && enemies[i].is_dead == false)	//collider
		{
			this.collided = true;
			this.wait = 150;
			enemies[i].life -= player.gun_damage;
			score++;
			if (sfx == true)
			{
				try {hurt_audio.currentTime = 0;} catch(e){}	//sfx abspielen
				hurt_audio.play();
			}
		}

		if (this.collided == true && this.wait > 0)
		{
			main_ctx.drawImage(main_sprite, 0, 107, 9, 9, this.drawX, this.drawY, 9, 9);	//hit animation
			this.wait--;
		}
	}
};

//----------------------------//

function Bullet_up_right(x, y)
{
	this.drawX = x;
	this.drawY = y;

	this.srcX = 256;
	this.srcY = 0;

	this.width = 20;
	this.height = 20;

	this.collided = false;
	this.wait = 0;
}

Bullet_up_right.prototype.draw = function()
{
	if (this.collided == false)
	{
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 12, 12);	//bullet sprite
		this.drawX += bullet_speed;	//movement direction
		this.drawY -= bullet_speed;	//movement direction
	}

	for (var i = 0; i < enemies.length; i++)
	{
		if (this.drawX + 25 <= enemies[i].drawX + enemies[i].width && this.drawX - 30 + this.width >= enemies[i].drawX &&
			this.drawY + 10 <= enemies[i].drawY + enemies[i].height && this.drawY - 10 + this.height >= enemies[i].drawY && this.collided == false && enemies[i].is_dead == false)	//collider
		{
			this.collided = true;
			this.wait = 150;
			enemies[i].life -= player.gun_damage;
			score++;
			if (sfx == true)
			{
				try {hurt_audio.currentTime = 0;} catch(e){}	//sfx abspielen
				hurt_audio.play();
			}
		}

		if (this.collided == true && this.wait > 0)
		{
			main_ctx.drawImage(main_sprite, 0, 107, 9, 9, this.drawX, this.drawY, 9, 9);	//hit animation
			this.wait--;
		}
	}
};

//----------------------------//

function Bullet_down_left(x, y)
{
	this.drawX = x;
	this.drawY = y;

	this.srcX = 277;
	this.srcY = 0;

	this.width = 20;
	this.height = 20;

	this.collided = false;
	this.wait = 0;
}

Bullet_down_left.prototype.draw = function()
{
	if (this.collided == false)
	{
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 12, 12);	//bullet sprite
		this.drawX -= bullet_speed;	//movement direction
		this.drawY += bullet_speed;	//movement direction
	}

	for (var i = 0; i < enemies.length; i++)
	{
		if (this.drawX + 25 <= enemies[i].drawX + enemies[i].width && this.drawX - 25 + this.width >= enemies[i].drawX &&
			this.drawY + 10 <= enemies[i].drawY + enemies[i].height && this.drawY - 10 + this.height >= enemies[i].drawY && this.collided == false && enemies[i].is_dead == false)	//collider
		{
			this.collided = true;
			this.wait = 150;
			enemies[i].life -= player.gun_damage;
			score++;
			if (sfx == true)
			{
				try {hurt_audio.currentTime = 0;} catch(e){}	//sfx abspielen
				hurt_audio.play();
			}
		}

		if (this.collided == true && this.wait > 0)
		{
			main_ctx.drawImage(main_sprite, 0, 107, 9, 9, this.drawX, this.drawY, 9, 9);	//hit animation
			this.wait--;
		}
	}
};

//----------------------------//

function Bullet_down_right(x, y)
{
	this.drawX = x;
	this.drawY = y;

	this.srcX = 235;
	this.srcY = 0;

	this.width = 20;
	this.height = 20;

	this.collided = false;
	this.wait = 0;
}

Bullet_down_right.prototype.draw = function()
{
	if (this.collided == false)
	{
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 12, 12);	//bullet sprite
		this.drawX += bullet_speed;	//movement direction
		this.drawY += bullet_speed;	//movement direction
	}
	
	for (var i = 0; i < enemies.length; i++)
	{
		if (this.drawX + 25 <= enemies[i].drawX + enemies[i].width && this.drawX - 30 + this.width >= enemies[i].drawX &&
			this.drawY + 10 <= enemies[i].drawY + enemies[i].height && this.drawY - 10 + this.height >= enemies[i].drawY && this.collided == false && enemies[i].is_dead == false)	//collider
		{
			this.collided = true;
			this.wait = 150;
			enemies[i].life -= player.gun_damage;
			score++;
			if (sfx == true)
			{
				try {hurt_audio.currentTime = 0;} catch(e){}	//sfx abspielen
				hurt_audio.play();
			}
		}

		if (this.collided == true && this.wait > 0)
		{
			main_ctx.drawImage(main_sprite, 0, 107, 9, 9, this.drawX, this.drawY, 9, 9);	//hit animation
			this.wait--;
		}
	}
};

//--------player bullets-------//
//------enemy spawn------//

function Enemy()
{
	this.spawn_point = Math.round(Math.random() * 4) + 1;	//gives a number from 1-4 that will decide, where the enemies are gonna spawn

	switch(this.spawn_point) {
		case 1:
			this.drawX = Math.round(Math.random() * -101);	//spawnpoint 1
			this.drawY = Math.round(Math.random() * 801);
		  break;
		case 2:
			this.drawX = Math.round(Math.random() * 1196) + 1100;	//spawnpoint 2
			this.drawY = Math.round(Math.random() * 801);
		  break;
		case 3:
			this.drawX = Math.round(Math.random() * 1201);	//spawnpoint 3
			this.drawY = Math.round(Math.random() * -301);
		  break;
		case 4:
			this.drawX = Math.round(Math.random() * 1201);	//spawnpoint 4
			this.drawY = Math.round(Math.random() * 51) + 850;
		  break;
		default:
			this.drawX = Math.round(Math.random() * -101);	//default spawnpoint
			this.drawY = Math.round(Math.random() * 801);
	}
	this.srcX = 23;
	this.srcY = 0;

	this.width = 42;
	this.height = 106;

	this.is_looking_left = false;
	this.is_looking_right = false;

	this.life = 30;
	this.is_dead = false;

	this.wait = 0;
}

Enemy.prototype.draw = function()
{

	if (this.is_dead == false)
	{
		this.ai();
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);	//enemy sprite

		if (this.life <= 0)
		{
			dead_enemies++;
			this.is_dead = true;
			player.coin += 5;	//+ coin when enemy = dead
			score += 10;	//+ score when enemy = dead
		}
	}
};


Enemy.prototype.ai = function()
{
	if (this.drawX - 10 < player.drawX || this.drawX - 10 == player.drawX)	//rotation
	{
		this.drawX += enemy_speed;	//if enemy is left to the player, then move right
		this.srcX = 23;
		this.srcY = 0;
		this.is_looking_left = true;

		if (this.is_looking_right == false)
		{
			main_ctx.fillStyle = "black";	//fancy healthbar
			main_ctx.fillRect(this.drawX - 15, this.drawY - 10, 50, 5);	//background of health bar
		
			main_ctx.fillStyle = "green";
			main_ctx.fillRect(this.drawX - 15 + 1, this.drawY - 10 + 1, this.life / 30 * 48, 4);	//inside color of health bar (green)

			if (this.life <= 20 && this.life >= 11)	//fancy healthbar
			{
				main_ctx.fillStyle = "yellow";
				main_ctx.fillRect(this.drawX - 15 + 1, this.drawY - 10 + 1, this.life / 30 * 48, 4);	//inside color yellow when health = 20 or bellow
			}

			if (this.life <= 10 && this.life >= 1)	//fancy healthbar
			{
				main_ctx.fillStyle = "red";
				main_ctx.fillRect(this.drawX - 15 + 1, this.drawY - 10 + 1, this.life / 30 * 48, 4);	//inside color red when health = 10 or bellow
			}
		}	
	}
	else
	{
		this.is_looking_left = false;
	}

	if (this.drawX + 10 > player.drawX || this.drawX + 10 == player.drawX)	//rotation
	{
		this.drawX -= enemy_speed;	//if enemy is right to the player, then move left
		this.srcX = 66;
		this.srcY = 0;
		this.is_looking_right = true;

		main_ctx.fillStyle = "black";	//fancy healthbar
		main_ctx.fillRect(this.drawX + 5, this.drawY - 10, 50, 5);	//background of health bar
		
		main_ctx.fillStyle = "green";
		main_ctx.fillRect(this.drawX + 5 + 1, this.drawY - 10 + 1, this.life / 30 * 48, 4);	//inside color of health bar (green)

		if (this.life <= 20 && this.life >= 11)	//fancy healthbar
		{
			main_ctx.fillStyle = "yellow";
			main_ctx.fillRect(this.drawX + 5 + 1, this.drawY - 10 + 1, this.life / 30 * 48, 4);	//inside color yellow when health = 20 or bellow
		}

		if (this.life <= 10 && this.life >= 1)	//fancy healthbar
		{
			main_ctx.fillStyle = "red";
			main_ctx.fillRect(this.drawX + 5 + 1, this.drawY - 10 + 1, this.life / 30 * 48, 4);	//inside color red when health = 10 or bellow
		}
	}
	else
	{
		this.is_looking_right = false;
	}

	if (this.drawY < player.drawY)
	{
		this.drawY += enemy_speed;	//if enemy is above player, then enemy move down 
	}

	if (this.drawY > player.drawY)
	{
		this.drawY -= enemy_speed;	//if enemy is below player, then enemy move up 
	}

	if (this.drawX + 30 <= player.drawX + player.width && this.drawX - 30 + this.width >= player.drawX &&
		this.drawY + 20 <= player.drawY + player.height && this.drawY - 20 + this.height >= player.drawY)	//collider
	{
		player.life -= 10;
		Enemy.wait = 50;
		
		if (player.life > 0)	//if collide -10 player health and enemy = destroyed
		{
			this.life -= 30;		
		}
	}
};



//----enemy spawn-----//

function check_wave()
{
	if (spawned_enemies == dead_enemies)
	{
		if (is_timeout)	//display message: next wave!
		{
			main_ctx.fillStyle = "black";	//the transparent box
			main_ctx.globalAlpha = 0.6;
			main_ctx.fillRect(1200 / 2 - 300 / 2, 800 / 2 - 100 / 2, 300, 100);		//kann man mit grafik ersetzen
			main_ctx.globalAlpha = 1;

			main_ctx.fillStyle = "white";	//the actuall text
			main_ctx.textAlign = "center";
			main_ctx.textBaseline = "middle";
			main_ctx.font = "40px Maiandra GD";
			main_ctx.fillText("Nächste Runde!", 1200 / 2, 800 / 2);
		}
		else
		{
			is_timeout = true;
			if (spawned_enemies == 0)
			{
				wave++;	//increase wave when all enemies are dead
				spawn_enemy(wave);
				is_timeout = false;
			}
			else
			{
				window.setTimeout(function()  {wave++;spawn_enemy(wave); is_timeout = false;}, 2000);
			}
		}
	}
}

function spawn_enemy(n)	//enemy spawn
{
	spawned_enemies += n;

	for (var i = 0; i < n; i++)
	{
		enemies[enemies.length] = new Enemy();
	}
}

function loop()
{
	main_ctx.clearRect(0, 0, 1200, 800);

	play_background_music();

	if (is_menu == false)
	{
		background_ctx.drawImage(bg_sprite, 0, 0);
		player.draw();

		for (var i = 0; i < enemies.length; i++)
		{
			enemies[i].draw();
		}

		for (i = 0; i < bullets.length; i++)
		{
			bullets[i].draw();
		}

		main_ctx.fillStyle = "white";
		main_ctx.textAlign = "center";
		main_ctx.textBaseline = "top";
		main_ctx.font = "30px Maiandra GD";
		main_ctx.fillText("Runde: " + wave, 300, 20);	//display wave count
		main_ctx.fillText("Punkte: " + score, 900, 20);	//display score count
		
		check_wave();
	}
		
	else
	{
		menu();
		main_ctx.drawImage(main_sprite, 250, 649, 51, 60, document.getElementById("x").innerHTML, document.getElementById("y").innerHTML, 51, 60);
	}

	if (is_playing)
	{
		requestaframe(loop);
	}
}

function new_game()	//starts a new game with all the scores and coins set to 0
{
	player = new Player();
  	enemies = [];
  	bullets = [];
	dead_enemies = 0;
	spawned_enemies = 0;
	wave = 0;
	score = 0;
	is_timeout = false;

	bullet_speed = 1.5;

	enemy_speed = 0.25;

	is_menu = false;

	level_move_speed = 1;
	level_damage = 1;
	level_shoot_speed = 1;

	price_move_speed = 50;
	price_damage = 50;
	price_shoot_speed = 50;
}

function start_loop()
{
	is_playing = true;
	loop();
}

function stop_loop()
{
	is_playing = false;
}

//------------loop------------//
//----------movement----------//

function key_down(e)
{
	var key_id = e.keyCode || e.which;

	if (key_id == 83)	//down key
	{
		player.is_downkey = true;
		e.preventDefault();
	}

	if (key_id == 87)	//up key
	{
		player.is_upkey = true;
		e.preventDefault();
	}

	if (key_id ==65)	//left key
	{
		player.is_leftkey = true;
		e.preventDefault();
	}

	if (key_id == 68)	//right key
	{
		player.is_rightkey = true;
		e.preventDefault();
	}

	if (key_id == 27 && is_menu == false && player.life > 0)	//esc key
	{
		is_menu = true;
		menu_status = 'pause';
	}

	if (key_id == 84 && is_menu == false && player.life > 0)	//t key
	{
		is_menu = true;
		menu_status = 'shop';
	}
}

function key_up(e)
{
	var key_id = e.keyCode || e.which;
	
	if (key_id == 83)	//down key
	{
		player.is_downkey = false;
		e.preventDefault();
	}

	if (key_id == 87)	//up key
	{
		player.is_upkey = false;
		e.preventDefault();
	}

	if (key_id ==65)	//left key
	{
		player.is_leftkey = false;
		e.preventDefault();
	}

	if (key_id == 68)	//right key
	{
		player.is_rightkey = false;
		e.preventDefault();
	}
}

//----------movement----------//