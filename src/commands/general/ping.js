const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Get information about the bot latency.',
	cooldown: 10,
	perms: ['administrator'],
	myperms: ['embed_links'],
	/**
	 * @param { Client } client
	 * @param { CommandInteraction } int
	 */
	run: async (client, int) => {
		const msg = await int.channel.send('• Pinging...');
		const firstTime = msg.createdTimestamp;
		msg.delete();
		const delay = firstTime - int.createdTimestamp;
		const embed = new MessageEmbed()
			.setTitle(`• ${client.user.username} Ping.`)
			.setDescription(`**- Discord API: \`${client.ws.ping}ms\`**\n**- Bot Ping: \`${delay}ms\`**`)
			.setThumbnail(int.guild.iconURL())
			.setColor(delay < 100 ? '#00ff00' : delay < 500 ? '#f7a900' : '#ff0000')
			.setTimestamp()
			.setFooter(`­ • Requested By: ${int.user.tag}\n­`, int.user.displayAvatarURL({ dynamic: true }));
		int.reply({ content: '• Pong!', embeds: [embed] });
	},
};