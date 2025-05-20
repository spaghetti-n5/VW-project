import DataTableContainer from './components/DataTable/DataTableContainer';
import { Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';

const App = () => (
  <>
    <Header />
    <Routes>
      <Route path="VW-project" element={<DataTableContainer />} />
      <Route path="VW-project/favorites" element={<div>favorites page</div>} />
    </Routes>
  </> 
);

export default App;