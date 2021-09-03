const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'info',
	desciption: 'View the bot details.',
	myperms: ['embed_links'],
	cooldown: 10,
	run: async (client, int) => {
		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`• ${client.user.username} Info.`)
			.setDescription(``)
	},
};