import Phaser from 'phaser';

export default class Scores extends Phaser.GameObjects.DOMElement {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.createFromHTML('<div class="text count"></div>');
        this.setOrigin(0, 0);
    }
}
