export default class Number extends Phaser.Sprite {
    constructor({game, x, y, num, scale}) {
        super(game, x, y, num.image);
        this.world.x = x;
        this.world.y = y;
        this.num = num;
        this.name = num.text;
        this.hidden = false;
        this.tweenArray = [];
        this.oldX = x;
        this.oldY = y;
        this.scale.x = scale.x;
        this.scale.y = scale.y;
        this.hidden = false;

        if (otsimo.kv.game.add_outline) {
            var oimg = num.outline || otsimo.kv.game.outline_image;
            let out = new Phaser.Sprite(game, 0, 0, oimg)
            out.anchor.set(0.5, 0.5);
            out.z = -5;
            this.addChild(out);
            this.outline = out;
            this.has_outline = true;
        } else {
            this.has_outline = false;
        }
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
        console.log("highlight");
        let dur = 150;
        let ns = this.scale.x * 1.2;
        otsimo.game.add.tween(this.scale).to({ x: ns, y: ns }, dur, Phaser.Easing.Back.Out, true);
    }
}
