import Phaser from 'phaser';

export default class Steps extends Phaser.GameObjects.DOMElement {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.createFromHTML('<div class="text possibleUserSteps"></div>');
    }
}
