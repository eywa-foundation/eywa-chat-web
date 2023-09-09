import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from '../pages/Chat';
import JoinPage from '../pages/Join';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/Home';
import ListPage from '../pages/List';
import ResetPage from '../pages/Reset';

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
        <Route path="/reset" element={<ResetPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
