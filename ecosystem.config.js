module.exports = {
  apps: [
    {
      name: 'kgmao-backend',
      script: 'server.js',
      cwd: '/home/u633695266/domains/kgmao.com/public_html',
      instances: 1,       // Single instance for stability on shared/limited hosting
      exec_mode: 'cluster',   // Cluster mode for load balancing
      watch: false,
      max_memory_restart: '1G', // Prevent memory leaks from destroying the server
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true
    }
  ]
};
