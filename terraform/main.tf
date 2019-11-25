module "infrastructure" {
  source = "./infrastructure/hcloud"
  token           = var.hcloud_token
  ssh_keys        = var.hcloud_ssh_keys
  location        = var.hcloud_location
  type            = var.hcloud_type
  image           = var.hcloud_image
  domain          = var.domain
}

module "apps" {
  source           = "./apps"
  public_ip        = module.infrastructure.public_ip
  hcloud_volume_id = module.infrastructure.hetzner_volume_id
  domain           = var.domain
}
