# Technical documentation

VW project is a prototype project built with React, TypeScript, Vite, and TanStack Table, designed to showcase modern web development skills.

It serves as a data-driven app for managing posts with a focus on clean code, scalability, and user experience.
It emphasizes performance optimizations, accessibility (WCAG 2.1 Level AA), and responsive design.

The app displays a data table of posts fetched from a mock API (JSONPlaceholder), allowing users to view, filter, sort, favorite, edit, and delete posts.

## JSONPlaceholder and design choices

In the VW-project, the _edit_, _delete_, and _create_ actions for posts are not permanent, reverting to their original state after a page refresh, due to the following reasons related to the use of the JSONPlaceholder API and local state management:

- **JSONPlaceholder API is a Mock API:**

[JSONPlaceholder](https://jsonplaceholder.typicode.com) is a public, read-only mock API designed for testing and prototyping.
It simulates CRUD operations (Create, Read, Update, Delete) by returning realistic responses (e.g., HTTP 200 with updated data), but it does not persist changes in a real database. Any _POST_, _PUT_, or _DELETE_ request (e.g., via _addPost_, _editPost_, _deletePost_ in `utils/api`) only mimics the action server-side without storing it.
After a refresh, the app re-fetches the original mock data (e.g., 100 posts), resetting all changes.

- **Local State Management:**

The app stores posts in a local React state (data in PostsPage.tsx, managed via useState) and favorites in a Zustand store (usePostStore). When you edit, delete, or create a post, the local data state is updated (e.g., setData in handleModalSubmit or handleDelete), reflecting changes in the UI.

However, this state is ephemeral and resets on page refresh because it’s not persisted to a database or browser storage (e.g., localStorage, sessionStorage). The app re-fetches data from JSONPlaceholder on mount (useEffect in PostsPage.tsx), restoring the original posts.

- **No Client-Side Persistence:**

The app doesn’t implement client-side storage (e.g., localStorage to save modified posts or changes) to simulate persistence. Without such a mechanism, all local state changes (e.g., new posts, edits, deletions) are lost when the browser reloads, and the app reloads the original JSONPlaceholder data.

Unlike posts, favorites are persisted in localStorage using the Zustand store (usePostStore). The favorites array is saved client-side, so favorited posts remain after a refresh, providing a lightweight form of persistence for user preferences.

### Potential improvements/workarounds

To simulate persistence for demo purposes, I could store changes in localStorage:

- On edit/delete/create, save the updated data to localStorage.
- On mount, check localStorage before fetching from JSONPlaceholder.

This would persist changes across refreshes, but it’s a client-side workaround, not a replacement for a real database.

```tsx
useEffect(() => {
  const loadPosts = async () => {
    try {
      const savedPosts = localStorage.getItem("posts");
      if (savedPosts) {
        setData(JSON.parse(savedPosts));
      } else {
        const posts = await fetchPosts();
        setData(posts);
        localStorage.setItem("posts", JSON.stringify(posts));
      }
    } catch (error) {
      setError("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };
  loadPosts();
}, []);

const handleModalSubmit = async (post: Post) => {
  // ... existing logic ...
  setData((prev) => {
    const newData =
      modalType === ModalType.ADD
        ? [{ ...newPost, id: prev.length + 101 }, ...prev]
        : prev.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    localStorage.setItem("posts", JSON.stringify(newData));
    return newData;
  });
};
```

## Desktop vs mobile view

In the VW-project, cards are used instead of tables in the mobile view for responsive design reasons:

- **Improved Readability:** Tables with multiple columns (ID, Title, Body, Actions) often require horizontal scrolling on small screens (e.g., 320px), which is cumbersome. Cards stack vertically, displaying each post’s fields in a compact, readable format without scrolling.
- **Space Efficiency:** Cards adapt to narrow viewports by arranging fields (e.g., Title, Body) in a single-column layout, using flexbox or grid (styles.cardView), ensuring content fits without truncation or overflow.
- **User Experience:** Cards provide a touch-friendly interface, with larger tap targets for actions (e.g., Edit, Delete), better suited for mobile users than dense table rows.
- **Accessibility:** Cards support reflow, avoiding horizontal scrolling and ensuring content is accessible on small screens.

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

TanStack Table (formerly React Table) is a powerful, lightweight, and flexible library for building dynamic tables in JavaScript applications, particularly React-based ones.
It provides "headless" architecture, meaning it provides logic (e.g., pagination, sorting) without dictating UI, allowing to style and structure the table as needed.

- It provides hooks like **useReactTable** for managing table state, which provides sorting and pagination features out of the box. It offers sorting, column resizing, and row selection, global or column filters. It provides `getPaginationRowModel` and methods like `table.nextPage`, `table.setPageSize` to navigate posts and adjust page sizes.
- TanStack Table is ~10-15KB (minified), much lighter than full-featured libraries, reducing the app’s bundle size.
- Uses React’s virtual DOM efficiently, only re-rendering when table state changes.
- TanStack Table’s strong TypeScript support ensures robust development.

## CSS modules and pico.css

In the context of the VW-project repository, the use of Pico.css and CSS Modules as styling solutions was a strategic choice that aligns with the project's goals of building a lightweight, maintainable, and modern web application.

**Pico.css** is a minimal, classless CSS framework designed to provide clean, semantic, and responsive styling with minimal setup. Unlike heavier frameworks like Bootstrap or Tailwind, Pico.css applies styles directly to HTML elements based on semantic markup, requiring no additional classes for basic styling. It’s lightweight (~10KB minified), customizable, and ideal for small-to-medium projects or prototypes.

**CSS Modules** is a CSS scoping mechanism that locally scopes styles to components, preventing style conflicts in JavaScript applications. By importing CSS files (e.g., Pagination.module.css) as modules, styles are transformed into unique class names (e.g., .pagination_abc123), ensuring encapsulation.

#### Why did I chosoe this approach for styling?

The first idea for the styling was to use a UI / CSS Framework, specifically Ant Design. Ant Design is a popular React UI library offering a comprehensive set of pre-built components (e.g., tables, buttons, modals) with a polished, enterprise-grade design.
After deeply analyze the approach I decided that Ant Design wasn’t a good choice for VW-project due to its large bundle size, complex components, limited customization, and mismatch with the headless table needs met by TanStack Table.

It would add unnecessary overhead, complicate testing, and detract from the project’s minimalist, custom, and fast prototyping-focused goals. The chosen stack (Pico.css, CSS Modules, and TanStack Table) offers a lightweight, flexible, and type-safe solution. This combination ensures VW-project remains fast, maintainable, and distinctive, showcasing modern web development skills.

**Pico.css** offers simplicity and Lightweight Design.
The VW-project is portfolio project (aligned with spaghetti-n5/JS-exercises), prioritizing simplicity and fast development. Pico.css’s minimal footprint (~10KB vs. Bootstrap’s ~150KB) reduces bundle size, improving load times for users.

_Benefits:_
Pico.css styles native HTML elements without requiring classes, reducing markup complexity. It does not need for extensive configuration or learning a complex API, allowing rapid prototyping of components. It encourages clean HTML, using Semantic Markup, aligning with modern web standards and accessibility. It offers theming capability out of the box.

pico.css offers `dark-light themes` feature out of the box, synching with your browser theme preference.

**CSS Modules** offer scoped and Maintainable Styling
In a React application with multiple components (Pagination, Button, PostsPage), style conflicts can arise if global CSS is used. CSS Modules ensures styles are scoped to specific components, enhancing maintainability.

_Benefits:_
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

#### Why using Zustand as global store?

- Zustand allows components to access and update favorites and searchText without prop drilling, simplifying the app’s architecture.
- Changes to the store (e.g., adding a favorite) automatically re-render subscribed components, ensuring a responsive UI.
- Zustand’s minimal API avoids the complexity of Redux, making it ideal for managing small-to-medium state like favorites and search.
- Persistence: Zustand supports middleware to persist favorites to local storage, preserving user preferences across sessions.

## Jest and React testing library

Jest is a JavaScript testing framework designed for simplicity and performance, particularly suited for React applications. Provides a full suite of testing tools: test runner, assertions, mocks, spies, and code coverage reports.
Supports unit, integration, and snapshot testing, covering your React components and logic.

React Testing Library is a lightweight library for testing React components by simulating user interactions, focusing on behavior over implementation. It integrates smoothly with Jest, as Jest provides the test runner and assertions while RTL handles DOM interactions.

- Use `npm run test` to run your tests locally
- Use `npm run test:watch` during local development when actively writing or debugging React components, practicing TDD, or focusing on specific tests. It provides real-time feedback as you edit code, leveraging Jest’s watch mode for interactivity
- Use `npm run test:coverage` to calculate the test coverage of the repo

```bash
----------------------|---------|----------|---------|---------|-----------------------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-----------------------------------
All files             |   90.45 |    71.05 |    89.7 |   90.74 |
 components/DataTable |    82.5 |    63.07 |   85.71 |      84 |
  Modal.tsx           |      80 |    60.46 |      90 |      82 | 40-50
  SortButtons.tsx     |      75 |    58.33 |      50 |      75 | 27-40
  TableComponent.tsx  |   94.11 |       80 |     100 |   94.11 | 19
 components/shared    |     100 |    81.81 |     100 |     100 |
  Button.tsx          |     100 |       75 |     100 |     100 | 31
  ErrorAlert.tsx      |     100 |      100 |     100 |     100 |
  LoadingSpinner.tsx  |     100 |      100 |     100 |     100 |
  Pagination.tsx      |     100 |      100 |     100 |     100 |
  SearchBar.tsx       |     100 |    85.71 |     100 |     100 | 23
 pages                |    90.1 |    78.12 |   86.66 |   89.15 |
  PostsPage.tsx       |    90.1 |    78.12 |   86.66 |   89.15 | 47-48,103-104,137,168,203,229-230
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

`npm run cy:run`: Runs Cypress tests headlessly (in the background, no GUI). The output is shown in the terminal, and results (videos/screenshots) are stored in the `/cypress/videos` or `/screenshots` directories. It's useful in CI/CD pipelines or automated test scripts.

## Eslint and Prettier configuration to ensure code quality

ESLint is a static code analysis tool that identifies and enforces coding standards, catching potential errors and enforcing best practices.
Prettier is an opinionated code formatter that automatically formats code for consistent style, reducing manual styling effort.
They provide a robust, automated solution for maintaining high-quality, consistent code in your React + Vite project, enhancing collaboration, reducing bugs, and streamlining development and deployment workflows.

**Eslint scripts:**

`npm run lint`: checks for issues without modifying files.

`npm run lint:fix`: checks and applies fixes where possible. It runs ESLint with the `--fix` flag to automatically correct fixable linting issues (e.g., formatting, simple React errors) in the project’s source files.

**Prettier scripts:**

`npm run format`: it scans specified files and automatically formats them according to Prettier’s rules (defined in .prettierrc or defaults)

`npm run check-format`: it scans specified files and checks if they conform to Prettier’s formatting rules without modifying them. It outputs a report in the terminal displaying a lists of files that deviate from the expected format and it exits with a non-zero status code if any files are incorrectly formatted, making it ideal for CI/CD.
