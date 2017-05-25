'use strict';

const Git = require('./lib/Git');

let git = new Git('D:/git/testGit');

async function a() {
  try {
    let result = await git.status();
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}
a();
