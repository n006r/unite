import Phaser from 'phaser';
import {COLOR, getColorTextureKeyByColor, getColorByTextureKey} from '../utils';

export default class Cell extends Phaser.GameObjects.Sprite {

	neighbors: Cell[];
	tween?: Phaser.Tweens.Tween;
	
	constructor(scene, x, y, color: COLOR, onConqueredCallback) {
		super(scene, x, y, getColorTextureKeyByColor(color));
		
		
		this.setData('isConquered', false);
		this.setData('color', color);

		this.on('changedata-isConquered', (gameObj, value, prevValue) => {
			if (value) {
				onConqueredCallback();
			} else {
				this.returnToUsual();
			}

			if (value !== prevValue && this.scene.registry.get('mode') === 'playing') {
				this.startConquerVibe();
				this.notifyNeighbors();
			}
		})
		this.on('changedata-color', (gameObj, value, prevValue) => {
			const textureName = getColorTextureKeyByColor(value);
			this.setTexture(textureName);

			if (value !== prevValue && this.scene.registry.get('mode') === 'playing') {
				this.startConquerVibe();
				this.notifyNeighbors();
			}
		})


		this.neighbors = [];
		
	}

	neighborCellUpdated(newColor, isConquered) {
		const selfColor = this.getData('color');
		const selfIsConquered = this.getData('isConquered');
		if (newColor === selfColor || selfIsConquered && isConquered) {
			if (!selfIsConquered && isConquered) {
				this.setConquered();
			}
			if (selfColor !== newColor) {
				this.setColor(newColor);
			}
		}
	}

	setColor(newColor) {
		this.setData('color', newColor);
	}
	setConquered() {
		this.setData('isConquered', true);
	}

	notifyNeighbors() {
		setTimeout(() => {
			this.neighbors.forEach(neighbor => {
				neighbor.neighborCellUpdated(this.getData('color'), this.getData('isConquered'));
			})
		}, 50)
	}

	startConquerVibe() {
		if (this.tween) {
			this.tween.stop();
			this.tween.remove();
			this.scaleX = 1;
			this.scaleY = 1;
		}

		this.tween = this.scene.tweens.add({
			targets: this,
			scaleX: 1.1,
			scaleY: 1.1,
			ease: 'Sine.easeInOut',
			yoyo: true,
			duration: 100,
			onComplete: this.livingVibe.bind(this),
		});
	}

	livingVibe() {
		this.returnToUsual();
		this.tween = this.scene.tweens.add({
			targets: this,
			scaleX: 1.05,
			scaleY: 1.05,
			ease: 'Sine.easeInOut',
			repeat: -1,
			yoyo: true,
			duration: 300,
		});
	}

	returnToUsual() {
		if (this.tween) {
			this.tween.stop();
			this.tween.remove();
		}
		this.scaleX = 1;
		this.scaleY = 1;
	}
}
