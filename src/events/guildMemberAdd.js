const userDataHandler = require("../handlers/userDataHandler.js");

module.exports = (client, config, member) => {
	// if a bot joins exit
	if (member.user.bot) return;
	
	// Run the UserData handler
	userDataHandler.run(client, member, config);
};