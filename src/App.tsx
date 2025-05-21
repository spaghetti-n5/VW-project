import { Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import PostsPage from './pages/PostsPage';

const App = () => (
  <>
    <Header />
    <Routes>
      <Route path="VW-project" element={<PostsPage />} />
      <Route path="VW-project/favorites" element={<PostsPage />} />
    </Routes>
  </>
);

export default App;
