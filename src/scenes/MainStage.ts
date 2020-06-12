import Phaser from 'phaser';

import Cell from '../gameObjects/Cell';
import ChooseColorButton from '../gameObjects/ChooseColorButton';
import GameOverModal from '../gameObjects/GameOverModal';
import Steps from '../gameObjects/Steps';
import Scores from '../gameObjects/Scores';

import {COLOR, getColorTextureKeyByColor, getRandomColor} from '../utils';

import {AUTOPLAY} from '../CONSTANTS';
import {SAVED_LEVEL} from '../autoplay';

const rowsAmount = 13;
const columnsAmount = 13;

let cellsAmount = 0;

export default class MainStage extends Phaser.Scene {
	gameOverTimeout?: number;

	grid!: Cell[][];
	userCell!: Cell;

	orangeButton!: ChooseColorButton;
	greenButton!: ChooseColorButton;
	blueButton!: ChooseColorButton;
	redButton!: ChooseColorButton;

	
	constructor() {
		super("MainStage");
		
		this.incConqueredCellsCount = this.incConqueredCellsCount.bind(this);
    }

    create() {
		this.registry.set('map', 0);
		this.registry.set('absoluteRecord', localStorage.getItem('absoluteRecord') || 0);
		this.registry.events.on('changedata-absoluteRecord', (game, value) => {
			localStorage.setItem('absoluteRecord', value);
		});


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
				this.data.inc('score');
			}

