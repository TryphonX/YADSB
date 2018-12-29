const economyHandler = require("../handlers/economyHandler.js");
const userDataHandler = require("../handlers/userDataHandler.js");
const commandHandler = require("../handlers/commandHandler.js");

module.exports = (client, config, msg) => {

	// Exit if author is a bot
	if (msg.author.bot) return;

	let member;
	if (msg.channel.type === "text") {
		member = client.guilds.get(msg.guild.id).members.get(msg.author.id);
		// Run the UserData handler
		userDataHandler.run(client, member, config);
		
		// Check if economy is on and proceed to run the Economy handler
		// Do not run economy handler if it's a querying command or economy system is disabled
		let queryCmds = ["balance"];
		if (~~config.preferences.economyEnabled && !queryCmds.some(queryCmd => msg.content.toLowerCase().startsWith(`${config.preferences.prefix}${queryCmd}`))) {
			economyHandler.run(client, member, config);
		}
	}

	// Deletes every non-bot message in order to not flood the channels
	// Useful when testing the database
	/*if (~~config.advanced.debugMode) {
		msg.delete();
	}*/

	// Exit if the messages does not start with the prefix specified in the config file
	if (!msg.content.startsWith(config.preferences.prefix) && msg.channel.type === "text") return;

	commandHandler.run(client, msg, config);
};