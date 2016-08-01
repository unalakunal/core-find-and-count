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
 * @param {string} [answer_text] - The answer text that this layout belongs to.
 * @param {number} [gray] - The gray background that was created on scene.
 */
export default class Layout extends Phaser.Group {
    constructor({game, staged, answers, questions, answer_text, gray}) {
        super(game);
        /**
         * @property {boolean} [staged] - A staged game contains two types of on screen data: answers and questions.
         *                                If a game is not staged, there are only interactive objects (answers) on the screen.
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

        /**
         * @param {string} [answer_text] - The answer text that this layout belongs to.
         */
        this.answer_text = answer_text;

        /**
         * @param {number} [gray] - The gray background that was created on scene.
         */
        this.gray = gray;

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

        this.tapeParent = new Phaser.Group(otsimo.game);

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
     */
    setBackground() {
        this.gray.alpha = 0.2;
        this.gray.scale.y = 0.52;
        this.tapeParent.add(this.gray);
        this.tapeParent.x = this.gray.x;
        this.tapeParent.y = this.gray.y;
        this.gray.x = 0;
    }

    /**
     * Puts questions on screen in zigzag formation.
     * 
     * @method Layout.zigzag
     */
    zigzag() {
        let center_x = otsimo.game.world.centerX;
        let len = this.questionObjects.length;
        let w = this.questionObjects[0].width;
        let start_x = center_x - (len * w) * 0.5;
        start_x += this.questionObjects[0].width * 0.5;
        let start_y = otsimo.game.height * otsimo.kv.layout.above_space + this.gray.height * 0.5 - this.questionObjects[0].height * 0.5;
        for (let i = 0; i < len; i++) {
            let item = this.questionObjects[i];
            let xk = start_x + item.width * i;
            let yk = start_y;
            if (i % 2 == 1) {
                yk = start_y + item.height;
            }
            item.x = xk;
            item.y = yk;
            this.tapeParent.add(item);
        }
    }

    /**
     * Puts questions on screen in line formation.
     * 
     * @method Layout.line
     */
    line() {
        let center_x = otsimo.game.world.centerX;
        let len = this.questionObjects.length;
        let w = this.questionObjects[0].width;
        let start_x = center_x - (len * w) * 0.5;
        if (len == 1) {
            start_x = center_x;
        }
        let start_y = otsimo.game.height * otsimo.kv.layout.above_space + this.gray.height * 0.5;
        for (let i = 0; i < len; i++) {
            if (otsimo.kv.game.type == "find_next") {
                start_x = center_x - 0.25 * w - (len * w) * 0.5;
            }
            let item = this.questionObjects[i];
            let xk = start_x + item.width * i * 1.5;
            if (len % 2 == 0 && otsimo.kv.game.type != "find_next") {
                xk = start_x + item.width * i * 2;
            }
            let yk = start_y;
            item.x = xk;
            item.y = yk;
            this.tapeParent.add(item);
        }
    }

    /**
     * Puts questions on screen in square formation.
     * 
     * @method Layout.line
     */
    square() {
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
        //TODO: center the y coordinate according to background
        let len = this.questions.length;
        /**
         * @property {list} [questionObjects] - The questions on layout, bound to gray background.
         */
        this.questionObjects = [];
        let four_arr = [];
        if (otsimo.kv.game.type == "how_many") {
            four_arr = ["zigzag", "square"];
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
                item.anchor.set(0.5, 0.5);
                item.inputEnabled = false;
                this.questionObjects.push(item);
            }
        } else {
            four_arr.push("line");
            for (let i = 0; i < len; i++) {
                let num = new Number({
                    game: otsimo.game,
                    x: this.hiddenPos.x,
                    y: this.hiddenPos.y,
                    num: this.questions[i],
                    scale: {
                        x: 0.9,
                        y: 0.9
                    }
                });
                num.anchor.set(0.5, 0.5);
                num.inputEnabled = false;
                this.questionObjects.push(num);
            }
            let dotted = this.game.add.sprite(
                this.hiddenPos.x,
                this.hiddenPos.y,
                "dotted"
            );
            let sc = this.questionObjects[0].width / dotted.width;
            dotted.scale.x = sc;
            dotted.scale.y = sc;
            dotted.anchor.set(0.5, 0.5);
            this.questionObjects.push(dotted);
        }
        this.permission = [
            [], //0
            ["line"], //1
            ["line"], //2
            ["line"], //3
            four_arr, //4
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
        this[func]();
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
            num.anchor.set(0.5, 0.5);
            if (this.answer_text == num.num.text) {
                this.answer_sprite = num;
            }
            num.inputEnabled = true;
            num.events.onInputDown.add(this.clickListener, this);
            let w = num.width;
            let start_x = center_x - (len * w) * 0.5;
            if (len % 2 == 0) {
                start_x = center_x - 0.25 * w - Math.pow((len * 0.5), 2) * w * 0.5;
            }
            let start_y = otsimo.game.height * otsimo.kv.layout.answer_y_constant;
            let xk = start_x + num.width * i * 1.5;
            let yk = start_y;
            num.x = xk;
            num.y = yk;
            this.numbers.push(num);
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
        let t = otsimo.game.add.tween(this)
            .to({ x: x, y: y }, duration, Phaser.Easing.Quintic.Out, false, delay);
        t.start();
    }

    /**
     * 
     * 
     * @
     */
    relayout({delay, answer_name, isTrue, obj}) {
        if (isTrue) {
            this.clean(delay, answer_name);
        } else {
            if (otsimo.kv.layout.on_wrong == "hide") {
                //hide object and relayout
                this.hide(obj, delay);
            } else {
                //move object away and relayout
                this.moveAway(obj, delay);
                this.numbers = this.numbers.filter(f => {
                    if (f.num.text == obj.num.text) {
                        return false;
                    }
                    return true;
                });
                setTimeout(() => {
                    let len = this.numbers.length;
                    let center_x = otsimo.game.world.centerX;
                    let w = this.numbers[0].width;
                    let start_x = center_x - (len * w) * (len + 1) * 0.1;
                    if (len == 1) {
                        start_x = center_x;
                    }
                    for (let i = 0; i < len; i++) {
                        let num = this.numbers[i];
                        let xk = start_x + num.width * i * 1.3;
                        otsimo.game.add.tween(num).to({ x: xk }, 600, Phaser.Easing.Back.Out, true);
                    }
                }, 500);
            }
        }
    }

    clean(delay, answer_name) {
        let len = this.children.length;
        for (let i = 0; i < len; i++) {
            if (answer_name != this.children[i].name) {
                otsimo.game.add.tween(this.children[i]).to({ alpha: 0.3 }, 300, "Linear", true);
            }
        }
        otsimo.game.add.tween(this.tapeParent)
            .to({ x: otsimo.game.width * 1.2 }, otsimo.kv.layout.move_away_duration * 0.35, Phaser.Easing.Sinusoidal.In, true, delay);
        let t = otsimo.game.add.tween(this).to({ x: this.hiddenPos.x, y: this.hiddenPos.y }, otsimo.kv.layout.move_away_duration, Phaser.Easing.Back.In, false, delay * 1.3);
        t.start();
    }

    moveAway(obj, delay) {
        obj.inputEnabled = false;
        otsimo.game.add.tween(obj).to({ y: this.hiddenPos.y }, 1000, Phaser.Easing.Sinusoidal.In, true, delay);
    }

    hide(obj, delay) {
        obj.inputEnabled = false;
        obj.hidden = true;
        let a = otsimo.game.add.tween(obj).to({ alpha: 0.3 }, 500, Phaser.Easing.Exponential.Out, false, delay);
        let ret = obj.scale.x;
        let b = otsimo.game.add.tween(obj.scale).to({ x: ret, y: ret }, 500, Phaser.Easing.Back.In, false);
        a.chain(b);
        a.start();
    }

    clickListener(num) {
        if (num.hidden) {
            return;
        }
        this.itemSelected.dispatch(num);
    }

}