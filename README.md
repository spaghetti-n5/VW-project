# VW project

VW project uses a setup made of React, Typescript and Vite and it's deployed in Github Pages: https://spaghetti-n5.github.io/VW-project/

Author: Eleonora Baret

## How to run the project locally

#### Prerequisites
- Node.js: Version 16.x or higher.
- npm: Package manager for dependencies.

#### Clone the Repository:
```
git clone https://github.com/spaghetti-n5/VW-project.git
cd VW-project
```

#### Install Dependencies:
```
npm install
```

#### Start the Development Server:
```
npm run dev
```
The app will be available at http://localhost:5173/VW-project/

## Technology Stack

- React: Core library for building the user interface.
- TypeScript: Adds static types for improved code quality and developer experience.
- TanStack Table: Powers dynamic tables with pagination and sorting.
- pico.css and CSS modules: Ensures maintainable, component-scoped styling.
- Zustand: Manages application state, e.g., favorite posts and search filters.
- React Router: Handles client-side routing for multi-page navigation.
- Jest & React Testing Library: Facilitates unit and integration testing.
- Cypress: E2E testing
- Vite: build tool and development server 
- JSONPlaceholder API: Mock backend for testing CRUD operations.

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

## TanStack Table

## CSS modules and pico.css

In the context of the VW-project repository, the use of Pico.css and CSS Modules as styling solutions was a strategic choice that aligns with the project's goals of building a lightweight, maintainable, and modern web application.

**Pico.css** is a minimal, classless CSS framework designed to provide clean, semantic, and responsive styling with minimal setup. Unlike heavier frameworks like Bootstrap or Tailwind, Pico.css applies styles directly to HTML elements based on semantic markup, requiring no additional classes for basic styling. It’s lightweight (~10KB minified), customizable, and ideal for small-to-medium projects or prototypes.

**CSS Modules** is a CSS scoping mechanism that locally scopes styles to components, preventing style conflicts in JavaScript applications. By importing CSS files (e.g., Pagination.module.css) as modules, styles are transformed into unique class names (e.g., .pagination_abc123), ensuring encapsulation.

#### Why did I chosoe this approach for styling?

**Pico.css** offers simplicity and Lightweight Design.
The VW-project is portfolio project (aligned with spaghetti-n5/JS-exercises), prioritizing simplicity and fast development. Pico.css’s minimal footprint (~10KB vs. Bootstrap’s ~150KB) reduces bundle size, improving load times for users.
Benefits:

Pico.css styles native HTML elements without requiring classes, reducing markup complexity. It does not need for extensive configuration or learning a complex API, allowing rapid prototyping of components. It encourages clean HTML, using Semantic Markup, aligning with modern web standards and accessibility. It offers theming capability out of the box.

**CSS Modules** offer scoped and Maintainable Styling
In a React application with multiple components (Pagination, Button, PostsPage), style conflicts can arise if global CSS is used. CSS Modules ensures styles are scoped to specific components, enhancing maintainability.
Benefits:
Each component has its own CSS file (e.g., Pagination.module.css), making it easy to update or refactor styles without affecting the entire app.
TypeScript Integration: CSS Modules work seamlessly with TypeScript, providing type-safe style imports (e.g., import styles from './Pagination.module.css'), reducing runtime errors.
It works natively with Create React App, Vite, or Webpack, automatically scoping styles during the build process.

## Zustand

Zustand is a lightweight, modern state management library for React applications. It provides a simple, scalable, and performant way to manage global state without the complexity of larger libraries like Redux.
Zustand is ideal for projects requiring straightforward global state management, such as toggling UI states, managing form inputs, or tracking user preferences.

- **Simple API**: Uses a single create function to define a store with state and actions.
- **Hook-Based**: Integrates seamlessly with React via custom hooks, allowing components to subscribe to specific state slices.
- **No Boilerplate**: Avoids complex setup (e.g., reducers, actions, or middleware) for faster development.
- **TypeScript Support**: Offers excellent type inference and safety, especially for TypeScript projects.
- **Middleware**: Supports extensions like persistence or immer for complex state updates.
- **Performant**: Minimizes re-renders by allowing components to select only the state they need.

In the project the store is declared with `PostStore` Interface: it defines the store’s shape using TypeScript, ensuring type safety:
- **favorites**: number[]: An array of post IDs marked as favorites. Enables users to save preferred posts for quick access, displayed on a dedicated Favorites page.
- **searchText**: string: A string for filtering posts (e.g., in a search bar). upports real-time search functionality, allowing users to find posts by title, body, or other criteria.
- **setSearchText**: (searchText: string) => void: A function to update searchText.
- **toggleFavorite**: (postId: number) => void: A function to add or remove a post ID from favorites.

