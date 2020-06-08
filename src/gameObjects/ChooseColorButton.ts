
// You can write more code here

/* START OF COMPILED CODE */

export default class ChooseColorButton extends Phaser.GameObjects.Sprite {
	
	constructor(scene, x, y, texture) {
		super(scene, x, y, texture || "greenSq68px");

		this.setOrigin(0, 0);
		
		this.scaleX = 3.17;
		this.scaleY = 3.39;
		
		this.init();
		
	}
	
	/* START-USER-CODE */

	init() {
		this.setInteractive();
		// if (this.texture.key === 'greenSq68px') {
		// 	this.texture
		// }
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
