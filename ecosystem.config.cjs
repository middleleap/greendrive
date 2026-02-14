module.exports = {
  apps: [
    {
      name: 'greendrive',
      script: 'server/index.js',
      cwd: '/home/ec2-user/greendrive',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '256M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
