var game = new Phaser.Game(600, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update,
    //render: render
}, true);

function preload() {
	game.load.image('board', 'img/board.png');
    game.load.image('blue', 'img/blue.png');
    game.load.image('green', 'img/green.png');
    game.load.image('red', 'img/red.png');
    game.load.image('yellow', 'img/yellow.png');
    game.load.spritesheet('dice-init', 'img/dice-init.png', 157, 158, 4);
    game.load.image('dice1', 'img/dice1.png');
    game.load.image('dice2', 'img/dice2.png');
    game.load.image('dice3', 'img/dice3.png');
    game.load.image('dice4', 'img/dice4.png');
    game.load.image('dice5', 'img/dice5.png');
    game.load.image('dice6', 'img/dice6.png');
}

var board;
var character;
var players = ['red', 'yellow'];
var activePlayer = players[0];
var gameEnds = false;
var redDices;
var diceOne;
var diceTwo;
var animDice01;
var animDice02;

// [x, y, special]
var boardSpaces = [];
boardSpaces[1] = [364, 580, null];
boardSpaces[2] = [364, 551, null];
boardSpaces[3] = [364, 522, null];
boardSpaces[4] = [364, 494, null];
boardSpaces[5] = [364, 466, 'yellow-start'];
boardSpaces[6] = [364, 437, null];
boardSpaces[7] = [364, 409, null];
boardSpaces[8] = [364, 382, null];
boardSpaces[9] = [381, 365, null];
boardSpaces[10] = [409, 365, null];
boardSpaces[11] = [437, 365, null];
boardSpaces[12] = [466, 365, null];
boardSpaces[13] = [493, 365, null];
boardSpaces[14] = [521, 365, null];
boardSpaces[15] = [550, 365, null];
boardSpaces[16] = [578, 365, null];
boardSpaces[17] = [578, 300, 'blue-end'];
boardSpaces[18] = [578, 235, null];
boardSpaces[19] = [550, 235, null];
boardSpaces[20] = [521, 235, null];
boardSpaces[21] = [493, 235, null];
boardSpaces[22] = [466, 235, 'blue-start'];
boardSpaces[23] = [437, 235, null];
boardSpaces[24] = [409, 235, null];
boardSpaces[25] = [381, 235, null];
boardSpaces[26] = [364, 218, null];
boardSpaces[27] = [364, 191, null];
boardSpaces[28] = [364, 163, null];
boardSpaces[29] = [364, 134, null];
boardSpaces[30] = [364, 106, null];
boardSpaces[31] = [364, 77, null];
boardSpaces[32] = [364, 48, null];
boardSpaces[33] = [364, 20, null];
boardSpaces[34] = [300, 20, 'red-end'];
boardSpaces[35] = [235, 20, null];
boardSpaces[36] = [235, 48, null];
boardSpaces[37] = [235, 77, null];
boardSpaces[38] = [235, 106, null];
boardSpaces[39] = [235, 134, 'red-start'];
boardSpaces[40] = [235, 163, null];
boardSpaces[41] = [235, 191, null];
boardSpaces[42] = [235, 219, null];
boardSpaces[43] = [216, 235, null];
boardSpaces[44] = [190, 235, null];
boardSpaces[45] = [161, 235, null];
boardSpaces[46] = [133, 235, null];
boardSpaces[47] = [105, 235, null];
boardSpaces[48] = [77, 235, null];
boardSpaces[49] = [48, 235, null];
boardSpaces[50] = [20, 235, null];
boardSpaces[51] = [20, 300, 'green-end'];
boardSpaces[52] = [20, 365, null];
boardSpaces[53] = [48, 365, null];
boardSpaces[54] = [77, 365, null];
boardSpaces[55] = [105, 365, null];
boardSpaces[56] = [133, 365, 'green-start'];
boardSpaces[57] = [161, 365, null];
boardSpaces[58] = [190, 365, null];
boardSpaces[59] = [216, 365, null];
boardSpaces[60] = [235, 382, null];
boardSpaces[61] = [235, 409, null];
boardSpaces[62] = [235, 437, null];
boardSpaces[63] = [235, 466, null];
boardSpaces[64] = [235, 494, null];
boardSpaces[65] = [235, 522, null];
boardSpaces[66] = [235, 551, null];
boardSpaces[67] = [235, 580, null];
boardSpaces[68] = [300, 580, 'yellow-end'];

