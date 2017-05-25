var game = new Phaser.Game(800, 600, Phaser.Canvas,'')
var starfield;
var background=2;
var level=1;
var player;
var cursors;
var bullets;
var bulletTime = 0;
var fireButton;
var enemies;
var enemies2;
var score = 0;
var scoreText;
var winText;
var loseText;
var giftboxs;
var firingTimer = 0;
var enemyBullet;
var livingEnemies = [];
var lives;
var enemylives;
var mainState = {
    preload: function(){
        game.load.image('starfield','assets/starfield.jpg')
        game.load.image('player','assets/player.png')
        game.load.image('bullet2','assets/bullet.png')
        game.load.image('enemy','assets/enemy.png');
        game.load.image('chicken','assets/chicken.png');
        game.load.image('giftbox','assets/giftbox.png');
        game.load.image('flash','assets/flash.png');
        game.load.image('egg','assets/egg.png');

        game.load.spritesheet('explosion', 'assets/explosion.png', 64, 64, 60);
		game.load.spritesheet('chickensprite','assets/chickensprite.png', 50, 61);
		game.load.spritesheet('boss','assets/boss.png', 270, 310);
//		game.load.atlasJSONHash('boss', 'assets/boss.png', 'assets/boss.json');
		
    },
    create :function(){
        starfield = game.add.tileSprite(0,0,800,600,'starfield');
        //  Set the world (global) gravity
        game.physics.arcade.gravity.y = 100;

        player = game.add.sprite(game.world.centerX,game.world.centerY + 200, 'player');
        game.physics.enable(player,Phaser.Physics.ARCADE)

        cursors = game.input.keyboard.createCursorKeys()

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30,'bullet2')
        bullets.setAll('anchor.x',0.5)
        bullets.setAll('anchor.y',1)
        bullets.setAll('outOfBoundsKill',true);
        bullets.setAll('checkWorldBounds',true)

        giftboxs= game.add.group();
        giftboxs.enableBody = true;
        giftboxs.physicsBodyType = Phaser.Physics.ARCADE;
        giftboxs.createMultiple(30,'bullet2')
        giftboxs.setAll('anchor.x',0.5)
        giftboxs.setAll('anchor.y',0.5)


        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'egg');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

        scoreText = game.add.text(0,550,'Score: ',{font:'32px Arial',fill:'#fff'})
        lives = game.add.group();
		
		for (var i = 0; i < 3; i++) 
    	{
        	var ship = lives.create(game.world.width - 100 + (40 * i), 60, 'player');
        	ship.anchor.setTo(0.5, 0.5);
          	
    	}
		

    	game.add.text(game.world.width-100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });
        winText = game.add.text(game.world.centerX-50,game.world.centerY,'Good Job!!!',{font:'32px Arial',fill:'#fff'})
        loseText = game.add.text(game.world.centerX-50,game.world.centerY," GAME OVER \n Click to restart",{font:'32px Arial',fill:'#fff'})
        loseText.visible = false;
        winText.visible = false;
		
		enemies = game.add.group();
        enemies.enableBody = true;
        createLevel();
		
	},
    update :function(){
    	starfield.tilePosition.y += background;

    	//if (player.alive){
    		if (game.time.now > firingTimer)
    	    {
        	    enemyFires();
        	}
        
        	

        	player.body.velocity.x = 0;
        	player.body.velocity.y = 0;

        	

        	if(cursors.up.isDown){
        		if (player.position.y > 0) {
        			player.body.velocity.y = -350;
        		}	
        	}

        	if(cursors.down.isDown){
        		if (player.position.y <= game.world.height-52) {
        			player.body.velocity.y = 350;
        		}
           
        	}

        	if(cursors.left.isDown){
        		if (player.position.x > 0)
        		{
        			player.body.velocity.x = -350;
        		}
            
        	}

        	if(cursors.right.isDown){
        	    if (player.position.x <= game.world.width-52)
        		{
        			player.body.velocity.x = 350;
        		}
        	}

        	if(fireButton.isDown){
        	    fireBullet();
        	}
        	game.physics.arcade.overlap(bullets,enemies,collision_bullet_enemy,null,this);
        	game.physics.arcade.overlap(player,enemies,collision_player_enemy ,null,this);
        	game.physics.arcade.overlap(player,giftboxs,collision_player_giftbox ,null,this);
        	game.physics.arcade.overlap(player,enemyBullets,collision_enemybullet_player ,null,this);
    	//}
 		

  
        
    }
}

