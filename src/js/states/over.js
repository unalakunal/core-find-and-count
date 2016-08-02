import Balloon from '../prefabs/balloon'

export default class Over extends Phaser.State {
    create() {
        this.game.add.button((this.game.width) * 0.37, (this.game.height) * 0.47, 'playButton', this.playAction, this, 2, 1, 0);
        this.game.add.button(25, 25, 'back', this.backAction, this);
        Balloon.random();
        let applause = this.game.add.sound("applause", 1, false);
        applause.play();
        let congrats = this.game.add.sound("congratulations", 1, false);
        congrats.play();
    }

    playAction(button) {
        this.game.state.start('Play');
    }

    backAction(button) {
        this.game.state.start('Home');
    }
}