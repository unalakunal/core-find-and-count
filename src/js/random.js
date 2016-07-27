export class Random {
    /**
     * Takes care of random selection of items, numbers or kind.
     * 
     * @class Random
     * @constructor
     * @param {object} [game] - The game which the random object belongs to.
     */
    constructor({game}) {
        /**
         * @property {object} [game] - The game which the random object belongs to.
         */
        this.game = game;
        /**
         * @property {string} [game_type] - The game type of the core.
         */
        this.game_type = otsimo.kv.game.type;
        /**
         * @property {boolean} [notStaged] - If the game is staged or not. Changes according to game_type.
         */
        this.isStaged = true;
        if (this.game_type == "compare") {
            this.isStaged = false;
            this.items = otsimo.kv[otsimo.kv.game.questions];
        } else {
            this.items = otsimo.kv[otsimo.kv.game.questions];
            this.numbers = otsimo.kv[otsimo.kv.game.answers];
        }
    }

    /**
     * The amount of items or numbers. Checks the isStaged flag and game difficulty as follows:
     * In a staged game the question number is fixed whereas amount of answers goes through 2 to 4 from easy to hard.
     * 
     * @method Random.amount
     * @param {boolean} [isAnswer] - If looking for answer amount, takes action accordingly.
     * @return {number} [amount] - Returns the amount of object specified.
     */
    amount(isAnswer) {
        let amount = Math.floor(Math.random() * 10);
        if (this.isStaged) {
            if (isAnswer) {
                switch (otsimo.settings.difficulty) {
                    case "easy":
                        amount = 2;
                        break
                    case "medium":
                        amount = 3;
                        break
                    case "hard":
                        amount = 4;
                        break
                }
            } else {
                while (amount == 0) {
                    amount = Math.floor(Math.random() * 10);
                }
            }
        }
        else {
            switch (otsimo.settings.difficulty) {
                case "easy":
                    break
                case "medium":
                    break
                case "hard":
                    break
            }
        }
        console.log("amount returns", amount);
        return amount;
    }

    /**
     *  Provides count number of kinds in an array randomly. Answer should be known if answers are to be returned.
     * 
     * @method Random.for
     * @param {string} [type] - Could be item or number, defines behaviour of method.
     * @param {string} [answer] - If the type given is to be an answer, it should know the correct one beforehand.
     * @return {list} [res] - The result list, generated randomly. If answer is given, it puts it in a random place too.
     */
    for(type, answer) {
        let res = []
        if (type == "items") {
            // question for items
            let count = this.amount(false);
            let kind = this.forKind(this.items);
            for (let i = 0; i < count; i++) {
                res.push(kind);
            }
            this.items = res;
        } else {
            //dealing with numbers
            if (answer) {
                // answer for numbers
                console.log("answer for numbers, where numbers are: ", this.numbers);
                let answer_obj = this.numbers.filter(o => {
                    if (o.id == answer) {
                        return true;
                    }
                    return false;
                })[0];
                this.answer = answer_obj;
                console.log("answer_obj:  ", answer_obj);
                let count = this.amount(true);
                console.log("count: ", count);
                res[0] = answer_obj;
                for (let i = 1; i < count; i++) {
                    let kind = this.forKind(this.numbers);
                    // TODO: get rid of the limit
                    let limit = 50;
                    while ((this.include(res, kind))) {
                        if (limit < 0) {
                            //break;
                        }
                        limit--;
                        console.log("while", res, "includes", kind);
                        kind = this.forKind(this.numbers);
                    }
                    res.push(kind);
                }
            } else {
                // question for numbers, game type must be find_next
                console.log("question for numbers, where numbers are: ", this.numbers);
                let count = 3;
                console.log("count: ", count);
                let kind = this.forKind(this.numbers);
                while (kind.id > 7) {
                    kind = this.forKind(this.numbers);
                }
                console.log("kind: ", kind);
                let plus_one = this.numbers.find(f => {
                    return (f.id == kind.id + 1);
                });
                console.log("plus_one: ", plus_one);
                let plus_two = this.numbers.find(f => {
                    return f.id == kind.id + 2;
                });
                console.log("plus_two: ", plus_two);
                res.push(kind);
                res.push(plus_one);
                res.push(plus_two);
                this.questions = res;
            }
            console.log("res: ", res);
        }
        return res;
    }

    /**
     * Gives a random value for an array; called by either items or numbers list.
     * 
     * @method Random.forKind
     * @param {list} [array] - The list at hand.
     * @return {object} [array[n]] - A random value in the array.
     */

    forKind(array) {
        console.log("forkind array: ", array);
        let len = array.length;
        let n = Math.floor(Math.random() * len);
        console.log("forkind returns: ", array[n]);
        return array[n];
    }

    shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    include(arr, member) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === member) {
                // TODO: can't compare two objects
                return true;
            }
        }
        return false;
    }
}