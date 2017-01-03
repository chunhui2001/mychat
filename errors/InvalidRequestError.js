"use strict";

var util = require('util');
var Errors = require('./Errors');

function InvalidRequestError(code, error) {
    Error.call(this, typeof error === "undefined" ? undefined : error.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "InvalidRequestError";
    this.message = typeof error === "undefined" ? '605 - Invalid Request!' : error.message;
    this.code = typeof code === "undefined" ? "605" : code;
    this.status = 605;
    this.inner = error;
}

InvalidRequestError.prototype = Object.create(Error.prototype);
InvalidRequestError.prototype.constructor = InvalidRequestError;

util.inherits(InvalidRequestError, Errors);

module.exports = InvalidRequestError;