import Session from '../session'
import Scene from '../scene'
import Balloon from '../prefabs/balloon'

export default class Play extends Phaser.State {
    create() {
        let session = new Session({ game: this.game, state: this });
        let scene = new Scene({game: this.game, session: session, score: session.score });
        if (otsimo.kv.background_image) {
            let back = this.game.add.image(this.game.world.centerX, this.game.world.centerY, otsimo.kv.background_image)
            back.anchor.set(0.5, 0.5);
        }
        this.session = session
        this.scene = scene

        this.game.add.button(otsimo.game.width * 0.02, otsimo.game.height * 0.022, 'back', this.backAction, this);
        scene.init(0);
    }

    backAction(button) {
        this.scene.hint.kill();
        this.scene.hint.removeTimer();     
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
