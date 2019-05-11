var express = require('express');
var router = express.Router();

var User = require(__dirname + '/../models/User');
var APIdata = require(__dirname + '/../models/APIdata');

router.get('/user/new', function (req, res) {

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/user/new"
    }
    console.log(log);
    var createPage = {'content':"hello"}
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', createPage);
});

router.get('/users/:id/edit', function (req, res) {


    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': req.params.id,
        'route': "/user/:id/edit"
    }
    console.log(log);


    User.getUserByName(req.params.id, function (u) {
        res.status(200);
        res.setHeader('Content-Type', 'text/html')
        res.render('user_details', {
            user: u
        });
    });
});

router.put('/users/:id', function (req, res) {


	var log = {
		'timestamp': Date(),
		'httpverb': "PUT",
		'username': req.body.id,
		'route': "/users/:id"
	}
	console.log(log);

	User.getUserByName(req.params.id, function (u) {
		User.getUsers(function (users) {
			var found = false;
			users.forEach(function (a) {
				if (a["name"] == req.body.id && req.body.id != req.params.id) {
					found = true;
				}
			});
			if (found) {
				u['response'] = "<p class='red'>Username taken.</p>";
				res.status(200);
				res.setHeader('Content-Type', 'text/html')
				res.render('user_details', {
					user: u
				});
			} else if (req.body.password == req.body.password2) {
				var updatedUser = "";
				if (req.body.id != req.params.id) {
					updatedUser = req.body.id;
				}
				u['name'] = req.body.id;
        u['email'] = req.body.email;
				u['firstname'] = req.body.fname;
				u['lastname'] = req.body.lname;
				u['password'] = req.body.password;
				User.setUser(req.params.id, u, function () {
					User.getUserByName(req.body.id, function (us) {
						us['response'] = "<p class='green'>User details updated.</p>";
						res.status(200);
						res.setHeader('Content-Type', 'text/html')
						res.render('user_details', {
							updatedUser: updatedUser,
							user: us
						});
					});
				});
			} else {
				u['response'] = "<p class='red'>Entered passwords did not match.</p>";
				res.status(200);
				res.setHeader('Content-Type', 'text/html')
				res.render('user_details', {
					user: u
				});
			}
		})
	});
});

router.delete('/users/:id', function (req, res) {


    var log = {
		'timestamp': Date(),
		'httpverb': "DELETE",
		'username': req.params.id,
		'route': "/users/:id"
	}
	console.log(log);

	User.deleteUser(req.params.id); //need to make a deleteUser function

	User.getUsers(function (u) {
		res.status(200);
		res.setHeader('Content-Type', 'text/html')
		res.render('index', {
			newuser: req.params.id,
			users: u
		});
	});
});

router.post('/users', function (req, res) {


	var log = {
		'timestamp': Date(),
		'httpverb': "POST",
		'username': req.body.id,
		'route': "/users"
	}
	console.log(log);
  console.log(req.body);

	User.checkNewUser(req.body.id, req.body.password, req.body.password2, function (response) {

		if ((response == "User already taken") || (response == "Passwords do not match")) { //if new user isn't valid
			res.status(200);
			res.setHeader('Content-Type', 'text/html')
			res.render('user_details', {
				response2: response
			}); //lets login page show error message by sendinb back user information with result information
		} else { //if new user is valid
			User.createUser(req.body.id, req.body.password, req.body.fname, req.body.lname, req.body.email, function () {
				User.getUsernames(function (users) {
					res.status(200);
					res.setHeader('Content-Type', 'text/html')
					res.render('index', {
						newuser: req.body.id,
						users: users
					}); //sends you to index
				}); //creates new user
			}); //creates object of new user
		}
	}); //gives response on whether this is a proper new user
});

router.get('/login', function (request, response) {



	var log = {
		'timestamp': Date(),
		'httpverb': "GET",
		'username': request.query.player_name,
		'route': "/login"
	}
	console.log(log);

	User.checkUsername(request.query.player_name, request.query.player_password, function (res, userActual) {
		var user_data = {
			username: request.query.player_name,
			password: request.query.player_password,
			result: res
		};
		if (res != "Wrong user/password") {
			response.status(200);
			response.setHeader('Content-Type', 'text/html')
			response.render('user_details', {
				user: userActual
			});
		} else {
			User.getUsers(function (users) {
				response.status(200);
				response.setHeader('Content-Type', 'text/html')
				response.render('index', {
					user: user_data,
					users: users
				}); //lets login page show error message
			});
		}
	});
});

