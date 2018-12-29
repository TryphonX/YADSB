const sqlite3 = require("sqlite3");
let db = new sqlite3.Database("./src/data/localdb.db");

exports.run = (client, msg, args, config) => {
	const publicFlags = ["-p", "-public"];

	if (~~config.preferences.economyEnabled) {
		db.get("SELECT balance FROM Economy WHERE id = $id", {$id: msg.author.id}, (error, row) => {

			// User not in the Economy table
			if (error) {
				msg.channel.send("Balance: null").catch(console.error);
				return console.error(error);
			}
	
			// Check if args include any of the public tag variations
			if (publicFlags.some(flag => args.includes(flag))) {
				//msg.channel.send(`You have ${row.balance} ${config.preferences.pointsName}.\n============================================`);
				return msg.channel.send(`\`\`\`Balance: ${row.balance} ${config.preferences.pointsName}\`\`\``).catch(console.error);
				//return msg.channel.send(`Balance: ${row.balance}`);
			}
			if (msg.channel.type === "text") {
				msg.channel.send("📜 Querying.. (Check DMs)").catch(console.error);
			}
			//msg.author.send(`You have ${row.balance} ${config.preferences.pointsName}.\n============================================`);
			return msg.author.send(`Balance: ${row.balance} ${config.preferences.pointsName}`).catch(console.error);
			//msg.author.send(`Balance: ${row.balance}`);
		});
	}
	else return msg.channel.send("Economy system is disabled.").catch(console.error);
};