# Mid-Senior test
This project is a simple Express application implementing [this requirements](requirements.md). Some assumptions were made for business rules like: 
- You cannot pay more than you owe for a loan
- A user cannot pay other people's loans

Because a route was asked to be admin only the user model has an additonal field called role.
Additionally instead of having remaining_balance and total_paid  as columns they're calculated when fetching any loan. If they're needed as a literal column or property they can be calculated with additional configuration for populating them as calculated fields.

Tsoa is used instead of traditionally declaring routes for automatic documentation, to comply with the "Include example requests and responses" requirement and to get the most of type hinting. Originally the alpha of Sequelize that integrates typescript was used ([see doc](https://sequelize.org/docs/v7/getting-started/)) but yielded unexpected behaviors, for this reason some parts may not be type hinted like the returns in the controllers; this can be fixed using interfaces with the Loan, User and Payment model structure. For this same reason in some parts the sequelize object is casted to a regular object using the ```.get({plain: true})``` method in the sequelize-typescript responses. 
## 🛠️ Tech Stack

### Backend:

- Node.js (v22 intel platform)
- Express
- TypeScript
- Sequelize-Typescript
- TSOA

### DevOps & Tooling:

- Docker & Docker Compose
- Yarn
- Nodemon & TSX
- Vitest
- ESLint & Prettier


## Getting Started

### 1. Clone the Repository:

```bash
git clone https://github.com/Bardofaragon/amigo-veloz-mid-senior-test.git
cd amigo-veloz-mid-senior-test
```

### 2. Setup Environment Variables:

- Copy the `.env.example` file to `.env` and fill in the required values:

```bash
cp .env.example .env
```

### 3. Run the Project in Development Mode:

```bash
docker compose up --build
```

- The application will be available at: [http://localhost:3000](http://localhost:3000)
- API documentation is available at: [http://localhost:3000/docs](http://localhost:3000/docs)


## ⚠️ Important: Avoid Manual Changes to Generated Files

- **Do NOT edit `src/routes.ts` or `src/openapi.json` manually.**
- These files are **automatically generated** by **TSOA** using the commands:

```bash
yarn tsoa:routes
yarn tsoa:spec
```

- Any **manual changes** will be **overwritten** when **TSOA regenerates** these files.


## 🎮 Playing Around
TBD. Seeding code pending.


## 🧪 Running Tests

```bash
yarn test
```

⚠️ Important: Have in mind that the tests are not unit tests, since they're integration tests you need a database to run them. So for simplicity you may run 
```bash
docker compose run app yarn test
```
or modify the .env to point to a testing db

## 🚀 Deploying to Production

### ⚠️ Important: Development and Production Setups Differ

- The **development environment** uses **hot reloading** with **TSX** and **syncs models automatically**.
- For **production**, you should:
  - Use a **production-ready Dockerfile** that **builds the TypeScript project**.
  - Serve the **built `dist` folder** instead of using **TSX**.

### Example Production Dockerfile

```Dockerfile
FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn build

FROM node:22-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Running with a Production Docker Compose

- Instead of using **`docker compose up`** for development, your **production `docker-compose.yml`** should:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
    ports:
      - '3000:3000'
    command: ['node', 'dist/server.js']
```

### Use Sequelize Migrations for Production

- Instead of **`sequelize.sync()`**, use **migrations**:

```bash
npx sequelize-cli db:migrate
```

- Make sure to run **migrations** as part of your **deployment pipeline**.

---

## 📄 Additional Documentation & References

- **API Documentation:** [Download OpenAPI Spec](openapi.json)
- **Project Requirements:** [View Requirements](requirements.md)

---

## 💡 Helpful Commands
For simplicity running ```docker compose run app yarn XXXX``` is recommended but have in mind that all the yarn commands can be run both inside and outside docker with minor tweaks.

 For example if you're pointing to host=database in the env, this uses the docker network to resolve database, but if you're running it without docker you may need to point to a propper host or localhost. Additionally if running without docker make sure to use the propper node version and install beforehand all the dependencies.

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `yarn dev`          | Run the app in development mode        |
| `yarn build`        | Generate routes and compile TypeScript |
| `yarn test`         | Run all unit tests using Vitest        |
| `yarn tsoa:routes`  | Generate TSOA routes file              |
| `yarn tsoa:spec`    | Generate OpenAPI spec file             |
| `docker compose up` | Start the app using Docker             |

---

## ❓ Troubleshooting

- Make sure **Docker** is running before executing **docker compose up**.

- Since we're using bycript have in mind that your node_modules and yarn may compile the binary in different architectures. So don't try to run both yarn dev and the build at the same time even though the Dockerfile explicitly deletes the node_modules to avoid issues related to that. 
- If ports are in use, check for **existing processes** or **containers** using **port 3000**.
