import Phaser from 'phaser';

import Cell from '../gameObjects/Cell';
import ChooseColorButton from '../gameObjects/ChooseColorButton';
import GameOverModal from '../gameObjects/GameOverModal';

import {COLOR, getColorTextureKeyByColor, getRandomColor} from '../utils';

import {AUTOPLAY} from '../CONSTANTS';
import {MAPS} from '../MAPS';
import {SAVED_LEVEL} from '../autoplay';

const rowsAmount = 13;
const columnsAmount = 13;

let cellsAmount = 0;

export default class MainStage extends Phaser.Scene {
	gameOverTimeout?: number;

	grid?: Cell[][];
	userCell?: Cell;
	
	constructor() {
		super("MainStage");
		
		this.incConqueredCellsCount = this.incConqueredCellsCount.bind(this);
    }

    create() {
		const cellGrid = new Phaser.GameObjects.Container(this, 89, 290);
		this.add.existing(cellGrid);

		this.grid = [];
		for (let row = 0; row < rowsAmount; row++) {
			this.grid [row] = [];
			for (let column = 0; column < columnsAmount; column++) {
				const x = row * (68 + 7);
				const y = column * (68 + 7);
				const cell = new Cell(this, x, y, getColorTextureKeyByColor(getRandomColor()), this.incConqueredCellsCount);
				cellGrid.add(cell);
				this.grid[row][column] = cell;
				cellsAmount += 1;
			}
		}

		for (let row = 0; row < rowsAmount; row++) {
			for (let column = 0; column < columnsAmount; column++) {
				const cell = this.grid[row][column];
				if (row > 0) {
					cell.neighbors.push(this.grid[row - 1][column]);
				}
				if (column < columnsAmount - 1) {
					cell.neighbors.push(this.grid[row][column + 1]);
				}
				if (row < rowsAmount - 1) {
					cell.neighbors.push(this.grid[row + 1][column]);
				}
				if (column > 0) {
					cell.neighbors.push(this.grid[row][column - 1]);
				}
			}
		}

		this.userCell = this.grid[Math.floor(rowsAmount / 2)][Math.floor(columnsAmount / 2)];

		this.data.set('conqueredCellsCount', 0);

        this.data.events.on('changedata-conqueredCellsCount', (level, value) => {
			if (this.registry.get('mode') ==='playing') {
				console.log('incrementing score');
				this.data.inc('score');
			}

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
		
		// orangeButton
		const orangeButton = new ChooseColorButton(this, 89, 1632, "orangeSq68px");
		this.add.existing(orangeButton);
		
		// greenButton
		const greenButton = new ChooseColorButton(this, 89 + 216 + 37, 1632, "greenSq68px");
		this.add.existing(greenButton);
		
		// blueButton
		const blueButton = new ChooseColorButton(this, 89 + (216 + 37) * 2, 1632, "blueSq68px");
		this.add.existing(blueButton);
		
		// redButton
		const redButton = new ChooseColorButton(this, 89 + (216 + 37) * 3, 1632, "redSq68px");
		this.add.existing(redButton);
		
		// ui
		const ui = this.add.container(0, 0);
        
        this.data.set('score', 0);
		const scoresText = new Phaser.GameObjects.DOMElement(this, 54, 200, (() => {
			const stepsDiv = document.createElement('div');
			stepsDiv.classList.add('text', 'count');
			return stepsDiv;
		})());
		scoresText.setText(`очки: ${this.data.get('score')}`);
		scoresText.setOrigin(0, 0);
		ui.add(scoresText);

		this.data.events.on('changedata-score', (level, value) => {
			scoresText.setText(`очки: ${value}`);
		})

		const steps = new Phaser.GameObjects.DOMElement(this, 540, 1400, (() => {
				const stepsDiv = document.createElement('div');
				stepsDiv.classList.add('text', 'possibleUserSteps');
				return stepsDiv;
			})());
		steps.setText(`шагов: ${this.data.get('possibleUserSteps')}`);
		
		ui.add(steps);

		const gameOverModal = new GameOverModal(this, 0, 0, () => {
			console.log('on restart button click!');
			this.registry.set('map', 0);
			this.data.set('score', 0);
			this.applyMap();
			gameOverModal.hideFarAway();
		});
		gameOverModal.setOrigin(0, 0);	
		gameOverModal.hideFarAway();
		ui.add(gameOverModal);

		this.data.set('possibleUserSteps', 10000);
		this.data.events.on('changedata-possibleUserSteps', (level, value) => {
			console.log('changedata-possibleUserSteps ', value);
			steps.setText(`шагов: ${value}`);
			this.gameOverTimeout = setTimeout(() => {
				if (value <= 0 && this.data.get('conqueredCellsCount') !== cellsAmount && !AUTOPLAY) {
					if (this.data.get('score') > this.registry.get('absoluteRecord')) {
						this.registry.set('absoluteRecord', this.data.get('score'))
					}
					gameOverModal.show(this.data.get('score'), this.registry.get('absoluteRecord'));
				}
			}, 1200)
		});

		orangeButton.on('pointerdown', () => {
			this.onUserChangeColor(COLOR.ORANGE);
		});

		greenButton.on('pointerdown', () => {
			this.onUserChangeColor(COLOR.GREEN);
		});

		blueButton.on('pointerdown', () => {
			this.onUserChangeColor(COLOR.BLUE);
		});

		redButton.on('pointerdown', () => {
			this.onUserChangeColor(COLOR.RED);
		});


		this.applyMap();
	}
	
	loadLevel(level) {
		const grid = this.grid;
		if (!grid) {
			throw Error('no cellGrid');
		}
		for (let row = 0; row < rowsAmount; row++) {
			for (let column = 0; column < columnsAmount; column++) {
				grid[row][column].setData('color', level.grid[row][column].color);
				grid[row][column].setData('isConquered', false);
			}
		}
	}

    applyMap() {
		if (!this.userCell) {
			throw Error('userCell is not defined');
		}
		this.registry.set('mode', 'applying map');
		let map;
		if (AUTOPLAY) {
			map = SAVED_LEVEL;
		} else {
			const mapNumber = this.registry.get('map');
			console.log('loading map ', mapNumber);
			map = MAPS[mapNumber];
		}
		this.loadLevel(map);
		this.data.set('possibleUserSteps', map.minSteps.length);
		this.data.set('conqueredCellsCount', 0);
		this.registry.set('mode', 'playing');
		this.userCell.setConquered();
		this.events.emit('mapApplied', this);
	}

	onUserChangeColor(newColor) {
		if (!this.userCell) {
			throw Error('userCell is not defined');
		}
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
