'use strict';

const ChildProccessor = require('./ChildProcessor');
const os = require('os');
const util = require('util');

class Git {
  constructor(cwd) {
    if (cwd) {
      this.cwd = cwd;
    }
    this.childProcessor = new ChildProccessor();
    this.platform = os.platform();
  }
  async execute(cmd, cwd) {
    let gitPath = cwd || this.cwd;
    let args = [];
    if (this.platform === 'win32') {
      args = ['cmd', ['/c', util.format('git %s ', cmd)], { cwd: gitPath }];
    } else {
      args = ['git', [cmd], { cwd: gitPath }];
    }
    try {
      let result = await this.childProcessor.spawn(...args);
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }
  async status(cwd) {
    return this.execute('status', cwd);
  }
  async fetch(cwd) {
    return this.execute('fetch', cwd);
  }
  async diff(cwd) {
    return this.execute('diff', cwd);
  }
  async log(cwd) {
    let result;
    try {
      result = await this.execute('log ', cwd);
    } catch (e) {
      throw new Error(e);
    }
    return parseLog(result);
  }
  async logToOrigin(cwd) {
    let result;
    try {
      result = await this.execute('log master..origin/master', cwd);
    } catch (e) {
      throw new Error(e);
    }
    return parseLog(result);
  }
}
function parseLog(result) {
  let stdout = result.stdout;
  let arr = stdout.split('\n');
  let logs = [];
  if (arr.length < 6) {
    return stdout;
  }
  for (let i = arr.length - 1; i >= 0; i -= 6) {
    let log = {};
    if (arr[i - 5].indexOf('Merge:') >= 0) {
      log = {
        commitId: arr[i - 6].slice(7),
        author: arr[i - 4].slice(8),
        date: arr[i - 3].slice(8),
        comment: arr[i - 1].slice(4),
      };
    } else {
      log = {
        commitId: arr[i - 5].slice(7),
        author: arr[i - 4].slice(8),
        date: arr[i - 3].slice(8),
        comment: arr[i - 1].slice(4),
      };
    }
    logs.push(log);
  }
  return logs;
}
module.exports = Git;
