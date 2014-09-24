'use strict';

var Target = function(game, x, y) {
  this.targetBMD = game.make.bitmapData(10,10);
  Phaser.Sprite.call(this, game, x, y, this.targetBMD);

  this.anchor.setTo(0.5);

  this.inputEnabled = true;
  this.input.priorityID = 1;
  // initialize your prefab here
  this.createGraphics();

};

Target.prototype = Object.create(Phaser.Sprite.prototype);
Target.prototype.constructor = Target;

Target.prototype.update = function() {

  // write your prefab's specific update code here

};


Target.prototype.createGraphics = function() {
  var ctx = this.targetBMD.ctx;

  ctx.fillStyle = '#ffd100';
  ctx.strokeStyle = '#333';

  ctx.beginPath();
  ctx.arc(5,5,4,0,Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};

module.exports = Target;
