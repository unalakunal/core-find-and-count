export default class Hint {
    constructor({game, answer, score}) {
        this.game = game;
        this.answer = answer;
        this.score = score;
        this.arrow = undefined;
        this.tweenArr = [];
        this.step = 0;
    }

    call(delay) {
        if (!otsimo.settings.show_hint) {
            return;
        }
        console.log("hint called with answer: ", this.answer);
        this.removeTimer();
        this.timer = setTimeout(this.create.bind(this), delay + (otsimo.settings.hint_duration * 1000));
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
        this.arrow.anchor.set(-0.1, -0.5);
        let t = otsimo.game.add.tween(this.arrow.scale).to({ x: 0.66, y: 0.66 }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Back.Out, false);
        let t2 = otsimo.game.add.tween(this.arrow)
            .to({ y: this.answer.y, x: this.answer.x }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Sinusoidal.In, false);
        this.arrow.anchor.set(-0.3, -0.5);
        t.start();
        t2.start();
        if (this.step < 3) {
            t2.onComplete.add(this.kill, this);
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
