import Phaser from 'phaser';

import CellGrid from '../gameObjects/CellGrid';
import ChooseColorButton from '../gameObjects/ChooseColorButton';
import GameOverModal from '../gameObjects/GameOverModal';

import {COLORS} from '../utils';

import {AUTOPLAY} from '../CONSTANTS';
import {MAPS} from '../MAPS';

export default class MainStage extends Phaser.Scene {
	
	constructor() {
		super("MainStage");
		
    }

    create() {
        this.data.set('conqueredCellsCount', 0);

        this.data.events.on('changedata-conqueredCellsCount', (level, value) => {
			// this.conquerCount.setText(`заражено: ${value}`);
			if (this.registry.get('mode') ==='playing') {
				console.log('incrementing score');
				this.data.inc('score');
			}

			const cellsAmount = this.cellGrid.getData('cellsAmount');

			if (value !== 0 && cellsAmount !== 0 && value === cellsAmount) {
				console.log('conqueredCellsCount ', value, ' cellsAmount ', cellsAmount);
				if (!AUTOPLAY) {
					setTimeout(() => {
						console.log('COMPLETE LEVEL');
						clearTimeout(this.gameOverTimeout);
						this.registry.inc('map');
						this.applyMap();
					}, 1000)
				}
			}
		})

        // cellGrid
		const cellGrid = new CellGrid(this, 89, 290);
		this.add.existing(cellGrid);
		
		// orangeButton
		const orangeButton = new ChooseColorButton(this, 68, 1632, "orangeSq68px");
		this.add.existing(orangeButton);
		
		// greenButton
		const greenButton = new ChooseColorButton(this, 340, 1632, "greenSq68px");
		this.add.existing(greenButton);
		
		// blueButton
		const blueButton = new ChooseColorButton(this, 612, 1632, "blueSq68px");
		this.add.existing(blueButton);
		
		// redButton
		const redButton = new ChooseColorButton(this, 884, 1632, "redSq68px");
		this.add.existing(redButton);
		
		// ui
		const ui = this.add.container(0, 0);
		
		// fields
		this.cellGrid = cellGrid;
		this.orangeButton = orangeButton;
		this.greenButton = greenButton;
		this.blueButton = blueButton;
		this.redButton = redButton;
        this.ui = ui;
        
        this.data.set('score', 0);
		const scoresText = new Phaser.GameObjects.DOMElement(this, 54, 200, (() => {
			const stepsDiv = document.createElement('div');
			stepsDiv.classList.add('text', 'count');
			return stepsDiv;
		})());
		scoresText.setText(`очки: ${this.data.get('score')}`);
		scoresText.setOrigin(0, 0);
		this.ui.add(scoresText);

		this.data.events.on('changedata-score', (level, value) => {
			scoresText.setText(`очки: ${value}`);
		})

		const steps = new Phaser.GameObjects.DOMElement(this, 540, 1400, (() => {
				const stepsDiv = document.createElement('div');
				stepsDiv.classList.add('text', 'possibleUserSteps');
				return stepsDiv;
			})());
		steps.setText(`шагов: ${this.data.get('possibleUserSteps')}`);
		
		this.ui.add(steps);

		const gameOverModal = new GameOverModal(this, 0, 0, () => {
			console.log('on restart button click!');
			this.registry.set('map', 0);
			this.data.set('score', 0);
			this.applyMap();
			gameOverModal.hideFarAway();
		});
		gameOverModal.setOrigin(0, 0);	
		gameOverModal.hideFarAway();
		this.ui.add(gameOverModal);

		this.data.set('possibleUserSteps', 10000);
		this.data.events.on('changedata-possibleUserSteps', (level, value) => {
			console.log('changedata-possibleUserSteps ', value);
			steps.setText(`шагов: ${value}`);
			this.gameOverTimeout = setTimeout(() => {
				console.log('afterTimeout value is ', value);
				if (value <= 0 && this.data.get('conqueredCellsCount') !== this.cellGrid.getData('cellsAmount') && !AUTOPLAY) {
					if (this.data.get('score') > this.registry.get('absoluteRecord')) {
						this.registry.set('absoluteRecord', this.data.get('score'))
					}
					console.log('showing gameOver');
					// gameOverModal.setAbsoluteRecord(this.registry.get('absoluteRecord'));
					// gameOverModal.setScore(this.data.get('score'));
					// gameOverModal.x = 0;
					gameOverModal.show(this.data.get('score'), this.registry.get('absoluteRecord'));
				}
			}, 1200)
		});

		this.userCell = this.cellGrid.userCell;

		this.orangeButton.on('pointerdown', () => {
			this.onUserChangeColor(COLORS.ORANGE);
		});

		this.greenButton.on('pointerdown', () => {
			this.onUserChangeColor(COLORS.GREEN);
		});

		this.blueButton.on('pointerdown', () => {
			this.onUserChangeColor(COLORS.BLUE);
		});

		this.redButton.on('pointerdown', () => {
			this.onUserChangeColor(COLORS.RED);
		});


		this.applyMap();
    }

    applyMap() {
		this.registry.set('mode', 'applying map');
		let map;
		if (AUTOPLAY) {
			map = SAVED_LEVEL;
		} else {
			const mapNumber = this.registry.get('map');
			console.log('loading map ', mapNumber);
			map = MAPS[mapNumber];
		}
		this.cellGrid.loadLevel(map);
		this.data.set('possibleUserSteps', map.minSteps.length);
		this.data.set('conqueredCellsCount', 0);
		this.registry.set('mode', 'playing');
		this.userCell.setConquered();
		this.events.emit('mapApplied', this);
	}

	onUserChangeColor(newColor) {
		console.log('onUserChangeColor');
		const possibleUserSteps = this.data.get('possibleUserSteps');
		if (possibleUserSteps > 0) {
			this.userCell.setColor(newColor);
			this.data.set('possibleUserSteps', this.data.get('possibleUserSteps') -1);
		}
	}

	incConqueredCellsCount() {
		this.data.inc('conqueredCellsCount');
	}
}
