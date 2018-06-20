
// Is this a dev environment
const __dev__ = true;
console.debug = (str) => {
	if(__dev__){
		console.log(str);
	}
}

// private info
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('configurations.json', {
	encoding : 'utf-8'
}));

// Used for connecting to the database
const url = "mongodb://" + config.user + ":" + config.password + "@localhost:" + config.port + "/" + config.db;
const assert = require('assert');
const throws = assert.ifError;

// Salt and Hash library
const bcrypt = require('bcrypt');

// Server Code
const express = require('express');
let app = express();
app.use(express.static("www"));

// MiddleWare stuff

// Make Sessions
// session store
const session = require('express-session');
let MongoDBStore = require('connect-mongodb-session')(session);
let store = new MongoDBStore({
	uri: url,
	databaseName: config.db,
	collection: config.collections[0]
});
store.on('error', throws);

app.use(session({
	secret: config.secret,
	saveUninitialized: true,
	resave: true,
	store: store
}));

// Add cookie parser
const cp = require('cookie-parser');
app.use(cp());

// Initialize the template engine
const pug = require('pug');
let templateNames = fs.readdirSync('templates');
// let templateNames = ['index.pug'];
let templates = {};
templateNames.forEach((file) => {
	templates[file] = pug.compileFile("templates/" + file);
});
function sendPug(res, file, json, always = false) {
	if(__dev__ || always)
		templates[file] = pug.compileFile("templates/" + file);
	res.send(templates[file](json));
}

// Make CSS from Css preprocessor
const sass = require('sass');
let sassNames = fs.readdirSync('sass');
// let sassNames = ['main.sass', 'index.sass'];
function renderSass(css) {
	if(__dev__){
		// console.log(css);
		let res = sass.renderSync({
			file: "sass/" + css
		});
		// console.log(res.css.toString('utf-8'));
		fs.writeFileSync("www/css/" + css.replace(".sass", ".css"), res.css);
	}
}
sassNames.forEach(renderSass);

// Connect to Database
const mdb = require('mongodb');
const mongo = mdb.MongoClient;
const articles = config.collections[1];
const accounts = config.collections[2];
const wrongUserOrPassword = "Wrong Username or Password";
mongo.connect(url, (err, databases) => {
	throws(err);
	
	console.log("Successfully Connected");

	// declarations of collections
	let db = databases.db(config.db);

	// Routing to pages

	// home
	app.get("/", (req, res) => {
		['main.sass', 'index.sass'].forEach(renderSass);
		sendPug(res, 'index.pug', {
			articles: ["DAS", "DA", "DADAD", "DASD", "DSA", "DASD", "FUXK"]
		}, true);
	});

	// login page
	app.get("/login", (req, res) => {
		['main.sass'].forEach(renderSass);
		let sendmsg = req.query.msg;
		sendPug(res, 'login.pug', {
			msg : sendmsg
		});
	});

	// Authentication
	app.get("/a", (req, res) => {
		if(req.query.user && req.query.pwd) {
			db.collection(accounts).findOne({
				"user" : req.query.user
			})
			.then((user) => {
				if(user == null){
					throw new Error(wrongUserOrPassword);
				} 
				else {
					return bcrypt.compare(req.query.pwd, user.pwd);
				}
			})
			.then((isSame) => {
				if(isSame){
					// res.setHeader("Set-Cookie", "s=" + user._id + ";" + stringify(req.cookies));
					return db.collection(accounts).updateOne({
						_id : user._id
					},
					{
						$push : {
							sessionIDs : req.sessionID
						}	
					})
				}
				else {
					throw new Error(wrongUserOrPassword)
				}
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				if(err.message == wrongUserOrPassword){
					loginMsg(res, err.message);
				}
				else{
					console.log(err);
					res.status(500);
				}
			});
		}
		else {
			loginMsg(res, "Incomplete Username or Password fields");
		}
	});
	// makes login display a message
	function loginMsg(res, str, options){
		if(options == null)
			options = {
				msg: str
			};
		else
			options['msg'] = str;
		console.log(options, makeQuery("login", options))
		res.redirect(makeQuery("login", options));
	}
	/* takes cookie as a json object and makes it into a string
	   following the key=value;key2=value2 format				*/
	function stringify(cookie) {
		let out = "";
		for(key in cookie){
			out += key + "=" + cookie[key] + ";";
		}
		return out;
	}

	app.get("/signup", (req, res) => {
		['main.sass'].forEach(renderSass);
		sendPug(res, "signup.pug", {});
	});
	// Makes signup msg
	function signupMsg(res, mes) {
		res.redirect(makeQuery("signup", {
			msg: mes
		}));
	}

	app.get("/init", (req, res) => {
		const pwd = req.query.pwd;
		if(pwd.length < 7 && pwd.length > 72){
			signupMsg(res, "Password length must be between 7 and 72 characters.");
		}
		const email = req.query.email;
		const user = req.query.user;
		loginMsg(res, "Success", {
			isError: false
		});
	});

	app.get("/exists", (req, res) => {
		const type = req.query.type;
		if(type){
			if(type == "account"){
				if(req.query.user)
					db.collection(accounts).findOne({
						"user" : req.query.user
					})
					.then((isThere) => {
						res.send({
							exists : isThere?true:false
						});
					})
					.catch((err) => console.log(err));
				else
					res.send({
						err: "No account specified"
					});
			}
		}
		else {
			res.send({
				err : "Type not specified"
			});
		}
	});

	// 404 for unknown requests
	app.all('*', (req, res) => {
		res.sendStatus(404);
	});

	/* makes query using json objects and url
	   if only json is provided then it makes 
	   only the query from ? 
	   url must be string that does not start with / */
	function makeQuery(url, json) {
		if(json == null){
			json = url;
			url = "";
		}
		url += "?";
		for(query in json)
			url += query + "=" + json[query] + "&";
		url = url.substring(0, url.length - 1);
		return url;
	}

	// Start the server
	const port = process.env.port || 80;
	app.listen(port, () => console.log("Listening on port " + port));
});