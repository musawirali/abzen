# Abzen

- Run `yarn` to install packages
- Install and run Redis
- Install and run Postgres DB server
- Create DB user: `abzen` with password `abzen`:
- Create DB: `abzen_dev`
   ```sh
    $ psql postgres
    postgres=# CREATE USER abzen WITH PASSWORD 'abzen';
    postgres=# CREATE DATABASE abzen_dev OWNER abzen;
    ```
- Run migrations: `yarn run admin-server:migrate`
- Start: `yarn start`

# Nx

This project was generated using [Nx](https://nx.dev).

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@abzen/mylib`.
