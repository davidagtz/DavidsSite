
// Is this a dev environment
const __dev__ = true;

// private info
let fs = require('fs');
const config = fs.readFileSync('configurations.json', {
	encoding : 'utf-8'
});

// Server Code
let express = require('express');
let app = express();
app.use(express.static("www"));

// Initialize the template engine
let pug = require('pug');
let templateNames = ['index.pug'];
let templates = {};
templateNames.forEach((file) => {
	templates[file] = pug.compileFile("templates/" + file);
});
function sendPug(res, file, json) {
	if(__dev__)
		templates[file] = pug.compileFile("templates/" + file);
	res.send(templates[file](json));
}

// Make CSS from Css preprocessor
let sass = require('sass');
let sassNames = ['main.sass'];
sassNames.forEach((css) => {
	sass.renderSync({
		file : "sass/" + css,
		outFile : "www/css/" + css.replace(".sass", ".css")
	});
});

// just some functions
let throws = (err) => {if(err) throw err};


// Connect to Database
let mdb = require('mongodb');
const url = "mongodb://" + config.user + ":" + config.password + "@localhost:27017/" + config.db;
let mongo = mdb.MongoClient;
mongo.connect(url)
	.then((err, databases) => {
		throws(err);
		let db = databases.db(config.db);
		let admin = db.admin();
		console.log(admin.authenticate);
	}).catch((err) => {
		console.log(err);
		process.exit();
	});

// Start the server
let port = process.env.port || 80
app.listen(port);