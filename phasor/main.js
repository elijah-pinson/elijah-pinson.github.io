// We start by initializing Phaser
// Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game_div');

// And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
var main_state = {
    preload: function() {
        // Everything in this function will be executed at the beginning. That’s where we usually load the game’s assets (images, sounds, etc.)
	game.load.image('hello', 'assets/hello.png');
	//game.load.image('bullet', 'assets/bullet.png');
	game.load.spritesheet('bullet', 'assets/sprite_wm.png', 30, 30);
    },

    create: function() { 
        // This function will be called after the preload function. Here we set up the game, display sprites, add labels, etc.
        //bullets
		
		
		this.nextShotAt = 0;
		this.shotDelay = 200;
		
        this.bulletPool = this.add.group();

        //physics for bullets
        this.bulletPool.enableBody = true;
		this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
		
		this.bulletPool.createMultiple(100, 'bullet');
		
		// Sets anchors of all sprites
		this.bulletPool.setAll('anchor.x', 0.5);
		this.bulletPool.setAll('anchor.y', 0.5);

		// Automatically kill the bullet sprites when they go out of bounds
		this.bulletPool.setAll('outOfBoundsKill', true);
		this.bulletPool.setAll('checkWorldBounds', true);

		this.bulletPool.forEach(function (bul) {
			bul.animations.add('spin', [0, 1, 2, 3], 8, true);
			bul.play('spin');
		});
		
		
		this.hello_sprite = game.add.sprite(250, 300, 'hello');
		//this.hello_sprite.animations.add('fire', [1]
		this.hello_sprite.anchor.setTo(0.5, 0.5);
		
		this.settext();
    },

    update: function() {
        // This is where we will spend the most of our time. This function is called 60 times per second to update the game.
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			this.fire();
		}
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
		{
			this.hello_sprite.angle -= 3;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
		{
			this.hello_sprite.angle += 3
		}
    },
    
    settext: function() {
    	this.instructions = this.add.text(250, 500, 'left/right arrows to rotate\n space to shoot', { font: '20px monospace', fill: '#fff', align: 'center' });
    	this.instructions.anchor.setTo(0.5, 0.5);
    },

    fire: function() {
	
		if (this.nextShotAt > this.time.now) {
			return;
		}
		
		if (this.bulletPool.countDead() === 0) {
			return;
		}
		
		this.nextShotAt = this.time.now + this.shotDelay;
		
		var bullet = this.bulletPool.getFirstExists(false);
		
		bullet.reset(250, 300);
		//bullet.angle = this.hello_sprite.angle;
		
		game.physics.arcade.velocityFromRotation(this.hello_sprite.rotation, 400, bullet.body.velocity);
    },
}

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state);  
game.state.start('main');
