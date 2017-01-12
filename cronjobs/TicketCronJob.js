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
		
		Object.keys(ticket_list).forEach(function (ticketKey) {
			
			var ticket = JSON.parse(ticket_list[ticketKey]);

			// 如果当前票的状态是locked, 查看当前票的过期时间
			// 如果当前票的过期时间 <= 当前时间, 则更新当前票的状态: change locked to pending
			// 并将状态变化广播出去
			if (ticket.status === 'locked') {
				if (ticket.expiredAt === null || ticket.expiredAt === '' || moment().format('x') > ticket.expiredAt) {
					// the ticket is expired
					ticket.status = 'pending';	

					// TODO.
					// should be update TicketPool ticket status to pending				
				} 
			}

			var theTicketKey = ticketKey + "_" + ticket.status;
			ticket.key = theTicketKey;

			// ['pending', 'locked', 'saled']

			// TODO.
			// should be delete ticket first 
			// c62479_005_20170101_19:40_CNXJ0056301_FR1A01#04_locked
			// c62479_005_20170101_19:40_CNXJ0056301_FR1A01#04_locked

			TicketQueneRepo.add(theTicketKey, ticket, redisClient).done(function (ok) {
				
			});

		});

	});
}

module.exports = function () {
	ticketJob();
	return new CronJob('* * * * *', ticketJob, null,	true, 'Asia/Shanghai');

}