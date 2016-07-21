import Session from '../session'
import Scene from '../scene'
import Balloon from '../prefabs/balloon'

export default class Play extends Phaser.State {
    create() {
        let session = new Session({ state: this });
        let scene = new Scene({ session: session });

        this.session = session
        this.scene = scene

        this.game.add.button(25, 25, 'back', this.backAction, this);
        scene.init();
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
