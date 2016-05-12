var koa = require('koa')
  , route = require('./route');

var app = koa();

app.use(function* (next) {
  this.type = 'application/json; charset=utf-8';
  yield next;
});

app.use(function* (next) {
  if (this.headers.appid) {
    this.appid = this.headers.appid;
    yield next;
  } else {
    this.status = 422;
    this.body = JSON.stringify({msg: '请求头部缺少: appid'});
  }
});

route(app);

app.listen(3000);
