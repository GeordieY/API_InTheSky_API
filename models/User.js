var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
var doc = new GoogleSpreadsheet('1QMyQyfTo4FLFeOK5HXHXs6JyE4ng0IWw4yl78b4TWcA');

exports.setUser = function (name, ob, callback) { //updates user data
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (name == a[i]["name"]) {
				a[i] = ob;
				a[i]["lastupdate"] = Date();
				a[i].save(callback);
			}
		}
	});

}

exports.setUserNoWait = function (ob) { //updates user data
	//ob["lastupdate"]=Date();
	ob.save();

}

exports.deleteUser = function (name) {
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (name == a[i]["name"]) {
				a[i].del();
			}
		}
	});
}

exports.checkUsername = function (username, password, callback) { //handles login
	exports.getUsers(function (user_data) {
		var found = false;
		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["name"]) {
				found = true;
				if (password == user_data[i]["password"]) {
					callback("logged in", user_data[i]);
				} else {
					callback("Wrong user/password", null);
				}
			}
		}
		if (!found) {
			callback("Wrong user/password", null);
		}

	});
}

exports.checkNewUser = function (username, password, password2, callback) { //checks whether new user is already taken
	exports.getUsers(function (user_data) {
		var found = false;
		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["name"]) {
				found = true;
				callback("User already taken");
			}
		}
		if (!found) {
			if (password != password2) {
				callback("Passwords do not match");
			} else {
				callback("Logged in");
			}
		}
	});
}

exports.createUser = function (username, password, fname, lname, email, callback) { //creates new user
	var user_object = new Object();
	user_object["name"] = username;
	user_object["password"] = password;
	user_object["apikey"] = makeid(8);
	user_object["firstname"] = fname;
	user_object["lastname"] = lname;
	user_object["email"] = email;
	user_object["creationdate"] = Date();
	user_object["lastupdate"] = Date();
	doc.useServiceAccountAuth(creds, function (err) {
		doc.addRow(1, user_object, callback);
	});
}

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

exports.getUserByName = function (username, callback) { //returns user object by username

	exports.getUsers(function (user_data) {
		var found = false;
		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["name"]) {
				found = true;
				callback(user_data[i]);
			}
		}
		if (!found) {
			console.log("No user found");
			console.trace();
			callback(null);
		}
	});
}

exports.getUsers = function (callback) { //gets users data from users.csv

	doc.useServiceAccountAuth(creds, function (err) {
		doc.getRows(1, function (err, rows) {
			callback(rows);

		});

	});
}

exports.getUsernames = function (callback) {
	exports.getUsers(function (user_data) {
		callback(user_data.map(function (a) {
			return a["name"];
		}));
	});
}

exports.checkAPIkey = function (apikey, callback){
	exports.getUsers(function (user_data) {
		var keyfound = false;
		user_data.forEach(function (user) {
			if(keyfound||user["apikey"]==apikey){
				keyfound= true;
			}
			else{
				keyfound= false;
			}
		});
		callback(keyfound);
	});
}

/*exports.sendUsers=function(user_data) { //updates users.csv
	var string = "username,password,games_played,games_won,games_lost,paper,rock,scissors,first name,last name";
	for (var i = 0; i < user_data.length; i++) {
		var a = ""
		a += "\n" + user_data[i]["name"] + "," + user_data[i]["password"] + "," + user_data[i]["games_played"] + "," + user_data[i]["games_won"] + "," + user_data[i]["games_lost"] + "," + user_data[i]["paper"] + "," + user_data[i]["rock"] + "," + user_data[i]["scissors"]+ "," + user_data[i]["fname"]+ "," + user_data[i]["lname"];
		string += a;
	}
	fs.writeFileSync("data/users.csv", string, "utf8");
}*/
