export default class Queue {
    constructor() {
        this.v = [];
    }

    enqueue(el) {
        this.v.push(el);
    }

    dequeue() {
        if (this.v.length > 0) {
            return this.v.shift(1);
        }
        else {
            throw new Error("Empty queue.");
        }
    }

    size () {
        return this.v.length;
    }

    empty() {
        return this.size() == 0;
    }
}
