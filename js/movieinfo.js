var movieID = localStorage['movieID'];
var userID = localStorage['userID'];

if (userID === undefined)										// if user has not logged in
	window.location.assign("log_in.html");

if (!localStorage.getItem("reload")) {    // if page has not been reloaded
    // set reload
    localStorage.setItem("reload", "true");
    location.reload();
}
else {
    localStorage.removeItem("reload");
}


$(document).ready(function(){
	var movieTitle = localStorage['movieTitle'];
	var movieDesc = localStorage['movieDesc'];
	var movieActors = localStorage['movieActors'];
	var releaseDate = localStorage['releaseDate'];
	var copies = localStorage['numCopies'];
	var category = localStorage['category'];
	
	$('#movieReleaseDate').datepicker();


	$('#movieTitle').val(movieTitle);
	$('#movieDesc').val(movieDesc);
	$('#movieActors').val(movieActors);
	$('#movieReleaseDate').val(releaseDate);
	$('#movieCopies').val(copies);
	$('#movieCategory').val(category);

	// if the user can edit/delete movie, provide buttons
	if (localStorage['saveMovie'] === 'true')
		$('#saveMovie').show();
	if (localStorage['deleteMovie'] === 'true')
		$('#deleteMovie').show();
	if (localStorage['borrowMovie'] === 'true')
		$('#borrowMovie').show();
	if (localStorage['returnMovie'] === 'true')
		$('#returnMovie').show();

	/*
	* 			Editing handlers
	*			Edit fields should contain previous selection, and after user changes, he should be able to save.
	*			Saving overwrites previous reference in database
	*/

	$('#saveMovie').click(function(){									// calls when the user saves on edit dialog
		var editTitle = $('#movieTitle').val();
		var editDesc = $('#movieDesc').val();
		var editActors = $('#movieActors').val();
		var editDate = $('#movieReleaseDate').val();
		var editCopies = $('#movieCopies').val();
		var editCategory = $('#movieCategory').val();

		manager.updateMovie(movieID, editTitle, editDesc,
			editActors, editDate, editCopies, editCategory);
	});

	/*
	*			Only user who adds a movie should be allowed to delete
	*/

	$('#deleteMovie').click(function(){								//		delete movie from db
		// dialog to confirm before this action
		manager.deleteMovie(movieID);
	})

	/*
	*			Function to handle movie-borrowing
	*/

	$('#borrowMovie').click(function(){								// 		borrow movie
		manager.borrowMovie(userID, movieID);
	})

	/*
	*			Function to handle movie-returning
	*/ 
	$('#returnMovie').click(function(){									// return movie
		manager.returnMovie(userID, movieID);
	})

});