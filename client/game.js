// Set main namespace
goog.provide("game");

// Get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Sprite');

// Constants
var GAME_AREA_WIDTH = 1024;
var GAME_AREA_HEIGHT = 768;

var WICKET_WIDTH = 42;
var WICKET_HEIGHT = 128;
var WICKET_OFFSET = 35;

// Entry point, setup game world
game.start = function() {

	var director = new lime.Director(document.body, GAME_AREA_WIDTH, GAME_AREA_HEIGHT),
		scene = new lime.Scene(),
		background = new lime.Sprite()
			.setAnchorPoint(0, 0)
			.setPosition(0, 0)
			.setSize(GAME_AREA_WIDTH, GAME_AREA_HEIGHT)
			.setFill('../resources/images/bg.png')
		wicket = new lime.Sprite()
			.setAnchorPoint(0.5, 1)
			.setPosition(GAME_AREA_WIDTH / 2, GAME_AREA_HEIGHT - WICKET_OFFSET)
			.setSize(WICKET_WIDTH, WICKET_HEIGHT)
			.setFill('../resources/images/wicket.png');

	// Add to scene
	scene.appendChild(background);
	scene.appendChild(wicket);

	director.makeMobileWebAppCapable();

	// Set current scene active
	director.replaceScene(scene);
}

goog.exportSymbol("game.start", game.start);
