export default class Score {
    constructor() {
        this.limit = otsimo.kv.game.limit_score;
        this._stepScore = otsimo.kv.game.step_score;
        this._totalScore = 0;
        this.game_step = 0;
        this.stepStartTime = Date.now();
        this.previousInput = Date.now();
    }

    get total() {
        return this._totalScore;
    }

    get step() {
        return this._stepScore;
    }

    initStep() {
        this.stepStartTime = Date.now();
        this.previousInput = Date.now();
        this._stepScore = otsimo.kv.game.step_score;
    }

    endStep() {
        this._totalScore += this._stepScore;
        this.game_step++;
        let gameOver = (this.game_step == otsimo.kv.game.session_step);
        console.log("??gameover: ", gameOver);
        return gameOver;
    }

    decrement() {
        console.log("decrement with: ", this._stepScore, this.limit);
        if (this._stepScore > this.limit) {
            this._stepScore--;
        }
    }

    createPayload({itemID, itemKind, isSuccess}) {
        let now = Date.now();
        let payload = {
            item: itemID,
            kind: itemKind,
            time: now - this.stepStartTime,
            delta: now - this.previousInput
        };
        this.previousInput = now;

        if (isSuccess) {
            let end = this.endStep();
            otsimo.customevent("game:success", payload);
            return end;
        } else {
            otsimo.customevent("game:failure", payload);
            return false;
        }
    }
}