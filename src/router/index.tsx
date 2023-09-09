import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from '../pages/Chat';
import JoinPage from '../pages/Join';
import ChatHistory from '../pages/ChatHistory';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/Home';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="join" element={<JoinPage />} />
          <Route path="chat/:address" element={<ChatPage />} />
          <Route path="history" element={<ChatHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
