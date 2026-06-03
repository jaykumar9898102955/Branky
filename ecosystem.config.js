module.exports = {
  apps: [
    {
      name: 'branky-stemlab',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
