import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/shared/LoadingSpinner';

// Lazy load components
const PostsPage = lazy(() => import('./pages/PostsPage'));
const Header = lazy(() => import('./components/shared/Header'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Header />
    <Routes>
      <Route path="VW-project" element={<PostsPage />} />
      <Route path="VW-project/favorites" element={<PostsPage />} />
    </Routes>
  </Suspense>
);

export default App;
