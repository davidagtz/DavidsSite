# Just some things
- This website is built off:
	- Backend:
		- Node.js
		- Pug
		- Express
		- Sass
		- MongoDB
	- Front end:
		- JQuery
- Templates for configurations.json and other things [here](./templates.md). Information on email delivery can also be found there.
- To run the website (On Windows Machines):
	- Set up configurations.json
	- Start the database, typically by executing `mongod`
	- Run datatbaseConfig.js using `node databaseConfig.js`
	- Restart the database but this time by running `mongod --auth --port /* put port number here */`
	- Run the main script with either `npm start` or `node server.js`
- This Website was authored by David Gutierrez
# API
- ## Seeing if an account exists
	- Accessing ```/exists?type=account&user=insertRandomUser```, where insertRandomUser is the desired user to verify, will send a json object that looks like this
	```json
	{
		"exists" : "boolean value of true or false"
	}
	```