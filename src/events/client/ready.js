module.exports = {
	name: 'ready',
	/**
	 * @param { Client } client
	 * @param {*} logger
	 */
	run: async (client, logger) => {
		logger.info(`Bot Logged in as [${client.user.tag}]`);
		client.user.setActivity({ name: 'MechaBot', type: 'WATCHING' });
	},
};