'use strict';

const ChildProccessor = require('./ChildProcessor');
const os = require('os');
const util = require('util');
const diff2html = require('diff2html').Diff2Html;

class Git {
  constructor(cwd) {
    if (cwd) {
      this.cwd = cwd;
    }
    this.childProcessor = new ChildProccessor();
  }
  /**
   * execute git command
   * like: status
   * @param [String] cmd
   * @param [String] cwd: optional
   * @return [Promise]
   */
  async execute(cmd, cwd) {
    let gitPath = cwd || this.cwd;
    let args = [];
    if (os.platform() === 'win32') {
      args = ['cmd', ['/c', util.format('git %s ', cmd)], { cwd: gitPath, encoding: 'utf8' }];
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
    let result;
    try {
      result = await this.execute('status', cwd);
    } catch (e) {
      throw new Error(e);
    }
    return result.stdout;
  }
  async fetch(cwd) {
    let result;
    try {
      result = await this.execute('fetch', cwd);
    } catch (e) {
      throw new Error(e);
    }
    return result.stderr;
  }
  async merge(cmd = '', cwd) {
    let result;
    try {
      result = await this.execute(util.format('merge %s', cmd), cwd);
    } catch (e) {
      throw new Error(e);
    }
    return result.stdout;
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
  async diff(commitId1, commitId2, cwd) {
    let result;
    try {
      result = await this.execute(util.format('diff %s..%s', commitId1, commitId2), cwd);
    } catch (e) {
      throw new Error(e);
    }
    return result.stdout;
  }
  async diffToHtml(commitId1, commitId2, cwd) {
    let result;
    try {
      result = await this.diff(commitId1, commitId2, cwd);
    } catch (e) {
      throw new Error(e);
    }
    return diff2html.getPrettyHtml(result);
  }
  async diffToJson(commitId1, commitId2, cwd) {
    let result;
    try {
      result = await this.diff(commitId1, commitId2, cwd);
    } catch (e) {
      throw new Error(e);
    }
    return diff2html.getJsonFromDiff(result.stdout);
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
