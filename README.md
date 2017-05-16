# node_utils #
**some utils for node.js**
# Entry #
[1.MailSender](https://github.com/39Er/node_utils/blob/master/README.md#1-mailsender)
## Env ##

	node.js: v7.8.0	
	npm: v4.2.0
	yarn: v0.24.2 

## Basic modules ##

> config: for configuration [github地址](https://github.com/lorenwest/node-config)<br/>
> eslint: check code styles [github地址](https://github.com/eslint/eslint)<br/>
> mocha: unit test [github地址](https://github.com/mochajs/mocha)<br/>
> should.js: BDD style assertions for node.js [github地址](https://github.com/shouldjs/should.js)<br/>
> bunyan: log libary form node.js [github地址](https://github.com/trentm/node-bunyan)<br/>
> lodash: A modern JavaScript utility library delivering modularity, performance & extras. [github地址](https://github.com/lodash/lodash)<br/>

## Code Styles ##

Use airbnb eslint code styles

## Utils ##

### 1. MailSender ###

Modules:

> [nodemailer](https://nodemailer.com/about/)

Config:

	{
	  "mailConfig": {
	    "service": "163",
	    // "port": "25",
	    // "host": "smtp.163.com",
	    "auth": {
	      "user": "mailsender999@163.com",
	      "pass": "******"  //  163邮箱需使用授权码作为密码，其他邮箱待测
	    }
	  },
	  "mailMaxRetry": 5
	}

Example:

- **async/await**
 

        const EmailSender = require('./lib/EmailSender');
    	let sendEmailAsync = async () => {
      		let emailSender = new EmailSender();
      		let result = {};
		      const mail = {
		    	from: '"MailSender" <mailsender999@163.com>', //  发件人
		    	to: '826891502@qq.com',  // 收件人
		    	cc: '',  // 抄送
		    	subject: 'Test mail sender',  //  主题
		    	text: 'Plaintext version of the message',  // 正文
		    	// html: '<p>HTML version of the message</p>'  // html正文
		      };
		      try {
		    	result = await emailSender.sendMail(mail);
		    	console.log(result);
		    	  } catch (e) {
		    	console.error(e);
		      }
	    };
	    
	    sendEmailAsync();

- **Promise**

		let emailSender = new EmailSender();
		const mail = {
		  from: '"MailSender" <mailsender999@163.com>', //  发件人
		  to: '826891502@qq.com',  // 收件人
		  cc: '',              // 抄送
		  subject: 'Test mail sender',  //  主题
		  text: 'Plaintext version of the message',  // 正文
		  // html: '<p>HTML version of the message</p>'  // html正文
		};
		emailSender.sendMail(mail)
		  .then((result) => { console.log(result); })
		  .catch((error) => { console.error(error); });

> Attention: 163邮箱开启授权码设置

![163邮箱设置](http://i.imgur.com/qPPNMoC.png)

### 2. ChildProcessor ###

> Effectively prevent Windows Chinese garbled

Methods:

- exec()
- execFile()
- spawn()

> 参数详见node:[child_process](https://nodejs.org/dist/latest-v7.x/docs/api/child_process.html)

Example:

- **exec()**

		const ChildProcessor = require('./lib/ChildProcessor');
		
		let exec = async () => {
		  let cp = new ChildProcessor();
		  try {
		    let result = await cp.exec('git status');
		    console.log(result);
		  } catch (e) {
		    console.log(e);
		  }
		};
		
		exec();

- **execFile()**

		const ChildProcessor = require('./lib/ChildProcessor');
		
		let execFile = async () => {
		  let cp = new ChildProcessor();
		  try {
		    let result = await cp.execFile('node', ['-h']);
		    console.log(result.stdout);
		  } catch (e) {
		    console.log(e);
		  }
		};
		
		execFile();

- **spawn()**

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





