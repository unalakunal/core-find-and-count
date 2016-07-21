import Item from "./item"
import Number from "./number"

export default class Layout extends Phaser.Group {
    constructor({game, staged, answers, questions}) {
        super(game);
        this.staged = staged;
        this.itemSelected = new Phaser.Signal();
        this.answers = answers;
        this.questions = questions;
        console.log("layout.questions: ", questions);
        this.layout();
    }

    layout() {
        this.hiddenPos = {
            x: otsimo.kv.game.hidden_pos.x * otsimo.game.width,
            //y: (otsimo.game.height + maxHeight),
            y: otsimo.kv.game.hidden_pos.y * otsimo.game.height
        }

        this.visiblePos = {
            x: otsimo.kv.game.visible_pos.x * otsimo.game.width,
            y: otsimo.kv.game.visible_pos.y * otsimo.game.height
        }

        if (this.staged) {
            this.layoutBoth();
        } else {
            this.layoutOnce();
        }
    }

    layoutBoth() {
        // background platform arrives
        this.setBackGround();
        // questions reach above
        this.layoutQuestions();
        // answers come below
        this.layoutAnswers();
    }

    setBackGround() {
        console.log("background set, pass for now");
    }

    layoutQuestions() {
        // question and answer exist seperately
        let len = this.questions.length;
        this.items = [];
        for (let i = 0; i < len; i++) {
            let item = new Item({
                game: otsimo.game,
                x: this.hiddenPos.x,
                y: this.hiddenPos.y,
                item: this.questions[i],
                scale: {
                    x: 1,
                    y: 1
                }
            });
            this.items.push(item);
            console.log("item.width", item.width, "item.height: ", item.height);
        }
        let total_width = this.items[0].width * len;
        console.log("total_width: ", total_width);
        let avl_width = otsimo.game.width * (1 - otsimo.kv.layout.side_space_constant * 2);
        console.log("avl_width: ", avl_width);
        let total_height = this.items[0].height * 2;
        console.log("total_height: ", total_height);
        let avl_height = otsimo.kv.layout.bar_length_constant * otsimo.game.height;
        for (let i = 0; i < len; i++) {
            let item = this.items[i];
            let sc = 0.4;
            let xk = otsimo.kv.layout.side_space_constant;
            let yk = otsimo.kv.layout.above_space * 1.5;
            if (total_width * 0.6 > avl_width) {
                console.log("can't fit in av_space")
                sc = (avl_width / total_width);
                let inc_x = (item.width * sc) / otsimo.game.width;
                xk = xk + inc_x * i;
                if (i % 2 == 1) {
                    let inc_y = (item.height * (avl_height / total_height)) / otsimo.game.height;
                    yk = yk + inc_y;
                }
            } else {
                yk = yk + 0.05;
                if (len % 2 == 0) {
                    xk = (avl_width / otsimo.game.width) * 0.5 * (i + 1);
                } else {
                    xk = xk + 0.25 * ((i + 1) % 2) * ((i + 2) * 0.5);
                }
            }
            console.log("xk: ", xk, "yk: ", yk);
            item.x = xk * otsimo.game.width;
            item.y = yk * otsimo.game.height;
            item.scale.x = sc;
            item.scale.y = sc;
            item.anchor.set(0.5, 0.5);
            this.add(item);
        }
    }

    layoutAnswers() {
        // question and answer exist both
        //TODO: remember to add clicklistener to every one of them
        console.log("layout answers: ", this.answers);
    }

    layoutOnce() {
        // questions are also answers
    }

    move(x, y, duration) {
        let t = otsimo.game.add.tween(this)
            .to({ x: x, y: y }, duration, Phaser.Easing.Back.Out);
        t.start();
    }

    relayout() {

    }

    moveOutItem() {

    }

    hideItem() {

    }

    clickListener(sig) {
        if (this.item.hidden) {
            return;
        }
        console.log("clicked to: ", sig);
    }

}