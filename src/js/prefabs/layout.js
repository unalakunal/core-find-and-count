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
        let item = new Item({
            game: otsimo.game,
            x: otsimo.game.width * 0.35,
            y: otsimo.kv.game.bar_space_above * otsimo.game.height,
            item: this.questions[0],
            scale: {
                x: 0.3,
                y: 0.3
            }
        });
        for (let i = 0; i < this.questions.length; i++) {
            //TODO: layout each of it
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