module.exports = {
  redis: {
    host: 'vcs.host.name',
    port: 6379,
    prefix: 'vcs:'
  },
  apps: [{
    id: 'demo',
    expire: 1800,
    tpl: 'Your validation code #code#'
  }]
}
