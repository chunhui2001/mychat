
var util = require('util');

function Errors() {
	// body...
}

Errors.prototype.instance = function () {
	// throw new Error('Error#instance must be overridden by subclass');
	return { name: this.name, message: this.message, code: this.code, status: this.status, error: true};
}


util.inherits(Errors, Error);

module.exports = Errors;