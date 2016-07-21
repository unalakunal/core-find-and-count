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
    constructor({session}) {
        this.session = session;
        /**
         * @property {object} random - The Random objects that contains items and numbers according to that game type.
        */
        this.random = new Random({ game: otsimo.game, game_type: otsimo.kv.game.type });
    }

    /**
     * Initializes the scene using the random object.
     * Creates a layout in a hidden position. Lastly announces the layout by calling the announce function.
     * 
     * @method Scene.init 
     */
    init() {
        let answers = [];
        let questions = this.random.for("items");
        let answer = this.random.items[0].id;
        console.log("this.random.items: ", this.random.items);
        let staged = true;
        console.log("answer: ", answer);
        if (otsimo.kv.game.type == "how_many") {
            // get random number of items to screen
            console.log("it's a how_many game");
            // TODO: add numbers under the bar after seeing the items above
        } else if (otsimo.kv.game.type == "compare") {
            answers = this.random.for("numbers");
            staged = false;
        } else if (otsimo.kv.game.type == "sort") {
            answers = this.random.for("numbers");
            staged = false;
        } else if (otsimo.kv.game.type == "find_next") {
            questions = this.random.for("numbers");
        }

        let layout = new Layout({
            game: otsimo.game,
            staged: staged,
            answers: answers,
            //TODO: answers: this.random.for("numbers"),
            questions: questions
        });

        console.log("layout: ", layout);

        layout.x = layout.hiddenPos.x;
        layout.y = layout.hiddenPos.y;

        this.layout = layout;
        // TODO: this.gameStep = next;
        this.announce(answer, otsimo.kv.announce_text_time);
    }



    onSelected(item) {
        if (this.gameStep.done) {
            return;
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
     *  
    */

    announce(answer, y_time) {
        let txt = sprintf(otsimo.kv.announce_text, answer, "s are there?");
        console.log("txt: ", txt);
        let text = otsimo.game.add.text(otsimo.game.world.centerX, otsimo.game.world.centerY * (-0.1), txt, otsimo.kv.announce_font);

        text.anchor.set(0.5, 0.5);
        text.alpha = 0.1;
        this.announceText = text;

        otsimo.game.add.tween(text).to({ alpha: 1 }, 100, "Linear", true);
        let a = otsimo.game.add.tween(text).to({ y: otsimo.game.world.centerY }, 500, Phaser.Easing.Circular.Out, false);
        let b = otsimo.game.add.tween(text).to({ y: otsimo.game.height * (-0.3) }, y_time, Phaser.Easing.Circular.In, false, 1200);
        a.chain(b);
        a.start();

        setTimeout(() => {
            this.layout.move(this.layout.visiblePos.x, this.layout.visiblePos.y, otsimo.kv.show_layout_duration);
        }, 2000)

    }

    hideLayout() {

    }



}