router.get('/bumps', function(req, res){
  var log = {
    'timestamp': Date(),
    'httpverb': "GET",
    'apikey': req.query.apikey,
    'route': "/bumps"
  }
  console.log(log);

  User.checkAPIkey(req.query.apikey, function(result){
    if(result){
      APIdata.getBumps(function(rows){
        var filteredData;
        if(req.query.keywordtype=="beforedate"){
            filteredData=rows.filter(function(row, i, arr){
              arr[i]={"geometry":row["geometry"],"type":row["type"]};
              return (new Date(row["date"])<new Date(req.query.keyword));
            })
        }
        else if(req.query.keywordtype=="afterdate"){
          filteredData=rows.filter(function(row, i, arr){
            arr[i]={"geometry":row["geometry"],"type":row["type"]};
            return (new Date(row["date"])>new Date(req.query.keyword));
          })
        }
        else if(req.query.keywordtype=="zipcode"){
          filteredData=rows.filter(function(row){
            return (row["zipcode"]==req.query.keyword);
          })
        }
        else if(req.query.keywordtype=="street"){
          filteredData=rows.filter(function(row, i, arr){
            arr[i]={"geometry":row["geometry"],"type":row["type"]};
            return (row["street"].toLowerCase().includes(req.query.keyword.toLowerCase())||req.query.keyword.toLowerCase().includes(row["street"].toLowerCase()));
          })
        }
        else if(req.query.keywordtype=="borough"){
          filteredData=rows.filter(function(row, i, arr){
            arr[i]={"geometry":row["geometry"],"type":row["type"]};
            return (row["borough"].toLowerCase()==req.query.keyword.toLowerCase());
          })
        }
        filteredData.forEach(function(row, i, arr){
          arr[i]={"geometry":row["geometry"],"type":row["type"]};
        });
        res.send(JSON.stringify(filteredData));
      });
    }
    else{
      res.send(JSON.stringify({ errmessage: 'API key not found' }));
    }

  });
});

router.get('/crashes', function(req, res){
  var log = {
    'timestamp': Date(),
    'httpverb': "GET",
    'apikey': req.query.apikey,
    'route': "/crashes"
  }
  console.log(log);

  User.checkAPIkey(req.query.apikey, function(result){
    if(result){
      APIdata.getCrashes(function(rows){
        var filteredData;
        if(req.query.keywordtype=="beforedate"){
            filteredData=rows.filter(function(row, i, arr){
              arr[i]={"geometry":row["geometry"],"type":row["type"]};
              return (new Date(row["date"])<new Date(req.query.keyword));
            })
        }
        else if(req.query.keywordtype=="afterdate"){
          filteredData=rows.filter(function(row, i, arr){
            arr[i]={"geometry":row["geometry"],"type":row["type"]};
            return (new Date(row["date"])>new Date(req.query.keyword));
          })
        }
        else if(req.query.keywordtype=="zipcode"){
          filteredData=rows.filter(function(row, i, arr){
            arr[i]={"geometry":row["geometry"],"type":row["type"]};
            return (row["zipcode"]==req.query.keyword);
          })
        }
        else if(req.query.keywordtype=="street"){
          filteredData=rows.filter(function(row, i, arr){
            arr[i]={"geometry":row["geometry"],"type":row["type"]};
            return (row["street"].toLowerCase().includes(req.query.keyword.toLowerCase())||req.query.keyword.toLowerCase().includes(row["street"].toLowerCase()));
          })
        }
        else if(req.query.keywordtype=="borough"){
          filteredData=rows.filter(function(row, i, arr){
            arr[i]={"geometry":row["geometry"],"type":row["type"]};
            return (row["borough"].toLowerCase()==req.query.keyword.toLowerCase());
          })
        }
        filteredData.forEach(function(row, i, arr){
          arr[i]={"geometry":row["geometry"],"type":row["type"]};
        });
        res.send(JSON.stringify(filteredData));
      });
    }
    else{
      res.send(JSON.stringify({ errmessage: 'API key not found' }));
    }

  });
});

module.exports = router;
