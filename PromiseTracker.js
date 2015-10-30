'use strict';
const PromiseAttachment = require('./PromiseAttachment');

class PromiseTracker {
    constructor() {
        this.promises = [];
        this._allPromisesGiven = false;
        this._expectedPromiseCount = undefined;

        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    get allPromisesGiven() {
        return this._allPromisesGiven;
    }


    set allPromisesGiven(value) {
        this._allPromisesGiven = value;
        this.checkPromises();
    }

    get expectedPromiseCount() { return this._expectedPromiseCount; }
    set expectedPromiseCount(value) {
        this._expectedPromiseCount = value;
        this.allPromisesGiven = this.expectedPromiseCount === this.totalPromiseCount;
    }

    get percentComplete() {
        return (this.resolvedPromiseCount / this.totalPromiseCount) * 100;
    }

    get totalPromiseCount () { return this.promises.length; }

    get resolvedPromiseCount() {
        let resolvedPromises = 0;
        this.promises.forEach(promise => {
            if(promise.resolved) {
                resolvedPromises += 1;
            }
        });
        return resolvedPromises;
    }

    get promisesResolved() { return this.allPromisesGiven && this.promises.every(promise => promise.resolved); }
    get promisesHaveErrors() { return this.promises.some(promise => promise.error);  }

    checkPromises() {
        if(this.promisesResolved) {
            this._resolve();
        }
    }

    generatePromiseAttachment(promise, attachToPromise) {
        if(attachToPromise === undefined) {
            attachToPromise = true;
        }
        let promiseAttachment = new PromiseAttachment({
            trackedPromise: promise,
            onResolve: () => this.checkPromises()
        });

        this.promises.push(promiseAttachment);

        if(this.expectedPromiseCount !== undefined) {
            if(this.expectedPromiseCount === this.totalPromiseCount) {
                this.allPromisesGiven = true;
            }
        }

        if(attachToPromise) {
            let returnPromise = promiseAttachment.attach();
            return returnPromise;
        }
        return promiseAttachment;
    }
}

module.exports = PromiseTracker;