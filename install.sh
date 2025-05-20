#!/bin/bash

# L4 DDoS Monitor Installation Script
# This script installs all dependencies and sets up the L4 DDoS Monitor system

echo "╔═════════════════════════════════════════════╗"
echo "║        L4 DDoS Monitor Installation         ║"
echo "╚═════════════════════════════════════════════╝"

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
  echo "Error: This script must be run as root to install system dependencies."
  echo "Please run with sudo or as root user."
  exit 1
fi

# Detect OS
if [ -f /etc/debian_version ]; then
  OS="debian"
  echo "Detected Debian-based distribution."
elif [ -f /etc/lsb-release ]; then
  OS="ubuntu"
  echo "Detected Ubuntu distribution."
else
  echo "Error: This installation script only supports Debian and Ubuntu."
  echo "Please install dependencies manually according to documentation."
  exit 1
fi

# Install system dependencies
echo "Installing system dependencies..."
apt-get update
apt-get install -y tcpdump sqlite3 geoip-bin geoip-database apache2 nodejs npm

# Enable Apache modules
echo "Configuring Apache modules..."
a2enmod proxy proxy_http proxy_wstunnel
systemctl restart apache2

# Create application directory
echo "Setting up application structure..."
APP_DIR="/opt/l4-ddos-monitor"
mkdir -p $APP_DIR
cp -r * $APP_DIR/
cd $APP_DIR

# Fix permissions for tcpdump
chmod u+s $(which tcpdump)

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Create database directory
mkdir -p data
chmod 755 data

# Create systemd service for monitor
echo "Creating systemd service..."
cat > /etc/systemd/system/l4-ddos-monitor.service << EOL
[Unit]
Description=L4 DDoS Traffic Monitor
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node $APP_DIR/backend/monitor.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

# Create systemd service for web frontend
cat > /etc/systemd/system/l4-ddos-web.service << EOL
[Unit]
Description=L4 DDoS Monitor Web Interface
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

# Create Apache config
echo "Configuring Apache virtual host..."
cat > /etc/apache2/sites-available/l4-ddos-monitor.conf << EOL
<VirtualHost *:80>
    ServerName monitor.local

    ProxyPreserveHost On
    ProxyRequests Off
    
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    ProxyPass /socket.io/ ws://localhost:3001/socket.io/
    ProxyPassReverse /socket.io/ ws://localhost:3001/socket.io/

    ErrorLog \${APACHE_LOG_DIR}/l4-ddos-error.log
    CustomLog \${APACHE_LOG_DIR}/l4-ddos-access.log combined
</VirtualHost>
EOL

# Enable the site
a2ensite l4-ddos-monitor
systemctl reload apache2

# Start services
echo "Starting services..."
systemctl enable l4-ddos-monitor
systemctl enable l4-ddos-web
systemctl start l4-ddos-monitor
systemctl start l4-ddos-web

# Build the Next.js application
echo "Building Next.js application..."
npm run build

echo "╔═════════════════════════════════════════════╗"
echo "║      Installation completed successfully    ║"
echo "╚═════════════════════════════════════════════╝"
echo ""
echo "Monitor is now running and accessible at: http://localhost:3000"
echo "To access from other machines, configure DNS or hosts file to point to this server."
echo ""
echo "Services status:"
echo "- Backend service: $(systemctl is-active l4-ddos-monitor)"
echo "- Web interface: $(systemctl is-active l4-ddos-web)"
echo ""
echo "Use these commands to control the services:"
echo "- sudo systemctl start/stop/restart l4-ddos-monitor"
echo "- sudo systemctl start/stop/restart l4-ddos-web"
echo ""
echo "Log files are located at:"
echo "- /var/log/syslog (for service logs)"
echo "- /var/log/apache2/l4-ddos-error.log (for Apache errors)"
echo ""