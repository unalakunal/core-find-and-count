import Item from "./prefabs/item"
import Number from "./prefabs/number"
import Hint from "./prefabs/hint"
import Layout from "./prefabs/layout"
import {Random} from "./random"

/**
 * Creates a new scene in the session. Deals with layout object.
 * 
 * @constructor
 * @param {object} - The session that this scene belongs to.
 */
export default class Scene {
    constructor({session, score}) {
        this.session = session;
        /**
         * @property {object} [random] - The Random objects that contains items and numbers according to that game type.
        */
        this.random = new Random({ game: otsimo.game });
        /**
         * Creates a score system for this scene.
         * 
         * @property {object} [score] - The score object that contains step score and limit specialized in key values of the game.
         */
        this.score = score;
        this.score.initStep();
    }

    /**
     * Initializes the scene using the random object.
     * Creates a layout in a hidden position. Lastly announces the layout by calling the announce function.
     * 
     * @method Scene.init 
     */
    init(delay) {
        //console.log("this.random.items: ", this.random.items);
        let staged = true;
        if (otsimo.kv.game.type == "how_many") {
            // get random number of items to screen
            var questions = this.random.for("items");
            var answer = questions.length;
            var answers = this.random.for("numbers", answer);
            //var item_type = this.random.items[0].id;
            var item_type = questions[0].id;
        } else if (otsimo.kv.game.type == "compare") {
            var answers = this.random.for("numbers", answer);
            var item_type = this.random.items[0].id;
            staged = false;
        } else if (otsimo.kv.game.type == "find_next") {
            var questions = this.random.for("numbers", false);
            var answer = questions[2].id + 1;
            var answers = this.random.for("numbers", answer);
            var item_type = this.random.items[0].id;
        }

        let layout = new Layout({
            game: otsimo.game,
            staged: staged,
            answers: answers,
            questions: questions,
            answer_text: this.random.answer.text
        });

        let hint = new Hint({
            game: otsimo.game,
            answer: layout.answer_sprite,
            score: this.score
        });

        layout.x = layout.hiddenPos.x;
        layout.y = layout.hiddenPos.y;

        layout.itemSelected.add(this.onSelected, this);
        this.layout = layout;
        this.hint = hint;

        // TODO: this.gameStep = next;
        this.announce(item_type, otsimo.kv.announce_text_time, delay);
    }

    /**
     * The input handler of the scene. Only enabled in answers.
     * 
     * @method Scene.onSelected
     * @param {object} [item] - The item or number that takes the input.
     */
    onSelected(obj) {
        if (otsimo.kv.game.hint_type == "hand") {
            this.hint.kill();
        }
        this.hint.removeTimer();
        let correctInput = (obj.num.id == this.random.answer.id);
        obj.inputEnabled = false;

        if (correctInput) {
            this.hint.kill();
            this.hint.removeTimer();
            //if the answer is true
            let delay = 1000;
            obj.highlight();
            obj.playSound();
            if (otsimo.correctSound) {
                otsimo.correctSound.play(null, null, 0.5);
            }
            this.layout.relayout({
                delay: delay,
                answer_name: this.random.answer.text,
                isTrue: true,
                obj: undefined
            });
            delay = delay * 2;
            this.session.correctInput(this.random.answer, delay);
        } else {
            this.hint.kill();
            this.hint.removeTimer();
            this.layout.relayout({
                delay: 0,
                answer_name: this.random.answer.text,
                isTrue: false,
                obj: obj
            });
            this.session.wrongInput(obj.num, this.random.answer);
            this.hint.call(otsimo.kv.layout.relayout_duration);
        }
    }

    /**
     * Creates question text specified by answer parameter and proper tweens to prepare the screen for gameplay.
     * Firstly, announce text is created and brought the screen.
     * After the text, layout is placed considering the game type.
     * 
     * @class Scene 
     * @param {string} [answer] - Name of the objects on the screen.
     * @param {number} [y_time] - The leave time of the animation on text.
    */
    announce(item_type, y_time, delay) {
        if (otsimo.kv.game.type == "how_many") {
            var txt = sprintf(otsimo.kv.announce_text_how_many, item_type, "s are there?");
        } else {
            var txt = otsimo.kv.announce_text_find_next;
        }

        let text = otsimo.game.add.text(otsimo.game.world.centerX, otsimo.game.world.centerY * (-0.1), txt, otsimo.kv.announce_font);
        text.anchor.set(0.5, 0.5);
        text.alpha = 0.1;
        this.announceText = text;

        otsimo.game.add.tween(text).to({ alpha: 1 }, 100, "Linear", true, delay);
        let a = otsimo.game.add.tween(text).to({ y: otsimo.game.world.centerY }, 500, Phaser.Easing.Circular.Out, false, delay);
        let b = otsimo.game.add.tween(text).to({ y: otsimo.game.height * (-0.3) }, y_time, Phaser.Easing.Circular.In, false, 1200);
        a.chain(b);
        a.start();

        setTimeout(() => {
            otsimo.game.add.tween(this.layout.gray).to(
                {
                    x: 0,
                    y: otsimo.game.height * otsimo.kv.layout.above_space * 0.65
                },
                otsimo.kv.game.announce_layout_time * 0.35,
                Phaser.Easing.Sinusoidal.Out,
                true
            )
        }, delay + 1500);

        setTimeout(() => {
            this.layout.move(this.layout.visiblePos.x, this.layout.visiblePos.y, otsimo.kv.layout.show_layout_duration, delay);
        }, otsimo.kv.game.announce_layout_time)
        this.hint.call(otsimo.kv.game.announce_layout_time);
    }

    /**
     * Gives current coordinates of answer sprite on screen via layout object.
     * Used in killTween in jump hint.
     * 
     * @method Scene.answerPos
     * @return {tuple(number, number)} [ans.x, ans.y] - x and y coordinates of answer sprite. 
     */
    answerPos() {
        let ans = this.layout.answer_sprite;
        return (ans.x, ans.y);
    }

}

