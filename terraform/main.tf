module "infrastructure" {
  source = "./infrastructure/hcloud"
  token           = "${var.hcloud_token}"
  ssh_keys        = "${var.hcloud_ssh_keys}"
  location        = "${var.hcloud_location}"
  type            = "${var.hcloud_type}"
  image           = "${var.hcloud_image}"
  hostname_format = "${var.hostname_format}"
}

module "apps" {
  source           = "./apps"
  public_ips       = module.infrastructure.public_ips
  hcloud_volume_id = module.infrastructure.hetzner_volume_id
  domain           = module.infrastructure.domain
}
