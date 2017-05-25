var About = {
	preload: function() {
 
	game.load.image('backBtn', 'assets/back.png');
	game.load.image('background', 'assets/credit.png');
	
 
  },
 
  create: function() {
 
	game.add.tileSprite(0,0,800,600,'background');
    game.stage.backgroundColor = "#71c5cf";
	backButton = game.add.button(150, game.height-100, "backBtn", this.back, this);
    backButton.anchor.setTo(0.5);
    
	
  },
  back: function() {
	game.state.start("Menu");
  }
 
 

};
game.state.add('about',About);

