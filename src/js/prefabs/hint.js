import {randomColor} from "../randomColor"

export default class Hint {
    constructor({game, answer, score}) {
        this.game = game;
        this.answer = answer;
        this.score = score;
        this.arrow = undefined;
        this.tweenArr = [];
        this.timerArr = [];
        this.step = 0;
    }

    color() {
        this.arrow.tint = otsimo.kv.game.hint_color;
    }

    call(delay) {
        if (!otsimo.settings.show_hint) {
            return;
        }
        console.log("hint called with answer: ", this.answer);
        this.removeTimer();
        this.timer = setTimeout(this.create.bind(this), delay + (otsimo.settings.hint_duration * 1000));
        this.timerArr.push(this.timer);
    }

    create() {
        this.score.decrement();
        switch (otsimo.kv.game.hint_type) {
            case ("jump"):
                this.jump();
                break;
            case ("hand"):
                this.hand();
                break;
            default:
                this.hand();
                break;
        }
    }

    kill() {
        console.log("hint killed");
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
        if (this.timer) {
            console.log("clearing timeout");
            clearTimeout(this.timer);
            this.timer = undefined;
        }
        for (let i of this.timerArr) {
            clearTimeout(i);
        }
    }

    incrementStep() {
        this.step++;
    }

    hand() {
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
        this.color();
        this.arrow.anchor.set(0.4, 0);
        let t = otsimo.game.add.tween(this.arrow.scale).to({ x: 0.66, y: 0.66 }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Cubic.Out, false);
        let t2 = otsimo.game.add.tween(this.arrow)
            .to({ y: this.answer.y, x: this.answer.x }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Sinusoidal.In, false);
        let t3 = otsimo.game.add.tween(this.arrow.scale).to({ x: 0.75, y: 0.75 }, otsimo.kv.game.hint_hand_duration * 0.5, Phaser.Easing.Cubic.Out, false, 50);
        //this.arrow.anchor.set(-0.3, -0.5);
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

    jump() {
        // TODO 
    }

    killArrow() {
        if (this.arrow) {
            this.arrow.kill();
            this.arrow = undefined;
        }
    }
}
