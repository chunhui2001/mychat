var CronJob = require('cron').CronJob;
var moment = require('moment');
var redis = require('redis');

var redisClient = redis.createClient('redis://127.0.0.1:6379/9');

var TicketPoolRepository = require('../repository/cinema/TicketPoolRepository');
var TicketQueneRepository = require('../repository/cinema/TicketQueneRepository');


var TicketPoolRepo = new TicketPoolRepository();
var TicketQueneRepo = new TicketQueneRepository();

function ticketJob(argument) {

	console.log('');
	console.log('');
	console.log('');
	console.log('A new job started:');
	console.log('==============================');
	console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
	console.log('');

	// 从票池中取出所有票，根据状态推入 待售、锁定、已售
	TicketPoolRepo.list(redisClient).done(function (ticket_list) {

		console.log(Object.keys(ticket_list).length, 'Cron Job: Object.keys(ticket_list)');
		
		Object.keys(ticket_list).forEach(function (ticketKey) {
			
			var ticket = JSON.parse(ticket_list[ticketKey]);
			var theTicketKey = ticketKey + "_" + ticket.status;
			ticket.key = theTicketKey;
			TicketQueneRepo.add(theTicketKey, ticket, redisClient).done(function (ok) {
				
			});

		});
	});
}

module.exports = function () {
	ticketJob();
	return new CronJob('* * * * *', ticketJob, null,	true, 'Asia/Shanghai');

}