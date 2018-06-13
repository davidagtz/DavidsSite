# Just some things
- The structure for configurations.json, an essential file is:
	```json
	{
		"user"  : /* username for session */,
		"password" : /* password for sessions */,
		"db" : /* insert authentication database */,
		"secret": /* insert secret for sessions */
	}
	```
- This website is built off:
	- Backend:
		- Node.js
		- Pug
		- Express
		- Sass
		- MongoDB
	- Front end:
		- JQuery
- To run the website (On Windows Machines):
	- Set up configurations.json
	- Start the database, typically by executing `mongod`
	- Run datatbaseConfig.js using `node databaseConfig.js`
	- Restart the database but this time by running `mongod --auth --port /* put port number here */`
	- Run the main script with either `npm start` or `node server.js`
- This Website was authored by David Gutierrez