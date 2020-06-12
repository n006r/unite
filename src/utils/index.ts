/*
    Генератор уровней.
    Скопировать и вставить на новой странице, чтобы получить новый уровень
*/

const rowsAmount = 13;
const columnsAmount = 13;

export enum COLOR {
    ORANGE = 'ORANGE',
    BLUE = 'BLUE',
    GREEN = 'GREEN',
    RED = 'RED',
};

const CELL_COLOR = {
	[COLOR.ORANGE]: 'orangeSq68x68Illustr',
	[COLOR.BLUE]: 'blueSq68x68Illustr',
	[COLOR.GREEN]: 'greenSq68x68Illustr',
	[COLOR.RED]: 'redSq68x68Illustr',
}

let COLOR_BY_TEXTURE_KEY = {};

Object.keys(CELL_COLOR).forEach(color => {
    const textureKey = CELL_COLOR[color];
    COLOR_BY_TEXTURE_KEY[textureKey] = color;
})

export const getColorByTextureKey = (key) => COLOR_BY_TEXTURE_KEY[key];

export const getColorTextureKeyByColor = color => CELL_COLOR[color];

export const getRandomColor = (): COLOR => {
    const colors = Object.values(COLOR);
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// const getLevel = () => {
//     const grid = [];
// 	for (let row = 0; row < rowsAmount; row++) {
// 		grid [row] = [];
// 		for (let column = 0; column < columnsAmount; column++) {
// 			const cell = {color: getRandomColor()};
// 			grid[row][column] = cell;
// 		}
//     }
//     const r = {
//         minSteps: [],
//         grid,
//     };
//     // return JSON.stringify(r); 
//     return r;
// }
