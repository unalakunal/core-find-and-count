export default class Number extends Phaser.Sprite {
    constructor({game, x, y, num, scale}) {
        super(game, x, y, num.image);
        this.x = x;
        this.y = y;
        this.num = num;
        this.name = num.text;
        this.hidden = false;
        this.scale.x = scale.x;
        this.scale.y = scale.y;
    }

    playSound() {
        console.log("playsound");
        this.game.sound.play(this.num.audio);
    }

    playQuestion() {
        if (typeof this.num.question !== "undefined") {
            this.game.sound.play(this.num.question);
        }
    }

    highlight() {
        let dur = 150;
        let ns = this.scale.x * 1.2;
        otsimo.game.add.tween(this.scale).to({ x: ns, y: ns }, dur, Phaser.Easing.Exponential.Out, true);
        return dur;
    }

    correct({slot, layout, delay}) {
        if (otsimo.kv.game.type == "find_next") {
            this.parent = layout.tapeParent;
            let yk = this.height * 0.5
            this.y = this.y - yk;
            let durJumpUp = 500;
            let durJumpDown = 500;
            let durMove = 500;
            let oldY = this.y;
            let t1 = otsimo.game.add.tween(this).to({ y: oldY - yk }, durJumpUp, Phaser.Easing.Cubic.Out, false, delay);
            let t2 = otsimo.game.add.tween(this).to({ y: oldY }, durJumpDown, Phaser.Easing.Cubic.Out, false);
            let t3 = otsimo.game.add.tween(this).to({ x: slot.x, y: slot.y }, durMove, Phaser.Easing.Cubic.Out, false);
            t1.chain(t2.chain(t3));
            t1.start();
            return (durJumpUp + durJumpDown + durMove) * 1.5;
        } else {
            return delay + 1000;
        }
    }
}
