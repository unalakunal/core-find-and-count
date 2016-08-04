import Balloon from '../prefabs/balloon'
import {gameVisibleName, calculateConstraint} from '../utils'


export default class Home extends Phaser.State {

    create() {
        if (otsimo.kv.home_background_color) {
            this.game.stage.backgroundColor = otsimo.kv.home_background_color;
            console.log("asd: ", otsimo.kv.home_background_color);
        }
        if (otsimo.kv.background_image) {
            let back = this.game.add.image(this.game.world.centerX, this.game.world.centerY, otsimo.kv.background_image)
            console.log("asd: ", otsimo.kv.background_image);            
            back.anchor.set(0.5, 0.5);
        }

        let cp = calculateConstraint(otsimo.kv.homePlayButton || defaultPlayButton);
        let home = this.game.add.button(cp.x, cp.y, 'playButton', this.playAction, this, 2, 1, 0);
        home.anchor.set(cp.anchor.x, cp.anchor.y);

        let back = this.game.add.button(otsimo.game.width * 0.02, otsimo.game.height * 0.022, 'back', this.quitGame, this);
        back.anchor.set(0, 0);

        let vn = gameVisibleName();
        let q = calculateConstraint(otsimo.kv.gameNameLayout);
        let text = otsimo.game.add.text(q.x, q.y, vn, otsimo.kv.gameNameTextStyle);
        text.anchor.set(q.anchor.x, q.anchor.y);

        if (otsimo.kv.name_shadow) {
            text.setShadow(otsimo.kv.name_shadow.x, otsimo.kv.name_shadow.y, otsimo.kv.name_shadow.color, otsimo.kv.name_shadow.blur, true, false);
        }

        if (otsimo.currentMusic) {
            otsimo.currentMusic.volume = otsimo.kv.game_music.volume_home_screen;
        }

    }

    playAction(button) {
        if (otsimo.clickSound) {
            otsimo.clickSound.play();
        }
        this.game.state.start('Play');
    }

    quitGame() {
        if (otsimo.clickSound) {
            otsimo.clickSound.play()
        }
        otsimo.quitgame();
    }

    render() {
        if (otsimo.debug) {
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
        }
    }
}





