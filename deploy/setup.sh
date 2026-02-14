#!/bin/bash
# One-time EC2 provisioning for Bank GreenDrive
# Run on Amazon Linux 2023 t2.micro instance
set -euo pipefail

echo "=== Bank GreenDrive EC2 Setup ==="

# System updates
sudo dnf update -y

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install nginx
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install certbot for SSL
sudo dnf install -y augeas-libs
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -sf /opt/certbot/bin/certbot /usr/bin/certbot

# Create app directory
mkdir -p ~/greendrive

# PM2 startup (run as ec2-user)
pm2 startup systemd -u ec2-user --hp /home/ec2-user | tail -1 | sudo bash

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Set up SSL:  sudo certbot --nginx -d greendrive.middleleap.com"
echo "  2. Install nginx config:  sudo cp ~/greendrive/deploy/nginx-greendrive.conf /etc/nginx/conf.d/greendrive.conf"
echo "  3. Remove default nginx config:  sudo rm -f /etc/nginx/conf.d/default.conf"
echo "  4. Test nginx:  sudo nginx -t && sudo systemctl reload nginx"
echo "  5. Create .env:  nano ~/greendrive/.env"
echo "     Required vars: TESLA_CLIENT_ID, TESLA_CLIENT_SECRET, TESLA_REDIRECT_URI, TESLA_REGION, FRONTEND_URL"
echo "  6. Push to main branch to trigger first deploy"
echo ""
echo "  Auto-renew SSL: sudo certbot renew --dry-run"
