provider "docker" {
  host = "ssh://root@${element(var.public_ips, 0)}:22"
}

# declare any input variables

# create docker volume resource


# create docker network resource
resource "docker_network" "lunch_network" {
  name = "lunch_network"
}


# create lunch-app-backend container
data "docker_registry_image" "lunch-app-backend" {
  name = "blinkeyech/lunch-app-backend:latest"
}
resource "docker_image" "lunch-app-backend" {
  name          = "${data.docker_registry_image.lunch-app-backend.name}"
  pull_triggers = ["${data.docker_registry_image.lunch-app-backend.sha256_digest}"]
}
resource "docker_container" "lunch-app-backend" {
  name          = "lunch-app-backend"
  labels        = {"id"="${docker_image.lunch-app-backend.id}"}
  image        = "${data.docker_registry_image.lunch-app-backend.name}"
  restart      = "always"
  must_run     = true
  ports {
    internal = "3005"
    external = "3005"
    #ip       = "127.0.0.1"
  }
  networks_advanced {
    name = "${docker_network.lunch_network.id}"
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
    "API_SECRET=XXX"
  ]
}

# create lunch-admin-app container
data "docker_registry_image" "lunch-admin-app" {
  name = "blinkeyech/lunch-admin-app:latest"
}
resource "docker_image" "lunch-admin-app" {
  name          = "${data.docker_registry_image.lunch-admin-app.name}"
  pull_triggers = ["${data.docker_registry_image.lunch-admin-app.sha256_digest}"]
}
resource "docker_container" "lunch-admin-app" {
  name          = "lunch-admin-app"
  labels        = {"id"="${docker_image.lunch-admin-app.id}"}
  image         = "${data.docker_registry_image.lunch-admin-app.name}"
  restart       = "always"
  must_run      = true
  ports {
    internal = "80"
    external = "3000"
  }
  networks_advanced {
    name = "${docker_network.lunch_network.id}"
  }
}

