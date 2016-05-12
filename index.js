var koa = require('koa')
  , route = require('./route');

var app = koa();

route(app);

app.listen(3000);
