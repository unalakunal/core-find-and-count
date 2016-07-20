import Balloon from '../prefabs/balloon'

export default class Home extends Phaser.State {

    create() {
        //let music = this.game.add.audio('welcome');
        //music.play();

        this.game.add.button((this.game.width) * 0.37, (this.game.height) * 0.47, 'playButton', this.playAction, this, 2, 1, 0);
        this.game.add.button(25, 25, 'back', this.quitGame, this);

        if (otsimo.currentMusic) {
            console.log("game has a currentmusic");
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
        this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    }
}





