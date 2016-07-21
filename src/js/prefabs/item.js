export default class Item extends Phaser.Sprite {
    constructor({game, x, y, item}) {
        super(game, x, y, item.image);
        this.world.x = 512;
        this.world.y = 300;
        this.item = item;
        this.name = item.text;
        this.hidden = false;
        this.tweenArray = [];
        this.oldX = x;
        this.oldY = y;

        if (otsimo.kv.game.add_outline) {
            var oimg = item.outline || otsimo.kv.game.outline_image;
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
        this.game.sound.play(this.item.audio);
    }

    playQuestion() {
        if (typeof this.item.question !== "undefined") {
            this.game.sound.play(this.item.question);
        }
    }

    highlight() {
        let dur = 150;
        let ns = this.scale.x * 1.2;
        otsimo.game.add.tween(this.scale).to({ x: ns, y: ns }, dur, Phaser.Easing.Back.Out, true);
    }

}
