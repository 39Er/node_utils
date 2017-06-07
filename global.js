'use strict';

const path = require('path');
const config = require('config');
const bunyan = require('bunyan');
const Mystream = require('bunyan-rotate-file-stream');

module.exports.config = config;
module.exports.logger = bunyan.createLogger({
  name: 'main',
  serializers: bunyan.stdSerializers,
  level: 'info',
  streams: [
    {
      level: 'error',
      type: 'raw',
      stream: new Mystream(path.join(__dirname, 'logs/error.log')),
    }, {
      level: 'debug',
      stream: process.stdout,
    },
  ],
});

