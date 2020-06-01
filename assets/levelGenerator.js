const rowsAmount = 13;
const columnsAmount = 13;

// const COLORS = {
//     ORANGE: 'ORANGE',
//     BLUE: 'BLUE',
//     GREEN: 'GREEN',
//     RED: 'RED',
// }

// const CELL_COLOR = {
// 	ORANGE: 'orangeSq68px',
// 	BLUE: 'blueSq68px',
// 	GREEN: 'greenSq68px',
// 	RED: 'redSq68px',
// }

// let COLOR_BY_TEXTURE_KEY = {};

// Object.keys(CELL_COLOR).forEach(color => {
//     const textureKey = CELL_COLOR[color];
//     COLOR_BY_TEXTURE_KEY[textureKey] = color;
// })

// const getColorByTextureKey = (key) => COLOR_BY_TEXTURE_KEY[key];

// const getColorTextureKeyByColor = color => CELL_COLOR[color];

// const getRandomColor = () => {
//     const colors = Object.keys(CELL_COLOR);
//     const randomIndex = Math.floor(Math.random() * colors.length);
//     return colors[randomIndex];
// }

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

// document.body.innerText = JSON.stringify(getLevel());
