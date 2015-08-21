var userID = localStorage.getItem('userID');
if (userID === undefined)										// if user has not logged in
	window.location.assign("log_in.html");

$(document).ready(function(){
	$('#addDate').datepicker();

	$('#saveAdd').click(function(){										// confirms addition entry and saves to db
		var addTitle = $('#addTitle').val();
		var addDesc = $('#addDesc').val();
		var addActors = $('#addActors').val();
		var releaseDate = $('#addDate').val();
		var copies = $('#addCopies').val();
		var category = $('#addCategory').val();

		if (addTitle !== "" && addDesc !== "" && addActors !== "" && releaseDate !== "" && copies !== ""){
			manager.addMovie(localStorage['userID'], addTitle, addDesc, addActors, releaseDate, copies, category);
		}
		else    														// display error message
			$('#status').append("Please fill in all fields")
	});

})