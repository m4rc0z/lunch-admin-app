variable "token" {}

variable "hosts" {
  default = 0
}

variable "hostname_format" {
  type = "string"
}

variable "location" {
  type = "string"
}

variable "type" {
  type = "string"
}

variable "image" {
  type = "string"
}

variable "ssh_keys" {
  type = "list"
}

provider "hcloud" {
  token = "${var.token}"
}

variable "apt_packages" {
  type    = "list"
  default = []
}

resource "hcloud_ssh_key" "default" {
  name       = "root@hcloud"
  public_key = file("~/.ssh/hetzner.pub")
}

resource "hcloud_server" "host" {
  name        = "${format(var.hostname_format, 1)}"
  location    = "${var.location}"
  image       = "${var.image}"
  server_type = "${var.type}"
  ssh_keys    = ["${hcloud_ssh_key.default.name}"]

  count       = "${var.hosts}"

  connection {
    user = "root"
    type = "ssh"
    timeout = "2m"
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

output "public_ips" {
  depends_on  = [status]
  value = "${hcloud_server.host.*.ipv4_address}"
}