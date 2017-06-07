'use strict';

const path = require('path');
const config = require('config');
const bunyan = require('bunyan');
const Mystream = require('bunyan-rotate-file-stream');

module.exports.config = config;
module.exports.logger = bunyan.createLogger({
  name: config.get('loggerConfig.name'),
  serializers: bunyan.stdSerializers,
  src: config.get('loggerConfig.src'),
  streams: [
    {
      level: 'error',
      type: 'raw',
      stream: new Mystream(path.join(__dirname, config.get('loggerConfig.errorLogPath'))),
    }, {
      level: config.get('loggerConfig.level'),
      stream: process.stdout,
    },
  ],
});

