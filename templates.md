# Template for an account
```json
{
	"user" : "user",
	"pwd" : "hashedPwd",
	"email" : "email"
}
```
# Template for configurations.json
```json
{
	"user"  : "username for session",
	"password" : "password for sessions",
	"db" : "insert authentication database",
	"secret": "insert secret for sessions",
	"collections" : ["optional",
					 "array of ",
					 "collections"],
	"port" : "number for mongodb port",
	"saltRounds" : "insert number of salt rounds",
	"email" : {
		"options" : {
			"port" : "insert port number of email server",
			"host" : "insert host server",
			"secure" : "(boolean) if true the connection will use TLS when connecting to server else TLS is used if server supports the STARTTLS extension.",
			"auth" : {
				"user" : "insert email here",
				"pass" : "email password"
			},
			"tls" : "options for the node.js TLSSocket object"
		},
		"defaults" : {
			"from" : {
				"name" : "insert your name here",
				"address" : "insert email address here"
			}
		}
	}
}
```
More options are available for email available at https://nodemailer.com/smtp/
# Email Files
- Emails must be sent using either text or html, because of this, it is imperative that we have both. To match plain text files and html, we must use a json file that maps it. Here is the template for the json file
	```json
	{
		"pair1" : {
			"html" : "path/to/pug/file",
			"text" : "path/to/plain/text"
		},
		"pair2" : {
			"html" : "path/to/pug/file",
			"text" : "path/to/plain/text"
		},
		"pair3" : {
			"html" : "path/to/pug/file",
			"text" : "path/to/plain/text"
		}
	}
	```
- The file can be expanded to any amount of pairs.
- All html will be rendered from the Pug template engine. Plain text will also be rendered to allow for text replacement.