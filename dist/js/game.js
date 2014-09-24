(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'hookshot');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
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

},{"./Hookshot":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('play');
  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],7:[function(require,module,exports){

'use strict';
var Character = require('../prefabs/Character');
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
  },
  update: function() {
  }
};

module.exports = Menu;

},{"../prefabs/Character":2}],8:[function(require,module,exports){

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

},{"../prefabs/Character":2,"../prefabs/Target":4}],9:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])