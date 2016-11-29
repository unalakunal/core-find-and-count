import { randomColor } from "../randomColor"

export default class Hint {
    constructor({game, answer, score}) {
        this.game = game;
        this.answer = answer;
        this.score = score;
        this.timer = undefined;
        this.arrow = undefined;
        this.timerArr = [];
        this.step = 0;
    }

    call(delay) {
        let currentState = otsimo.game.state.getCurrentState().key;        
        if (!otsimo.settings.show_hint || currentState != "Play") {
            return;
        }
        this.removeTimer();
        this.timer = otsimo.game.time.events.add(delay + (otsimo.settings.hint_duration * 1000), this.create, this);
        this.timerArr.push(this.timer);
    }

    create() {
        console.log("hint create");
        let currentState = otsimo.game.state.getCurrentState().key;
        if (currentState != "Play") {
            return;
        }
        switch (otsimo.kv.game.hint_type) {
            case ("hand"):
                this.hand();
                break;
            default:
                this.hand();
                break;
        }
    }

    kill() {
        //console.log("hint killed");
        switch (otsimo.kv.game.hint_type) {
            case ("jump"):
                this.killTweenIn();
                break;
            case ("hand"):
                this.killArrow();
                break;
            default:
                this.killArrow();
                break;
        }
    }

    removeTimer() {
        otsimo.game.time.events.stop(false);
        if (this.timer) {
            otsimo.game.time.events.remove(this.timer);
            this.timer = undefined;
        }
        otsimo.game.time.events.start();            
    }

    incrementStep() {
        this.step++;
    }

    hand() {
        this.score.decrement();        
        this.incrementStep();
        if (this.step > 3 && this.arrow) {
            return;
        }
        if (otsimo.kv.game.answer_type == "match") {
            this.handMatch();
        } else {
            this.handTween();
        }
    }

    handTween() {
        this.arrow = otsimo.game.add.sprite(this.answer.x, this.answer.y, 'hand');
        this.arrow.anchor.set(0.4, 0);
        let t = otsimo.game.add.tween(this.arrow.scale).to({ x: 0.66, y: 0.66 }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Cubic.Out, false);
        let t2 = otsimo.game.add.tween(this.arrow)
            .to({ y: this.answer.y, x: this.answer.x }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Sinusoidal.In, false);
        let t3 = otsimo.game.add.tween(this.arrow.scale).to({ x: 0.75, y: 0.75 }, otsimo.kv.game.hint_hand_duration * 0.5, Phaser.Easing.Cubic.Out, false, 50);
        t.chain(t3);
        t.start();
        t2.start();
        if (this.step < 3) {
            t3.onComplete.add(this.kill, this);
        }
        let delay = 2 * otsimo.kv.game.hint_hand_duration;
        this.call(delay);
        this.answer.tweenArray = this.tweenArr;
    }

    killArrow() {
        if (this.arrow) {
            this.arrow.kill();
            this.arrow = undefined;
        }
    }
}
