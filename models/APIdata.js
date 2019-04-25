var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
var doc = new GoogleSpreadsheet('1QMyQyfTo4FLFeOK5HXHXs6JyE4ng0IWw4yl78b4TWcA');

/*exports.sendVillains=function(browser_data) { //updates villains.csv
		var string = "name,special,games_played,games_won,games_lost,paper,rock,scissors";
	for (var i = 0; i < browser_data.length; i++) {
		var a = ""
		a += "\n" + browser_data[i]["name"] + "," + browser_data[i]["special"] + "," + browser_data[i]["games_played"] + "," + browser_data[i]["games_won"] + "," + browser_data[i]["games_lost"] + "," + browser_data[i]["paper"] + "," + browser_data[i]["rock"] + "," + browser_data[i]["scissors"];
		string += a;
	}
	fs.writeFileSync("data/villains.csv", string, "utf8");
}*/

exports.getBumps=function(callback){

<<<<<<< HEAD
	doc.useServiceAccountAuth(creds, function (err) {
		doc.getRows(2, function (err, rows) {
			callback(rows);
		});
	});
}

exports.getCrashes=function(callback){

	doc.useServiceAccountAuth(creds, function (err) {
		doc.getRows(3, function (err, rows) {
			callback(rows);
		});
	});
=======

>>>>>>> 9c9e83bf7afe3f51929148bf4e86c1cf06bade7d
}
