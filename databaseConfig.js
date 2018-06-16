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
				createCollections(db, config.collections);
		});
	});
});

function createCollections(db, arr){
	if(arr.length > 0) {
		let element = arr.shift();
		db.db(config.db).createCollection(element, (err, res) => {
			if (err)
				console.log("\x1b[41m", element + ' Collection Creation Failed', err);
			else
				console.log("\x1b[42m", element + " Collection Creation Successful");
			createCollections(db, arr);
		});
	}
	else {
		db.close();
	}
}