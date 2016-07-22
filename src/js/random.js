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
        console.log("random constructor game type is: ", this.game_type);
        if (this.game_type == "compare") {
            this.isStaged = false;
            this.items = otsimo.kv[otsimo.kv.game.questions];
        } else {
            this.items = otsimo.kv[otsimo.kv.game.questions];
            console.log("this.items: ", this.items);
            // TODO: add some numbers to data
            this.numbers = otsimo.kv[otsimo.kv.game.answers];
            console.log("this.numbers: ", this.numbers);
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
        console.log("number of things on screen which isAnswer is :", isAnswer, amount);
        return amount;
    }

    /**
     *  Provides count number of kinds in an array randomly. Answer should be known for some cases.
     * 
     * @method Random.for
     * @param {string} [type] - Could be item or number, defines behaviour of method.
     * @param {string} [answer] - If the type given is to be an answer, it should know the correct one beforehand.
     * @return {list} [res] - The result list, generated randomly. If answer is given, it puts it in a random place too.
     */

    for(type, answer) {
        let count = this.amount(false);
        if (type == "items") {
            var kind = this.forKind(this.items);
            this.itemsCount = count;
        } else {
            var kind = this.forKind(this.numbers);
            this.numbersCount = count;
        }

        console.log("random kind returned with: ", kind, "and count is: ", count);

        let res = [];
        for (let i = 0; i < count; i++) {
            res.push(kind);
        }

        if (type == "items") {
            this.items = res;
        } else {
            this.numbers = res;
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
        console.log("array in forKind: ", array);
        let len = array.length;
        let n = Math.floor(Math.random() * len);
        while (n == 0) {
            n = Math.floor(Math.random() * len);
        }
        return array[n];
    }

}