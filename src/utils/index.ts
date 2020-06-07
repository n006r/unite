/*
    Генератор уровней.
    Скопировать и вставить на новой странице, чтобы получить новый уровень
*/

const rowsAmount = 13;
const columnsAmount = 13;

export const COLORS = {
    ORANGE: 'ORANGE',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    RED: 'RED',
}

const CELL_COLOR = {
    // ORANGE: 'orangeSq68x73',
	// BLUE: 'blueSq68x73',
	// GREEN: 'greenSq68x73',
	// RED: 'redSq68x73',
	ORANGE: 'orangeSq68x68Illustr',
	BLUE: 'blueSq68x68Illustr',
	GREEN: 'greenSq68x68Illustr',
	RED: 'redSq68x68Illustr',
}

let COLOR_BY_TEXTURE_KEY = {};

Object.keys(CELL_COLOR).forEach(color => {
    const textureKey = CELL_COLOR[color];
    COLOR_BY_TEXTURE_KEY[textureKey] = color;
})

export const getColorByTextureKey = (key) => COLOR_BY_TEXTURE_KEY[key];

export const getColorTextureKeyByColor = color => CELL_COLOR[color];

export const getRandomColor = () => {
    const colors = Object.keys(CELL_COLOR);
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const getLevel = () => {
    const grid = [];
	for (let row = 0; row < rowsAmount; row++) {
		grid [row] = [];
		for (let column = 0; column < columnsAmount; column++) {
			const cell = {color: getRandomColor()};
			grid[row][column] = cell;
		}
    }
    const r = {
        minSteps: [],
        grid,
    };
    // return JSON.stringify(r); 
    return r;
}
