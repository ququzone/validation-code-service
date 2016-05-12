module.exports = {
  redis: {
    host: 'vcs.host.name',
    port: 6379,
    prefix: 'vcs:'
  },
  apps: [{
    id: 'demo',
    expires: 1800
  }]
}
