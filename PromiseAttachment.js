'use strict';

class PromiseAttachment {
    constructor(options) {
        this.trackedPromise = options.trackedPromise;
        this.attachmentPromise = new Promise((resolve, reject) => this.initializePromise(resolve, reject));
        this.onResolve = options.onResolve || (() => {});
        this.resolved = false;
    }

    initializePromise(resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
    }

    success(results) {
        this.results = results;
        this.resolved = true;
        this._resolve(results);
        this.onResolve();
    }

    error(reason) {
        this.error = reason;
        this.resolved = true;
        this._reject(reason);
        this.onResolve();
    }

    thrownError(reason) {
        this.exceptionCaught = true;
        this.error = reason;
        this.resolved = true;
        this._reject(reason);
        this.onResolve();
    }

    attach() {
        this.trackedPromise.then(results => this.success(results), reason => this.error(reason))
        .catch(reason => this.thrownError(reason));
        return this.attachmentPromise;
    }
}

module.exports = PromiseAttachment;