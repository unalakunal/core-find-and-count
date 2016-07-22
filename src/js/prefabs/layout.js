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
        // TODO: return background object
    }

    //TODO
    zigzag(start_x) {
        let len = this.items.length;
        let start_y = otsimo.game.height * otsimo.kv.layout.above_space;
        for (let i = 0; i < len; i++) {
            let item = this.items[i];
            let xk = start_x + item.width * i;
            let yk = start_y;
            if (i % 2 == 1) {
                yk = start_y + item.height;
            }
            item.x = xk;
            item.y = yk;
            this.add(item);
        }
    }

    line(start_x) {
        let len = this.items.length;
        let start_y = otsimo.game.height * otsimo.kv.layout.above_space * 1.2;
        for (let i = 0; i < len; i++) {
            let item = this.items[i];
            let xk = start_x + item.width * i * 1.3;
            let yk = start_y;
            item.x = xk;
            item.y = yk;
            this.add(item);
        }
    }

    square(start_x) {
        // TODO
    }


    /**
     * Adds questions to layout. Creates each question as a number or item.
     * Specifies their coordinates and scale values according to their number.
     * 
     * @method Layout.layoutQuestions
     */
    layoutQuestions() {
        // TODO: list which numbers have which available formations
        // TODO: question can be a number
        // TODO: problems with 3,4,5 number of items
        let len = this.questions.length;
        this.items = [];
        let center_x = otsimo.game.world.centerX;
        let yk = 200;
        for (let i = 0; i < len; i++) {
            let item = new Item({
                game: otsimo.game,
                x: this.hiddenPos.x,
                y: this.hiddenPos.y,
                item: this.questions[i],
                scale: {
                    x: 0.3,
                    y: 0.3
                }
            });
            //item.anchor.set(0.5, 0.5);
            this.items.push(item);
            let w = this.items[0].width;
            var start_x = center_x - (len * w) * 0.5;
            //console.log("item.width", item.width, "item.height: ", item.height);
        }
        this.permission = [
            [], //0
            ["line"], //1
            ["line"], //2
            ["line"], //3
            ["line", "zigzag", "square"], //4
            ["zigzag"], //5
            ["zigzag"], //6
            ["zigzag"], //7
            ["zigzag"], //8
            ["zigzag"] //9
        ]
        let perm_arr = this.permission[len];
        let rand = Math.floor(Math.random() * perm_arr.length);
        let func = perm_arr[rand];
        this[func](start_x)
    }

    layoutAnswers() {
        // question and answer exist both
        let len = this.answers.length;
        //console.log("this.answer in layout object: ", this.answers);
        if (len == 0) {
            //console.log("there are no answers to bind with layout object");
        }
        // TODO: avl_width might be unnecessary
        let avl_width = otsimo.game.width * (1 - otsimo.kv.layout.side_space_constant_answer * 2);
        let yk = otsimo.kv.layout.answer_y_constant * otsimo.game.height;
        let center = otsimo.game.world.centerX;
        console.log("this.answers: ", this.answers);
        let leftmost = undefined;
        let rightmost = undefined;
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
                let xk = center + num.width;
                if (i % 2 == 0) {
                    xk = center - num.width;
                    leftmost = num;
                } else {
                    rightmost = num;
                }
                num.anchor.set(0.5, 0.5);
                num.x = xk;
                num.y = yk;
                this.add(num);
                console.log("even number answer xk: ", xk, num);
                this.answers[i] = undefined;
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
            num.x = center;
            num.y = yk;
            this.add(num);
            leftmost = num;
            rightmost = num;
            console.log("odd number answer xk: ", center, num);
            this.answers[0] = undefined;
        }
        let c = 0;
        for (let i = 0; i < this.answers.length; i++) {
            if (this.answers[i]) {
                console.log("this.answers[i]: ", this.answers[i]);
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
                num.anchor.set(0.5, 0.5);
                num.y = yk;
                if (c % 2 == 0) {
                    num.x = leftmost.x - num.width * 1.2;
                    leftmost = num;
                } else {
                    num.x = rightmost.x + num.width * 1.2;
                    rightmost = num;
                }
                this.add(num);
                c++;
            }
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