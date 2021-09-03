const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
require('dotenv').config();
const { promisify } = require('util');
const glob = promisify(require('glob'));

const commands = [];

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
	try {
		const commandsFiles = await glob(`${__dirname}/src/commands/**/*.js`);
		commandsFiles.forEach(value => {
			const file = require(value);
			if (!file.name || !file.description) return;
			const data = new SlashCommandBuilder()
				.setName(file.name)
				.setDescription(file.description);
			if (file.name == 'help') {
				data.addStringOption(option =>
					option.setName('command')
						.setDescription('One of the bot\'s commands.')
						.addChoices(
							commandsFiles.map(v => {
								const cmd = require(v);
								return [cmd.name[0].toUpperCase() + cmd.name.slice(1).toLowerCase(), cmd.name];
							}),
						),
				);
			}
			else if (file.options) {
				file.options.forEach(option => {
					if (option.type == 'string') data.addStringOption(o => o.setName(option.name).setDescription(option.description).setRequired(option.required));
					else if (option.type == 'bool') data.addBooleanOption(o => o.setName(option.name).setDescription(option.description).setRequired(option.required));
					else if (option.type == 'channel') data.addChannelOption(o => o.setName(option.name).setDescription(option.description).setRequired(option.required));
					else if (option.type == 'user') data.addUserOption(o => o.setName(option.name).setDescription(option.description).setRequired(option.required));
					else if (option.type == 'role') data.addRoleOption(o => o.setName(option.name).setDescription(option.description).setRequired(option.required));
					else if (option.type == 'int') data.addIntegerOption(o => o.setName(option.name).setDescription(option.description).setRequired(option.required));
					else if (option.type == 'mention') data.addMentionableOption(o => o.setName(option.name).setDescription(option.description).setRequired(option.required));
				});
			}
			commands.push(data.toJSON());
			console.log(`Deployed Command: ${file.name} (${file.description})`);
		});
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	}
	catch (error) {
		console.error(error);
	}
})();