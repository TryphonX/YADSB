exports.run = (client, msg, config) => {
	// Set args for Guild commands and text channel commands
	const args = (msg.channel.type === "text")? msg.content.slice(config.preferences.prefix.length).trim().split(/ +/g) : msg.content.trim().split(/ +/g);
	// Get the command's name
	const command = args.shift().toLowerCase();
	// Grab the command file from the client.commands Enmap
	const cmd = client.commands.get(command);
	// Exit if it's not a command
	if (!cmd) return;
	// Make all args lowercase
	if (command !== "eval") {
		// eslint-disable-next-line no-unused-vars
		args.forEach(arg => {
			arg = arg.toLowerCase();
		});
	}
	// Run the command
	cmd.run(client, msg, args, config);
};