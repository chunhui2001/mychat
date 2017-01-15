var CronJob = require('cron').CronJob;
var moment = require('moment');

var redisClient = require('../providers/RedisProvider')['REDIS_CINEMA_CLIENT'];

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
				} 
			}

			var theTicketKey = ticketKey + "_" + ticket.status;
			ticket.key = theTicketKey;

			var keysShouldBeDeleted = ['pending', 'locked', 'saled'].filter(function (status) {
				return status !== ticket.status && status != 'saled';
			}).map(function (status) {
				if (status !== ticket.status) return ticketKey + "_" + status;
			});

			TicketQueneRepo.remove(keysShouldBeDeleted, redisClient).done(function (affectRowCount) {
				if (keysShouldBeDeleted > 0)
					console.log(keysShouldBeDeleted, 'keysShouldBeDeleted[' + affectRowCount + ']');
			});

			TicketQueneRepo.add(theTicketKey, ticket, redisClient).done(function (ok) {
				// TODO.
				// 将状态变化广播出去
			});

		});

	});
}

module.exports = function () {
	ticketJob();
	return new CronJob('* * * * *', ticketJob, null,	true, 'Asia/Shanghai');

}