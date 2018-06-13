let fs = require('fs');
let config = JSON.parse(fs.readFileSync('configurations.json', {
	encoding : 'utf-8'
}));

let mdb = require('mongodb');
mdb.MongoClient.connect("mongodb://localhost:27017", (err, db) => {
	if(err) throw err;
	db.db(config.db).removeUser(config.user, (err, res) => {
		if (err)
			console.log("\x1b[41m", "Account Deletion Failed", err)
		else
			console.log("\x1b[42m", "Account Deletion Successful");
		db.db(config.db).addUser(config.user, config.password, {
			roles : [{
					role: "userAdminAnyDatabase",
					db: "admin"
				},
				"readWrite"
			]
			}, (err, res) => {
				if(err)
					console.log("\x1b[41m", "Account Creation Failed", err)
				else
					console.log("\x1b[42m", "Account Creation Successful");
				db.db(config.db).createCollection('store', (err, res) => {
					if(err)
						console.log("\x1b[41m", 'Store Collection Creation Failed');
					else
						console.log("\x1b[42m", "Store Collection Creation Successful");
					db.close();
				});
		});
	});
});