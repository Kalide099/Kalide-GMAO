module.exports = {
  apps: [
    {
      name: 'kgmao-backend',
      script: 'backend/src/server.js',
      instances: 'max', // or a specific number of instances like 2 or 4
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'kgmao-ai-engine',
      script: 'uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8100 --workers 4',
      cwd: './ai_service',
      interpreter: 'python3',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        PYTHONUNBUFFERED: "1"
      }
    }
  ]
};
