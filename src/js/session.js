
export default class Session {
    constructor({state}) {
        this.score = 0;
        this.stepScore = otsimo.kv.game.step_score;
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

    correctInput(item, answerItem) {
        console.log("correct input");
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
    }
}