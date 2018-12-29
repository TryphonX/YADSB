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
	let balance;

	// if the user is in the economy table, save the value of their balance
	// don't ask me why I had to do this; database got weird,
	// figured this is the only way to make it work for now
	db.get("SELECT balance FROM Economy WHERE id = $id", {$id: userID}, (err, row) => {if (row) balance = row.balance;});

	// Generate a number in (1,x]; x being the number specified in the config file as the multiplier
	let pointsEarned = Math.ceil(Math.random()*~~config.preferences.multiplier);

	// Check if the user of the message is in the economy table
	db.get("SELECT id FROM Economy WHERE id=$id", {$id: userID}, (err, row) => {
		if (err) return console.error(err);

		// If the user is not in the table, insert default values
		if (!row) {
			db.run("INSERT INTO Economy (id, username, tag, msgCount, balance) VALUES ($id, $username, $tag, $msgCount, $balance)", {
				$id: userID,
				$username: userUsername,
				$tag: userTag,
				$msgCount: 1,
				$balance: pointsEarned
			}, (err) => {
				if (err) return console.error(err);
				sqliteLog("Table updated");
				if (~~config.advanced.debugMode) {
					db.each("SELECT * FROM Economy WHERE id = $id", {$id: userID}, (err, row) => {if (err) console.error(err); debugLog(`${row.id} ${row.username} ${row.tag} ${row.msgCount} ${row.balance}`);});
				}
			});
		}

		// if the user is in the table, update their data
		else {
			db.run("UPDATE Economy SET username = $username, tag = $tag, msgCount = msgCount+1, balance = $balance WHERE id = $id", {
				$id: userID,
				$username: userUsername,
				$tag: userTag,
				$balance: balance+pointsEarned
			}, (err) => {
				if (err) return console.error(err);
				sqliteLog("Table updated");
				if (~~config.advanced.debugMode) {
					db.each("SELECT * FROM Economy WHERE id = $id", {$id: userID}, (err, row) => {if (err) console.error(err); debugLog(`${row.id} ${row.username} ${row.tag} ${row.msgCount} ${row.balance}`);});
				}
			});

		}
	});

};