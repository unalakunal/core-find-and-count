import Session from '../session'
import Balloon from '../prefabs/balloon'

export default class Play extends Phaser.State {
    create() {
        let session = new Session({ state: this });
        this.session = session
        
        this.game.add.button(25, 25, 'back', this.backAction, this);
        Balloon.random()

        let self = this
        setTimeout(function() {
            self.sceneEnded();
        }, 2000);
    }

    backAction(button) {
        this.game.state.start('Home');
    }

    render() {
        if (otsimo.debug) {
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
            this.session.debug(this.game);
        }
    }

    sceneEnded() {
        this.session.end();
        this.game.state.start('Over');
    }
}
