var redis = require('redis')
  , _ = require('lodash')
  , config = require('./config')
  , sms = require('./sms');

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
  var context = this;
  yield new Promise((resolve, reject) => {
    var client = redis.createClient({
      host: config.redis.host,
      port: config.redis.port
    });
    client.on('error', (err) => {
      context.status = 500;
      context.body = {message: 'request redis error'};
      resolve();
    });
    var redisKey = config.redis.prefix + context.app.id + ':' + type + ':' + phone;
    client.get(redisKey, (err, code) => {
      if (err) {
        context.status = 500;
        context.body = {message: 'redis get error'};
        return resolve();
      }
      if (!code) {
        code = parseInt(Math.random()*(999999-100001)+100000);
      }
      client.multi()
        .set(redisKey, code)
        .expire(redisKey, context.app.expire)
        .exec((err) => {
          if (err) {
            context.status = 500;
            context.body = {message: 'redis set error'};
            return resolve();
          }
          sms.send(phone, _.replace(context.app.tpl, '#code#', code), function(err) {
            if (err) {
              context.status = err.status;
              context.body = {message: err.message};
            } else {
              context.body = '';
            }
            resolve();
          });
        });
    });
  });
}

exports.verify = function* (type, phone, code) {
  this.body = '';
}
