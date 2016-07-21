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
            x: otsimo.game.world.centerX,
            //y: (otsimo.game.height + maxHeight),
            y: otsimo.game.height * 1.5
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
                item: this.questions[i]
            });
            //item.worldVisible = true;
            this.items.push(item);
            console.log("item.width", item.width, "item.height: ", item.height);
        }
        let total_width = this.items[0].width * len;
        console.log("total_width: ", total_width);
        let avl_width = otsimo.game.width * (1 - otsimo.kv.layout.side_space_constant * 2);
        console.log("avl_width: ", avl_width);
        let inc_rate_x = 0.2;
        for (let i = 0; i < len; i++) {
            let item = this.items[i];
            // scale constants
            let xs = 0.3;
            let ys = 0.3;
            // position constants
            let xk = otsimo.kv.layout.side_space_constant;
            let yk = otsimo.kv.game.bar_space_above_constant * 1.2;
            if (total_width > avl_width) {
                console.log("items can't fit in av_space");
                // items can't fit in the available space
                xs = 0.3;
                ys = 0.3;
                inc_rate_x = (this.items[i].width / otsimo.game.width) * i * 0.35
                xk = xk + inc_rate_x;
                if (i % 2 == 0) {
                    let inc_rate_y = (this.items[i].height / otsimo.game.height) * 0.3;
                    yk = yk + inc_rate_y;
                }
            } else {
                xs = 0.5;
                ys = 0.5;
                console.log("items can fit in av_space")
                inc_rate_x = (this.items[i].width / otsimo.game.width) * i + 0.05
                xk = xk + (inc_rate_x);
            }
            //TODO: layout each of it, find a way to do it randomly
            console.log("before change: ", this.items[i]);
            console.log("w: ", xk * otsimo.game.width);
            console.log("h: ", yk * otsimo.game.height);
            item.x = xk * otsimo.game.width;
            item.y = yk * otsimo.game.height;
            item.scale.x = xs;
            item.scale.y = ys;
            //console.log("changed item: ", this.items[i]);
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