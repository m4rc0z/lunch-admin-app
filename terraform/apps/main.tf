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
    "AUTH_DOMAIN=lunchmenuapp.eu.auth0.com",
    "AUTH_AUDIENCE=https://lunchmenuapp/api",
    "DB_USER=marcoz2",
    "DB_PASSWORD=mz96589658",
    "DB_HOST=ds153947.mlab.com:53947",
    "DB_NAME=lunch-app-database",
    "CLOUD_NAME=di7doiggx",
    "API_KEY=142987644383175",
    "API_SECRET=VN267caeUXJZBT0I84F3GVc86cg"
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

