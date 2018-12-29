const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const ini = require("ini");
const config = ini.parse(fs.readFileSync("./src/config.ini", "utf-8"));
const Enmap = require("enmap");
const clientLog = (msg) => {
	if (msg.includes("\n")) {
		msg = msg.replace(/\n/g, "\n[Client] ");
	}
	console.log(`[Client] ${msg}`);
	return msg;
};

client.login(config.app.token);

//eventHandler.run(client, config);

fs.readdir("./src/events", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client, config));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
});

// Loading Commands
client.commands = new Enmap();
fs.readdir("./src/commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let commandFile = require(`./commands/${file}`);
		let commandName = file.split(".")[0];
		clientLog(`Loading command: ${commandName}`);
		client.commands.set(commandName, commandFile);
	});
});