var _ = require('lodash')
  , koa = require('koa')
  , bodyParser = require('koa-bodyparser')
  , config = require('./config')
  , route = require('./route');

var app = koa();

app.use(bodyParser());

app.use(function* (next) {
  var ctx = this;
  this.error = (err, status) => {
    ctx.status = status || 500;
    ctx.body = err;
  };
  yield next;
});

app.use(function* (next) {
  if (!this.headers.appid) {
    this.status = 422;
    this.body = {message: '请求头部缺少: appid'};
    return;
  }
  var app = _.find(config.apps, ['id', this.headers.appid]);
  if (!app) {
    this.status = 422;
    this.body = {message: 'appid错误'};
    return;
  }
  this.state.app = app;
  yield next;
});

route(app);

app.listen(3000);
