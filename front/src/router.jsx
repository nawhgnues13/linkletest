import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, AuthLayout } from './components/layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OAuth2Callback from './pages/auth/OAuth2Callback';

const router = createBrowserRouter([
  // 메인 레이아웃
  {
    path: '/',
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  // 인증 레이아웃
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },
  // OAuth2 콜백 처리 페이지 추가
  {
    path: '/auth/callback',
    element: <OAuth2Callback />,
  },
]);

export default router;
