export default class Stack {
    constructor() {
        this.v = [];
    }

    push(el) {
        this.v.push(el);
    }

    pop() {
        if (this.v.length > 0) {
            return this.v.pop();
        }
        else {
            throw new Error("Empty stack.");
        }
    }

    peek() {
        if (this.v.length > 0) {
            return this.v[this.v.length - 1];
        }
        else {
            throw new Error("Empty stack.");
        }
    }

    size () {
        return this.v.length;
    }

    empty() {
        return this.size() == 0;
    }
}
