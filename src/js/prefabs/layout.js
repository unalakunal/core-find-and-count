import Item from "./item"
import Number from "./number"

/**
 * Creates a new Layout object with specifying the answers, questions and if it's a staged game.
 * Layout class is not aware of item and number difference. It just knows answers and questions.
 * Everything on gameplay screen is inside a layout object, which consists of items or numbers. It derives from Phaser.Group object.
 * 
 * @class Layout
 * @constructor
 * @param {object} [game] - The game which the layout object belongs to.
 * @param {boolean} [staged] - A staged game contains two types of on screen data: answers and questions.
 *                             If a game is not staged, there are only interactive objects (answers) on the screen.
 * @param {list} [answers] - The list of answer sprites. Answers are input enabled.
 * @param {list} [questions] - The list of question sprites. Questions can not be touched or dragged.
 */

export default class Layout extends Phaser.Group {
    constructor({game, staged, answers, questions}) {
        super(game);
        /**
         * @property {boolean} [staged] - A staged game contains two types of on screen data: answers and questions.
         *                              If a game is not staged, there are only interactive objects (answers) on the screen.
         */
        this.staged = staged;

        /**
         * @property {Phaser.Signal} [itemSelected] - The signal input for answers on the layout.
         */
        this.itemSelected = new Phaser.Signal();

        /**
         * @property {list} [answers] - The list of answer sprites. Answers are input enabled.
         */
        this.answers = answers;

        /**
         * @property {list} [questions] - The list of question sprites. Questions can not be touched or dragged.
         */
        this.questions = questions;

        console.log("layout.questions: ", questions);
        this.init();
    }

    /**
     * Initializes the layout object, creates hidden and visible position values to be used in scene announce.
     * Decides the layout type according to the staged choice.
     * 
     * @method Layout.init
     */
    init() {
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

    /**
     * Calls the proper functions for staged games.
     * 
     * @method Layout.layoutBoth
     */
    layoutBoth() {
        // background platform arrives
        this.setBackground();
        // questions reach above
        this.layoutQuestions();
        // answers come below
        this.layoutAnswers();
    }

    /**
     * Sets background for staged games to display and highlight questions.
     * 
     * @method Layout.setBackground
     * @return {Phaser.Image} [image] - Phaser image of background.
     */
    setBackground() {
        console.log("background set, pass for now");
        // TODO: return background object
    }

    /**
     * Adds questions to layout. Creates each question as a number or item.
     * Specifies their coordinates and scale values according to their number.
     * 
     * @method Layout.layoutQuestions
     */
    layoutQuestions() {
        // TODO: question can be a number
        // TODO: problems with 3,4,5 number of items
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
        let avl_width = otsimo.game.width * (1 - otsimo.kv.layout.side_space_constant_question * 2);
        console.log("avl_width: ", avl_width);
        let total_height = this.items[0].height * 2;
        console.log("total_height: ", total_height);
        let avl_height = otsimo.kv.layout.bar_length_constant * otsimo.game.height;
        for (let i = 0; i < len; i++) {
            let item = this.items[i];
            let sc = 0.4;
            let xk = otsimo.kv.layout.side_space_constant_question;
            let yk = otsimo.kv.layout.above_space * 1.5;
            if (total_width * 0.6 > avl_width) {
                console.log("can't fit in av_space");
                let width_ratio = (avl_width / total_width);
                if (width_ratio < 0.45) {
                    sc = width_ratio;
                }
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
            console.log("sc constant: ", sc);
            item.scale.x = sc;
            item.scale.y = sc;
            item.anchor.set(0.5, 0.5);
            this.add(item);
        }
    }

    layoutAnswers() {
        // question and answer exist both
        let len = this.answers.length;
        console.log("this.answer in layout object: ", this.answers);
        if (len == 0) {
            console.log("there are no answers to bind with layout object");
        }
        // TODO: avl_width might be unnecessary
        let avl_width = otsimo.game.width * (1 - otsimo.kv.layout.side_space_constant_answer * 2);
        let yk = otsimo.kv.layout.answer_y_constant * otsimo.game.height;
        let center = otsimo.game.world.centerX;
        if (len % 2 == 0) {
            // if there are even number of objects, put one of them left, one of them right of the center with a width/2 distance.
            for (let i = 0; i < 2; i++) {
                let num = new Number({
                    game: otsimo.game,
                    x: this.hiddenPos.x,
                    y: this.hiddenPos.y,
                    num: this.answers[i],
                    scale: {
                        x: 0.8,
                        y: 0.8
                    }
                });
                let xk = center + num.width + item.width * 0.5;
                if (i % 2 == 0) {
                    xk = center - num.width item.width * 0.5;
                }
                console.log("answer xk: ", xk);
                num.anchor.set(0.5, 0.5);
                num.x = xk;
                num.y = yk;
                this.add(num);
            }
        } else {
            // if there are odd number of objects, put one in the center.
            let num = new Number({
                game: otsimo.game,
                x: this.hiddenPos.x,
                y: this.hiddenPos.y,
                num: this.answers[0],
                scale: {
                    x: 0.8,
                    y: 0.8
                }
            });
            num.anchor.set(0.5, 0.5);
            console.log("answer xk: ", center);
            num.x = center + item.width * 0.5;
            num.y = yk;
            this.add(num);
        }
        // Update the leftmost and rightmost.
        //TODO: the difference from left and right has to be the same
        //TODO: the difference (x coordinate) between the items has to be the same
        // Then place one left and one right.
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