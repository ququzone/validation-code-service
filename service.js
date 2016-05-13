var sms = require('./sms');

exports.sendSMS = function* () {
  var context = this;
  yield new Promise((resolve, reject) => {
    sms.send(context.request.body.phone, context.request.body.message, function(err) {
      if (err) {
        context.status = err.status;
        context.body = {message: err.message};
      } else {
        context.body = '';
      }
      resolve();
    });
  });
}

exports.request = function* (type, phone) {
  this.body = '';
}

exports.verify = function* (type, phone, code) {
  this.body = '';
}
