exports.run = (client, msg) => {
	let ping = client.ping;
	let emoji;
	if (ping<200) emoji = "✅";
	else if (ping<300) emoji = "🚧";
	else if (ping<500) emoji = "🔻";
	else emoji = "😖";
	return msg.channel.send(`Pong! Response time: ${ping}ms ${emoji}`).catch(console.error);
};