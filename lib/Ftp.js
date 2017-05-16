'use strict';

const Client = require('ftp');
const logger = require('../commonUtil').logger;

class Ftp {
  constructor(config) {
    this.client = new Client();
    this.config = config;
  }
  async connect() {
    return new Promise((resolve, reject) => {
      this.client.connect(this.config);
      this.client.on('ready', () => {
        logger.debug('client is ready !');
        resolve();
      });
      this.client.on('error', (error) => {
        reject(error);
      });
    });
  }
  async list(path = '/') {
    return new Promise((resolve, reject) => {
      this.client.list(path, (err, list) => {
        if (err) {
          reject(err);
        }
        resolve({
          list: list,
          path: path,
        });
      });
    });
  }
  async disconnect() {
    return new Promise((resolve) => {
      this.client.end();
      this.client.on('close', () => {
        logger.debug('client close!');
        resolve();
      });
    });
  }
}


module.exports = Ftp;
