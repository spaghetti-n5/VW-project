 # VW project

VW project uses a setup made of React, Typescript and Vite and it's deployed in Github Pages: https://spaghetti-n5.github.io/VW-project/

Author: Eleonora Baret

## How to run the project locally

#### Prerequisites

- Node.js: Version 16.x or higher.
- npm: Package manager for dependencies.

#### Clone the Repository:

```bash
git clone https://github.com/spaghetti-n5/VW-project.git
cd VW-project
```

#### Install Dependencies:

```bash
npm install
```

#### Start the Development Server:

```bash
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

#### Why using Zustand as global store?

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

```bash 
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

## Eslint and Prettier configuration to ensure code quality

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

### CI

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

### CD

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

### Github setup

Branch protection is setup to avoid merging if the CI checks are failing

## AI Tool Usage

GitHub copilot: 
- integrated in my code editor, provides useful helps while compiling imports, functions.
- Sometimes I find it a bit overwhelming

ChatGPT:

- used for understanding the proper tech stack to use
- helped with documentation
- helped in fixing bugs during developement

## Reusable components

### Pagination component

The Pagination component is a reusable React component designed for the VW-project. It integrates with `@tanstack/react-table` to provide intuitive table navigation and page size selection.

Link to the component folder: [Pagination](https://github.com/spaghetti-n5/VW-project/blob/main/src/components/shared/Pagination.tsx)


The Pagination component enables users to navigate through table data (e.g., posts in PostsPage) and adjust the number of rows displayed per page. It is used in the VW-project to enhance the user experience of data-heavy interfaces, such as the All Posts (/VW-project) and Favorites (/VW-project/favorites) pages. The component is styled with Pico.css and CSS Modules (Pagination.module.css) and works seamlessly with the project’s TypeScript, Zustand, and TanStack Table stack.

#### Design Decisions

The Pagination component was designed with specific goals to align with the VW-project’s requirements for simplicity, reusability, and a modern, user-friendly UI.

1. Easy integration with TanStack Table: use @tanstack/react-table’s Table<T> interface to manage pagination state and logic.
2. The root `<div className={styles.pagination}>` uses CSS Modules for layout, while Pico.css styles `<Button>` and `<select>` elements, creating a clean, professional look.
3. Simple Page Size Options: Hardcode page size options [5, 10, 20] in the `<select>` element. Common page sizes (5, 10, 20) balance usability and performance for typical datasets (e.g., posts), avoiding overwhelming users with too many options. Hardcoding avoids complex configuration, fitting the project’s minimalist approach. The array can be updated or made configurable if needed (e.g., via props).
4. Two-Section Layout: Structure the component with two `<div>` sections: one for navigation buttons and one for page info and size selector. I made this decision for clarity reasons: separating navigation (First, Previous, Next, Last) from status (Page X of Y) and controls (Show N) improves readability and user focus.
5. Responsive Design: The layout (likely flexbox in Pagination.module.css) adapts to different screen sizes, ensuring usability on mobile and desktop.
Modularity: Allows independent styling of each section via CSS Modules.
6. Generic Type for Reusability: Use a generic type PaginationProps<T> to accept any Table<T> instance. It allows Pagination to work with any table data type (e.g., Post for posts, or future types like User), making it reusable across the app or other projects. Ensures TypeScript enforces correct data types, reducing errors when integrating with different tables.

#### Reusability
The Pagination component is designed for high reusability within the VW-project and beyond. Here’s how it can be reused and integrated:

1. It offers a generic integration with any table as well as cross-project portability.

The generic Table<T> prop allows **Pagination** to work with any TanStack Table instance, regardless of data type (e.g., Post, User, Product).

```tsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import Pagination from './Pagination';
import { Post } from '../types';

const columns = [{ accessorKey: 'title', header: 'Title' }];
const data: Post[] = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

return (
  <div>
    <table>{/* Render table */}</table>
    <Pagination table={table} />
  </div>
);
```

I can reuse the component in a new page of the same repo for users or inventory, by passing a different table instance.
It could also be reused in another project needing table pagination only needing @tanstack/react-table, and a Button component.

It' currently reused in PostsPage for both All Posts and Favorites views, filtering data dynamically.

```tsx
import { usePostStore } from '../store/postStore';
import Pagination from './Pagination';

const PostsPage = () => {
  const { favorites, searchText } = usePostStore();
  const table = useReactTable({
    data: posts.filter((post) => favorites.includes(post.id) || post.title.includes(searchText)),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return <Pagination table={table} />;
};
```

2. Extensibility for Additional Features

The component can be extended with props or logic for new features (e.g., custom page sizes, jump-to-page input). For example for adding a  “Go to Page” input for larger datasets.

```tsx
interface PaginationProps<T> {
  table: Table<T>;
  pageSizes?: number[];
}

const Pagination = <T,>({ table, pageSizes = [5, 10, 20] }: PaginationProps<T>) => (
  // Use pageSizes in <select>
);
```

#### Trade-offs Made During Development

##### Hardcoded Page Sizes vs. Configurable Option
Fixed page sizes [5, 10, 20] instead of a configurable pageSizes prop.

Pros:
- Simplifies the component’s API, reducing complexity
- Covers common use cases for small-to-medium datasets (e.g., posts).
- Aligns with minimalist design, avoiding over-engineering.

Cons:
- Less flexible for tables requiring different page sizes (e.g., 50, 100).
- Requires code changes to update options, reducing reusability for edge cases.

Add a pageSizes prop if needed:

```tsx
pageSizes.map((size) => <option key={size} value={size}>Show {size}</option>)
```

##### No Additional Controls vs. Enhanced Features

It's a basic pagination (First, Previous, Next, Last, page size) without features like a “Go to Page” input or page number buttons.

Pros:
- Keeps the component focused and easy to use/test, as seen in Pagination.test.ts.
- Fewer elements reduce rendering time for small datasets.


Cons:
    - Less Usable for Large Datasets: Navigating many pages (e.g., 100) is slower without direct page access.
    - Limited UX: Users can’t jump to a specific page quickly.

Add a `<input>` for page jumping or dynamic page number buttons if needed:

```tsx
<input
  type="number"
  value={table.getState().pagination.pageIndex + 1}
  onChange={(e) => table.setPageIndex(Number(e.target.value) - 1)}
/>
```
It's acceptable for VW-project’s scope, as post datasets are likely small, but could be extended for larger apps.

##### Reliance on TanStack Table vs. Custom Pagination

It use TanStack Table’s pagination logic instead of custom state management (e.g., with useState or Zustand).

Pros:
- Robust Logic: TanStack Table handles edge cases (e.g., getCanPreviousPage), reducing bugs.
- Integration: Syncs with PostsPage table state, leveraging usePostStore for filtering.
- Testable: Mockable methods (e.g., mockTable.setPageSize) simplify testing, as in Pagination.test.ts.

Cons:
- Dependency: Adds @tanstack/react-table (~10-15KB), though lightweight.
- Learning Curve: Requires understanding TanStack Table’s API, though minimal for pagination.

The Pagination component is a robust, reusable solution for VW-project, balancing simplicity, functionality, and customizability. Its design decisions—using TanStack Table, Button, Pico.css, CSS Modules, and a generic type—ensure it meets the project’s needs for a lightweight, type-safe, and VW-themed table UI. 

While trade-offs like hardcoded page sizes and basic controls limit flexibility, they align with the project’s minimalist, prototyping goals. 

---
### Button component

The Button component is designed to deliver a consistent, customizable, and accessible button UI for various actions in the VW-project. It supports multiple styling variants (e.g., outline, secondary), integrates with the project’s styling stack (Pico.css and CSS Modules), and ensures type safety with TypeScript.

Link to the component folder: [Button](https://github.com/spaghetti-n5/VW-project/blob/main/src/components/shared/Button.tsx)

```tsx
import { ReactNode } from 'react';
import styles from './../../styles/Button.module.css';

interface ButtonProps {
  variant?:
    | 'secondary'
    | 'contrast'
    | 'outline'
    | 'outline secondary'
    | 'outline primary'
    | 'outline contrast';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  onClick,
  disabled = false,
  ariaLabel,
}) => (
  <button
    type="button"
    className={`${styles.button} ${variant ? variant : ''}`}
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

export default Button;
```

#### Design Decisions

The Button component was crafted to balance simplicity, flexibility, and accessibility within the VW-project’s requirements.

**TypeScript and Type-Safe Props**:

Use TypeScript with a ButtonProps interface to define props, including a union type for variant and optional props like disabled and custom ariaLabel.

- ***ReactNode for Children:*** Supports diverse content (e.g., text, icons, or JSX), as seen in Pagination’s text labels ("First," "Next").
The **variant union type** ('secondary' | 'contrast' | ...) enforces valid styles, and `React.FC<ButtonProps>` provides type inference for props.

- **Styling with Pico.css and CSS Modules:** combine Pico.css for baseline button styling and CSS Modules (Button.module.css) for custom styles, applied via `styles.button` and variant.

**Accessible Button Attributes:** 
Include aria-disabled and aria-label props, with type="button" and disabled handling.

- ***Accessibility:*** `aria-disabled={disabled}` ensures screen readers correctly interpret disabled states, as used in Pagination’s navigation buttons.

- ***Semantic HTML:*** add **type="button"** when button is used for JavaScript actions (e.g., opening modals, toggling content, navigation) and not for form submission. This avoids unintended behavior if the button is placed inside a `<form>`, where the default **type="submit"** might cause the form to submit unexpectedly.
- ***User Experience:*** disabled prop visually and functionally disables buttons.

**Variant System:**

Define a variant prop with specific options (secondary, contrast, outline, etc.) instead of fully dynamic classes.
- ***Consistency:*** Predefined variants ensure buttons align with the project’s design system 
- ***Simplicity:*** Limits variants to a manageable set, reducing complexity for a small project.

**Minimal Prop Set:**

Restrict props to variant, children, onClick, disabled, and ariaLabel, omitting advanced features like size or icon.
- ***Simplicity:*** A focused prop set suits the project’s minimalist goals, avoiding over-engineering for a learning-focused app.

- ***Usability:*** Covers core button needs (styling, click handling, accessibility).

- ***Extensibility:*** Props can be added later (e.g., size, type) if needed without breaking existing usage.

#### Reusability

1. The Button component is highly reusable within the VW-project and portable to other React projects.

```tsx
import Button from './Button';

const PostsPage = () => (
  <div>
    <Button variant="outline primary" onClick={() => addPost()}>
      Add Post
    </Button>
    <Button variant="secondary" disabled={true} ariaLabel="Save changes">
      Save
    </Button>
  </div>
);
```
It depends only on react and Button.module.css, with optional Pico.css for styling, making it easy to copy to other React projects.


2. Extensibility for New Features

Add props like size (small, large), icon, or type (submit, reset) to support more use 

```tsx
interface ButtonProps {
  variant?: /* existing variants */;
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({ size, icon, type = 'button', ...props }) => (
  <button
    type={type}
    className={`${styles.button} ${props.variant || ''} ${size ? styles[size] : ''}`}
    {...props}
  >
    {icon && <span className={styles.icon}>{icon}</span>}
    {props.children}
  </button>
);
```


#### Trade-offs Made During Development

##### Limited Variants vs. Fully Dynamic Classes

Predefined variant options (secondary, outline, etc.) instead of allowing arbitrary class names.

Pros:
- Consistency: Ensures buttons align with Pico.css’s design system
- Reduces complexity
- Type Safety: Union type enforces valid variants, preventing errors.

Cons:
- New variants require updating ButtonProps, unlike passing custom classes.
- Adding variants (e.g., danger) needs code changes.

Allow a className prop for custom styles:
```tsx
className={`${styles.button} ${variant || ''} ${className || ''}`}
```

##### Minimal Props vs. Feature-Rich Button

Restrict props to core functionality (variant, children, etc.) instead of adding size, icon, or loading states.

Pros:
- Fits the project’s prototyping goals, focusing on core React/TypeScript skills.
- Fewer props reduce complexity and testing effort.

Cons:
- Limited Features: Can’t support sized variants without updates and future needs (e.g., loading spinners) require prop additions.

##### No Custom Event Handlers vs. Advanced Interactions
Only onClick for event handling, omitting onMouseEnter, onFocus, etc.

Pros:
- Simplicity: onClick suffices for Pagination (e.g., table.nextPage()) and typical actions.
- Performance: Fewer props reduce component overhead.

Cons:
- Limited Interactivity: Can’t handle hover or focus events without modification (only css classes :hover are used)
- UX Constraints: Advanced features (e.g., tooltips on hover) need extra logic.

##### Single Button Type vs. Form Support

Hardcode ***type="button"*** instead of supporting submit or reset for forms.

Pros:
- Prevents accidental form submissions, suitable for standalone buttons in Pagination.
- Aligns with current use cases (e.g., navigation, toggling favorites).

Cons:

- Extensibility: Can’t use directly in forms (e.g., submitting a new post) without ***type="submit"***, requires prop addition for form support


The Button component is a versatile, accessible, and lightweight solution for VW-project, balancing simplicity with customization. Its design decisions—TypeScript props, Pico.css/CSS Modules styling, and accessibility features—ensure it meets the project’s needs for a consistent, VW-themed UI. Trade-offs like limited variants and props prioritize ease of use and fast prototyping, with extensibility for future needs. 


## Improvements

- Debouncing Search: Add a debounce mechanism to setSearchText to reduce re-renders on rapid typing.
- Reset Action: Add a resetFavorites action to clear favorites for user convenience.
- Persistence: Add Zustand’s persist middleware to save favorites to localStorage
- Add Cypress tests in CI pipeline
- Update icon in tab navigation
- Update LoadingSpinner to use a nice animation
