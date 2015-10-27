'use strict';
const PromiseAttachment = require('./PromiseAttachment');

class PromiseTracker {
    constructor() {
        this.promises = [];
        this._allPromisesGiven = false;

        this.promise = new Promise(resolve => {
            this._resolve = resolve;
        });
    }
    get allPromisesGiven() { return this._allPromisesGiven; }

    set allPromisesGiven(value) {
        this._allPromisesGiven = value;
        this.checkPromises();
    }

    get promisesResolved() { return this.allPromisesGiven && this.promises.every(promise => promise.resolved); }

    checkPromises() {
        if(this.promisesResolved) {
            this._resolve();
        }
    }

    generatePromiseAttachment(item) {
        let promiseAttachment = new PromiseAttachment({
            itemToTrack: item,
            onResolve: () => this.checkPromises()
        });

        this.promise.push(promiseAttachment);

        return promiseAttachment;
    }
}

module.exports = PromiseTracker;