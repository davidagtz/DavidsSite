let fs = require('fs');
let config = JSON.parse(fs.readFileSync('configurations.json', {
	encoding : 'utf-8'
}));

let mdb = require('mongodb');
mdb.MongoClient.connect("mongodb://localhost:27017", (err, db) => {
	if(err) throw err;
	db.db(config.db).addUser(config.user, config.password, {
		roles : [{
			role: "userAdminAnyDatabase",
			db: "admin"
		}]
	}, (err, res) => {
		db.close();
		if(err){
			console.log("Account Creation Failed")
			throw err;
		}
		console.log("Account Creation Successful");
	});
});