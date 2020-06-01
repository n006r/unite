
// You can write more code here

/* START OF COMPILED CODE */

class ChooseColorButton extends Phaser.GameObjects.Image {
	
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "blueSq68px");
		
		this.scaleX = 3.17;
		this.scaleY = 3.29;
		this.setOrigin(0, 0);
		
		this.init();
		
	}
	
	/* START-USER-CODE */

	init() {
		this.setInteractive();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
