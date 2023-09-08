import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from '../pages/Chat';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
