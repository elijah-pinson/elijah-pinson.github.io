// We start by initializing Phaser
// Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game_div');

// And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
var main_state = {
    preload: function() {
    
    this.leftvel = 0;
    this.rightvel = 0;
    this.leftpress = false;
    this.rightpress = false;
    
        // Everything in this function will be executed at the beginning. That’s where we usually load the game’s assets (images, sounds, etc.)
	game.load.image('hello', 'assets/hello.png');
    },

    create: function() { 
        // This function will be called after the preload function. Here we set up the game, display sprites, add labels, etc.
		this.hello_sprite = game.add.sprite(250, 300, 'hello');
		this.hello_sprite.anchor.setTo(0.5, 0.5);
		var left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		left_key.onDown.add(this.leftturnon, this);
		left_key.onUp.add(this.leftturnoff, this);
	
		var right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		right_key.onDown.add(this.rightturnon, this);
		right_key.onUp.add(this.rightturnoff, this);
		
		this.settext();
    },

    update: function() {
        // This is where we will spend the most of our time. This function is called 60 times per second to update the game.
    	if(this.leftpress) {
    		this.leftvel += .15;   		
    	}
    	else {
    		if (this.leftvel > 0)
    			this.leftvel -= .15;
    		if (this.leftvel < 0)
    			this.leftvel = 0;
    	}
    	
    	this.hello_sprite.angle -= this.leftvel;
    		
    	if(this.rightpress) {
    		this.rightvel += .15;   		
    	}
    	else {
    		if (this.rightvel > 0)
    			this.rightvel -= .15;
    		if (this.rightvel < 0)
    			this.rightvel = 0;
    	}
    	
    	this.hello_sprite.angle += this.rightvel;
    },
    
    settext: function() {
    	this.instructions = this.add.text(250, 500, 'left/right arrows to rotate', { font: '20px monospace', fill: '#fff', align: 'center' });
    	this.instructions.anchor.setTo(0.5, 0.5);
    },

    leftturnon: function() {
		this.leftpress = true;
    },

    rightturnon: function() {
    	this.rightpress = true;
    },
    
    leftturnoff: function() {
		//this.leftvel = 0;
		this.leftpress = false;
    },

    rightturnoff: function() {
    	//this.rightvel = 0;
    	this.rightpress = false;
    }

}

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state);  
game.state.start('main');
