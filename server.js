
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

// domain of the site
const domain = "localhost";

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

// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// multipart
const fileU = require('express-fileupload');
app.use(fileU());

// app.use((req, res, next) => {
// 	console.log(req.session.user.user);
// 	next();
// })

// Add cookie parser
const cp = require('cookie-parser');
app.use(cp());

// Initialize the template engine
const pug = require('pug');
let templates = {};
function compileFolder(folder){
	let templateNames = fs.readdirSync(folder);
	templateNames.forEach((file) => {
		if(fs.lstatSync(folder + "/" + file).isDirectory())
			compileFolder(folder + "/" + file + "/");
		else {
			let path = folder.substring('templates/www'.length);
			templates[path + file] = pug.compileFile(folder + "/" + file);
		}
	});
}
compileFolder('templates/www');
function sendPug(res, req, file, json, always = false) {
	if(__dev__ || always)
		templates[file] = pug.compileFile("templates/www/" + file);
	if(typeof(json) == "boolean"){
		always = json;
		json = {};
	}
	if(!json)
		json = {};
	if(req.session.user){
		json.user = req.session.user.name;
	}
	res.send(templates[file](json));
}
const emailTemplateNames = JSON.parse(fs.readFileSync('templates/email/emails.json'));
let emailTemplates = {};
for(email in emailTemplateNames){
	emailTemplates[email] = {
		"html" : pug.compileFile("templates/email/" + emailTemplateNames[email].html),
		"text" : pug.compileFile("templates/email/" + emailTemplateNames[email].text)
	}
}
/* This function takes in the name given in emails.json 
   and compiles the plain text and html then sends it.
   json has and email and pug json key which hold the object
   for the email and the object for compilation	*/
function sendEmail(name, json, callback) {
	if(__dev__ || always){
		emailTemplates[name].html = pug.compileFile("templates/email/" + emailTemplateNames[email].html);
		emailTemplates[name].text = pug.compileFile("templates/email/" + emailTemplateNames[email].text);
	}
	if(json.pug == undefined)
		json.pug = {};
	if(json.email == undefined)
		throw new Error("No Email contents given");
	json.email.html = emailTemplates[name].html(json.pug);
	json.email.text = emailTemplates[name].text(json.pug);
	if(callback == undefined)
		return transporter.sendMail(json.email);
	else
		transporter.sendMail(json.email, callback);
}


// Make CSS from Css preprocessor
const sass = require('sass');
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
function compileSassFolder(folder) {
	let templateNames = fs.readdirSync(folder);
	templateNames.forEach((file) => {
		let path = folder.substring('sass'.length);
		if (fs.lstatSync(folder + "/" + file).isDirectory()){
			// console.log("./www/css" + path + "/" + file);
			if(!fs.existsSync("./www/css/" + path + "/" + file)){
				fs.mkdirSync("./www/css/" + path + "/" + file);
			}
			compileSassFolder(folder + "/" + file + "/");
		}
		else {
			renderSass(path + "/" + file);
		}
	});
}
compileSassFolder('sass');

