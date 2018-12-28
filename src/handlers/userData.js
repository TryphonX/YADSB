const sqlite3 = require("sqlite3");
let db = new sqlite3.Database("./src/data/localdb.db");
const sqliteLog = (str) => {
	if (str.includes("\n")) {
		str = str.replace(/\n/g, "\n[SQLite] ");
	}
	console.log(`[SQLite] ${str}`);
	return str;
};
const debugLog = (str) => {
	if (str.includes("\n")) {
		str = str.replace(/\n/g, "\n[Debug] ");
	}
	console.error(`[Debug] ${str}`);
	return str;
};

exports.run = (client, member, config) => {
	// member is of GuildMember type.
	// GuildMembers have the id property, but not tag or username
	// instead use the id to get the tag from the User object
	const userID = member.id;
	const userTag = client.users.get(userID).tag;
	const userUsername = client.users.get(userID).username;

	// Get all the discord tags of the user that are saved in the database
	// This technically checks usernames as well since the username is part of the tag
	db.all("SELECT tag FROM UserData WHERE id = $id", {$id: userID}, (err, rows) => {
		if (err) return console.error(err);
		
		// Create a new Date type class named date
		let date = new Date();

		// if the user is not in the database
		// insert them in the UserData table
		if (!rows) {
			db.run("INSERT INTO UserData (id, username, tag, date) VALUES ($id, $username, $tag, $date)", {
				$id: userID,
				$username: userUsername,
				$tag: userTag,
				$date: date.toUTCString()
			}, (err) => {
				if (err) console.error(err);
				sqliteLog("Table updated");
				if (~~config.advanced.debugMode) {
					db.each("SELECT * FROM UserData WHERE id = $id", {$id: userID}, (err, row) => {if (err) console.error(err); debugLog(`${row.id} ${row.username} ${row.tag} ${row.date}`);});
				}
			});
		}

		// if the author is in the database:
		// check if user changed their tag
		// if the tag does not exist in the database insert it
		else if (!rows.some(row => row.tag === userTag)) {
			db.run("INSERT INTO UserData (id, username, tag, date) VALUES ($id, $username, $tag, $date)", {
				$id: userID,
				$username: userUsername,
				$tag: userTag,
				$date: date.toUTCString()
			}, (err) => {
				if (err) return console.error(err);
				sqliteLog("Table updated");
				if (~~config.advanced.debugMode) {
					db.each("SELECT * FROM UserData WHERE id = $id", {$id: userID}, (err, row) => {if (err) console.error(err); debugLog(`${row.id} ${row.username} ${row.tag} ${row.date}`);});
				}
			});
		}
		
	});
};