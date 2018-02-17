/**
 * A command that can be ran.
 */
class Command {
	/**
	 * Options that are passed when creating a new command
	 * @typedef {object} CommandOptions
	 * @prop {string} [name] The command name
	 * @prop {Array<string>} [aliases=[]] The command aliases
	 * @prop {string} [description] The command description
	 */

	/**
	 * Creates an instance of Command.
	 * @param {Strelitzia} client The client
	 * @param {CommandOptions} [options={}] The command options
	 * @memberof Command
	 */
	constructor(client, options = {}) {
		/**
		 * The client instance
		 * @name Command#client
		 * @type {Strelitzia}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The command name
		 * @type {string}
		 */
		this.name = options.name;

		/**
		 * The command aliases
		 * @type {Array<string>}
		 * @default []
		 */
		this.aliases = options.aliases || [];

		/**
		 * The command description
		 * @type {?string}
		 */
		this.description = options.description;

		/**
		 * Options for throttling
		 * @type {Object}
		 */
		this.throttling = options.throttling || null;

		/**
		 * Whether default handling is enabled
		 * @type {boolean}
		 */
		this.defaultHandling = 'defaultHandling' in options ? options.defaultHandling : true;

		/**
		 * The regular expression triggers
		 * @type {Array<RegExp>}
		 */
		this.patterns = options.patterns || null;

		/**
		 * Current throttling, mapped by user id
		 * @private
		 * @type {Map<string, Object>}
		 */
		this._throttles = new Map();

		/**
		 * Array of subcommands, if any
		 * @type {Array<SubCommand>}
		 * @default []
		 */
		this.subCommands = [];
	}

	/**
	 * Preparations before running the command.
	 * @param {Object} message The raw message data
	 * @param {string} args The parsed arguments
	 * @returns {*}
	 * @memberof Command
	 */
	_run(message, args) {
		const throttle = this._throttle(message.author.id);
		if (throttle && throttle.usages + 1 > this.throttling.usages) {
			const remaining = (throttle.start + (this.throttling.duration * 1000) - Date.now()) / 1000;
			return this.client.rest.channels[message.channel_id].messages.create({
				content: `You may not use this command again for another ${remaining.toFixed(1)} seconds.`
			});
		}
		if (throttle) throttle.usages++;

		return this.run(message, args);
	}

	/**
	 * Runs the actual command.
	 * @param {Object} message The raw message data
	 * @param {string} args The parsed arguments
	 * @abstract
	 * @memberof Command
	 */
	async run(message, args) {} // eslint-disable-line no-unused-vars

	/**
	 * Throttling bois
	 * @private
	 * @param {string} user ID of the user
	 * @return {?Object}
	 */
	_throttle(user) {
		if (!this.throttling) return null;

		let throttle = this._throttles.get(user);
		if (!throttle) {
			throttle = {
				start: Date.now(),
				usages: 0,
				timeout: setTimeout(() => {
					this._throttles.delete(user);
				}, this.throttling.duration * 1000)
			};
			this._throttles.set(user, throttle);
		}

		return throttle;
	}
}

module.exports = Command;
