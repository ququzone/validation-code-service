var sms = require('./sms');

exports.request = function* (type, phone) {
  // TODO
  var context = this;
  context.body = 'YES';
}

exports.sendSMS = function* () {
  var context = this;
  yield new Promise((resolve, reject) => {
    sms.send(context.request.body.phone, context.request.body.message, function(err) {
      if (err) {
        context.status = err.status;
        context.body = err.message;
      } else {
        context.body = '';
      }
      resolve();
    });
  });
}