			if (value !== 0 && cellsAmount !== 0 && value === cellsAmount) {
				console.log('conqueredCellsCount ', value, ' cellsAmount ', cellsAmount);
				if (!AUTOPLAY) {
					setTimeout(() => {
						clearTimeout(this.gameOverTimeout);
						this.registry.inc('map');
						this.applyMap();
					}, 1000)
				}
			}
		})
		
		// orangeButton
		this.anims.create({
			key: 'orangeButtonOn',
			frames: this.anims.generateFrameNames('orangeButton', { prefix: 'OrangeButton', end: 9, zeroPad: 4 }),
			frameRate: 60,
			repeat: 0,
		});
		this.anims.create({
			key: 'orangeButtonOff',
			frames: this.anims.generateFrameNames('orangeButton', { prefix: 'OrangeButton', start: 9, end: 0, zeroPad: 4 }),
			frameRate: 60,
		});
		this.orangeButton = new ChooseColorButton(this, 55, 1632, COLOR.ORANGE, () => this.onUserColorButtonClick(COLOR.ORANGE));
		this.add.existing(this.orangeButton);
		
		// greenButton
		this.anims.create({
			key: 'greenButtonOn',
			frames: this.anims.generateFrameNames('greenButton', { prefix: 'GreenButton', end: 9, zeroPad: 4 }),
			frameRate: 60,
			repeat: 0,
		});
		this.anims.create({
			key: 'greenButtonOff',
			frames: this.anims.generateFrameNames('greenButton', { prefix: 'GreenButton', start: 9, end: 0, zeroPad: 4 }),
			frameRate: 60,
		});
		this.greenButton = new ChooseColorButton(this, 55 + 216 + 37, 1632, COLOR.GREEN, () => this.onUserColorButtonClick(COLOR.GREEN));
		this.add.existing(this.greenButton);
		
		// blueButton
		this.anims.create({
			key: 'blueButtonOn',
			frames: this.anims.generateFrameNames('blueButton', { prefix: 'BlueButton', end: 9, zeroPad: 4 }),
			frameRate: 60,
			repeat: 0,
		});
		this.anims.create({
			key: 'blueButtonOff',
			frames: this.anims.generateFrameNames('blueButton', { prefix: 'BlueButton', start: 9, end: 0, zeroPad: 4 }),
			frameRate: 60,
		});
		this.blueButton = new ChooseColorButton(this, 55 + (216 + 37) * 2, 1632, COLOR.BLUE, () => this.onUserColorButtonClick(COLOR.BLUE));
		this.add.existing(this.blueButton);
		
		// redButton
		this.anims.create({
			key: 'redButtonOn',
			frames: this.anims.generateFrameNames('redButton', { prefix: 'RedButton', end: 9, zeroPad: 4 }),
			frameRate: 60,
			repeat: 0,
		});
		this.anims.create({
			key: 'redButtonOff',
			frames: this.anims.generateFrameNames('redButton', { prefix: 'RedButton', start: 9, end: 0, zeroPad: 4 }),
			frameRate: 60,
		});
		this.redButton = new ChooseColorButton(this, 55 + (216 + 37) * 3, 1632, COLOR.RED, () => this.onUserColorButtonClick(COLOR.RED));
		this.add.existing(this.redButton);
		
		// ui
		const ui = this.add.container(0, 0);
        
        this.data.set('score', 0);
		const scoresText = new Scores(this, 54, 200).setText(`очки: ${this.data.get('score')}`);
		ui.add(scoresText);

		this.data.events.on('changedata-score', (level, value) => {
			scoresText.setText(`очки: ${value}`);
		})

		const steps = new Steps(this, 540, 1400).setText(`шагов: ${this.data.get('possibleUserSteps')}`);
		ui.add(steps);

		const gameOverModal = new GameOverModal(this, 0, 0, () => {
			this.registry.set('map', 0);
			this.data.set('score', 0);
			this.applyMap();
			gameOverModal.hideFarAway();
		});	
		gameOverModal.hideFarAway();
		ui.add(gameOverModal);

		this.data.set('possibleUserSteps', 10000);
		this.data.events.on('changedata-possibleUserSteps', (level, value) => {
			// console.log('changedata-possibleUserSteps ', value);
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


		this.applyMap();
	}
	
	loadLevel(level) {
		const grid = this.grid;
		for (let row = 0; row < rowsAmount; row++) {
			for (let column = 0; column < columnsAmount; column++) {
				grid[row][column].setData('color', level.grid[row][column].color);
				grid[row][column].setData('isConquered', false);
			}
		}
	}

    applyMap() {
		this.registry.set('mode', 'applying map');
		let map;
		if (AUTOPLAY) {
			map = SAVED_LEVEL;
		} else {
			const mapNumber = this.registry.get('map');
			const MAPS = this.load.cacheManager.json.get('maps');
			console.log();
			map = MAPS[mapNumber];
		}
		this.loadLevel(map);
		this.data.set('possibleUserSteps', map.minSteps.length);
		this.data.set('conqueredCellsCount', 0);
		this.registry.set('mode', 'playing');
		this.userCell.setConquered();
		const firstCellColor = this.userCell.data.get('color');
		this.setColorButtonUnpressed();
		this.setColorButtonPressed(firstCellColor);
		this.events.emit('mapApplied', this);
	}

	onUserColorButtonClick(newColor) {
		const prevColor: COLOR = this.userCell.getData('color');
		if (prevColor === newColor) {
			return;
		}
		const possibleUserSteps = this.data.get('possibleUserSteps');
		if (possibleUserSteps <= 0) {
			return;
		}
		this.userCell.setColor(newColor);
		this.data.set('possibleUserSteps', this.data.get('possibleUserSteps') -1);


		this.setColorButtonUnpressed(prevColor);
		this.setColorButtonPressed(newColor);
	}

	setColorButtonUnpressed(color?: COLOR) {
		switch(color) {
			case COLOR.ORANGE:
				this.orangeButton.play('orangeButtonOff');
				break;
			case COLOR.GREEN:
				this.greenButton.play('greenButtonOff');
				break;
			case COLOR.BLUE:
				this.blueButton.play('blueButtonOff');
				break;
			case COLOR.RED:
				this.redButton.play('redButtonOff');
				break;
			default:
				this.orangeButton.play('orangeButtonOff');
				this.greenButton.play('greenButtonOff');
				this.blueButton.play('blueButtonOff');
				this.redButton.play('redButtonOff');
		}
	}

	setColorButtonPressed(newColor) {
		switch(newColor) {
			case COLOR.ORANGE:
				this.orangeButton.play('orangeButtonOn');
				break;
			case COLOR.GREEN:
				this.greenButton.play('greenButtonOn');
				break;
			case COLOR.BLUE:
				this.blueButton.play('blueButtonOn');
				break;
			case COLOR.RED:
				this.redButton.play('redButtonOn');
				break;
		}
	}

	incConqueredCellsCount() {
		this.data.inc('conqueredCellsCount');
	}
}
