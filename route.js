var route = require('koa-route')
  , service = require('./service');

module.exports = function(app) {
  app.use(route.post('/request/:type/:phone', service.request));
  app.use(route.post('/sms', service.sendSMS));
};
