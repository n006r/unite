import {COLOR} from '../utils';

const textureByColor = {
	[COLOR.ORANGE]: 'orangeButton',
	[COLOR.GREEN]: 'greenButton',
	[COLOR.BLUE]: 'blueButton',
	[COLOR.RED]: 'redButton',
}

export default class ChooseColorButton extends Phaser.GameObjects.Sprite {
	
	constructor(scene, x, y, color: COLOR, onClick: () => void) {
		let texture = textureByColor[color];
		super(scene, x, y, texture);

		this.setOrigin(0, 0);

		this.setInteractive();
		
		this.on('pointerdown', onClick);
	}
}
