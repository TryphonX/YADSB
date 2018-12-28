const economyHandler = require("../handlers/economy.js");
const userDataHandler = require("../handlers/userData.js");

module.exports = (client, config, msg) => {
	const member = client.guilds.get(msg.guild.id).members.get(msg.author.id);

	// Exit if author is a bot
	if (msg.author.bot) return;

	// Deletes every non-bot message in order to not flood the channels
	// Useful when testing the database
	/*if (~~config.advanced.debugMode) {
		msg.delete();
	}*/

	// Run the UserData handler
	userDataHandler.run(client, member, config);
	
	// Check if economy is on and proceed to run the Economy handler
	if (~~config.preferences.economyEnabled) {
		economyHandler.run(client, msg, config);
	}

	// Exit if the messages does not start with the prefix specified in the config file
	if (!msg.content.startsWith(config.preferences.prefix)) return;

	// Set args
	const args = msg.content.slice(config.preferences.prefix.length).trim().split(/ +/g);
	// Get the command's name
	const command = args.shift().toLowerCase();
	// Grab the command file from the client.commands Enmap
	const cmd = client.commands.get(command);
	// Exit if it's not a command
	if (!cmd) return;
	// Run the command
	cmd.run(client, msg, args);
};