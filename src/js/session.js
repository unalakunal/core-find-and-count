import Scene from "./scene"
import Score from "./prefabs/score"


function makeID(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export default class Session {
    constructor({game, state}) {
        this.score = new Score();
        this.game = game;
        this.startTime = new Date();
        this.state = state;
        this.hintTotal = 0;
        this.hintStep = 0;
        this.wrongAnswerTotal = 0;
        this.wrongAnswerStep = 0;
        this.id = makeID(10);
        this.sessionStart();
    }

    itemAmount() {
        let diff = otsimo.settings.difficulty;
        if (diff == "easy") {
            return otsimo.kv.game.easy_size;
        } else if (diff == "medium") {
            return otsimo.kv.game.medium_size;
        } else if (diff == "hard") {
            return otsimo.kv.game.hard_size;
        }
        return otsimo.kv.game.medium_size;
    }

    sessionStart() {
        let difficulty = otsimo.settings.difficulty;
        let steps = otsimo.kv.game.session_step;
        let payload = {
            id: this.id,
            difficulty: difficulty,
            steps: steps
        }
        otsimo.customevent("game:session:start", payload);
    }

    end() {
        let fin = Date.now();
        let delta = fin - this.startTime;
        let difficulty = otsimo.settings.difficulty;
        let item_amount = this.itemAmount();
        let total_score = this.score._totalScore;
        let total_failure = this.wrongAnswerTotal;
        let steps = otsimo.kv.game.session_step;
        let payload = {
            total_score: total_score,
            duration: delta,
            total_failure: total_failure,
            steps: steps
        }
        otsimo.customevent("game:session:end", payload);
        console.log("end session, post to analytics")
    }

    startStep() {
        this.wrongAnswerStep = 0;
        this.hintStep = 0;
        this.score.initStep();
        console.log("start step");
    }

    wrongInput(item, amount, hintStep) {
        this.incrementHint(hintStep)
        this.wrongAnswerStep += 1;
        this.wrongAnswerTotal += 1;
        this.score.decrement();
        console.log("wrong input");
        this.score.createPayload({
            isSuccess: false,
            itemID: item.id,
            itemKind: item.kind,
            hint_count: hintStep,
            wrongAnswerStep: this.wrongAnswerStep,
            ID: this.id            
        });
    }

    correctInput(item, delay, hintStep) {
        this.incrementHint(hintStep);
        console.log("correct input");
        let gameOver = this.score.createPayload({
            isSuccess: true,
            itemID: item.id,
            itemKind: item.kind,
            hint_count: hintStep,
            wrongAnswerStep: this.wrongAnswerStep,
            ID: this.id
        });
        if (gameOver) {
            console.log("session over");
            this.end();
            setTimeout(() => {
                this.game.state.start('Over');
            }, otsimo.kv.layout.relayout_duration + delay);
            return;
        }
        let scene = new Scene({
            session: this,
            score: this.score
        });
        this.score.endStep();
        scene.init(delay);
    }

    incrementHint(tableHintStep) {
        let change = tableHintStep - this.hintStep;
        if (this.stepScore > 0) {
            this.stepScore -= change;
            if (this.stepScore < 0) {
                this.stepScore = 0;
            }
        }
        this.hintTotal += (tableHintStep - this.hintStep);
        this.hintStep = tableHintStep;
    }

    debug(game) {
        game.debug.text("total score: " + this.score.total, 2, 28, "#00ff00");
        game.debug.text("wrongAnswerTotal: " + this.wrongAnswerTotal, 2, 42, "#00ff00");
        game.debug.text("wrongAnswerStep: " + this.wrongAnswerStep, 2, 54, "#00ff00");
        game.debug.text("stepScore: " + this.score.step, 2, 90, "#00ff00");
    }
}