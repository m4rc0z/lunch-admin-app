#!/bin/sh
set -e

cat > /etc/docker/daemon.json <<EOF
{
  "storage-driver":"overlay2",
  "dns": ["8.8.8.8", "1.1.1.1", "8.8.4.4"]
}
EOF

cat >> /etc/apt/apt.conf.d/20auto-upgrades <<EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

systemctl restart docker.service