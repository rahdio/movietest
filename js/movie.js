var userID = localStorage.getItem('userID');
if (userID === undefined)										// if user has not logged in
	window.location.assign("log_in.html");

manager.listMovies();

$(document).ready(function(){

	$('#addMovie').click(function(){							// called when the user clicks add-movie button
		window.location.assign('add.html')
	});

});

