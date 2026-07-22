# ParelPracht Server

This is the back-end of ParelPracht. The front-end can be found [here](../parelpracht-client).

## Installation

1. Clone the repository with `git clone git@github.com:GEWIS/parelpracht-server`
2. Install the dependencies with `yarn install`.
3. Copy `.env.example` to `.env` and add the remaining environment variables.
4. Start the application with `yarn run dev`

It is suggested to use a local MariaDB instance. If you do not have a local
instance, you can use the docker compose file: `docker compose -f
docker-compose-mariadb.yaml up -d`. The environment variables in the
`.env.example` are adjusted to use this container configuration.

## First time setup

When running the application, you will first need to create a superuser. This is
done with the `/setup` endpoint.

1. Go to the [swagger docs](http://localhost:3001/api/swagger-ui/).
2. Navigate to `/setup` endpoint, and fill out the data for the request.
3. Check the console for the confirmation link.

Note: the confirmation link will only be logged in development mode. In
production, an actual mail will be sent with the confirmation link to the
indicated email address.