var boardSpecial = ['red', 'yellow'];
boardSpecial['red'] = [];
boardSpecial['red'][1] = [300, 48];
boardSpecial['red'][2] = [300, 77];
boardSpecial['red'][3] = [300, 106];
boardSpecial['red'][4] = [300, 134];
boardSpecial['red'][5] = [300, 163];
boardSpecial['red'][6] = [300, 191];
boardSpecial['red'][7] = [300, 219];
boardSpecial['red'][8] = [270, 250];

boardSpecial['yellow'] = [];
boardSpecial['yellow'][1] = [300, 551];
boardSpecial['yellow'][2] = [300, 522];
boardSpecial['yellow'][3] = [300, 494];
boardSpecial['yellow'][4] = [300, 466];
boardSpecial['yellow'][5] = [300, 437];
boardSpecial['yellow'][6] = [300, 409];
boardSpecial['yellow'][7] = [300, 382];
boardSpecial['yellow'][8] = [270, 350];

// [x, y, occuped]
var boardStart = ['red', 'yellow'];
boardSpecial['red'] = [];
boardSpecial['red'][0] = [30, 30, false];
boardSpecial['red'][1] = [60, 30, false];
boardSpecial['red'][2] = [90, 30, false];
boardSpecial['red'][3] = [120, 30, false];

boardSpecial['yellow'] = [];
boardSpecial['yellow'][0] = [570, 570, false];
boardSpecial['yellow'][1] = [540, 570, false];
boardSpecial['yellow'][2] = [510, 570, false];
boardSpecial['yellow'][3] = [480, 570, false];

function create() {
	// Board
    board = game.add.sprite(game.width, game.height, 'board');
    board.anchor.set(1, 1);

    var boardScaleWidth = 600 / board.texture.frame.width;
    var boardScaleHeight = boardScaleWidth;
    board.scale.setTo(boardScaleWidth, boardScaleHeight);

    // Red elements
    // Red player
    red01 = game.add.sprite(boardSpecial['red'][0][0], boardSpecial['red'][0][1], 'red');
    red01.anchor.set(0.5, 0.5);
    red01.scale.setTo(.6, .6);

    red02 = game.add.sprite(boardSpecial['red'][1][0], boardSpecial['red'][1][1], 'red');
    red02.anchor.set(0.5, 0.5);
    red02.scale.setTo(.6, .6);

    red03 = game.add.sprite(boardSpecial['red'][2][0], boardSpecial['red'][2][1], 'red');
    red03.anchor.set(0.5, 0.5);
    red03.scale.setTo(.6, .6);

    red04 = game.add.sprite(boardSpecial['red'][3][0], boardSpecial['red'][3][1], 'red');
    red04.anchor.set(0.5, 0.5);
    red04.scale.setTo(.6, .6);

    // Load dices and animations

    // Yellow elements
    // Yellow player
    yellow01 = game.add.sprite(boardSpecial['yellow'][0][0], boardSpecial['yellow'][0][1], 'yellow');
    yellow01.anchor.set(0.5, 0.5);
    yellow01.scale.setTo(.6, .6);

    yellow02 = game.add.sprite(boardSpecial['yellow'][1][0], boardSpecial['yellow'][1][1], 'yellow');
    yellow02.anchor.set(0.5, 0.5);
    yellow02.scale.setTo(.6, .6);

    yellow03 = game.add.sprite(boardSpecial['yellow'][2][0], boardSpecial['yellow'][2][1], 'yellow');
    yellow03.anchor.set(0.5, 0.5);
    yellow03.scale.setTo(.6, .6);

    yellow04 = game.add.sprite(boardSpecial['yellow'][3][0], boardSpecial['yellow'][3][1], 'yellow');
    yellow04.anchor.set(0.5, 0.5);
    yellow04.scale.setTo(.6, .6);

    resetDices();
    initGame();
}

function update() {
    // Character keyboard movement
    if (!gameEnds) {
    	showDices();
    }
}

function initGame() {
	red01.x = boardSpaces[39][0];
	red01.y = boardSpaces[39][1];
	players['red'] = 39;

	yellow01.x = boardSpaces[5][0];
	yellow01.y = boardSpaces[5][1];
	players['yellow'] = 5;

	showDices();
}

function throwingDicesRed() {

		animDice01 = diceInit01.animations.add('dice-init');

		//animDice01.onStart.add(dicesStarted, this);
	    animDice01.onLoop.add(dicesRedLooped, this);
	    //animDice01.onComplete.add(dicesStopped, this);

	    animDice01.play(12, true);

	    animDice02 = diceInit02.animations.add('dice-init');

		//animDice02.onStart.add(dicesStarted, this);
	    animDice02.onLoop.add(dicesRedLooped, this);
	    //animDice02.onComplete.add(dicesStopped, this);

	    animDice02.play(12, true);

}

