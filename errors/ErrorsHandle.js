"use strict";

module.exports = function (err, req, res, next) {

    var errorType = typeof err,
        code = 500,
        msg = { message: "Internal Server Error" };

    switch (err.name) {
        case "UnauthorizedError":
            code = err.status;
            msg = undefined;
            break;
        case "BadRequestError":
        case "UnauthorizedAccessError":
        case "NotFoundError":
            code = err.status;
            msg = err.message;
            break;
        case "AuthorizationError":
            code = err.status;
            msg = err.message;
            break;
        default:
            break;
    }

    console.log(err, 'err');

    return res.status(code).json(err.instance !== 'undefined' ? err.instance() : err);
    // return res.status(code).json(err);

}