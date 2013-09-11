var Player = function(game, id){
    this.draw = function(){
	this.game.canvas.save();

	this.game.canvas.fillStyle = "#fff";
	this.game.canvas.fillRect(this.x, this.y,20,20);

	this.game.canvas.restore();
    }

    this.x = 20;
    this.y = 200;
    this.angle = 0;
    this.game = game;
    this.draw();
    return this;
}
