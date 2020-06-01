
// You can write more code here

/* START OF COMPILED CODE */

class CellGrid extends Phaser.GameObjects.Container {
	
	constructor(scene, x, y) {
		super(scene, x, y);
		
		
		// fields
		this.cellTextrures = [];
		this.grid = [];
		
		this.init();
		
	}
	
	/* START-USER-CODE */

	// Write your code here.
	init() {
		this.setData('cellsAmount', 0);
		const grid = this.grid;
		for (let row = 0; row < rowsAmount; row++) {
			grid [row] = [];
			for (let column = 0; column < columnsAmount; column++) {
				const x = row * (68 + 7);
				const y = column * (68 + 7);
				const cell = new Cell(this.scene, x, y, getColorTextureKeyByColor(getRandomColor()));
				this.add(cell);
				grid[row][column] = cell;
				this.incData('cellsAmount');
			}
		}

		for (let row = 0; row < rowsAmount; row++) {
			for (let column = 0; column < columnsAmount; column++) {
				const cell = grid[row][column];
				if (row > 0) {
					cell.neighbors.push(grid[row - 1][column]);
				}
				if (column < columnsAmount - 1) {
					cell.neighbors.push(grid[row][column + 1]);
				}
				if (row < rowsAmount - 1) {
					cell.neighbors.push(grid[row + 1][column]);
				}
				if (column > 0) {
					cell.neighbors.push(grid[row][column - 1]);
				}
			}
		}

		this.userCell = grid[Math.floor(rowsAmount / 2)][Math.floor(columnsAmount / 2)];

		// setTimeout(() => {
		// 	this.userCell.setConquered();
		// }, 0);
	}

	loadLevel(level) {
		const grid = this.grid;
		for (let row = 0; row < rowsAmount; row++) {
			for (let column = 0; column < columnsAmount; column++) {
				// const x = row * (68 + 7);
				// const y = column * (68 + 7);
				// const cell = new Cell(this.scene, x, y, getColorTextureKeyByColor(level.grid[row][column].color));
				// this.add(cell);
				grid[row][column].setData('color', level.grid[row][column].color);
				grid[row][column].setData('isConquered', false);
				// this.incData('cellsAmount');
				
			}
		}

		// setTimeout(() => {
		// 	this.userCell.setConquered();
		// }, 0);
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
