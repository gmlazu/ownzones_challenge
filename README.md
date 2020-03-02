## ownzones_challenge

**Documentation**

You can generate project documentation by running `yarn run generate-docs`. The documentation will be outputted to `docs` in the HTML format.

* For API documentation, please refer to the [swagger docs](./swagger/index.html).

**Prerequisites**

* NodeJS 8 or later & yarn
* Docker (optional)

**Installation**

* Run `yarn install` to install project dependencies

**Building**

* You can build this project by running `yarn run build`. This will create the `build` folder, containing transpiled javascript source code.
    * Build with `yarn run build:prod` to build without sourcemaps
* You can build the project and docker containers by running `yarn run build:docker`. This will build the project and create the `ownzones_challenge` container. 

**Running**

When you run the app, you need to specify the environment you're on. You can do this by setting the `NODE_ENV` environment variable to `local`, `test` or `prod`.

* In a production environment, it is enough to run `yarn run start:prod`. This will not build the app.
* In a development environment, you can run `yarn run start:dev` to both build and run the app.

**Testing**

* You can run the unit tests by running `yarn run test`
    * Run `yarn run test:coverage` to measure code coverage


**Configuration**

* The configuration file can be found under `src/config.yml`, and it has the following format:
```
local:
  express:
    port: YOUR_EXPRESS_PORT
  cache:
    ttl: TTL
test:
  express:
    port: YOUR_EXPRESS_PORT
  cache:
    ttl: TTL
prod:
  express:
    port: YOUR_EXPRESS_PORT
  cache:
    ttl: TTL
```

The configuration that will be loaded depends on the `NODE_ENV` environment variable. 
* For example, if your `NODE_ENV` is set to `prod`, the config under `prod` will be loaded.
