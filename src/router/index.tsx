import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<></>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
