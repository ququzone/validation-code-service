var redis = require('redis')
  , _ = require('lodash')
  , config = require('./config')
  , sms = require('./sms');

exports.sendSMS = function* () {
  var ctx = this;
  yield new Promise((resolve, reject) => {
    sms.send(ctx.request.body.phone, ctx.request.body.message, function(err) {
      if (err) {
        ctx.error({message: err.message}, err.status);
      } else {
        ctx.body = '';
      }
      resolve();
    });
  });
}

exports.request = function* (type, phone) {
  var ctx = this;
  yield new Promise((resolve, reject) => {
    var client = redis.createClient({
      host: config.redis.host,
      port: config.redis.port
    });
    client.on('error', (err) => {
      ctx.error({message: 'request redis error'});
      resolve();
    });
    var redisKey = config.redis.prefix + ctx.state.app.id + ':' + type + ':' + phone;
    client.get(redisKey, (err, code) => {
      if (err) {
        ctx.error({message: 'redis get error'});
        client.quit();
        return resolve();
      }
      if (!code) {
        code = parseInt(Math.random()*(999999-100001)+100000);
      }
      client.multi()
        .set(redisKey, code)
        .expire(redisKey, ctx.state.app.expires)
        .exec((err) => {
          if (err) {
            ctx.error({message: 'redis set error'});
            client.quit();
            return resolve();
          }
          sms.send(phone, _.replace(ctx.state.app.tpl, '#code#', code), function(err) {
            if (err) {
              ctx.error({message: err.message}, err.status);
            } else {
              ctx.body = '';
            }
            client.quit();
            resolve();
          });
        });
    });
  });
}

exports.verify = function* (type, phone, code) {
  var ctx = this;
  yield new Promise((resolve, reject) => {
    var client = redis.createClient({
      host: config.redis.host,
      port: config.redis.port
    });
    client.on('error', (err) => {
      ctx.error({message: 'request redis error'});
      resolve();
    });
    var redisKey = config.redis.prefix + ctx.state.app.id + ':' + type + ':' + phone;
    client.get(redisKey, (err, result) => {
      if (err) {
        ctx.error({message: 'redis get error'});
        client.quit();
        return resolve();
      }
      if (!result) {
        ctx.error({message: '验证码不存在'}, 422);
        client.quit();
        resolve();
      } else {
        if(result !== code) {
          ctx.error({message: '验证码错误'}, 422);
          client.quit();
          resolve();
        } else {
          client.del(redisKey, () => {
            ctx.body = '';
            client.quit();
            resolve();
          });
        }
      }
    });
  });
}
