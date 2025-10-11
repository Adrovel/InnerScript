# Docker

### Why we use Docker?
- To ensure all the developers have the same environment and dependencies.
- Easier to setup the project.
- If plans to deploy, faster for CI/CD pipelines.

### How to use Docker?
*Minimal enough for the project*
- Docker consists of two main files: `Dockerfile` and `docker-compose.yml`.
- Dockerfiles is a text file that contains instructions for building a Docker image.
- Docker Compose is a tool for defining and running multi-container Docker applications.
- Docker Compose helps in connecting multiple docker applications together. In our case PostgreSQL and the Next.js application.

Dockerfile provides a line by line instructions for starting a server and running the application. For Next.js application, we write the instructions for copying the files, installing dependencies and building the application (if production). Then starting the server. A whole lifecycle of an application.

Docker compose provides the requirements while runnning applications, the order of starting each application. Sharing the volumes between containers, setting up environment variables for an application.

(PS: I have only mentioned our use cases).

- Please check the comments in the 'Dockerfile' and 'docker-compose.yml' for more details.

### Docker CLI commands
Starting a continaer.
```docker compose up [-d] [--build]```

Stopping a continaer.
```docker compose down```

Restarting a continaer.
```docker compose restart```

Rebuilding a continaer.
```docker compose build```

Logs of a continer.
```docker compose logs```

To run a command in a container
```docker compose exec <container_name> <command>```

List running services.
```docker compose ps```
