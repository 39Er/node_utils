'use strict';

const ChildProcessor = require('./lib/ChildProcessor');

let spawn = async () => {
  let cp = new ChildProcessor();
  try {
    let result = await cp.spawn('cmd', ['/c', 'dir']);
    console.log(result.stdout);
  } catch (e) {
    console.log(e);
  }
};

spawn();

