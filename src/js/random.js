export class Random {
    constructor({game, game_type}) {
        this.game = game;
        console.log("random constructor game type is: ", game_type);
        if (game_type == "how_many") {
            this.items = otsimo.kv[otsimo.kv.game.questions];
            console.log("this.items: ", this.items);
            // TODO: add some numbers to data
            this.numbers = otsimo.kv.items[otsimo.kv.game.answers];
        } else if (otsimo.kv.game.type == "compare") {

        } else if (otsimo.kv.game.type == "sort") {

        } else if (otsimo.kv.game.type == "find_next") {

        }
    }

    itemAmount() {
        let amount = Math.floor(Math.random() * 10);
        while (amount == 0) {
            amount = Math.floor(Math.random() * 10);
        }
        console.log("number of items on screen:", amount);
        return amount
    }

    forKind(array) {
        console.log("array in forKind: ", array);
        let len = array.length;
        let n = Math.floor(Math.random() * len);
        while (n == 0) {
            n = Math.floor(Math.random() * len);
        }
        return array[n];
    }

    /**
     *  Provides count number of kinds in an array randomly.
     */

    for(type) {
        let count = this.itemAmount();
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

    forNumbers() {
        let count = this.itemAmount();
        let kind = this.forKind(this.numbers);

        console.log("random kind returned with: ", kind, "and count is: ", count);

        return {
            "count": count,
            "kind": kind
        }
    }

}