var fireBaseURL = "https://tronkmovies.firebaseio.com/";
var fireBase = new Firebase(fireBaseURL);
var USERLIST = "userlist";
var MOVIELIST = "movielist";

function Manager(){

	this.addMovie = function(userID, title, description, actors, releaseDate, numCopies, category){
		// start out new movie with borrowed status false
		var newMovie = new Movie(userID, title, description, actors, releaseDate, numCopies, category);
		var props = newMovie.returnProps();
		
		var key = fireBase.child(MOVIELIST).push(newMovie.returnProps());  // save and obtain key
		$('#status').text("Movie Added Successfully");
		setTimeout(function(){
			window.location.assign("user.html");
		}, 3000);
		// manager.listMovies();
	}

	this.updateMovie = function(movieID, title, description, actors, releaseDate, numCopies, category){
		var datapoint = fireBase.child(MOVIELIST).child(movieID);

		datapoint.once("value", function(snapshot){
			datapoint.child('title').set(title);
			datapoint.child('description').set(description);
			datapoint.child('actors').set(actors);
			datapoint.child('releaseDate').set(releaseDate);
			datapoint.child('numCopies').set(numCopies);	
			datapoint.child('category').set(category);	
		});		

		$('#status').text("Movie Updated Successfully");
		setTimeout(function(){
			window.location.assign("user.html");
		}, 3000);
	}

	this.returnMovie = function(userID, movieID){
		var movieRef = fireBase.child(MOVIELIST).child(movieID);

		// increment number of copies
		var copies = movieRef.child("numCopies");
		copies.once("value", function(snapshot){	
			copies.set(snapshot.val() + 1);

			//  remove from movie's borrower list
			var borrowerList = movieRef.child('borrowerlist')
			borrowerList.once("value", function(snapshot){
				var list = snapshot.val();
				list.splice(list.indexOf(userID), 1);     // remove user from movie's list

				borrowerList.set(list);					// set list to new value
			});

			// remove from user's borrowed list
			var borrowedList = fireBase.child(USERLIST).child(userID).child('borrowedlist')
			borrowedList.once("value", function(snapshot){
				list = snapshot.val();
				list.splice(list.indexOf(movieID), 1);     // remove movie from user's list

				borrowedList.set(list);					// set list to new value

				$('#status').text("Movie Returned Successfully");
				setTimeout(function(){
					window.location.assign("user.html");
				}, 3000);
			});
		});
	}

	this.deleteMovie = function(movieID){
		var borrowerList = fireBase.child(MOVIELIST).child(movieID).child('borrowerlist')

		// clear movie from every borrowers' list
		borrowerList.once("value", function(snapshot){
			var list = snapshot.val();
			if (list !== null){
				for (var i in list)
					manager.returnMovie(movieID, i)  // simulating returning movies to clear storage
			}
			borrowerList.set([])     // making borrower list empty
			fireBase.child(MOVIELIST).child(movieID).remove();
			$('#status').text("Movie Deleted Successfully");
			setTimeout(function(){
				window.location.assign("user.html");
			}, 3000);
		})
	}

	this.borrowMovie = function(userID, movieID){
		var movieRef = fireBase.child(MOVIELIST).child(movieID);

		// check copies available
		var copies = movieRef.child("numCopies");
		copies.once("value", function(snapshot){
			if ((snapshot.val() - 1) > 0){
				copies.set(snapshot.val() - 1);
				// add user to movie list
				var list;
				var borrowerList = movieRef.child('borrowerlist')
				borrowerList.once("value", function(snapshot){

					list = snapshot.val();
					if (list === null){
						list = []
					}
					list.push(userID);
					borrowerList.set(list);
				});
				
				//add movie to user list
				var borrowedList = fireBase.child(USERLIST).child(userID).child('borrowedlist')
				borrowedList.once("value", function(snapshot){
					list = snapshot.val();
					if (list === null){
						list = []
					}
					list.push(movieID);
					borrowedList.set(list);

					$('#status').text("Movie Borrowed Successfully");
					setTimeout(function(){
						window.location.assign("user.html");
					}, 3000);
				});
			}
			else{
				$('#status').text("No copies available for rent");
				setTimeout(function(){
					window.location.assign("user.html");
				}, 3000);
			}
		});
	}

	this.listMovies = function(){
		var movieList = fireBase.child(MOVIELIST);
		var categories = {"action": [0, '#actionCat'], "adventure": [0, '#adventureCat'], "comedy": [0, '#comedyCat'],
			 "crime": [0, '#crimeCat'], "drama": [0, '#dramaCat'], "thriller": [0, '#thrillerCat'], 
			 "romance": [0, '#romanceCat']};
		movieList.once("value", function(snapshot){
			var fullList = snapshot.val();

			if (fullList !== null){
				// loop through movies and attach links in respective categories
				for (var i in fullList){
					$(categories[fullList[i].category][1]).append("<li><a href='#' class= 'movielinks' movieID='" + i 
						+ "'>" + fullList[i].title + "</a></li>");
					categories[fullList[i].category][0]++;					// increment so as to keep track of empty categories
				}
				$(status).text("Movies Loaded.");
			}
			else {
				$(status).text("No Movies Yet!");
			}
			
			for (var i in categories){
				if (categories[i][0] === 0){					// category empty
					$(categories[i][1]).append("<p>No movies in category yet. Be the first to Add One!!!</p>");
				}
			}

			// handler to handle clicked links
			$('.movielinks').click(function(){
				var movieID = $(this).attr('movieID');
				movieList.child(movieID).once("value", function(snapshot){
					var movieObject = snapshot.val();
					localStorage['movieID'] = movieID;
					localStorage['userID'] = userID;
					localStorage['movieTitle'] = movieObject.title;
					localStorage['movieDesc'] = movieObject.description;
					localStorage['movieActors'] = movieObject.actors;
					localStorage['releaseDate'] = movieObject.releaseDate;
					localStorage['category'] = movieObject.category;
					localStorage['numCopies'] = movieObject.numCopies;

					// if user should be able to edit/delete movies on next page
					if (movieObject.userID === userID){
						localStorage['saveMovie'] = true;
						localStorage['deleteMovie'] = true;
					}
					else{
						localStorage['saveMovie'] = false
						localStorage['deleteMovie'] = false;	
					}

					if (movieObject.borrowerlist !== null){
						var inArray = false;
						for (var i in movieObject.borrowerlist){
							if (movieObject.borrowerlist[i] === userID) inArray = true           // if user exists in borrower array
						}

						// if user has already borrowed, provide only button to return
						if (inArray){
							localStorage['borrowMovie'] = false;
							localStorage['returnMovie'] = true;
						}
						// provide button to borrow, hide button to return since user hasn't borrowed
						else{
							localStorage['borrowMovie'] = true;
							localStorage['returnMovie'] = false;
						}
					}else{														// if list has not been started, user can borrow
						localStorage['borrowMovie'] = true;
						localStorage['returnMovie'] = false;
					}
					window.location = "movie.html";
				})
			})
		});
	}
}

function Movie(userID, title, description, actors, releaseDate, numCopies, category){

	// method that could be called to initialize instance, or edit values
	this.title = title;
	this.description = description;
	this.actors = actors;
	this.releaseDate = releaseDate;
	this.numCopies = numCopies;
	this.category = category;
	this.userID = userID;

	this.returnProps = function(){
		var retObj = {};
		for (var i in this){
			if (typeof(this[i]) !== 'function' && typeof(this[i]) !== 'object')
				retObj[i] = this[i];
		}
		return retObj;
	}
}

var manager = new Manager();