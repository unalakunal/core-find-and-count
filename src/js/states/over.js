import Balloon from '../prefabs/balloon'
import { calculateConstraint } from '../utils'

class BalloonCounter {
    constructor() {
        this.counter = 0;
    }

    /**
     * add balloon pop
     * @param {number} amount
     * @memberOf BalloonCounter
     */
    add(amount) {
        this.counter += amount;
    }

    /**
     * send to server
     * @memberOf BalloonCounter
     */
    send() {
        otsimo.customevent('game:balloon:pop', { amount: this.counter })
    }
}

export default class Over extends Phaser.State {

    create() {

        if (otsimo.currentMusic) {
            otsimo.currentMusic.volume = otsimo.kv.game_music.volume_over_screen;
        }
        if (otsimo.kv.background_image) {
            let back = this.game.add.image(this.game.world.centerX, this.game.world.centerY, otsimo.kv.background_image)
            back.anchor.set(0.5, 0.5);
        }
        this.game.add.button(25, 35, 'back', this.backAction, this);

        //calculate text and button 
        let tc = calculateConstraint(otsimo.kv.ending_scene.text);
        let bc = calculateConstraint(otsimo.kv.ending_scene.button);

        //add button
        let btn = this.game.add.button(bc.x, otsimo.game.height + 200, otsimo.kv.ending_scene.button.image || 'playButton', this.playAction, this, 2, 1, 0);
        btn.anchor.set(bc.anchor.x, bc.anchor.y)
        btn.alpha = 0


        //add text
        let text = otsimo.game.add.text(tc.x, tc.y - 100, otsimo.kv.ending_scene.text.text, otsimo.kv.ending_scene.text.style);
        text.anchor.set(tc.anchor.x, tc.anchor.y);
        text.alpha = 0

        let dur = otsimo.kv.ending_scene.duration;
        let delay = otsimo.kv.ending_scene.button.delay;
        //enter text
        let t1 = otsimo.game.add.tween(text)
            .to({ y: tc.y + 100 }, dur, Phaser.Easing.Exponential.Out, false);

        otsimo.game.add.tween(text)
            .to({ alpha: 1 }, dur / 3, Phaser.Easing.Exponential.Out, true);


        let t2 = otsimo.game.add.tween(text)
            .to({ y: tc.y }, dur * 0.8, Phaser.Easing.Exponential.Out, false, (delay + dur * 0.2) - dur);

        //start tween
        t1.chain(t2)
        t1.start();

        //enter button tween
        otsimo.game.add.tween(btn)
            .to({ y: bc.y }, dur, Phaser.Easing.Exponential.Out, true, delay);

        otsimo.game.add.tween(btn)
            .to({ alpha: 1 }, dur / 3, Phaser.Easing.Exponential.Out, true, delay);


        //text sound
        setTimeout(() => {
            let cong = this.game.add.audio(otsimo.kv.ending_scene.victory_sound);
            cong.play();
        }, dur / 2);

        //finish sound
        let fin = this.game.add.audio(otsimo.kv.ending_scene.finish_sound);
        fin.play();

        this.counter = new BalloonCounter();
        this.balloons = Balloon.random(this.counter);
        this.payloadSent = false;       // checks whether the balloon payload is sent or not
    }

    update() {
        if (this.payloadSent) {
            return
        }
        if (!(Balloon.balloonsActive(this.balloons))) {
            this.payloadSent = true;
            this.counter.send();
        }
    }

    playAction() {
        if (otsimo.clickSound) {
            otsimo.clickSound.play()
        }
        // Jic that the user doesn't wait for all the balloons to pass by the screen.
        if (!this.payloadSent) {
            this.payloadSent = true;
            this.counter.send();
        }
        this.game.state.start('Play');
    }

    backAction() {
        if (otsimo.clickSound) {
            otsimo.clickSound.play()
        }
        // Jic that the user doesn't wait for all the balloons to pass by the screen.        
        if (!this.payloadSent) {
            this.payloadSent = true;
            this.counter.send();
        }
        this.game.state.start('Home');
    }

}