// Set up email service
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(config.email.options, config.email.defaults);

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

	// sites for activation
	let activations = {};

	// Routing to pages

	// home
	app.get("/", (req, res) => {
		['main.sass', 'index.sass'].forEach(renderSass);
		sendPug(res, req, 'index.pug', {
			articles: ["DAS", "DA", "DADAD", "DASD", "DSA", "DASD", "FUXK"]
		}, true);
	});

	// login page
	app.get("/login", (req, res) => {
		['main.sass'].forEach(renderSass);
		let sendmsg = req.query.msg;
		sendPug(res, req, 'login.pug', {
			msg : sendmsg
		});
	});
	app.get("/logout", (req, res) => {
		loginMsg(res, "Successfully logged out")
		req.session.destroy(()=>{});
	});

	// Authentication
	app.get("/a", (req, res) => {
		if(req.query.user && req.query.pwd) {
			let userjson;
			db.collection(accounts).findOne({
				"user" : req.query.user.toLowerCase()
			})
			.then((user) => {
				if(user == null){
					throw new Error(wrongUserOrPassword);
				} 
				else {
					userjson = user;
					return bcrypt.compare(req.query.pwd, user.pwd);
				}
			})
			.then((isSame) => {
				if(isSame){
					// res.setHeader("Set-Cookie", "s=" + user._id + ";" + stringify(req.cookies));
					loginMsg(res, "Successful login");
					return pushSession(req, userjson);
				}
				else {
					throw new Error(wrongUserOrPassword)
				}
			})
			.then((res) => {})
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
	// push session to database
	function pushSession(req, user) {
		req.session.user = user;
		req.session.save(()=>{});
		return db.collection(accounts).updateOne({
			_id: user._id
		},
		{
			$push: {
				sessionIDs: req.sessionID
			}
		});
	}
	// makes login display a message
	function loginMsg(res, str, options){
		if(options == null)
			options = {
				msg: str
			};
		else
			options['msg'] = str;
		console.log(options, makeQuery("/login", options))
		res.redirect(makeQuery("/login", options));
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
		sendPug(res, req, "signup.pug", {});
	});
	// Makes signup msg
	function signupMsg(res, mes) {
		res.redirect(makeQuery("signup", {
			msg: mes
		}));
	}

	app.post("/init", (req, res) => {
		// console.log(req)
		const pwd = req.body.pwd;
		if(!pwd || (pwd.length < 7 && pwd.length > 72)){
			console.log(req.body)
			signupMsg(res, "Password length must be between 7 and 72 characters.");
			return;
		}
		const email = req.body.email.toLowerCase();
		if (!email || !email.match(/\w+@\w+\.\w+/)){
			signupMsg(res, "Email is not present.");
			return;
		}
		const user = req.body.user.toLowerCase();
		if(!user){
			signupMsg(res, "User name not valid.");
			return;
		}
		const name = {
			first: req.body.first,
			last: req.body.last
		};
		if(!name.first){
			signupMsg(res, "First name must be present.");
			return;
		}
		if(!name.last){
			delete name["last"];
		}
		let userjson;
		db.collection(accounts).findOne({
			"user": user
		})
		.then(profile => {
			if(profile){
				signupMsg(res, "Username taken.");
				throw new Error("Username taken.")
			}
			else{
				userjson = user;
				loginMsg(res, "Successfully created the account. You must now authenticate the account through email.", {
					isError: false
				});
				return bcrypt.hash(pwd, config.saltRounds);
			}
		})
		.then(hash => {
			return db.collection(accounts).insertOne({
				"user": user,
				"pwd": hash,
				"email": email,
				"activated": false,
				"name" : name
			});
		})
		.then(r => {
			const length = 20;
			let act = generateRandomString(length);
			while(activations[act])
				act = generateRandomString(length);
			activations[act] = user;
			return sendEmail("welcome", {
				email: {
					to: email,
					subject: "Welcome!",
				},
				pug: {
					name: name.first,
					site: domain + "/init/" + act
				}
			})
		})
		.then(info => {
			console.log("Email to " + email + " has " + (info.accepted ? "" : "not ") + "been accepted");
			return pushSession(req, userjson);
		})
		.catch((err) => console.log(err));
	});
	app.get("/init/:act", (req, res) => {
		if(req.params.act){
			const profile = activations[req.params.act];
			db.collection(accounts).updateOne({
				"user": profile
			},{
				$set: {
					"activated": true
				}
			})
			.then(r => {
				loginMsg(res, "Successfully authenticated the account");
				delete activations[req.params.act];
			})
			.catch(err => console.log(err));
		}
		else{
			signupMsg(res, "No activation code.");
		}
	});
	function generateRandomString(len){
		let str = Math.random().toString(36);
		return str.substring(2, 2 + len);
	}

	// Account information
	app.get("/account", (req, res) => {
		if(req.session.user) {
			sendPug(res, req, "account.pug");
		}
		else {
			loginMsg(res, "You must be logged in to perform this action.");
		}
	});

	// article stuff
	app.get("/articles/submit", (req, res) => {
		['main.sass', '/articles/submit.sass'].forEach(renderSass);
		sendPug(res, req, "/articles/submit.pug");
	});
	app.post("/articles/submit", (req, res) => {
		['main.sass', '/articles/submit.sass'].forEach(renderSass);
		const title = req.body.title;
		const des = req.body.d;
		const article = req.body.article;
		const file = req.files.img;
		let err = "";
		if(!des)
			err += "Description Missing. "
		if(!title)
			err += "Title Missing. "
		if(!file)
			err += "Image Missing. "
		if(!article)
			err += "Article Missing. "
		successMsg(res, "Article Successfully Submited");
	});

	// generic success page
	app.get('/success', (req, res) => {
		sendPug(res, req, 'success.pug')
	});
	function successMsg(res, head, mes, options) {
		let sendJson = {};
		if(head)
			sendJson.title = head;
		if(mes)
			sendJson.msg = mes;
		res.redirect(makeQuery("/success", sendJson))
	}

	app.get("/exists", (req, res) => {
		const type = req.query.type;
		if(type){
			if(type == "account"){
				if(req.query.user)
					db.collection(accounts).findOne({
						"user" : req.query.user.toLowerCase()
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