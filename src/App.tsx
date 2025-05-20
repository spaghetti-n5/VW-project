import TablePage from './pages/TablePage';
import { Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import FavoritesPage from './pages/FavoritesPage';

const App = () => (
  <>
    <Header />
    <Routes>
      <Route path="VW-project" element={<TablePage />} />
      <Route path="VW-project/favorites" element={<FavoritesPage />} />
    </Routes>
  </>
);

export default App;
