var fireBaseURL = "https://tronkmovies.firebaseio.com/";

//Registering Users
var regfunc = function(){
var regUsers = new Firebase(fireBaseURL);

var USERLIST = "userlist";
var emailField = $("#reg_email").val();
var passField = $("#reg_pass").val();
var reg_firstName = $("#reg_first_name").val();
var reg_lastName = $("#reg_last_name").val();
var reg_address = $("#reg_add").val()
 
  regUsers.createUser(
  {
    email: emailField,
    password: passField
  }, 
  
  function(error, userData) {
    if (error) {
      switch (error.code) {
        case "EMAIL_TAKEN":
          $("#sign-up-error").html("The new user account cannot be created because the email is already in use.");
          break;
        case "INVALID_EMAIL":
          $("#sign-up-error").html("The specified email is not a valid email.");
          break;
        default:
          $("#sign-up-error").html("Error creating user." + error);
      }
    } else {
        regUsers.child(USERLIST).child(userData.uid).set({
          email: emailField,
          firstName: reg_firstName,
          lastName: reg_lastName,
          homeAddress: reg_address,
          password: passField
        });
        window.location = "index.html"
  }
  });
}

// To Login Users with authentication
var loginfunc = function(){
  var logInUsers = new Firebase(fireBaseURL);

  var loginEmail = $("#signin-email").val();
  var loginPass = $("#signin-password").val();

  logInUsers.authWithPassword(
  {
    email: loginEmail,
    password: loginPass
  }, 
  
  function(error, authData) {
    if (error) {
      $("#show_error").html("Login Failed!, you need to register first");
    } 
    else {
      console.log("Authenticated successfully with payload:", authData);
      localStorage['userID'] = authData.uid;
       window.location = "user.html"
    }
  });
}

//Forget Password
var forget_passfunc = function(){
var reset_pass = $("#pass-reset-email").val();
var forgetPass = new Firebase(fireBaseURL);
forgetPass.resetPassword(
{
  email: reset_pass
}, 

function(error){
      if (error === null){
        $("#reset_msg").html("Password reset email sent successfully.");
        $("#reset_msg2").html("Check your email for your password reset information.")
      }else{
  
      $("#reset_msg").html("Error sending password reset email.");
        
      }
    });
}

//Change Password
var changePassfunc = function(){
var pass_Email = $("#pass-change-email").val();
var old_Password = $("#old-password").val(); 
var new_Password = $("#new-password").val(); 

var changePass = new Firebase(fireBaseURL);
changePass.changePassword(
{
  email: pass_Email,
  oldPassword: old_Password,
  newPassword: new_Password
}, 

function(error) {
  if (error) {
    switch (error.code) {
      case "INVALID_PASSWORD":
        $("#changePass_msg").html("The specified user account password is incorrect.");
        break;
      case "INVALID_USER":
        $("#changePass_msg").html("The specified user account does not exist.");
        break;
        default:
        $("#changePass_msg").html("The specified user account does not exist.");
    }
  } else {
    $("#changePass_msg").html("User password changed successfully!");
  }
}
);
}