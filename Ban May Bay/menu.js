var startBtn;
var Menu = {
	preload: function() {
 
    game.load.image('playBtn', 'assets/play.png');
    game.load.image('instructionBtn', 'assets/instructionBtn.png');
    game.load.image('aboutBtn', 'assets/about.png');
 
  },
 
  create: function() {
 
    game.stage.backgroundColor = "#71c5cf";
 
    playButton = game.add.button(game.width/2, game.height/2 - 80, "playBtn", this.startGame, this);
    playButton.anchor.setTo(0.5);
    instructionBtn = game.add.button(game.width/2, game.height/2 + 42, "instructionBtn", this.instructionGame, this);
    instructionBtn.anchor.setTo(0.5);
    aboutBtn = game.add.button(game.width/2, game.height/2 + 128, "aboutBtn", this.about, this);
    aboutBtn.anchor.setTo(0.5);
  },
 
  startGame: function() {
 
    game.state.start("mainState");
 
  },

  instructionGame: function() {
    game.state.start("instructionState");
  },

  about: function() {
	   game.state.start("about");
  }
 

};
game.state.add("Menu", Menu);
game.state.start("Menu");