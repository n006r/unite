
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1080,
		height: 1920,
		type: Phaser.AUTO,
        backgroundColor: "#ececec",
		scale: {
			parent: 'game',
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: 1080,
			height: 1920,
		},
		parent: 'game',
		dom: {
			createContainer: true
		}
	});
	
	game.scene.add("Boot", Boot, true);

});

// массив успешных запусков. Хранит в себе последовательности цветов ведущих к победе
const RUNS = [];
// массив неудачный последовательностей.
const unsuccessfullRuns = [];

// сохранённый уровень
let SAVED_LEVEL = undefined;

const AUTOPLAY = false;

const autoPlay = (Level) => {
	console.log('RUNS is', RUNS);
	const minSteps = RUNS.reduce((min, run) => {
		if (run.length < min) {
			return run.length;
		}
		return min;
	}, 10000);

	console.log('minSteps is ', minSteps);

	const getSteps = (stepsCount) => {
		const steps = [getRandomColor()];
		for (let i = 0; i < stepsCount; i++) {
			let color;
			do {
				color = getRandomColor();
			} while (color === steps[steps.length -1]);
			steps.push(color);
		}
		return steps;
	}
	let steps = [];
	do {
		steps = getSteps(minSteps);
		console.log('generate steps');
		console.log('steps are ', steps.join(''));
		console.log('unsuccessfullRuns are ', unsuccessfullRuns);
	} while(unsuccessfullRuns.includes(steps.join('')))

	let step = 0;
	const autoUserStep = () => {
		if (step >= steps.length) {
			console.log('последовательность цветов больше минимальной');
			unsuccessfullRuns.push(steps.join(''));
			// Level.scene.restart();
			Level.applyMap();
			return;
		}
		if (Level.data.get('conqueredCellsCount') === Level.cellGrid.getData('cellsAmount')) {
			console.log('поле захвачено за ', step, ' шагов');
			console.log(steps.slice(0, step));
			RUNS.push(steps.slice(0, step));
			setTimeout(() => {
				// Level.scene.restart();
				Level.applyMap();
			}, 1000)
		} else {
			steps[step];
			const availableColors = Level.cellGrid.list.reduce((colors, cell) => {
				const cellColor = cell.getData('color');
				if (!colors.includes(cellColor)) {
					return ([...colors, cellColor]);
				}
				return colors;
			}, []);
			console.log('availableColors are ', availableColors);
			if (!availableColors.includes(steps[step])) {
				do {
					steps[step] = availableColors[Math.floor(Math.random() * availableColors.length)]
				} while(steps[step] === steps[step -1])
			}
			Level.userCell.setColor(steps[step]);
			step += 1;
			setTimeout(autoUserStep, 3000);
		}
	};

	setTimeout(autoUserStep, 2000);
}

const onGameCreate = (Level) => {
	if (AUTOPLAY) {
		autoPlay(Level);
	}
}



class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/asset-pack.json");
	}

	create() {
		this.registry.set('map', 0);
		this.scene.start("Level");
		// console.log('LEVEL SCENE IS ', this.scene.get('Level'));
		// this.scene.get('Level').events.on('create', onGameCreate)
		this.scene.get('Level').events.on('mapApplied', onGameCreate);
	}

}
