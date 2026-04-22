module.exports = {
  apps: [
    {
      name: 'kgmao-backend',
      script: 'src/server.js',
      instances: 'max',       // Utilize all available CPU cores for clustering
      exec_mode: 'cluster',   // Cluster mode for load balancing
      watch: false,
      max_memory_restart: '1G', // Prevent memory leaks from destroying the server
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true
    }
  ]
};
