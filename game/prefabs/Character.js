'use strict';

var Hookshot = require('./Hookshot');

var Character = function(game, x, y, frame) {
  this.characterBMD = game.make.bitmapData(30,30);
  Phaser.Sprite.call(this, game, x, y, this.characterBMD, frame);

  this.anchor.setTo(0.5);
  this.createGraphics();
  this.hookshot = new Hookshot(this.game, 0,0);

  this.hookshot.events.onLatched.add(this.onHookshotLatched, this);

  this.addChild(this.hookshot);


};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function() {

  // write your prefab's specific update code here

};

Character.prototype.fireMiss = function() {
  return this.hookshot.fire(this.game.input.activePointer).andReturn();
};

Character.prototype.fireHit = function(target) {
  this.hookshot.fire(target).andLatch();

};

Character.prototype.onHookshotLatched = function() {
  this.game.add.tween(this).to({x: this.hookshot.world.x, y: this.hookshot.world.y}, 1000, Phaser.Easing.Linear.NONE, true);
};


Character.prototype.createGraphics = function() {
  var ctx = this.characterBMD.ctx;
  ctx.fillStyle = '#ff5100';
  ctx.beginPath();
  ctx.fillRect(0,0,30,30);
  ctx.closePath();
};
module.exports = Character;
