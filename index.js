var _ = require('lodash')
  , koa = require('koa')
  , config = require('./config')
  , route = require('./route');

var app = koa();

app.use(function* (next) {
  this.type = 'application/json; charset=utf-8';
  yield next;
});

app.use(function* (next) {
  if (!this.headers.appid) {
    this.status = 422;
    this.body = JSON.stringify({msg: '请求头部缺少: appid'});
    return;
  }
  var app = _.find(config.apps, ['id', this.headers.appid]);
  if (!app) {
    this.status = 422;
    this.body = JSON.stringify({msg: 'appid错误'});
    return;
  }
  yield next;
});

route(app);

app.listen(3000);
