import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, AuthLayout } from './components/layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterStep2 from './pages/auth/RegisterStep2';
import RegisterStep3 from './pages/auth/RegisterStep3';
import OAuth2Callback from './pages/auth/OAuth2Callback';
import FindId from './pages/auth/FindId';

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
  {
    path: '/signup/step2',
    element: (
      <AuthLayout>
        <RegisterStep2 />
      </AuthLayout>
    ),
  },
  {
    path: '/signup/step3',
    element: (
      <AuthLayout>
        <RegisterStep3 />
      </AuthLayout>
    ),
  },
  {
    path: '/find-id',
    element: (
      <AuthLayout>
        <FindId />
      </AuthLayout>
    ),
  },
  // OAuth2 콜백 처리 페이지
  {
    path: '/auth/callback',
    element: <OAuth2Callback />,
  },
]);

export default router;
