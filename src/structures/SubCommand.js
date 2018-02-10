class SubCommand {
	/**
	 * Creates an instance of SubCommand.
	 * @param {Strelitzia} client The client
	 * @param {SubCommandOptions} [options={}] The subcommand options
	 * @memberof SubCommand
	 */
	constructor(client, options = {}) {
		Object.defineProperty(this, 'client', { value: client });

		this.name = options.name;
		this.aliases = options.aliases || [];
		this.description = options.description;
		this.subCommand = true;
		this.parent = options.parent;
	}

	/**
	 * Options that are passed when creating a new subcommand
	 * @typedef {object} SubCommandOptions
	 * @prop {string} [name] The subcommand name
	 * @prop {string[]} [aliases] The subcommand aliases
	 * @prop {string} [description] The subcommand description
	 * @prop {string} [parent] The subcommand parent
	 */

	/**
	 * Determines if the command is a subcommand or not
	 * @returns {boolean}
	 * @memberof SubCommand
	 */
	isSubCommand() {
		return true;
	}

	/**
	 * Runs the subcommand
	 * @param {object} message The raw message data
	 * @param {string} args The parsed arguments
	 * @abstract
	 * @memberof SubCommand
	 */
	async run(message, args) {} // eslint-disable-line no-unused-vars
}

module.exports = SubCommand;
