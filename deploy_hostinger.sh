#!/bin/bash
# ==============================================================================
# KGMAO HOSTINGER DEPLOYMENT SCRIPT
# Run this inside your Hostinger SSH terminal to fix the 503 errors.
# ==============================================================================

echo "🚀 Starting KGMAO Deployment on Hostinger..."

# 1. Ensure we are in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from inside the Kalide-GMAO project folder!"
    exit 1
fi

# 2. Pull the latest code from GitHub (where we just pushed everything)
echo "📥 Pulling latest code..."
git pull origin main

# 3. Install Global Dependencies
echo "📦 Installing global process managers (PM2)..."
sudo npm install -g pm2 concurrently

# 4. Install Node.js Dependencies & Build Frontend
echo "🏗️ Installing backend dependencies..."
cd backend && npm install
cd ..

echo "🏗️ Installing frontend dependencies and building React..."
cd frontend && npm install && npm run build
cd ..

# 5. Handle .env file (Prevents Node.js from crashing and causing 503s)
if [ ! -f "backend/.env" ]; then
    echo "⚠️ No backend/.env found. Copying from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ Created temporary .env. PLEASE EDIT backend/.env WITH REAL KEYS LATER."
fi

# Force PORT=5000 in the .env so Nginx proxy works correctly
sed -i 's/PORT=3000/PORT=5000/g' backend/.env
sed -i 's/AI_SERVICE_URL=http:\/\/localhost:8000/AI_SERVICE_URL=http:\/\/localhost:8100/g' backend/.env

# 6. Setup Python Environment for AI Service
echo "🐍 Setting up Python AI Engine..."
cd ai_service
# Install pip and venv if missing
sudo apt-get install -y python3-pip python3-venv
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate
# Install requirements
pip install -r requirements.txt
# Ensure uvicorn is available globally or in venv
pip install uvicorn
cd ..

# 7. Setup Nginx
echo "🌐 Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/kgmao
# Create symlink if it doesn't exist
if [ ! -f "/etc/nginx/sites-enabled/kgmao" ]; then
    sudo ln -s /etc/nginx/sites-available/kgmao /etc/nginx/sites-enabled/
fi
# Remove default nginx site to prevent conflicts
sudo rm -f /etc/nginx/sites-enabled/default

# 8. Start the PM2 Ecosystem
echo "🔄 Starting PM2 clusters (Node API & Python AI)..."
# We run pm2 with production environment
NODE_ENV=production pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 > startup.sh
chmod +x startup.sh
sudo ./startup.sh
rm startup.sh

# 9. Restart Nginx to clear the 503 error
echo "♻️ Restarting Nginx Server..."
sudo systemctl restart nginx

echo "================================================================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "Your app should now be live at https://kgmao.com without 503 errors."
echo ""
echo "To check logs if something is still failing, run: pm2 logs"
echo "================================================================================"
