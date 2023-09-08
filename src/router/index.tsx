import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from '../pages/Chat';
import JoinPage from '../pages/Join';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<JoinPage />} />
          <Route path="chat/:address" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
