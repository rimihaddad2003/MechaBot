require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const { createLogger, transports, format, config } = require('winston');
const logger = createLogger({
	levels: config.syslog.levels,
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize({ colors: { error: 'red', info: 'green', warning: 'yellow' } }),
				format.printf(log => `[${log.level}] - ${log.message}`),
			),
		}),
		new transports.File({ filename: './logs.log', format: format.printf(log => `[${log.level}] - ${log.message}`) }),
	],
});
const glob = require('util').promisify(require('glob'));

const client = new Client({
	intents: Intents.FLAGS.GUILDS,
});

client.commands = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.categories = new Set();
client.bc = (word) => word[0].toUpperCase() + word.slice(1).toLowerCase();

(async () => {
	const eventsFiles = await glob(`${__dirname}/events/**/*.js`);
	const commandsFiles = await glob(`${__dirname}/commands/**/*.js`);

	eventsFiles.forEach((value) => {
		try {
			const file = require(value);
			client.events.set(file.name.toLowerCase(), file);
			client.on(file.name, file.run.bind(null, client, logger));
			client.categories.add();
			logger.info(`Loaded Event: ${file.name}`);
		}
		catch (err) {
			console.error(err.stack);
		}
	});

	commandsFiles.forEach(value => {
		try {
			const file = require(value);
			const category = value.split('/')[value.split('/').length - 2];
			client.categories.add(category);
			file.category = category;
			client.commands.set(file.name.toLowerCase(), file);
			logger.info(`Loaded Command: ${file.name}`);
		}
		catch (err) {
			logger.error(err.stack);
		}
	});
})();

process.on('unhandledRejection', async error => {
	logger.error(error.stack);
});

client.login(process.env.TOKEN);