function dicesRedLooped(sprite, animation) {

    if (animDice01.loopCount > 2)
    {
        animDice01.loop = false;
        animDice02.loop = false;
		diceOne = getRandomInt();
		diceTwo = getRandomInt();
		diceInit01.loadTexture('dice' + diceOne, 0, false);
		diceInit02.loadTexture('dice' + diceTwo, 0, false);

		movePlayer('red', diceOne + diceTwo);
    }

}

function throwingDicesYellow() {

		animDice03 = diceInit03.animations.add('dice-init');

		//animDice01.onStart.add(dicesStarted, this);
	    animDice03.onLoop.add(dicesYellowLooped, this);
	    //animDice01.onComplete.add(dicesStopped, this);

	    animDice03.play(12, true);

	    animDice04 = diceInit04.animations.add('dice-init');

		//animDice02.onStart.add(dicesStarted, this);
	    animDice04.onLoop.add(dicesYellowLooped, this);
	    //animDice02.onComplete.add(dicesStopped, this);

	    animDice04.play(12, true);

}

function dicesYellowLooped(sprite, animation) {

    if (animDice03.loopCount > 2)
    {
        animDice03.loop = false;
        animDice04.loop = false;
		diceOne = getRandomInt();
		diceTwo = getRandomInt();
		diceInit03.loadTexture('dice' + diceOne, 0, false);
		diceInit04.loadTexture('dice' + diceTwo, 0, false);

		movePlayer('yellow', diceOne + diceTwo);
    }

}

function resetDices() {
	diceInit01 = game.add.sprite(60, 150, 'dice-init');
    diceInit01.anchor.set(0.5, 0.5);
    diceInit01.scale.setTo(.5, .5);

    diceInit01.inputEnabled = true;
    diceInit01.events.onInputDown.add(setDicesRed, this);

    diceInit02 = game.add.sprite(145, 150, 'dice-init');
    diceInit02.anchor.set(0.5, 0.5);
    diceInit02.scale.setTo(.5, .5);

    diceInit02.inputEnabled = true;
    diceInit02.events.onInputDown.add(setDicesRed, this);

    diceInit03 = game.add.sprite(600 - 60, 600 - 150, 'dice-init');
    diceInit03.anchor.set(0.5, 0.5);
    diceInit03.scale.setTo(.5, .5);

    diceInit03.inputEnabled = true;
    diceInit03.events.onInputDown.add(setDicesYellow, this);

    diceInit04 = game.add.sprite(600 - 145, 600 - 150, 'dice-init');
    diceInit04.anchor.set(0.5, 0.5);
    diceInit04.scale.setTo(.5, .5);

    diceInit04.inputEnabled = true;
    diceInit04.events.onInputDown.add(setDicesYellow, this);
}

function getRandomInt() {
	min = 1;
	max = 7; // Max number excluded
  	return Math.floor(Math.random() * (max - min)) + min;
}

function setDicesRed () {
	throwingDicesRed();
    setTimeout(function()
    {
	    activePlayer = 'yellow';
	    resetDices();
    }, 3000);
}

function setDicesYellow () {
	throwingDicesYellow();
    setTimeout(function()
    {
    	activePlayer = 'red';
    	resetDices();
    }, 3000);
}

function showDices() {
	diceInit01.visible = false;
	diceInit02.visible = false;
	diceInit03.visible = false;
	diceInit04.visible = false;

	if (activePlayer == 'red') {
		diceInit01.visible = true;
		diceInit02.visible = true;
	} else if (activePlayer == 'yellow') {
		diceInit03.visible = true;
		diceInit04.visible = true;
	}
}

function movePlayer(player, result) {
	var oldPosition;

	if (player == 'red') {
		oldPosition = players['red'];

		playerAnimation (red01, players['red'], result);

		players['red'] = oldPosition + result;

		if (players['red'] > 68) {
			players['red'] = players['red'] - 68;
		}

	} else if (player == 'yellow') {
		oldPosition = players['yellow'];

		playerAnimation (yellow01, players['yellow'], result);

		players['yellow'] = oldPosition + result;

		if (players['yellow'] > 68) {
			players['yellow'] = players['yellow'] - 68;
		}
	}
}

function playerAnimation (item, position, movements) {
   setTimeout(function () {
      movements--;
      position++;
      if (position > 68) {
      	position = 1;
      }
      if (movements >= 0) {
         playerAnimation(item, position, movements);
         game.add.tween(item).to(
         	{
         		x : boardSpaces[position][0],
         		y : boardSpaces[position][1]
         	}
         , 150, Phaser.Easing.Linear.None, true);
      }
   }, 150);
}