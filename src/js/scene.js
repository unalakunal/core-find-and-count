import Item from "./prefabs/item"
import Number from "./prefabs/number"
import Hint from "./prefabs/hint"
import Layout from "./prefabs/layout"
import { Random } from "./random"

/**
 * Creates a new scene in the session. Deals with layout object.
 * 
 * @constructor
 * @param {object} - The session that this scene belongs to.
 */
export default class Scene {
    constructor({game, session, score}) {
        this.game = game;
        this.session = session;
        /**
         * @property {object} [random] - The Random objects that contains items and numbers according to that game type.
        */
        this.random = new Random({ game: otsimo.game });
        /**
         * @property {object} [score] - The score object that contains step score and limit specialized in key values of the game.
         */
        this.score = score;
    }

    /**
     * Initializes the scene using the random object.
     * Creates a layout in a hidden position. Lastly announces the layout by calling the announce function.
     * 
     * @method Scene.init
     * @param {number} [delay] - The delay for announce trigger.  
     */
    init(delay) {
        this.score.initStep();
        let staged = true;
        let currentState = otsimo.game.state.getCurrentState().key;
        if (currentState != "Play") {
            return;
        }
        if (otsimo.kv.game.type == "how_many") {
            // get random number of items to screen
            var questions = this.random.for("items");
            var answer = questions.length;
            var answers = this.random.for("numbers", answer);
            var item_type = this.random.items[0].text;
        } else if (otsimo.kv.game.type == "compare") {
            var answers = this.random.for("numbers", answer);
            var item_type = this.random.items[0].text;
            staged = false;
        } else if (otsimo.kv.game.type == "find_next") {
            var questions = this.random.for("numbers", false);
            var answer = questions[2].id + 1;
            var answers = this.random.for("numbers", answer);
            var item_type = this.random.items[0].text;
        }

        let gray = otsimo.game.add.tileSprite(otsimo.game.width * 1.2, otsimo.game.height * otsimo.kv.layout.above_space, 1500, 340, "gray");

        let layout = new Layout({
            game: otsimo.game,
            staged: staged,
            answers: answers,
            questions: questions,
            answer_text: this.random.answer.text,
            gray: gray
        });

        let hint = new Hint({
            game: otsimo.game,
            answer: layout.answer_sprite,
            score: this.score
        });

        layout.x = layout.hiddenPos.x;
        layout.y = layout.hiddenPos.y;

        layout.itemSelected.add(this.onSelected, this);

        /**
         * @property {object} [layout] - The layout group that contains answers as children. 
         */
        this.layout = layout;

        /**
         * @property {object} [hint] - The hint used in this scene. Removed at the end with timers.
         */
        this.hint = hint;

        this.announce(item_type, otsimo.kv.announce_text_time, delay);
    }

    /**
     * The input handler of the scene. Only enabled in answers.
     * 
     * @method Scene.onSelected
     * @param {object} [obj] - The object that takes the input, it can only be a number.
     */
    onSelected(obj) {
        if (otsimo.kv.game.hint_type == "hand") {
            this.hint.kill();
        }
        this.hint.removeTimer();
        let correctInput = (obj.num.id == this.random.answer.id);
        obj.inputEnabled = false;
        if (correctInput) {
            //if the answer is true
            for(let i = 0; i < this.layout.numbers.length; i++) {
                this.layout.numbers[i].inputEnabled = false;
            }

            let slot = this.layout.questionObjects[this.layout.questionObjects.length - 1];
            let delay = obj.correct({
                slot: slot,
                layout: this.layout,
                delay: obj.highlight()
            });
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
            delay = delay * 1.75;
            this.session.correctInput(this.random.answer, delay, this.hint.step);
        } else {
            this.layout.relayout({
                delay: 0,
                answer_name: this.random.answer.text,
                isTrue: false,
                obj: obj
            });
            this.session.wrongInput(obj.num, this.random.answer, this.hint.step);
            console.log("wrong answer hint call");
            this.hint.call(otsimo.kv.layout.relayout_duration);
        }
    }

    /**
     * Creates question text specified by answer parameter and proper tweens to prepare the screen for gameplay.
     * Firstly, announce text is created and brought the screen.
     * After the text, layout is placed considering the game type.
     * 
     * @class Scene 
     * @param {string} [item_type] - Name of the objects on the screen.
     * @param {number} [y_time] - The leave time of the animation on text.
     * @param {number} [delay] - Delay time passed to the announce tweens.
    */
    announce(item_type, y_time, delay) {
        let currentState = otsimo.game.state.getCurrentState().key;
        let tts = otsimo.kv.game.init_tts;
        if (currentState != "Play") {
            console.log("currentState: ", currentState);
            return;
        }
        if (otsimo.kv.game.type == "how_many") {
            if (otsimo.child.language == "en") {
                var txt = sprintf(otsimo.kv.announce_text_how_many, item_type, "s?");
            } else {
                var txt = sprintf(otsimo.kv.announce_text_how_many, item_type);
            }
            var question_sound = otsimo.game.add.sound(this.random.items[0].audio, 1, false);
        } else {
            var question_sound = otsimo.game.add.sound("find_next_audio", 1, false);
            var txt = otsimo.kv.announce_text_find_next;
        }
        setTimeout(() => {
            currentState = otsimo.game.state.getCurrentState().key;
            if (currentState != "Play") {
                console.log("currentState: ", currentState);
                return;
            }

            if (tts == true) {
                otsimo.tts.speak(txt);
                console.log("tts triggered");
            } else {
                question_sound.play();
                console.log("tts not called");
            }
        }, delay);

        let text = otsimo.game.add.text(otsimo.game.world.centerX, otsimo.game.world.centerY * (-0.1), txt, otsimo.kv.announce_text_style);
        text.anchor.set(0.5, 0.5);
        text.alpha = 0.1;

        otsimo.game.add.tween(text).to({ alpha: 1 }, 100, "Linear", true, delay);
        let a = otsimo.game.add.tween(text).to({ y: otsimo.game.world.centerY }, 500, Phaser.Easing.Circular.Out, false, delay);
        let b = otsimo.game.add.tween(text).to({ y: otsimo.game.height * (-0.3) }, y_time, Phaser.Easing.Circular.In, false, 1200);
        a.chain(b);
        a.start();

        setTimeout(() => {
            otsimo.game.add.tween(this.layout.tapeParent).to(
                {
                    x: 0,
                    y: otsimo.game.height * otsimo.kv.layout.above_space
                },
                otsimo.kv.game.announce_layout_time * 0.35,
                Phaser.Easing.Sinusoidal.Out,
                true
            )
        }, delay + 2000);

        setTimeout(() => {
            this.layout.move(this.layout.visiblePos.x, this.layout.visiblePos.y, otsimo.kv.layout.show_layout_duration, delay);
        }, otsimo.kv.game.announce_layout_time);
        otsimo.game.world.bringToTop(this.layout);
        this.hint.call(otsimo.kv.game.announce_layout_time + otsimo.kv.layout.show_layout_duration + otsimo.kv.layout.relayout_duration + delay);
    }
}

