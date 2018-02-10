const { EventEmitter } = require('events');
const rest = require('@spectacles/rest');
const { Amqp } = require('@spectacles/brokers');
const Dispatcher = require('../structures/Dispatcher');
const Registry = require('../structures/Registry');

class Strelitzia extends EventEmitter {
	/**
	 * Creates an instance of Strelitzia.
	 * @param {StrelitziaOptions} [options={}] The client options
	 * @memberof Strelitzia
	 */
	constructor(options = {}) {
		super();
		this.rest = rest(options.token);
		this.id = options.id;
		this.prefix = options.prefix || '=';
		this.consumer = new Amqp('consumer');
		this.dispatcher = new Dispatcher(this);
		this.registry = new Registry(this);
	}

	/**
	 * Options passed to Strelitzia when creating a new instance
	 * @typedef {object} StrelitziaOptions
	 * @prop {string} [token] The token
	 * @prop {string} [id] The client ID
	 * @prop {string} [prefix='='] The command prefi
	 */

	/**
	 * Logs in to the gateway
	 * @param {string} [url='localhost'] The URL of the gateway
	 * @param {string[]} events Array of events
	 * @memberof Strelitzia
	 */
	async login(url = 'localhost', events) {
		try {
			await this.consumer.connect(url);
			await this.consumer.subscribe(events);
		} catch (error) {
			this.emit('error', this, error);
		}
	}
}

module.exports = Strelitzia;
