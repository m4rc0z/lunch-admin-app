provider "docker" {
  host = "ssh://root@${element(var.public_ips, 0)}:22"
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
  command = [
    "--log.level=info",
    "--api.insecure=true",
    "--providers.docker=true",
    "--providers.docker.exposedbydefault=false",
    "--entrypoints.frontend.address=:80",
    "--entryPoints.frontend-secure.address=:443",
  ]
  image    = data.docker_registry_image.lunch-app-traefik.name
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
    target = "/var/run/docker.sock"
    source = "/var/run/docker.sock"
    type = "bind"
    read_only = true
  }
}

# create lunch-app-backend container
data "docker_registry_image" "lunch-app-backend" {
  name = "m4rc0z/lunch-app-backend:latest"
}
resource "docker_image" "lunch-app-backend" {
  name          = data.docker_registry_image.lunch-app-backend.name
  pull_triggers = [data.docker_registry_image.lunch-app-backend.sha256_digest]
}
resource "docker_container" "lunch-app-backend" {
  name     = "lunch-app-backend"
  labels   = {
    "id"=docker_image.lunch-app-backend.id
    "traefik.enable"=true
    "traefik.http.routers.backend.tls"=true
    "traefik.http.routers.backend.rule"="Host(`dev.mealit.de`) && PathPrefix(`/authenticated/api`)"
  }
  image    = data.docker_registry_image.lunch-app-backend.name
  restart  = "always"
  must_run = true
  ports {
    internal = "3005"
    external = "3005"
    #ip       = "127.0.0.1"
  }
  networks_advanced {
    name = docker_network.lunch-app-network.id
  }
  env = [
    "AUTH_DOMAIN=XXX",
    "AUTH_AUDIENCE=XXX",
    "DB_USER=XXX",
    "DB_PASSWORD=XXX",
    "DB_HOST=XXX",
    "DB_NAME=XXX",
    "CLOUD_NAME=XXX",
    "API_KEY=XXX",
    "API_SECRET=XXX",
  ]
}



# create lunch-admin-app container
data "docker_registry_image" "lunch-admin-app" {
  name = "blinkeyech/lunch-admin-app:latest"
}
resource "docker_image" "lunch-admin-app" {
  name          = data.docker_registry_image.lunch-admin-app.name
  pull_triggers = [data.docker_registry_image.lunch-admin-app.sha256_digest]
}
resource "docker_container" "lunch-admin-app" {
  name          = "lunch-admin-app"
  labels        = {
    "id"=docker_image.lunch-admin-app.id
    "traefik.enable"=true
    "traefik.http.middlewares.lunchapp-admin-redirect-web-secure.redirectscheme.scheme"="https"
    "traefik.http.routers.frontend.middlewares"="lunchapp-admin-redirect-web-secure"
    "traefik.http.routers.frontend.rule"="Host(`dev.mealit.de`)"
    "traefik.http.routers.frontend.entrypoints"="frontend"
    "traefik.http.routers.frontend-secure.rule"="Host(`dev.mealit.de`)"
    "traefik.http.routers.frontend-secure.tls"=true
    "traefik.http.routers.frontend-secure.entrypoints"="frontend-secure"
  }
  image         = data.docker_registry_image.lunch-admin-app.name
  restart       = "always"
  must_run      = true
  ports {
    internal = "80"
    external = "3000"
  }
  networks_advanced {
    name = docker_network.lunch-app-network.id
  }
  env = [
    "AUTH_DOMAIN=lunchmenuapp.eu.auth0.com",
    "AUTH_AUDIENCE=https://lunchmenuapp/api",
  ]
}

