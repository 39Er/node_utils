'use strict';

const Client = require('ftp');
const logger = require('../commonUtil').logger;
const fs = require('fs');
const path = require('path');

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
  async list(listPath = '/') {
    return new Promise((resolve, reject) => {
      this.client.list(listPath, (err, list) => {
        if (err) {
          reject(err);
        }
        resolve({
          list: list,
          path: listPath,
        });
      });
    });
  }
  /**
   * @param [String] fileUrl : file's ftp url
   * @param [String] filepath : file's save path
   */
  async get(fileUrl, filepath) {
    let fileSize = 0;
    let filename = '';
    try {
      let listResult = await this.list(fileUrl);
      if (listResult.list.length === 0) {
        return Promise.reject(new Error('file not found'));
      }
      fileSize = listResult.list[0].size;
      filename = listResult.list[0].name;
    } catch (e) {
      return Promise.reject(e);
    }
    return new Promise((resolve, reject) => {
      this.client.get(fileUrl, async (err, stream) => {
        if (err) {
          return reject(err);
        }
        try {
          let downloadPath = path.join(filepath, filename);
          await pipe(stream, fs.createWriteStream(downloadPath));
          if (fs.statSync(downloadPath).size !== fileSize) {
            throw new Error('文件不完整！');
          }
          return resolve();
        } catch (e) {
          return reject(e);
        }
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
/**
 * @param [string] src
 * @param [string] dest
 * @return [Promise]
 */
async function pipe(src, dest) {
  return new Promise((resolvePipe, rejectPipe) => {
    src.pipe(dest);
    src.on('end', (data) => {
      resolvePipe(data);
    });
    src.on('error', (error) => {
      src.end();
      rejectPipe(error);
    });
  });
}

module.exports = Ftp;
