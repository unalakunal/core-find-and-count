import Item from "./prefabs/item"
import Number from "./prefabs/number"
import Hint from "./prefabs/hint"
import Layout from "./prefabs/layout"
import {Random} from "./random"

export default class Scene {
    constructor({delegate, session}) {
        this.delegate = delegate
        this.session = session;
        this.random = new Random({ game: otsimo.game, game_type: otsimo.kv.game.type });
    }

    get step() {
        return this.current_step | 0;
    }

    set step(value) {
        this.current_step = value;
    }

    init() {
        let layout = new Layout({
            game: otsimo.game,
            staged: true,
            answers: [],
            //TODO: answers: this.random.for("numbers"),
            questions: this.random.for("items")
        });

        console.log("layout", layout);

        //layout.x = layout.hiddenPos.x;
        //layout.y = layout.hiddenPos.y;

        this.layout = layout;
        // TODO: this.gameStep = next;

        if (otsimo.kv.game.type == "how_many") {
            // get random number of items to screen
            this.layout.questions[0].x = otsimo.game.width * 0.5;
            this.layout.questions[0].y = otsimo.game.height * 0.5;
            console.log("should be: ", this.layout.questions[0])
            // TODO: add numbers under the bar after seeing the items above
        } else if (otsimo.kv.game.type == "compare") {

        } else if (otsimo.kv.game.type == "sort") {

        } else if (otsimo.kv.game.type == "find_next") {

        }
    }

    onSelected(item) {
        if (this.gameStep.done) {
            return;
        }
    }

    announce() {

    }

    hideLayout() {

    }



}

