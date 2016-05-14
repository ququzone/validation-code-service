module.exports = {
  redis: {
    host: 'vcs.redis.host',
    port: 6379,
    prefix: 'vcs:'
  },
  apps: [{
    id: 'demo',
    expires: 1800,
    tpl: 'Your validation code #code#'
  }]
}
