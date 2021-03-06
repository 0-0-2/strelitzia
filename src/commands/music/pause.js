const Command = require('../../structures/Command');

class Pause extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			description: 'Pause the music.',
			group: 'music',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(message) {
		const userVoiceChannel = await this.client.cache.guilds[message.guild_id].voice_states.get(message.author.id);
		const selfVoiceChannel = await this.client.cache.guilds[message.guild_id].voice_states.get(this.client.id);

		if (!userVoiceChannel || !userVoiceChannel.channel_id) {
			return this.client.rest.channels[message.channel_id].messages.post({
				content: 'I know, I know, you are eager to do that but make sure you are in a voice channel first.'
			});
		}

		if (userVoiceChannel && userVoiceChannel.channel_id) {
			if (selfVoiceChannel && selfVoiceChannel.channel_id) {
				if (userVoiceChannel.channel_id !== selfVoiceChannel.channel_id) {
					return this.client.rest.channels[message.channel_id].messages.post({
						content: 'Look, don\'t be that guy alright?'
					});
				}
			}
		}

		await this.client.publisher.publish('lavalink:PAUSE', { guild: message.guild_id }, { expiration: '60000' });

		return this.client.rest.channels[message.channel_id].messages.post({
			content: 'Hold on, hold on! I got this.'
		});
	}
}

module.exports = Pause;
