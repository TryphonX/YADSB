/* eslint-disable no-unused-vars */
exports.run = (client, msg, args, config) => {
	if (msg.author.id === config.app.ownerID) {
		return eval(args.join(" "));
	}
	else {
		console.error("[EVAL] Someone tried to use eval. Full message sent in DMs.");
		client.users.get(config.app.ownerID).send(`Message by: <@${msg.author.id}> (${msg.author.tag})\nMessage:`).catch(console.error);
		return client.users.get(config.app.ownerID).send("```\njs" + msg.content +"\n```").catch(console.error);
	}	
};