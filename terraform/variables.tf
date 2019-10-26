variable "hcloud_token" {
  default = ""
}

variable "hcloud_ssh_keys" {
  type    = list(string)
  default = [""]
}

variable "node_count" {
  default = 1
}

variable "hcloud_name" {
  default = "hcloud"
}

variable "hcloud_type" {
  default = "cx11"
}

variable "hcloud_image" {
  default = "ubuntu-18.04"
}

variable "hcloud_location" {
  default = "nbg1"
}

variable "docker_version" {
  default = "18.03"
}

variable "domain" {
  default = "example.com"
}

variable "hostname_format" {
  default = "kube%d"
}

variable "apt_packages" {
  type    = "list"
  default = ["ufw"]
}
