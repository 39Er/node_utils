'use strict';

const nodemailer = require('nodemailer');
const { config, logger } = require('../global');

class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport(config.get('mailConfig'));
    this.maxRetry = config.get('mailMaxRetry');
  }

  /**
   * send mail
   * @param {Object} mailOptions
   *    like:{
   *      from: '"MailSender" <mailsender999@163.com>', //发件人
   *      to: '826891502@qq.com',  //收件人
   *      cc: '',              //抄送
   *      subject: 'Test mail sender',  //主题
   *      text: 'Plaintext version of the message',  //正文
   *      html: '<p>HTML version of the message</p>'  //html正文
   *    }
   * @param {Number} currentRetryTimes
   */
  async sendMail(mailOptions, currentRetryTimes = 0) {
    let result = {};
    result = await this.transporter.sendMail(mailOptions).then((info) => {
      return Promise.resolve({
        statusCode: '200',
        currentRetryTimes: currentRetryTimes,
        messageId: info.messageId,
        response: info.response,
      });
    }).catch((error) => {
      if (currentRetryTimes === this.maxRetry) {
        logger.error(error);
        return Promise.reject({
          statusCode: error.responseCode.toString(),
          message: error.toString(),
        });
      }
      logger.error('第%s次尝试发送邮件，报错： %s', currentRetryTimes, error.toString());
      currentRetryTimes += 1;
      return this.sendMail(mailOptions, currentRetryTimes);
    });
    return result;
  }
}

module.exports = MailSender;
