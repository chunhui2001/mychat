"use strict";

var util = require('util');

var TicketBaseRepository = require('./TicketBaseRepository');
var _TICKET_POOL_HASH_KEY = 'ticket_pool_';


function TicketPoolRepository() {

}

TicketPoolRepository.prototype.hashKey = function () {
	return _TICKET_POOL_HASH_KEY;
}


util.inherits(TicketPoolRepository, TicketBaseRepository);


module.exports = TicketPoolRepository;
