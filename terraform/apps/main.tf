provider "docker" {
  host = "ssh://root@${var.public_ip}:22"
  version = "2.5"
}

# declare any input variables

# create docker volume resource

# create docker network resource
resource "docker_network" "lunch-app-network" {
  name = "lunch-app-network"
}

# create traefik container
data "docker_registry_image" "lunch-app-traefik" {
  name = "traefik:v2.0.4"
}
resource "docker_image" "lunch-app-traefik" {
  name          = data.docker_registry_image.lunch-app-traefik.name
  pull_triggers = [data.docker_registry_image.lunch-app-traefik.sha256_digest]
}
resource "docker_container" "lunch-app-traefik" {
  name     = "lunch-app-traefik"
  image    = data.docker_registry_image.lunch-app-traefik.name
  command = [
    "--log.level=info",
    "--api.insecure=true",
    "--providers.docker=true",
    "--providers.docker.exposedbydefault=false",
    "--entrypoints.frontend.address=:80",
    "--entryPoints.frontend-secure.address=:443",
    "--certificatesresolvers.lunchmenuapp.acme.httpchallenge=true",
    "--certificatesresolvers.lunchmenuapp.acme.httpChallenge.entryPoint=frontend",
    #"--certificatesresolvers.lunchmenuapp.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory",
    "--certificatesresolvers.lunchmenuapp.acme.email=m.zirkenbach@gmx.de",
    "--certificatesresolvers.lunchmenuapp.acme.storage=/letsencrypt/acme.json",
]
  restart  = "always"
  must_run = true
  ports {
    internal = "80"
    external = "80"
  }
  ports {
    internal = "443"
    external = "443"
  }
  ports {
    internal = "8080"
    external = "8080"
  }
  networks_advanced {
    name = docker_network.lunch-app-network.id
  }
  mounts {
    source = "/var/run/docker.sock"
    target = "/var/run/docker.sock"
    type = "bind"
    read_only = true
  }
  mounts {
    source = "/mnt/HC_Volume_${var.hcloud_volume_id}/letsencrypt/${var.domain}"
    target = "/letsencrypt"
    type = "bind"
    read_only = false
  }
}

# create frontend container
data "docker_registry_image" "lunch-admin-app" {
  name = "m4rc0z/lunch-admin-app:${var.domain}"
}
resource "docker_image" "lunch-admin-app" {
  name          = data.docker_registry_image.lunch-admin-app.name
  pull_triggers = [data.docker_registry_image.lunch-admin-app.sha256_digest]
}
resource "docker_container" "lunch-admin-app" {
  name          = "lunch-admin-app"
  image         = data.docker_registry_image.lunch-admin-app.name
  restart       = "always"
  must_run      = true
  ports {
    internal = "80"
    external = "3000"
    ip       = "127.0.0.1" # enable for security reasons
  }
  networks_advanced {
    name = docker_network.lunch-app-network.id
  }
  env = [
    "AUTH_DOMAIN=lunchmenuapp.eu.auth0.com",
    "AUTH_AUDIENCE=https://lunchmenuapp/api",
  ]
  labels = {
    "id"=docker_image.lunch-admin-app.id
    "traefik.enable"=true
    "traefik.http.middlewares.lunchapp-admin-redirect-web-secure.redirectscheme.scheme"="https"
    "traefik.http.routers.frontend.middlewares"="lunchapp-admin-redirect-web-secure"
    "traefik.http.routers.frontend.rule"="Host(`${var.domain}`)"
    "traefik.http.routers.frontend.entrypoints"="frontend"
    "traefik.http.routers.frontend-secure.rule"="Host(`${var.domain}`)"
    "traefik.http.routers.frontend-secure.tls"=true
    "traefik.http.routers.frontend-secure.tls.certresolver"="lunchmenuapp"
    "traefik.http.routers.frontend-secure.entrypoints"="frontend-secure"
  }
}

# create backend container
data "docker_registry_image" "lunch-app-backend" {
  name = "m4rc0z/lunch-app-backend:${var.domain}"
}
resource "docker_image" "lunch-app-backend" {
  name          = data.docker_registry_image.lunch-app-backend.name
  pull_triggers = [data.docker_registry_image.lunch-app-backend.sha256_digest]
}
resource "docker_container" "lunch-app-backend" {
  name     = "lunch-app-backend"
  image    = data.docker_registry_image.lunch-app-backend.name
  restart  = "always"
  must_run = true
  ports {
    internal = "3005"
    external = "3005"
    ip       = "127.0.0.1" # enable for security reasons
  }
  networks_advanced {
    name = docker_network.lunch-app-network.id
  }
  env = [
    "AUTH_DOMAIN=lunchmenuapp.eu.auth0.com",
    "AUTH_AUDIENCE=https://lunchmenuapp/api",
    "DB_USER=XXX",
    "DB_PASSWORD=XXX",
    "DB_HOST=XXX",
    "DB_NAME=XXX",
    "CLOUD_NAME=XXX",
    "API_KEY=XXX",
    "API_SECRET=XXX",
  ]
  labels   = {
    "id"=docker_image.lunch-app-backend.id
    "traefik.enable"=true
    "traefik.http.routers.backend.tls"=true
    "traefik.http.routers.backend.rule"="Host(`${var.domain}`) && PathPrefix(`/authenticated/api`, `/unauthenticated/api`)"
  }
}