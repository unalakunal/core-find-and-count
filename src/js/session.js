import Scene from "./scene"
import Score from "./prefabs/score"

export default class Session {
    constructor({game, state}) {
        this.score = new Score();
        this.game = game;
        this.startTime = new Date();
        this.state = state;
        this.wrongAnswerTotal = 0;
        this.wrongAnswerStep = 0;
    }

    end() {
        console.log("end session, post to analytics")
    }

    startStep() {
        this.wrongAnswerStep = 0;
        console.log("start step");
    }

    wrongInput(item, amount) {
        this.wrongAnswerStep += 1;
        this.wrongAnswerTotal += 1;
        this.score.decrement();
        console.log("wrong input");
        this.score.createPayload({
            itemID: item.id,
            itemKind: item.kind,
            isSuccess: false
        });
    }

    correctInput(item, delay) {
        console.log("correct input");
        let gameOver = this.score.createPayload({
            itemID: item.id,
            itemKind: item.kind,
            isSuccess: true
        });
        if (gameOver) {
            console.log("session over");
            this.game.state.start('Over');
            return;
        }
        let scene = new Scene({
            session: this,
            score: this.score
        });
        scene.init(delay);
    }

    debug(game) {
        game.debug.text("total score: " + this.score.total, 2, 28, "#00ff00");
        game.debug.text("wrongAnswerTotal: " + this.wrongAnswerTotal, 2, 42, "#00ff00");
        game.debug.text("wrongAnswerStep: " + this.wrongAnswerStep, 2, 54, "#00ff00");
        //game.debug.text("hintStep: " + this.hintStep, 2, 66, "#00ff00");
        //game.debug.text("hintTotal: " + this.hintTotal, 2, 78, "#00ff00");
        game.debug.text("stepScore: " + this.score.step, 2, 90, "#00ff00");
    }
}