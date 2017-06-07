'use strict';

const childProcess = require('child_process');
const iconv = require('iconv-lite');
const BufferHelper = require('bufferhelper');
const os = require('os');
const _ = require('lodash');
const { logger } = require('../global');

/**
 * [private] judge os encoding
 * @return [String] encoding
 */
let setEncoding = () => {
  if (os.platform() === 'win32') {
    let chcpOut = childProcess.execSync('chcp');
    if (chcpOut.indexOf('936') > -1) {
      return 'GBK';
    }
  }
  return 'UTF8';
};
class ChildProcessor {
  constructor() {
    this.encoding = setEncoding();
  }
  exec(cmd, option = {}) {
    if (!option.encoding) {
      _.assign(option, { encoding: this.encoding });
    }
    return new Promise((resolve, reject) => {
      childProcess.exec(cmd, option, (err, stdout, stderr) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        return resolve({
          stdout: iconv.decode(stdout, option.encoding),
          stderr: stderr,
        });
      });
    });
  }
  execFile(file, args, option = {}) {
    if (!option.encoding) {
      _.assign(option, { encoding: this.encoding });
    }
    return new Promise((resolve, reject) => {
      childProcess.execFile(file, args, option, (err, stdout, stderr) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        return resolve({
          stdout: iconv.decode(stdout, option.encoding),
          stderr: stderr,
        });
      });
    });
  }
  spawn(cmd, args, option = {}) {
    if (!option.encoding) {
      _.assign(option, { encoding: this.encoding });
    }
    return new Promise((resolve, reject) => {
      let spawn = childProcess.spawn(cmd, args, option);
      let stdoutBuf = new BufferHelper();
      let stderrBuf = new BufferHelper();
      spawn.on('error', (err) => {
        logger.error(err);
        return reject(err);
      });
      spawn.stdout.on('data', (data) => {
        stdoutBuf.concat(data);
      });
      spawn.stderr.on('data', (data) => {
        stderrBuf.concat(data);
      });
      spawn.on('close', (code) => {
        return resolve({
          stdout: iconv.decode(stdoutBuf.toBuffer(), option.encoding),
          stderr: iconv.decode(stderrBuf.toBuffer(), option.encoding),
          code: code,
        });
      });
    });
  }
}

module.exports = ChildProcessor;

