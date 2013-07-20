$(window).bind("load",function(e){
    var k = Game.init();

    var gameId = window.location.pathname.replace('/', '');
    var socket = io.connect('http://192.168.0.104');
    
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
        this.id = "obtuse";
        this.fullScreen();

         this.is_touch_device = 'ontouchstart' in document.documentElement;

        this.setupCanvas();
        this.initImages();
        this.initControls();
	this.initEnvironment();
        return this;
     },

    fullScreen: function(){
        this.w = $("#container").width();
        this.h = $("#container").height();
    },

    initImages: function(){
	this.colors = {
	    "p1": "#23781B",
	    "p2": "#1B4C71"
	};
    },

    initEnvironment: function(){
        this.event = "";
	this.p1 = new Player(this, "prtk");
	this.stepper();
    },

    initControls: function(){
        var lr = $(window).width() / 2;
        var game = this;

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
    },

    stepper: function(){
        var then = this.now;
        this.now = new Date().getTime();
        this.delta = this.now - then;

        this.update();

        window.setTimeout(function(){this.stepper()}.bind(this), 1);
    },

    update: function(){
        this.canvas.clearRect(0, 0, this.w, this.h); // Clear Canvas

	if(this.event == "right"){
	    this.p1.x += 1;
	}else if(this.event == "left"){
	    this.p1.x -= 1;
	}

	this.p1.draw();

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
    },

    setupCanvas: function(){
        this.canvasElement = $("<canvas width='" + this.w +
                               "' id='" + this.id +
                               "' height='" + this.h + "'></canvas>");
        this.canvas = this.canvasElement.get(0).getContext("2d");
        this.canvasElement.appendTo('#container');
    }
};
