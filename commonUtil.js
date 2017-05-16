'use strict';

const config = require('config');
const bunyan = require('bunyan');

module.exports.config = config;
module.exports.logger = bunyan.createLogger(config.get('loggerConfig'));

