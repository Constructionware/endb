'use strict';

const EventEmitter = require('events');
const {safeRequire} = require('../util');
const Level = safeRequire('level');

class EndbLevel extends EventEmitter {
	constructor(uri, options = {}) {
		super();
		options = Object.assign(
			{
				uri: 'leveldb://:memory:'
			},
			typeof uri === 'string' ? {uri} : uri,
			options
		);
		options.path = options.uri.replace(/^leveldb:\/\//, '');
		const level = new Level(options.path, options, err => {
			this.emit('error', err);
		});
		this.db = [
			'del',
			'createKeyStream',
			'createReadStream',
			'get',
			'put',
			'close'
		].reduce((obj, method) => {
			obj[method] = require('util').promisify(level[method].bind(level));
			return obj;
		}, {});
	}

	all() {
		return this.db.createReadStream().then(stream => {
			stream.on('data', data => {
				return data === null ? null : data;
			});
		});
	}

	clear() {
		return this.db.createKeyStream().then(stream => {
			stream.on('data', async data => {
				await this.db.del(data);
			});
			return undefined;
		});
	}

	close() {
		return this.db.close().then(() => undefined);
	}

	delete(key) {
		return this.db.del(key).then(data => data > 0);
	}

	get(key) {
		return this.db.get(key).then(data => {
			return data === null ? null : data;
		});
	}

	set(key, value) {
		return this.db.put(key, value);
	}
}

module.exports = EndbLevel;
