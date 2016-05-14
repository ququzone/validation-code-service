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
    var redisKey = config.redis.prefix + context.state.app.id + ':' + type + ':' + phone;
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
        .expire(redisKey, context.state.app.expires)
        .exec((err) => {
          if (err) {
            context.status = 500;
            context.body = {message: 'redis set error'};
            return resolve();
          }
          sms.send(phone, _.replace(context.state.app.tpl, '#code#', code), function(err) {
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
  var context = this;
  yield new Promise((resolve, reject) => {
    // TODO
    var client = redis.createClient({
      host: config.redis.host,
      port: config.redis.port
    });
    client.on('error', (err) => {
      context.status = 500;
      context.body = {message: 'request redis error'};
      resolve();
    });
    var redisKey = config.redis.prefix + context.state.app.id + ':' + type + ':' + phone;
    client.get(redisKey, (err, result) => {
      if (err) {
        context.status = 500;
        context.body = {message: 'redis get error'};
        return resolve();
      }
      if (!result) {
        context.status = 422;
        context.body = {message: '验证码不存在'};
        resolve();
      } else {
        if(result !== code) {
          context.status = 422;
          context.body = {message: '验证码错误'};
          resolve();
        } else {
          client.del(redisKey, () => {
            context.body = '';
            resolve();
          });
        }
      }
    });
  });
}
