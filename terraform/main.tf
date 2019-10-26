module "infrastructure" {
  source = "./infrastructure/hcloud"
  token           = "${var.hcloud_token}"
  ssh_keys        = "${var.hcloud_ssh_keys}"
  location        = "${var.hcloud_location}"
  type            = "${var.hcloud_type}"
  image           = "${var.hcloud_image}"
  hosts           = "${var.node_count}"
  hostname_format = "${var.hostname_format}"
}
