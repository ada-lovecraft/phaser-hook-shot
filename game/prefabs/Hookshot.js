'use strict';

var Hookshot = function(game, x, y) {
  this.game = game;
  this.hookBMD = game.make.bitmapData(15,15);
  Phaser.Sprite.call(this, game, x, y, this.hookBMD);

  this.anchor.setTo(0.5);

  this.createGraphics();
  this.movementTween = null;
  this.events.onLatched = new Phaser.Signal();

};

Hookshot.prototype = Object.create(Phaser.Sprite.prototype);
Hookshot.prototype.constructor = Hookshot;

Hookshot.prototype.update = function() {

};

Hookshot.prototype.fire = function(target) {
  console.log({x: target.x - this.parent.x, y:target.y - this.parent.y});
  this.x = 0;
  this.y = 0;
  if(this.movementTween) {
    this.movementTween.stop();
  }
  this.movementTween = this.game.add.tween(this).to({x: target.x - this.parent.x, y:target.y - this.parent.y}, 1000, Phaser.Easing.Linear.NONE, true);
  return this;
};

Hookshot.prototype.andReturn = function() {
  function returnToParent() {
      this.game.add.tween(this).to({x: 0, y:0}, 1000, Phaser.Easing.Linear.NONE, true);
  }
  if(this.movementTween) {
    this.movementTween.onComplete.addOnce(returnToParent, this);
  } else {
    returnToParent();
  }
};

Hookshot.prototype.andLatch = function() {

  if(this.movementTween) {
    this.movementTween.onComplete.addOnce(function() {
      this.events.onLatched.dispatch();

      this.movementTween = this.game.add.tween(this).to({x: 0, y: 0}, 1000, Phaser.Easing.Linear.NONE, true);
    }, this);
  }
};

Hookshot.prototype.createGraphics = function() {
  var ctx = this.hookBMD.ctx;
  ctx.fillStyle = '#c3c3c3';
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  ctx.fillRect(1,1,14,14);
  ctx.stroke();
  ctx.closePath();

};

module.exports = Hookshot;
