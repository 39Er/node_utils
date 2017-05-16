'use strict';

const childProcess = require('child_process');
const iconv = require('iconv-lite');
const BufferHelper = require('bufferhelper');
const os = require('os');
const _ = require('lodash');
const logger = require('../commonUtil').logger;

class ChildProcessor {
  constructor() {
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
    this.encoding = setEncoding();
  }
  exec(cmd, option = {}) {
    _.assign(option, { encoding: this.encoding });
    return new Promise((resolve, reject) => {
      childProcess.exec(cmd, option, (err, stdout, stderr) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve({
          stdout: iconv.decode(stdout, this.encoding),
          stderr: stderr,
        });
      });
    });
  }
  execFile(file, args, option = {}) {
    _.assign(option, { encoding: this.encoding });
    return new Promise((resolve, reject) => {
      childProcess.execFile(file, args, option, (err, stdout, stderr) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve({
          stdout: iconv.decode(stdout, this.encoding),
          stderr: stderr,
        });
      });
    });
  }
  spawn(cmd, args, option = {}) {
    return new Promise((resolve, reject) => {
      let spawn = childProcess.spawn(cmd, args, option);
      let stdoutBuf = new BufferHelper();
      let stderrBuf = new BufferHelper();
      spawn.on('error', (err) => {
        logger.error(err);
        reject(err);
      });
      spawn.stdout.on('data', (data) => {
        stdoutBuf.concat(data);
      });
      spawn.stderr.on('data', (data) => {
        stderrBuf.concat(data);
      });
      spawn.on('close', (code) => {
        resolve({
          stdout: iconv.decode(stdoutBuf.toBuffer(), this.encoding),
          stderr: iconv.decode(stderrBuf.toBuffer(), this.encoding),
          code: code,
        });
      });
    });
  }
}

module.exports = ChildProcessor;

