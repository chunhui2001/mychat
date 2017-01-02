"use strict";

var util = require('util');
var Errors = require('./Errors');

function NotExistsError(code, error) {
    Error.call(this, typeof error === "undefined" ? undefined : error.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "NotExistsError";
    this.message = typeof error === "undefined" ? '604 - Entry not exists' : error.message;
    this.code = typeof code === "undefined" ? "604" : code;
    this.status = 604;
    this.inner = error;
}

NotExistsError.prototype = Object.create(Error.prototype);
NotExistsError.prototype.constructor = NotExistsError;

util.inherits(NotExistsError, Errors);

module.exports = NotExistsError;