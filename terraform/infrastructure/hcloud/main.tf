variable "token" {}

variable "location" {
  type = string
}

variable "domain" {
  type = string
}

variable "type" {
  type = string
}

variable "image" {
  type = string
}

variable "ssh_keys" {
  type = list(string)
}

provider "hcloud" {
  token   = var.token
  version = "1.14"
}

variable "apt_packages" {
  type    = list(string)
  default = []
}

resource "hcloud_ssh_key" "default" {
  name       = "root@${var.domain}"
  public_key = file("~/.ssh/${var.domain}.pub")
}

resource "hcloud_server" "vps" {
  name        = var.domain
  location    = var.location
  image       = var.image
  server_type = var.type
  ssh_keys    = [hcloud_ssh_key.default.name]

  connection {
    user = "root"
    type = "ssh"
    timeout = "10m"
    host = self.ipv4_address
  }

  provisioner "file" {
    source      = "scripts/install.sh"
    destination = "/root/install.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "bash -c 'until [[ -f /var/lib/cloud/instance/boot-finished ]]; do sleep 1; done'",
      "sleep 120",
      "while fuser /var/{lib/{dpkg,apt/lists},cache/apt/archives}/lock >/dev/null 2>&1; do sleep 30; done",
      "apt-get -qq update && apt-get -qq install -y docker.io -y ${join(" ", var.apt_packages)}",
      #"apt-get -qq upgrade -y",
    ]
  }
}

data "hcloud_volume" "letsencrypt" {
  with_selector = "key=${var.domain}"
}

resource "hcloud_volume_attachment" "main" {
  volume_id = data.hcloud_volume.letsencrypt.id
  server_id = hcloud_server.vps.id
  automount = true

  connection {
    user = "root"
    type = "ssh"
    timeout = "2m"
    host = hcloud_server.vps.ipv4_address
  }

  provisioner "remote-exec" {
    inline = [
      "bash -c 'cd /mnt/HC_Volume_${hcloud_volume_attachment.main.volume_id} && mkdir -p letsencrypt/${var.domain}'",
    ]
  }
}

# get and assign floating ip with a label "key=${var.domain}"
data "hcloud_floating_ip" "public-ip" {
  with_selector = "key=${var.domain}"
}
resource "hcloud_floating_ip_assignment" "public-ip" {
  floating_ip_id = data.hcloud_floating_ip.public-ip.id
  server_id      = hcloud_server.vps.id

  connection {
    user = "root"
    type = "ssh"
    timeout = "2m"
    host = hcloud_server.vps.ipv4_address
  }

  #############################################################################################################
  # Hetzner Floating IP assignement and setup
  # see https://wiki.hetzner.de/index.php/Cloud_floating_IP_persistent/en
  # create /etc/network/interfaces.d/60-my-floating-ip.cfg with the floating ip address and reload the network
  #############################################################################################################
  provisioner "file" {
    content = <<EOT
auto eth0:1
iface eth0:1 inet static
    address ${data.hcloud_floating_ip.public-ip.ip_address}
    netmask 32
EOT
    destination = "/etc/network/interfaces.d/60-my-floating-ip.cfg"
  }

  # After creating the /etc/network/interfaces.d/60-my-floating-ip.cfg with the proper ip address taken from
  # data.hcloud_floating_ip (with a label key=${var.domain}) restart network services to assign ip
  provisioner "remote-exec" {
    inline = [
      "sudo service networking restart",
    ]
  }
  #############################################################################################################
}

output "public_ip" {
  depends_on  = [status]
  value = data.hcloud_floating_ip.public-ip.ip_address
}

output "hetzner_volume_id" {
  depends_on  = [status]
  value = data.hcloud_volume.letsencrypt.id
}
