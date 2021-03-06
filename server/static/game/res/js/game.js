$(window).bind("load",function(e){
    var k = Game.init();
    
    var gameId = window.location.pathname.replace('/', '');
    var socket = io.connect('http://192.168.0.103');
    
    socket.on('connect', function() {
        socket.emit('gameId game', gameId);
    });
    
    socket.on('moveleft', function(data) {
        k.event = 'left';
    });

    socket.on('moveright', function(data) {
        k.event = 'right';
    });
});

var Game = {
    init: function(id,w,h){
        this.id = "vertigo";
        this.fullScreen();

        this.game_started = false;
        this.pause = false;
        this.is_touch_device = 'ontouchstart' in document.documentElement;

        this.setupCanvas();
        this.initImages();
        this.initControls();
        this.initMainMenu();

        return this;
    },

    fullScreen: function(){
        this.w = $("#container").width();
        this.h = $("#container").height();
    },

    initImages: function(){
	this.colors = {
	    "#3AB82F": "#23781B",
	    "#2F7EBB": "#1B4C71"
	};

        // Background
        var brick = new Image();
        brick.src = "/static/game/res/img/brick.png";

        var pipe = new Image();
        pipe.src = "/static/game/res/img/pipe.png";

        // Logo
        var logo = new Image();
        logo.src = "/static/game/res/img/logo.png";


        // Character
        var p_down_right = new Image();
        p_down_right.src = "/static/game/res/img/p_down_right.png";

        var p_down_left = new Image();
        p_down_left.src = "/static/game/res/img/p_down_left.png";

        var p_down_straight = new Image();
        p_down_straight.src = "/static/game/res/img/p_down_straight.png";

        var p_up_right = new Image();
        p_up_right.src = "/static/game/res/img/p_up_right.png";

        var p_up_left = new Image();
        p_up_left.src = "/static/game/res/img/p_up_left.png";

        var p_up_straight = new Image();
        p_up_straight.src = "/static/game/res/img/p_up_straight.png";

        // Arrows
        var blue_one = new Image();
        blue_one.src = "/static/game/res/img/blue_one.png"

        var blue_two = new Image();
        blue_two.src = "/static/game/res/img/blue_two.png"

        var blue_three = new Image();
        blue_three.src = "/static/game/res/img/blue_three.png"

        var green_one = new Image();
        green_one.src = "/static/game/res/img/green_one.png"

        var green_two = new Image();
        green_two.src = "/static/game/res/img/green_two.png"

        var green_three = new Image();
        green_three.src = "/static/game/res/img/green_three.png"

        var red = new Image();
        red.src = "/static/game/res/img/red.png"

        this.images = {
            "brick": brick,
            "pipe": pipe,
            "logo": logo,
            "p_down_right": p_down_right,
            "p_down_left": p_down_left,
            "p_down_straight": p_down_straight,
            "p_up_right": p_up_right,
            "p_up_left": p_up_left,
            "p_up_straight": p_up_straight,
            "blue_one": blue_one,
            "blue_two": blue_two,
            "blue_three": blue_three,
            "green_one": green_one,
            "green_two": green_two,
            "green_three": green_three,
            "red": red
        };

        console.log(this.images);
    },

    initEnvironment: function(){
        this.event = "";

        this.speed = 1; // Only Y speed
        this.gravity = 0.0006;
        this.points = 0;

        this.brickTop = 0;
        this.pipeTop = 0;
        this.top_button = undefined;

        this.height = 300;
        this.max_height = 300;

        this.combo_color = "";
        this.combo_hits = 1;
    },

    initMainMenu: function(){
        this.canvas.clearRect(0, 0, this.w, this.h); // Clear Canvas
        this.canvas.save();


        this.canvas.translate((this.w/2 - 170), 50);
        this.canvas.fillStyle = "#000000";
        this.canvas.fillRect(-5,-5,340,400);

        this.canvas.fillStyle = "#3a3a3a";
        this.canvas.fillRect(0,0,340,400);

        this.canvas.drawImage(this.images["logo"], 45, 45);

        this.canvas.fillStyle = "#000000"
        this.canvas.font = "30px 'munro_smallregular'";
        this.canvas.textAlign = "center"

        if(!!(this.points)){
            this.canvas.fillText("You scored ", 173,133);
            this.canvas.fillText(this.points + " points!", 173,153);

	    this.canvas.fillStyle = "#FFFFFF"
            this.canvas.fillText("You scored ", 170,130);
            this.canvas.fillText(this.points + " points!", 170,150);

            if(this.is_touch_device){
                this.canvas.fillText("Tap to Restart", 170,190);
            }else{
		this.canvas.fillStyle = "#000000";
                this.canvas.fillText("Hit Spacebar", 173,193);
		this.canvas.fillStyle = "#FFFFFF";
                this.canvas.fillText("Hit Spacebar", 170,190);
            }
	    this.canvas.fillStyle = "#000000";
            this.canvas.fillText("To try again", 173,213);
	    this.canvas.fillStyle = "#FFFFFF";
            this.canvas.fillText("To try again", 170,210);
        }else{
            this.canvas.fillText("Collect", 83, 138);
            this.canvas.fillText("Avoid", 253, 138);

	    this.canvas.fillStyle = "#FFFFFF";
            this.canvas.fillText("Collect", 80, 135);
            this.canvas.fillText("Avoid", 250, 135);

            this.canvas.drawImage(this.images["blue_two"], 55, 155);
            this.canvas.drawImage(this.images["green_two"], 85, 155);
            this.canvas.drawImage(this.images["red"], 240, 160);

	    this.canvas.fillStyle = "#000000";
            this.canvas.fillText("Use the same color", 173, 243);
            this.canvas.fillText("To make combos", 173, 273);

	    this.canvas.fillStyle = "#ffffff";
            this.canvas.fillText("Use the same color", 170, 240);
            this.canvas.fillText("To make combos", 170, 270);

            if(this.is_touch_device){
                this.canvas.fillText("Tap to begin", 170, 330);
                this.canvas.fillText("Tap edges to control", 170, 360);
            }else{
		this.canvas.fillStyle = "#000000";
                this.canvas.fillText("Hit spacebar to begin", 173, 333);
                this.canvas.fillText("Arrow keys to control", 173, 363);

		this.canvas.fillStyle = "#ffffff";
                this.canvas.fillText("Hit spacebar to begin", 170, 330);
                this.canvas.fillText("Arrow keys to control", 170, 360);
            }
        }

        this.canvas.restore();
    },

    initGame: function(){
        this.destroyGame();

        this.initEnvironment();
        this.game_started = true;
        this.pause = false;

        this.player = new Player(this,this.w/2, this.h/3)
        this.buttons = [];

        this.generateButtons(this.h);
        this.generateButtons(-this.h);

        this.now = new Date().getTime();
        this.timer = window.setTimeout(function(){this.stepper()}.bind(this), 1);
    },

    destroyGame: function(){

        this.game_started = false;

        delete this.player
        delete this.buttons
        delete this.now
        delete this.timer

        this.initMainMenu();
    },

    initPauseMenu: function(){
        this.canvas.save();

        this.canvas.fillStyle = 'rgba(90,90,90,0.5)';
        this.canvas.fillRect(0,0,this.w,this.h);


        this.canvas.translate((this.w/2 - 170), 50);
        this.canvas.fillStyle = "#000000";
        this.canvas.fillRect(-5,-5,340,400);
        this.canvas.fillStyle = "#3a3a3a";
        this.canvas.fillRect(0,0,340,400);


        this.canvas.drawImage(this.images["logo"], 45, 45);

        this.canvas.fillStyle = "#FFFFFF"
        this.canvas.font = "30px 'munro_smallregular'";
        this.canvas.textAlign = "center"

	this.canvas.fillStyle = "#000000"
        this.canvas.fillText("Game Paused", 173,143);
        this.canvas.fillText("Hit Spacebar to Resume", 173,173);
        this.canvas.fillText("Esc to go back to menu", 173,193);


	this.canvas.fillStyle = "#FFFFFF";
        this.canvas.fillText("Game Paused", 170,140);
        this.canvas.fillText("Hit Spacebar to Resume", 170,170);
        this.canvas.fillText("Esc to go back to menu", 170,190);

        this.canvas.restore();
    },

    backToMenu: function(){
        if(this.pause && this.game_started){
            this.destroyGame();
        }
    },

    initControls: function(){
        var lr = $(window).width() / 2;
        var game = this;

        if(this.is_touch_device){
          $(document).bind("mousedown touchstart",function(e){
              e.preventDefault();
              if(!game.game_started){;
                  game.initGame();
                  return false;
              }

              var x = 0;

              if (e.originalEvent.touches){
                  x = e.originalEvent.touches[0].pageX;
              }else{
                  x = e.pageX;
              }

              if (x > lr){
                  game.event = "right";
              }else{
                  game.event = "left";
              }
          });

          $(document).bind("mouseup touchend",function(e){
              game.event = "";
          });
        }else{
          $(document).bind("keydown",function(e){
              switch(e.keyCode){
              case 37:
                  e.preventDefault();
                  game.event = "left";
                  break;
              case 39:
                  e.preventDefault();
                  game.event = "right";
                  break;
              case 32:
                  e.preventDefault();
                  game.playPause();
                  break;
              case 27:
                  game.backToMenu();
                  break;
              default:
                  // Do nothing
              };
          });

          $(document).bind("keyup",function(e){
              game.event = "";
          });
        }


        // Social
        var points = this.points;
        $("#ic_twitter").bind("click", function(e){
            var screenshot = new Clay.Screenshot( { prompt: false } );
            screenshot.save(function(response) {
                (new Clay.Twitter()).post( { message: "Playing http://vertigo.clay.io ! Just scored " + this.points + "! Can you beat my score?", picture: response.imageSrc, editable: true } );
            }).bind(this);

        }).bind(this);

        $("#ic_facebook").bind("click", function(e){
            var screenshot = new Clay.Screenshot( { prompt: false } );
            screenshot.save(function(response) {
                (new Clay.Facebook()).post( { message: "Playing http://vertigo.clay.io ! Just scored " + this.points + "! Can you beat my score?", picture: response.imageSrc, editable: true } );
            }).bind(this);
        }).bind(this);

        $("#ic_hiscore").bind("click", function(e){
            var leaderboard = new Clay.Leaderboard({id:"score"});
            leaderboard.show({limit:10}, function(response){
                console.log(response)
            });
        });


        $(window).resize(function(){
            game.fullScreen();
        }).bind(this);
    },

    playPause: function(){
        if(this.game_started){
            if(this.pause){
                this.pause = false;
                this.now = new Date().getTime();
                window.setTimeout(function(){this.stepper()}.bind(this), 1);
            }else{
                this.pause = true;
            }
        }else{
            this.initGame();
        }
    },

    generateButtons: function(pos){
        if(this.points < 200000){
            var density = (((this.points * 0.0005)/100) * 80) + 30;
        }else{
            var density = 110;
        }
        var n = this.w / density ;
        for(var i = 0; i < n; i++){
            this.buttons.push(new Button(this, Math.random(1)*(pos)));
        }
    },

    stepper: function(){
        var then = this.now;
        this.now = new Date().getTime();
        this.delta = this.now - then;

        this.update();

        if(this.pause === false){
            window.setTimeout(function(){this.stepper()}.bind(this), 1);
        }else{
            this.initPauseMenu();
        }
    },

    update: function(){
        this.canvas.clearRect(0, 0, this.w, this.h); // Clear Canvas

        this.updateBg();
        this.updateSpeed();
        this.updateButtons();
        this.player.react(); // Make player react to event

       /* FPS Logging & Points
        var fps = Math.round(1000/this.delta);
        this.canvas.font = "bold 12px sans-serif";
        this.canvas.fillStyle = "#000";
        this.canvas.fillText("FPS: " + fps, 10, 60);
        this.canvas.fillText("Height: " + this.height, 10, 70);
        this.canvas.fillText("Max Height: " + this.max_height, 10, 80);
        this.canvas.fillText("Speed: " + this.speed, 10, 90);
        this.canvas.fillText("Momentum: " + this.player.momentum, 10, 100);
        this.canvas.fillText("Top Button: " + this.top_button.y, 10, 110);*/

        // Game interface
        this.updateInterface();
    },

    updateInterface: function(){
        this.canvas.fillStyle = "#111111";
        this.canvas.fillRect(10,10, 200, 50);
        this.canvas.fillStyle = "#333333";
        this.canvas.fillRect(15,15, 200, 50);
        this.canvas.font = "30px 'munro_smallregular'";
        this.canvas.fillStyle = "#111111";
        this.canvas.fillText(this.points + "pts", 33, 50);
        this.canvas.fillStyle = "#ffffff";
        this.canvas.fillText(this.points + "pts", 30, 47);

        if(this.combo_color !== ""){
            this.canvas.fillStyle = this.colors[this.combo_color];
            this.canvas.fillRect(240, 10, 150, 50);
            this.canvas.fillStyle = this.combo_color;
            this.canvas.fillRect(245, 15, 150, 50);

            this.canvas.fillStyle = this.colors[this.combo_color];
            this.canvas.fillText(this.combo_hits + "x Combo", 263, 50);

            this.canvas.fillStyle = "#ffffff";
            this.canvas.fillText(this.combo_hits + "x Combo", 260, 47);
        }
    },

    updateBg: function(){
        if(this.brickTop > 800){
            this.brickTop = 0;
        }

        if(this.brickTop < 0){
            this.brickTop = 800;
        }
        this.canvas.drawImage(this.images["brick"], 0, this.brickTop);
        this.canvas.drawImage(this.images["brick"], 0, this.brickTop - 800);
        this.brickTop += this.speed * this.delta / 4 ;

        if(this.pipeTop > 800){
            this.pipeTop = 0;
        }

        if(this.pipeTop < 0){
            this.pipeTop = 800;
        }
        this.canvas.drawImage(this.images["pipe"], 0, this.pipeTop);
        this.canvas.drawImage(this.images["pipe"], 0, this.pipeTop - 800);
        this.pipeTop += this.speed * this.delta / 2 ;

    },

    updateSpeed: function(){
        this.speed -= this.gravity * this.delta;
        this.height += this.speed;

        if (this.height > this.max_height){
            this.max_height = this.height;
        }


        if(this.top_button.y > 0){
            this.generateButtons(-this.h);
        }

        // TODO Fix game over check
        if((this.height + this.h) < this.max_height){
            $("#fall_sound")[0].play();

            var leaderboard = new Clay.Leaderboard({id:"score"});
            leaderboard.post({score : this.points}, function(response){
                console.log(response);
                var a = new Clay.Achievement({id : "first"});
                a.award(function(response){
                    console.log(response);
                });

            });

            this.destroyGame();
        }
    },

    updateButtons: function(){
        var speedDelta = this.speed * this.delta;
        for(var i = 0; i < this.buttons.length; i++){
            this.buttons[i].update(speedDelta); // Update speed and check collisions
        };
    },

    setupCanvas: function(){
        this.canvasElement = $("<canvas width='" + this.w +
                               "' id='" + this.id +
                               "' height='" + this.h + "'></canvas>");
        this.canvas = this.canvasElement.get(0).getContext("2d");
        this.canvasElement.appendTo('#container');
    }
};
