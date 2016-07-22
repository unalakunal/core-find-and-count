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

        //console.log("layout.questions: ", questions);
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

    /**
     * Puts questions on screen in zigzag formation.
     * 
     * @method Layout.zigzag
     * @param {number} [start_x] - Starting x coordinate, calculated in layoutQuestions considering question objects in layout.  
     */
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

    /**
     * Puts questions on screen in line formation.
     * 
     * @method Layout.line
     * @param {number} [start_x] - Starting x coordinate, calculated in layoutQuestions considering question objects in layout.  
     */
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

    /**
     * Puts questions on screen in square formation.
     * 
     * @method Layout.line
     * @param {number} [start_x] - Starting x coordinate, calculated in layoutQuestions considering question objects in layout.  
     */
    square(start_x) {
        // TODO
        console.log("in square function");
    }


    /**
     * Adds questions to layout. Creates each question as a number or item.
     * Randomly calls zigzag, line or square for specific coordinate. Edits permissions.
     * 
     * @method Layout.layoutQuestions
     */
    layoutQuestions() {
        // TODO: question can be a number
        let len = this.questions.length;
        this.items = [];
        let center_x = otsimo.game.world.centerX;
        let yk = otsimo.kv.layout.above_space;
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
            item.inputEnabled = false;
            this.items.push(item);
            let w = this.items[0].width;
            var start_x = center_x - (len * w) * 0.5;
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
        console.log("layout func for questions: ", func);
        this[func](start_x)
    }

    /**
     * Adds answers to layout. Creates each answer as numbers.
     * Specifies their coordinates and scale values according to their number.
     * Doesn't get called when there are no questions. Method "layoutOnce" is called in that case.
     *
     * @method Layout.layoutAnswers 
     */
    layoutAnswers() {
        let len = this.answers.length;
        this.numbers = [];
        let center_x = otsimo.game.world.centerX;
        let yk = otsimo.kv.layout.answer_y_constant;
        for (let i = 0; i < len; i++) {
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
            num.inputEnabled = true;
            num.events.onInputDown.add(this.clickListener, this);
            this.numbers.push(num);
            let w = this.numbers[0].width;
            let start_x = center_x - (len * w) * 0.5;
            let start_y = otsimo.game.height * otsimo.kv.layout.answer_y_constant;
            let xk = start_x + num.width * i * 1.3;
            let yk = start_y;
            num.x = xk;
            num.y = yk;
            this.add(num);
            num.events.onInputDown.add(this.clickListener, this, 0, num);
        }
    }

    layoutOnce() {
        // questions are also answers
    }

    /**
     * Moves layout on screen using tweens.
     * 
     * @method Layout.move
     * @param {number} [x] - Arriving x coordinate of tween.
     * @param {number} [y] - Arriving y coordinate of tween.
     * @param {number} [duration] - Duration of tween.
     */
    move(x, y, duration, delay) {
        console.log("tween duration: ", duration);
        let t = otsimo.game.add.tween(this)
            .to({ x: x, y: y }, duration, Phaser.Easing.Back.Out, false, delay);
        t.start();
    }

    relayout({delay, answer_name}) {
        let len = this.children.length;
        for (let i = 0; i < len; i++) {
            console.log("adding tween to: ", this.children[i], "where answer_name is: ", answer_name);
            if (answer_name != this.children[i].name) {
                otsimo.game.add.tween(this.children[i]).to({ alpha: 0.3 }, 300, "Linear", true);
            }
        }
        console.log("delay: ", delay, "dur: ", otsimo.kv.layout.move_away_duration);
        otsimo.game.add.tween(this).to({x: this.hiddenPos.x, y: this.hiddenPos.y}, otsimo.kv.layout.move_away_duration, Phaser.Easing.Back.In, true, delay);
    }

    moveOutItem() {

    }

    hideItem() {

    }

    clickListener(num) {
        console.log("this: ", this);
        console.log("this.layout: ", this.layout);
        console.log("num: ", num);
        if (num.hidden) {
            return;
        }
        console.log(this.itemSelected);
        this.itemSelected.dispatch(num);
    }

}