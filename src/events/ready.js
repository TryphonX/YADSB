const info = require("../../package.json");
const sqlite3 = require("sqlite3");
let db = new sqlite3.Database("./src/data/localdb.db");
const sqliteLog = (str) => {
	if (str.includes("\n")) {
		str = str.replace(/\n/g, "\n[SQLite] ");
	}
	console.log(`[SQLite] ${str}`);
	return str;
};

module.exports = (client, config) => {

	// Send a message to the owner of the bot
	if (!~~config.advanced.debugMode) client.users.get(config.app.ownerID).send(`Test. Version v${info.version}`).catch(console.error);

	// Check if the economy system is enabled.
	if (~~config.preferences.economyEnabled) {
		
		// Run a query in the Economy table
		db.get("SELECT id FROM Economy", (error) => {

			// if the table doesn't exist, create it
			if (error) {
				console.error(error);
				db.run("CREATE TABLE Economy (id TEXT, username TEXT, tag TEXT, msgCount INTEGER, balance INTEGER)", (err) => {
					if (err) {

						// In case anything goes wrong, terminate if
						// the table can't be created
						// could create errors later on otherwise
						console.error(err + "\n Failed to create table. Terminating.");
						return client.destroy();
					}
					sqliteLog("Economy table created");
				});
			}
			else sqliteLog("Economy table ready");
		});
	}

	// Same process for the UserData table
	db.get("SELECT id FROM UserData", (error) => {
		if (error) {
			console.error(error);
			db.run("CREATE TABLE UserData (id TEXT, username TEXT, tag TEXT, date TEXT)", (err) => {
				if (err) {
					console.error(err + "\n Failed to create table. Terminating.");
					return client.destroy();
				}
				sqliteLog("UserData table created");
			});
		}
		else sqliteLog("UserData table ready");
	});

	// Prints the launch message including the bot's name,
	// the author and the version
	console.log(`====================================\n~~ Yet Another Discord Server Bot ~~\n====================================\nBy TryphonX\nVersion: ${info.version}`);
};