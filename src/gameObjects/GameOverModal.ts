import Phaser from 'phaser';

export default class GameOverModal extends Phaser.GameObjects.DOMElement {

	absoluteRecordSign: HTMLElement;
	currentRecordSign: HTMLElement;
	
	constructor(scene, x, y, onRestartButtonClick) {
		super(scene, x, y);
		this.createFromCache('gameOverModal');

		const HTMLModalContainer = this.node.getElementsByClassName('modal-container')[0] as HTMLElement;

		HTMLModalContainer.style.width = `${this.scene.cameras.main.width}px`;
		HTMLModalContainer.style.height = `${this.scene.cameras.main.height}px`;

		const restartButton = this.node.querySelector('button');
		if (restartButton) {
			restartButton.addEventListener('click', onRestartButtonClick);
		}

		this.absoluteRecordSign = this.node.querySelector('.absoluteRecord .value') as HTMLElement;
		this.currentRecordSign = this.node.querySelector('.currentRecord .value') as HTMLElement;

		this.setOrigin(0, 0);
	}

	setAbsoluteRecord(value) {
		this.absoluteRecordSign.innerText = value;
	}

	setScore(value) {
		this.currentRecordSign.innerText = value;
	}

	hideFarAway() {
		this.x = 3000;
	}

	show(score, absoluteRecord) {
		this.setAbsoluteRecord(absoluteRecord);
		this.setScore(score);
		this.x = 0;
	}
}
