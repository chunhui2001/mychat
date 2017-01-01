module.exports = {

	detail: function (req, res) {
		
		var cinemaId 	= req.params.movieId;	

		


		// key: cinemaId_roomId_date_time_moveId_seatId
		res.render('cinema/movie', {cinemaId: cinemaId});
	}
}