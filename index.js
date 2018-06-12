
// Is this a dev environment
const __dev__ = true;
console.debug = (str) => {
	if(__dev__){
		console.log(str);
	}
}

// private info
let fs = require('fs');
const config = JSON.parse(fs.readFileSync('configurations.json', {
	encoding : 'utf-8'
}));

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
let sassNames = ['main.sass', 'index.sass'];
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

// just some functions
let throws = (err) => {if(err) throw err};

// Connect to Database
let mdb = require('mongodb');
const url = "mongodb://" + config.user + ":" + config.password + "@localhost/" + config.db;
let mongo = mdb.MongoClient;
mongo.connect(url, (err, databases) => {
	throws(err);
	
	console.log("Successfully Connected");

	// declarations of collections
	let db = databases.db(config.db);

	// Routing to pages
	app.get("/", (req, res) => {
		['main.sass', 'index.sass'].forEach(renderSass);
		sendPug(res, 'index.pug', {
			articles: ["DAS", "DA", "DADAD", "DASD", "DSA", "DASD", "FUXK"]
		});
	});

	// Start the server
	let port = process.env.port || 80
	app.listen(port, () => console.log("Listening on port " + port));
});