var request = require('request');

exports.send = function(phone, message, callback) {
  request.post({
    url: 'https://sms.yunpian.com/v1/sms/send.json',
    form: {
      apikey: 'apikey',
      mobile: phone,
      text: message
    }
  }, (err, response, body) => {
    if (err) {
      err.status = 500;
      err.body = 'Send shortmessage error';
      callback(err);
    }
    var result = JSON.parse(body);
    if (result.code !== 0) {
      var err = new Error(result.msg);
      err.status = 500;
      return callback(err);
    }
    callback(null);
  });
}
