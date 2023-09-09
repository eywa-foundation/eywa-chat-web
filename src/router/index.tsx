import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from '../pages/Chat';
import JoinPage from '../pages/Join';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/Home';
import ListPage from '../pages/List';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="list" element={<ListPage />} />
          <Route path="join" element={<JoinPage />} />
        </Route>
        <Route element={<MainLayout smallPadding />}>
          <Route path="chat/:address" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