function collision_bullet_enemy(bullet, enemy){
	var explosion;
	if(level!=4)
		explosion = game.add.sprite(enemy.body.x, enemy.body.y, 'explosion');
    else 
	{
		explosion = game.add.sprite(enemy.body.x+30, enemy.body.y+200, 'explosion');
		explosion.scale.setTo(2.0,2.0)
	}
	explosion.animations.add('explode');
    explosion.animations.play('explode',30, false, false);

    bullet.kill();
	enemylives-=1;
	if((level!=4)||(level==4 && enemylives==0))	
		enemy.kill();

    score += 100;
    scoreText.text ="Score: " + score;
    let d = Math.random();
    if (d < 0.95);
    else
    {
        var giftbox = giftboxs.create(enemy.x, enemy.y, 'giftbox')
        giftbox.anchor.setTo(0.5, 0.5)

        giftboxs.x = 100;
        giftboxs.y = 50;
        game.physics.enable(giftbox, Phaser.Physics.ARCADE)

    }

    if (enemies.countLiving()==0 || enemylives==0){
    	enemyBullets.callAll('kill',this);
        winText.text = " Good Job!!!, \n Click to continue";
        winText.visible = true;

        //the "click to restart" handler
		level+=1;
        if(level<5)
		{
			game.input.onTap.addOnce(createLevel,this);
		}
		else{
			player.kill();
			enemyBullets.callAll('kill');
			loseText.visible = false;
			winText.text=" YOU WON \n Click to restart";
			winText.visible = true;

			//the "click to restart" handler
			game.input.onTap.addOnce(restart,this);
		}
		

    }



}
function collision_enemybullet_player(player, enemybullet){

    var explosion = game.add.sprite(player.x, player.y, 'explosion');
    explosion.animations.add('explode');
    explosion.animations.play('explode',30, false, false);

    enemybullet.kill();
    
    live = lives.getFirstAlive();
	
    if (live)
    {
        live.kill();
    }

    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');
        winText.visible = false;
        loseText.text=" GAME OVER \n Click to restart";
        loseText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function collision_player_enemy(player, enemy){
    player.kill();
    loseText.visible = true; 
	game.input.onTap.addOnce(restart,this);
	
}

function collision_player_giftbox(player, giftbox) {
    giftbox.kill();
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    var giftnum = randomIntFromInterval(1,2);
    switch(giftnum)
    {
        case 1:
            bullets.createMultiple(30,'bullet2')
            break
        case 2:
            bullets.createMultiple(30,'flash')
            break
    }

    bullets.setAll('anchor.x',0.5)
    bullets.setAll('anchor.y',1)
    bullets.setAll('outOfBoundsKill',true);
    bullets.setAll('checkWorldBounds',true)

}
function fireBullet(){
    if(game.time.now > bulletTime){
        bullet = bullets.getFirstExists(false);

        if(bullet){
            bullet.reset(player.x + 17,player.y)
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }
}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    enemies.forEachAlive(function(enemy){

        // put every living enemy in an array
        livingEnemies.push(enemy);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {

        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);
        if (level == 4){
        	var random = game.rnd.integerInRange(0,game.world.width);
        	enemyBullet.reset(random, shooter.body.y);
        }
        if (level == 1) {
        	game.physics.arcade.moveToObject(enemyBullet,player,120);
            firingTimer = game.time.now + 2000;
        }
        else if (level == 2){
        	game.physics.arcade.moveToObject(enemyBullet,player,240);
            firingTimer = game.time.now + 800;
        }
        else if (level == 3){
        	game.physics.arcade.moveToObject(enemyBullet,player,450);
            firingTimer = game.time.now + 400;
        }
        else if (level == 4){
        	game.physics.arcade.moveToObject(enemyBullet,player,300);
            firingTimer = game.time.now + 200;
        }
    }

}

function createEnemiesLevel_1(){
    for(var y =0;y<4;y++){
        for(var x = 0;x<10;x++){
            var enemy = enemies.create(x*48,y*50,'enemy')
            enemy.anchor.setTo(0.5,0.5)
        }
    }

    enemies.x = 100;
    enemies.y = 50;

    var tween = game.add.tween(enemies).to({x:250},2000,Phaser.Easing.Linear.None,true,0,1000,true)
    //var tween = game.add.tween(enemies).to({x:250, y: 150},2000,Phaser.Easing.Circular.In,true,0,1000,true);
    tween.onLoop.add(descend,this);
}

function descend(){
    enemies.y += 10;
}

function createEnemiesLevel_2 (){
	enemies.x = 100;
    enemies.y = 50;

	for(var y =0;y<2;y++){
        for(var x = 0;x<10;x++){
            var enemy = enemies.create(x*60,y*60,'chickensprite');
            enemy.anchor.setTo(0.5,0.5);
            enemy.animations.add('fly',[0, 1, 2], 10, true);
            enemy.play('fly');
            enemy.body.moves = false;
        }
    }

    for(var y =2;y<4;y++){
        for(var x = 0;x<10;x++){
            var chicken = enemies.create(x*60,y*50,'enemy')
            enemy.anchor.setTo(0.5,0.5)
        }
    }

   // var tween = game.add.tween(enemies).to({x:250},2000,Phaser.Easing.Linear.None,true,0,1000,true)
    var tween = game.add.tween(enemies).to({x:250, y: 150},2000,Phaser.Easing.Circular.In,true,0,1000,true);
    tween.onLoop.add(descend,this);

}
function createEnemiesLevel_3 (){
	//enemylives = 4;
	enemies.x = 100;
    enemies.y = 50;

	for(var y =0;y<4;y++){
        for(var x = 0;x<10;x++){
            var enemy = enemies.create(x*60,y*60,'chickensprite');
            enemy.anchor.setTo(0.5,0.5);
            enemy.animations.add('fly',[0, 1, 2], 10, true);
            enemy.play('fly');
            enemy.body.moves = false;
        }
    }

   // var tween = game.add.tween(enemies).to({x:250},2000,Phaser.Easing.Linear.None,true,0,1000,true)
    var tween = game.add.tween(enemies).to({x:250, y: 150},2000,Phaser.Easing.Circular.In,true,0,1000,true);
    tween.onLoop.add(descend,this);

}
function createEnemiesLevel_4 (){

	enemylives=40;
	enemies.x = 100;
    enemies.y = 100;
	var boss = enemies.create(100, 50, 'boss');
	boss.anchor.setTo(0.5, 0.5);
	boss.animations.add('fly')
	boss.play('fly',8, true, false)
	
	var tween = game.add.tween(enemies).to({x:600},2000,Phaser.Easing.Linear.None,true,0,1000,true);
    tween.onLoop.add(descend,this);

	
}
function createLevel(){
	enemies.removeAll();
	winText.visible = false;
	switch(level){
		case 1:{
			createEnemiesLevel_1();
		}
		break;
		case 2:{
			createEnemiesLevel_2();
		}
		break;
		case 3:{
			createEnemiesLevel_3();
		}
		break;
		case 4:{
			createEnemiesLevel_4();
		}
		break;
		default:
			break;
	}
	enemies.forEach(function(L){L.body.allowGravity = false;  }, this);
	player.x = game.world.centerX;
	player.y = game.world.centerY + 200;
	
	player.revive();
}

function restart (){
	lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    enemies.removeAll();
    level = 1;
	createLevel();
    //revives the player
	player.x = game.world.centerX;
	player.y = game.world.centerY + 200;
    player.revive();
    //hides the text
    score = 0;
    scoreText.text ="Score: " + score;
	winText.visible = false;
    loseText.visible = false;
}
game.state.add('mainState',mainState);

