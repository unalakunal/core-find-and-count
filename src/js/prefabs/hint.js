export default class Hint {
    constructor({game, answer}) {
        this.game = game;
        this.answer = answer;
        this.arrow = undefined;
        this.tweenArr = [];
        this.step = 0;
    }

    call(delay) {
        if (!otsimo.settings.show_hint) {
            return;
        }
        console.log("answer: ", this.answer);
        console.log("hint called");
        this.removeTimer();
        switch (otsimo.kv.game.hint_type) {
            case ("jump"):
                this.timer = setTimeout(this.jump.bind(this), delay + (otsimo.settings.hint_duration * 1000));
                break;
            case ("hand"):
                this.timer = setTimeout(this.hand.bind(this), delay + (otsimo.settings.hint_duration * 1000));
                break;
            default:
                this.timer = setTimeout(this.jump.bind(this), delay + (otsimo.settings.hint_duration * 1000));
                break;
        }
    }

    kill() {
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
    }

    incrementStep() {
        this.step++;
    }

    hand() {
        console.log("this: ", this);
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
        this.arrow.anchor.set(-0.1, -0.5);
        console.log("arrow: ", this.arrow);
        console.log("answer: ", this.answer);
        console.log("hint_hand_duration test", otsimo.kv.game.hint_hand_duration);
        let t = otsimo.game.add.tween(this.arrow.scale).to({ x: 0.66, y: 0.66 }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Cubic.Out, false);
        let t2 = otsimo.game.add.tween(this.arrow)
            .to({ y: this.answer.y, x: this.answer.x }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Sinusoidal.In, false);
        let t3 = otsimo.game.add.tween(this.arrow.scale).to({ x: 0.8, y: 0.8}, otsimo.kv.game.hint_hand_duration/8, Phaser.Easing.Cubic.In, false);
        this.arrow.anchor.set(-0.3, -0.5);
        t.chain(t3);
        t.start();
        t2.start();
        /*if (this.step < 3) {
            t2.onComplete.add(this.kill, this);
        }*/
        let delay = 2 * otsimo.kv.game.hint_hand_duration;
        this.call(delay);
        this.answer.tweenArray = this.tweenArr;
    }

    jump() {

    }
}
