const { MessageEmbed } = require('discord.js');
const { ownerId } = require('../../../config.json');
const ms = require('pretty-ms');

module.exports = {
	name: 'help',
	description: 'View all of the bot\'s commands or get the details about a specific command.',
	cooldown: 5,
	myperms: ['embed_links'],
	/**
	 * @param { Client } client
	 * @param { CommandInteraction } int
	 */
	run: async (client, int) => {
		const cmdName = int.options.getString('command');
		if (!cmdName) {
			const embed = new MessageEmbed()
				.setColor('RANDOM')
				.setTitle(`• ${client.user.username} Help.`)
				.setDescription('**- You can use `/help <cmd>` to view a specific command\'s details.**\n** - You can use `/info` to view the bot details.**')
				.setTimestamp()
				.setFooter(`­ • Requested By ${int.user.username}\n­`, int.user.avatarURL({ dynamic: true }))
				.setThumbnail(int.guild.iconURL({ dynamic: true }));
			[...client.categories].forEach((value) => {
				if (!value || value.toLowerCase() == 'hidden') return;
				const cmds = client.commands.filter((m) => m.category.toLowerCase() == value.toLowerCase());
				embed.addField(`\\↪ ${client.bc(value)} __[${cmds.size}]__:`, `> \`${cmds.map((v) => v.name).join('`, `')}\``,
				);
			});
			int.reply({ embeds: [embed] });
		}
		else {
			const cmd = client.commands.get(cmdName);
			if (cmd.disabled && int.user.id != ownerId) return int.reply({ content: `**• This command is temporary disabled (__${cmd.disabled}__).**`, ephemeral: true });
			const embed = new MessageEmbed()
				.setColor('RANDOM')
				.setTitle(`• ${client.user.username} Help ⇾ ${client.bc(cmd.name)}`)
				.setDescription(`**- ${cmd.description}**`)
				.setTimestamp()
				.addField('\\↪ Category:', `> ${client.bc(cmd.category)}`)
				.setThumbnail(int.guild.iconURL({ dynamic: true }))
				.setFooter(`­ • Requested by ${int.user.username}`, int.user.avatarURL({ dynamic: true }));
			if (cmd.perms) embed.addField('\\↪ User Permissions:', `> \`${cmd.perms.map((v) => client.bc(v.toLowerCase().replace(/guild/g, 'server').replace(/_/g, ' '))).join('`, `')}\``);
			if (cmd.myperms) embed.addField('\\↪ Bot Permissions:', `> \`${cmd.myperms.map((v) => client.bc(v.toLowerCase().replace(/guild/g, 'server').replace(/_/g, ' '))).join('`, `')}\``);
			if (cmd.cooldown) embed.addField('\\↪ Cooldown:', `> ${ms(cmd.cooldown * 1000, { verbose: true })}`);
			int.reply({ embeds: [embed] });
		}
	},
};