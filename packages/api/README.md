<p align="center">
  <a href="http://github.com/lumilock/lumilock-idp" target="blank"><img src="./src/Logo.svg" width="320" alt="Lumilock Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>


## tuto
[tuto](https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f)
### 1. Party time — Let’s start our API and see if it works.
```
yarn run start:dev:db
yarn run start:dev
```
### 2. Creating a migration
```
yarn run typeorm:migration:generate my_init
```
### 3. Run a migration
```
yarn run typeorm:migration:run
yarn run start:dev:db:seed
```
## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Full deployement from scratch
in .env
```
MODE="DEV"
```
Then execute:
```
yarn run start:dev:db
yarn run typeorm:migration:generate my_init
yarn run typeorm:migration:run
yarn run start:dev:db:seed
```
in .env change the MODE ENV VAR
```
MODE="PROD"
```
Then execute:
```
yarn build
pm2 start dist/main.js --name Lumilock
```
## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Author

- Author - [Thibaud Perrin](https://github.com/thibaud-perrin)
- Lumilock - [https://github.com/lumilock](https://github.com/lumilock)

## License

Nest is [MIT licensed](LICENSE).