#### Why using a as global store?
- Zustand allows components to access and update favorites and searchText without prop drilling, simplifying the app’s architecture.
- Changes to the store (e.g., adding a favorite) automatically re-render subscribed components, ensuring a responsive UI.
- Zustand’s minimal API avoids the complexity of Redux, making it ideal for managing small-to-medium state like favorites and search.
- Persistence (Improvement): While not implemented here, Zustand supports middleware to persist favorites to local storage, preserving user preferences across sessions.

## Jest and React testing library

Jest is a JavaScript testing framework designed for simplicity and performance, particularly suited for React applications. Provides a full suite of testing tools: test runner, assertions, mocks, spies, and code coverage reports.
Supports unit, integration, and snapshot testing, covering your React components and logic.

React Testing Library is a lightweight library for testing React components by simulating user interactions, focusing on behavior over implementation. It integrates smoothly with Jest, as Jest provides the test runner and assertions while RTL handles DOM interactions.

- Use `npm run test` to run your tests locally
- Use `npm run test:watch` during local development when actively writing or debugging React components, practicing TDD, or focusing on specific tests. It provides real-time feedback as you edit code, leveraging Jest’s watch mode for interactivity
- Use `npm run test:coverage` to calculate the test coverage of the repo

````
----------------------|---------|----------|---------|---------|-----------------------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-----------------------------------
All files             |   93.84 |     81.7 |   90.32 |   93.51 |
 components/DataTable |   91.66 |    78.78 |   86.66 |   91.42 |
  Modal.tsx           |     100 |      100 |     100 |     100 |
  SortButtons.tsx     |      75 |    58.33 |      50 |      75 | 26-38
  TableComponent.tsx  |   93.75 |       80 |     100 |   93.75 | 18
 components/shared    |     100 |     90.9 |     100 |     100 |
  Button.tsx          |     100 |    66.66 |     100 |     100 | 27
  ErrorAlert.tsx      |     100 |      100 |     100 |     100 |
  LoadingSpinner.tsx  |     100 |      100 |     100 |     100 |
  Pagination.tsx      |     100 |      100 |     100 |     100 |
  SearchBar.tsx       |     100 |      100 |     100 |     100 |
 pages                |    90.1 |    78.12 |   86.66 |   89.15 |
  PostsPage.tsx       |    90.1 |    78.12 |   86.66 |   89.15 | 46-47,102-103,136,155,190,216-217
 types                |     100 |      100 |     100 |     100 |
  shared.ts           |     100 |      100 |     100 |     100 |
 utils                |     100 |      100 |     100 |     100 |
  api.ts              |     100 |      100 |     100 |     100 |
  constants.ts        |     100 |      100 |     100 |     100 |
  samplePost.ts       |     100 |      100 |     100 |     100 |
----------------------|---------|----------|---------|---------|--
```

## Cypress

Cypress is an open-source, JavaScript-based end-to-end (E2E) testing framework for web applications. It enables developers to write automated tests that simulate user interactions in a browser, such as clicking buttons, filling forms, and navigating pages. Key features include:

- Real Browser Testing: Runs tests in actual browsers (e.g., Chrome, Firefox) for accurate results.
- Time Travel: Allows debugging by capturing snapshots of the app state at each test step.
- Automatic Waiting: Handles asynchronous operations without manual waits.
- Easy Setup: Integrates with JavaScript frameworks like React, Vue, and Angular.
- Rich UI: Provides an interactive dashboard for test execution and debugging.

#### Useful command: 
`npm run cy:open`: Opens the Cypress Test Runner GUI in interactive mode. Lets you manually select and run tests in a browser (Chrome, Firefox..). It is iseful during local development and debugging as it provides visual feedback.

`npm cy:run`: Runs Cypress tests headlessly (in the background, no GUI). The output is shown in the terminal, and results (videos/screenshots) are stored in the `/cypress/videos` or `/screenshots` directories. It's useful in CI/CD pipelines or automated test scripts.


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

## CI/CD pipelines

#### CI
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

#### CD
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

## Github setup
Branch protection is setup to avoid merging if the CI checks are failing


## UI usage
GitHub copilot: integrated in my code editor, provides useful helps while compiling imports, functions. 

ChatGPT:
- used for understanding the proper tech stack to use
- helped with documentation
- helped in fixing smalls bugs during developement

## Reusable compoenents

## Improvements
- Debouncing Search: Add a debounce mechanism to setSearchText to reduce re-renders on rapid typing.
- Reset Action: Add a resetFavorites action to clear favorites for user convenience.
- Persistence: Add Zustand’s persist middleware to save favorites to localStorage
- Add Cypress tests in CI pipeline