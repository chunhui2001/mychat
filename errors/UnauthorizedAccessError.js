"use strict";

var util = require('util');
var Errors = require('./Errors');

function UnauthorizedAccessError(code, error) {
    Error.call(this, typeof error === "undefined" ? undefined : error.message);
	Error.captureStackTrace(this, this.constructor);
    this.name = "UnauthorizedAccessError";
    this.message = typeof error === "undefined" ? '401 - Unauthorized' : error.message;
    this.code = typeof code === 'undefined' ? 401 : code;
    this.status = 401;
    this.inner = error;
}

UnauthorizedAccessError.prototype = Object.create(Error.prototype);
UnauthorizedAccessError.prototype.constructor = UnauthorizedAccessError;

util.inherits(NotFoundError, Errors);

module.exports = UnauthorizedAccessError;