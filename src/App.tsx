import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/shared/LoadingSpinner';

// Lazy load components
const TablePage = lazy(() => import('./pages/TablePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const Header = lazy(() => import('./components/shared/Header'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Header />
    <Routes>
      <Route path="VW-project" element={<TablePage />} />
      <Route path="VW-project/favorites" element={<FavoritesPage />} />
    </Routes>
  </Suspense>
);

export default App;
