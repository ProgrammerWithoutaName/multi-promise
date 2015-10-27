'use strict';

class PromiseAttachment {
    constructor(options) {
        this.trackedItem = options.itemToTrack;
        this.onResolve = options.onResolve || (() => {});
        this.resolved = false;
    }

    success(results) {
        this.results = results;
        this.resolved = true;
        this.promiseResolution = Promise.resolve(results);
        this.onResolve();
    }

    error(reason) {
        this.error = reason;
        this.resolved = true;
        this.promiseResolution = Promise.reject(reason);
        this.onResolve();
    }

    thrownError(reason) {
        this.exceptionCaught = true;
        this.error = reason;
        this.resolved = true;
        this.promiseResolution = new Promise( () => { throw reason; } );
        this.onResolve();
    }

    attach(promise) {
        promise.then(results => this.success(results), reason => this.error(reason))
        .catch(reason => this.thrownError(reason));
        return this.promiseResolution;
    }
}

module.exports = PromiseAttachment;