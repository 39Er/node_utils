'use strict';

require('should');
const MailSender = require('../lib/MailSender');

describe('email test', () => {
  it('should success', async () => {
    const mailSender = new MailSender();
    const mail = {
      from: '"MailSender" <mailsender999@163.com>', //  发件人
      to: '826891502@qq.com',  // 收件人
      cc: '',              // 抄送
      subject: 'Test mail sender',  //  主题
      text: 'Plaintext version of the message',  // 正文
      // html: '<p>HTML version of the message</p>'  // html正文
    };
    let result = {};
    try {
      result = await mailSender.sendMail(mail);
      console.log(result);
      result.should.be.type('object');
      result.should.have.property('statusCode', '200');
      result.should.have.property('currentRetryTimes');
      result.should.have.property('messageId');
      result.should.have.property('response');
    } catch (e) {
      console.log(e);
    }
  });
  it('should failed', async () => {
    const mailSender = new MailSender();
    const mail = {
      from: '"MailSender" <mailsender999@.com>', //  发件人
      to: '826891502@qq.com',  // 收件人
      cc: '',              // 抄送
      subject: 'Test mail sender',  //  主题
      text: 'Plaintext version of the message',  // 正文
      // html: '<p>HTML version of the message</p>'  // html正文
    };
    let result = {};
    try {
      result = await mailSender.sendMail(mail);
      console.log(result);
    } catch (e) {
      console.log(e);
      e.should.be.type('object');
      e.should.have.property('statusCode', '553');
      e.should.have.property('message');
    }
  });
});
