
  'use strict';
  var Character = require('../prefabs/Character');
  var Target = require('../prefabs/Target');


  function Play() {}


  Play.prototype = {
    create: function() {

      this.backgroundBMD = this.game.make.bitmapData(this.game.width, this.game.height);
      this.target

      this.background = this.game.add.sprite(0,0, this.backgroundBMD);
      this.background.inputEnabled = true;
      this.background.input.priorityID = 0;
      this.background.events.onInputDown.add(this.onBackgroundClicked, this);
      this.player = new Character(this.game, this.game.width / 2, this.game.height / 2);
      this.game.add.existing(this.player);

      this.targets = this.game.add.group();

      var target = null;

      for(var i = 0; i < 10; i++) {
        target = new Target(this.game, this.game.world.randomX, this.game.world.randomY);
        target.events.onInputDown.add(this.onTargetClicked, this);
        this.targets.add(target);
      }


      this.createGraphics();
    },
    update: function() {

    },
    onBackgroundClicked: function() {
      console.log('firemiss');
      this.player.fireMiss();
    },
    onTargetClicked: function(target) {
      console.log('firehit:', arguments);
      this.player.fireHit(target);
    },
    render: function() {
      this.game.debug.geom(new Phaser.Line(this.player.world.x, this.player.world.y, this.player.hookshot.world.x, this.player.hookshot.world.y));
    },
    createGraphics: function() {
      var ctx =  this.backgroundBMD.ctx;
      ctx.fillStyle = '#00aeff';
      ctx.fillRect(0,0, this.game.width, this.game.height);
    }
  };

  module.exports = Play;
