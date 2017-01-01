"use strict";

var util = require('util');

var TicketBaseRepository = require('./TicketBaseRepository');
var _TICKET_QUENE_HASH_KEY 	= 'ticket_quene_';


function TicketQueneRepository() {

}

TicketQueneRepository.prototype.hashKey = function () {
	return _TICKET_QUENE_HASH_KEY;
}


util.inherits(TicketQueneRepository, TicketBaseRepository);


module.exports = TicketQueneRepository;
