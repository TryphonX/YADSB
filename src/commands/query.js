const sqlite3 = require("sqlite3");
let db = new sqlite3.Database("./src/data/localdb.db");

const sqliteLog = (str) => {
	if (str.includes("\n")) {
		str = str.replace(/\n/g, "\n[SQLite] ");
	}
	console.log(`[SQLite] ${str}`);
	return str;
};

const publicFlags = ["-p", "-public"];
const allFlags = ["-a", "-all"];

exports.run = (client, msg, args, config) => {

	let result = [];
	let query;
	let vars;

	const dbGet = () => {
		db.get(query, eval(vars), (error, row) => {
			if (error) {
				msg.channel.send("Query aborted.");
				sqliteLog("Query aborted.");
				return console.error(error);
			}
			
			// get the columns by splitting the SQL expression
			let columns = query.split(" ");
			
			// remove the first one (select)
			columns.splice(0, 1);
			
			// and remove another two starting from "FROM"
			// so "FROM" and the name of the table are out
			// This leaves al the actual columns we selected in columns
			columns.splice(columns.indexOf("FROM"), 2);
			
			// if all columns are selected push them in the result
			if (columns.includes("*")) {
				for (const key in row) {
					result.push(`${key}: ${row[key]}`);
				}
			}
			
			// otherwise remove commas from the column names and push them in the result
			else {
				columns.forEach(column => {
					if (column.includes(",")) {
						columns[column.indexOf(column)] = column.replace(/,/g, "");
						column = column.replace(/,/g, "");
					}
					result.push(`${column}: ${row[column]}`);
				});
			}
		
			// Join elements of result and print them
			let finalResult = result.join(" | ");
			sqliteLog("Query complete");
			msg.channel.fetchMessage(msgID).then(msg => {msg.delete();});
			if (publicFlags.some(flag => args.includes(flag))) {
				return msg.channel.send(`\`\`\`${finalResult}\`\`\``).catch(console.error);
			}
			if (msg.channel.type === "text") {
				if (msg.channel.type === "text") {
					msg.channel.send("📜 Querying.. (Check DMs)").catch(console.error);
				}
			}
			return msg.author.send(`\`\`\`${finalResult}\`\`\``).catch(console.error);
		});
	};

	const dbAll = () => {
		db.all(query, eval(vars), (error, rows) => {
			if (error) {
				msg.channel.send("Query aborted.");
				sqliteLog("Query aborted.");
				return console.error(error);
			}
			
			// get the columns by splitting the SQL expression
			let columns = query.split(" ");
			
			// remove the first one (select)
			columns.splice(0, 1);
			
			// and remove another two starting from "FROM"
			// so "FROM" and the name of the table are out
			// This leaves al the actual columns we selected in columns
			columns.splice(columns.indexOf("FROM"), 2);
			
			// if all columns are selected push them in the result
			if (columns.includes("*")) {
				rows.forEach(row => {
					for (const key in row) {
						result.push(`${key}: ${row[key]}`);
					}
				});
			}
			
			// otherwise remove commas from the column names and push them in the result
			else {
				columns.forEach(column => {
					if (column.includes(",")) {
						column = column.replace(/,/g, "");
					}
					rows.forEach(row => {
						result.push(`${column}: ${row[column]}`);
					});
				});
			}
		
			// Join elements of result and print them
			let finalResult = result.join(" | ");
			sqliteLog("Query complete");
			msg.channel.fetchMessage(msgID).then(msg => {msg.delete();});
			if (publicFlags.some(flag => args.includes(flag))) {
				return msg.channel.send(`\`\`\`${finalResult}\`\`\``).catch(console.error);
			}
			if (msg.channel.type === "text") {
				if (msg.channel.type === "text") {
					msg.channel.send("📜 Querying.. (Check DMs)").catch(console.error);
				}
			}
			return msg.author.send(`\`\`\`${finalResult}\`\`\``).catch(console.error);
		});
	};

	msg.delete();
	let msgID;
	// Ask for a SQL Querying Expression
	msg.channel.send("Enter a SQL querying expression.").then(msg => {msgID = msg.id;});
	const queryFilter = (msg) => (msg.content.startsWith("SELECT")) && msg.author.id === config.app.ownerID;
	const queryCollector = msg.channel.createMessageCollector(queryFilter, { time: 30000 , max: 1});

	// When the collector is done
	queryCollector.on("end", (collected) => {
		
		// if there is a collected message
		if (collected.first()) {
			msg.channel.fetchMessage(collected.first().id).then(msg => {msg.delete();});

			// The SQL query expression is the content of the message.
			query = collected.first().content;

			// If there are no custom variables
			if (!query.includes("$")) {
				if (allFlags.some(flag => args.includes(flag))) dbAll();
				else dbGet();
			}

			// if the query has custom variables
			else {
				msg.channel.fetchMessage(msgID).then(msg => {msg.edit("Define the custom variables.");});
				const varsFilter = (msg) => (msg.content.startsWith("$")) && msg.author.id === config.app.ownerID;
				const varsCollector = msg.channel.createMessageCollector(varsFilter, { time: 30000 , max: 1});

				varsCollector.on("end", (collectedVars) => {

					// if there is a collected message
					if (collectedVars.first()) {
						msg.channel.fetchMessage(collectedVars.first().id).then(msg => {msg.delete();});
						vars = collectedVars.first().content;
						if (allFlags.some(flag => args.includes(flag))) dbAll();
						else dbGet();

					}
					else {
						msg.channel.send("Query aborted.");
						sqliteLog("Query aborted.");
					}
				});
			}

		}
		else {
			msg.channel.send("Query aborted.");
			sqliteLog("Query aborted.");
		}
	});

};