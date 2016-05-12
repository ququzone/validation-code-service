var route = require('koa-route')
  , service = require('./service');

module.exports = function(app) {
  app.use(route.post('/request/:type/:phone', service.request));
};
