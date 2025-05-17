# VW project

VW project uses a setup made of React, Typescript and Vite and it's deployed in Github Pages: https://spaghetti-n5.github.io/VW-project/

## Vite

Vite is a modern build tool and development server designed for speed and simplicity, particularly for frameworks like React. It's ideal for single-page apps or static sites.
I decided to use Vite for these main reasons:

- Vite uses ES modules in the browser, serving code without bundling during development. This results in near-instant server startup and hot module replacement (HMR), even for large projects. HMR (live reloading of changed modules) is faster because Vite only updates the specific module that changed, rather than rebuilding an entire bundle.
- Compared to Webpack-based tools like Create React App (CRA), Vite’s dev server is significantly faster, improving developer productivity.
- Vite uses Rollup under the hood for production builds, producing highly optimized, tree-shaken bundles with minimal code.
- It supports code-splitting, lazy-loading, and CSS optimization out of the box, ensuring fast load times in production.
- Vite natively supports ESM, TypeScript, JSX, and modern JavaScript features, aligning perfectly with React’s ecosystem.
- It handles CSS modules, PostCSS, and SCSS with minimal setup, streamlining styling workflows.
- Vite is lightweight and avoids the bloat of older tools, reducing dependency overhead and simplifying project maintenance.

To run the project locally:
`npm install`: install dependencies
`npm run dev`: start the local development server

Other useful scripts:
`npm run preview`: starts a local server to preview the production build of your app, simulating how it will behave when deployed.
`npm run build`: compiles and bundles your app’s code into optimized static assets for production deployment.

## Eslint and Prettier configuration to ensure quality

ESLint is a static code analysis tool that identifies and enforces coding standards, catching potential errors and enforcing best practices.
Prettier is an opinionated code formatter that automatically formats code for consistent style, reducing manual styling effort.
They provide a robust, automated solution for maintaining high-quality, consistent code in your React + Vite project, enhancing collaboration, reducing bugs, and streamlining development and deployment workflows.

Eslint scripts:
`npm run lint`: checks for issues without modifying files.
`npm run lint:fix`: checks and applies fixes where possible. It runs ESLint with the `--fix` flag to automatically correct fixable linting issues (e.g., formatting, simple React errors) in the project’s source files.

Prettier scripts:
`npm run format`: it scans specified files and automatically formats them according to Prettier’s rules (defined in .prettierrc or defaults)
`npm run check-format`: it scans specified files and checks if they conform to Prettier’s formatting rules without modifying them. It outputs a report in the terminal displaying a lists of files that deviate from the expected format and it exits with a non-zero status code if any files are incorrectly formatted, making it ideal for CI/CD.

## Jest and React testing library

Jest is a JavaScript testing framework designed for simplicity and performance, particularly suited for React applications. Provides a full suite of testing tools: test runner, assertions, mocks, spies, and code coverage reports.
Supports unit, integration, and snapshot testing, covering your React components and logic.

React Testing Library is a lightweight library for testing React components by simulating user interactions, focusing on behavior over implementation. It integrates smoothly with Jest, as Jest provides the test runner and assertions while RTL handles DOM interactions.

- Use `npm run test` to run your tests locally
- Use `npm run test:watch` during local development when actively writing or debugging React components, practicing TDD, or focusing on specific tests. It provides real-time feedback as you edit code, leveraging Jest’s watch mode for interactivity
- Use `npm run test:coverage` to calculate the test coverage of the repo

## CI/CD

`ci.yml` GitHub Actions workflow, named `CI-checks`, automates a series of checks to ensure code quality and functionality for the React + Vite project whenever code is pushed or a pull request is opened targeting the main branch.

Triggers: Runs on push and pull requests to main.

The job `build-and-test` performs the following steps:

- Checkout code: Uses `actions/checkout@v4` to fetch the repository code.
- Set up Node.js: Uses `actions/setup-node@v4` to configure Node.js version 20 with npm caching.
- Install dependencies: Runs `npm ci` for a clean dependency installation.
- Run Prettier: executes `npm run check-format` to ensure code formatting.
- Run ESLint: executes `npm run lint` to check code quality.
- Run tests: Runs `npm test -- --ci` for CI-specific testing.
- Build the app: Executes `npm run build` to compile the application.

The `deploy.yml` GitHub Actions workflow, named `Deploy to GitHub Pages`, automates deploying the React + Vite app to GitHub Pages whenever code is pushed to the main branch.

Triggers: Runs on push to main.
Permissions: Grants read access to repository contents, write access to GitHub Pages, and ID token generation for authentication.
Environment: Configures a github-pages environment, capturing the deployment URL.

The job `build-and-deploy` performs the following steps:

- Checks out code (actions/checkout@v4).
- Sets up Node.js 20 (actions/setup-node@v4).
- Installs dependencies (npm ci).
- Builds the app `npm run build`, generating static files in ./dist.
- Configures GitHub Pages (actions/configure-pages@v5).
- Uploads the dist folder as an artifact (actions/upload-pages-artifact@v3).
- Deploys the artifact to GitHub Pages (actions/deploy-pages@v4).
- Logs the deployment URL.
