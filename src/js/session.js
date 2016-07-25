import Scene from "./scene"

export default class Session {
    constructor({game, state}) {
        this.game = game;
        this.score = 0;
        this.stepScore = otsimo.kv.game.step_score;
        this.end = otsimo.kv.game.session_step;
        this.step = 0;
        this.startTime = new Date();
        this.state = state;
        this.wrongAnswerTotal = 0;
        this.wrongAnswerStep = 0;
        this.stepStartTime = Date.now();
        this.previousInput = Date.now();
    }

    end() {
        console.log("end session, post to analytics")
    }

    startStep() {
        this.wrongAnswerStep = 0;
        console.log("start step");
        this.stepScore = otsimo.kv.game.step_score;
        this.stepStartTime = Date.now();
        this.previousInput = Date.now();
    }

    wrongInput(item, amount) {
        this.wrongAnswerStep += 1
        this.wrongAnswerTotal += 1
        this.decrementScore();
        console.log("wrong input");
        let now = Date.now();
        let payload = {
            item: item.id,
            kind: item.kind,
            time: now - this.stepStartTime,
            delta: now - this.previousInput
        }
        this.previousInput = now;
        otsimo.customevent("game:failure", payload);
    }

    correctInput(item, delay) {
        console.log("correct input");
        let now = Date.now();
        let payload = {
            item: item.id,
            kind: item.kind,
            time: now - this.stepStartTime,
            delta: now - this.previousInput
        }
        this.step++;
        this.previousInput = now;
        otsimo.customevent("game:success", payload);
        if (this.step == this.end) {
            console.log("session over");
            this.game.state.start('Over');
            return;
        }
        let scene = new Scene({
            session: this
        })
        scene.init(delay);
    }

    decrementScore() {
        //TODO: add score system to clicklisteners
        if (this.stepScore > 0) {
            this.stepScore--;
        }
    }

    debug(game) {
        game.debug.text("score: " + this.score, 2, 28, "#00ff00");
        game.debug.text("wrongAnswerTotal: " + this.wrongAnswerTotal, 2, 42, "#00ff00");
        game.debug.text("wrongAnswerStep: " + this.wrongAnswerStep, 2, 54, "#00ff00");
        game.debug.text("hintStep: " + this.hintStep, 2, 66, "#00ff00");
        game.debug.text("hintTotal: " + this.hintTotal, 2, 78, "#00ff00");
        game.debug.text("stepScore: " + this.stepScore, 2, 90, "#00ff00");
    }
}