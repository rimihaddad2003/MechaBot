const ms = require('pretty-ms');
const { ownerId } = require('../../../config.json');
const { CommandInteraction } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	/**
	 * @param { CommandInteraction } int
	 * @param { Client } client
	 */
	run: async (client, logger, int) => {
		if (int.user.bot || !int.guild || !int.isCommand()) return;
		const command = client.commands.get(int.commandName);
		if (!command) return;
		if (command.disabled && int.user.id != ownerId) return int.reply({ content: `**• This command is temporary disabled (__${command.disabled}__).**`, ephemeral: true });
		if (command.perms && !int.member.permissions.has(command.perms.map((v) => v.toUpperCase()) ?? [])) return int.reply({ content: `**• You don't have any of the required permissions: \`${command.perms.map((value) => client.bc(value.toLowerCase().replace(/guild/g, 'server').replace(/_/g, ' '))).join('`, `')}\`**`, ephemeral: true });
		if (command.myperms && !int.guild.me.permissions.has(command.myperms.map((v) => v.toUpperCase()) ?? [])) return int.reply({ content: `**• I don't have the required permissions: \`${command.myperms.map((value) => client.bc(value.toLowerCase().replace(/guild/g, 'server').replace(/_/g, ' '))).join('`, `')}\`**`, ephemeral: true });
		if (client.cooldowns.has(`${int.user.id}_${command.name}`)) return int.reply({ content: `**• You have to wait \`${ms((client.cooldowns.get(`${int.user.id}_${command.name}`) - Date.now()) >= 1000 ? (client.cooldowns.get(`${int.user.id}_${command.name}`) - Date.now()) : 1000, { verbose: true, secondsDecimalDigits: 0 })}\` before running this command again .**`, ephemeral: true });
		try {
			await command.run(client, int);
			if (command.cooldown) {
				client.cooldowns.set(`${int.user.id}_${command.name}`, Date.now() + command.cooldown * 1000);
				setTimeout(() => {
					client.cooldowns.delete(`${int.user.id}_${command.name}`);
				}, command.cooldown * 1000);
			}
		}
		catch (err) {
			logger.error(err.stack);
		}
	},
};