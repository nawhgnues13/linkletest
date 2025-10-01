import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, AuthLayout, MyPageLayout } from './components/layout';
import Home from './pages/Home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OAuth2Callback from './pages/auth/OAuth2Callback';

// 임시 컴포넌트들
const TempCommunity = () => (
  <div className="max-w-6xl mx-auto px-6 py-8">
    <h1 className="text-3xl font-bold mb-6">커뮤니티</h1>
    <p className="text-gray-600">커뮤니티 페이지 준비중입니다.</p>
  </div>
);

const TempGallery = () => (
  <div className="max-w-6xl mx-auto px-6 py-8">
    <h1 className="text-3xl font-bold mb-6">갤러리</h1>
    <p className="text-gray-600">갤러리 페이지 준비중입니다.</p>
  </div>
);

const TempCommunityCreate = () => (
  <div className="max-w-4xl mx-auto px-6 py-8">
    <h1 className="text-3xl font-bold mb-6">동호회 만들기</h1>
    <p className="text-gray-600">동호회 생성 페이지 준비중입니다.</p>
  </div>
);

// 마이페이지 임시 컴포넌트들
const MyPageProfile = () => (
  <div className="bg-white rounded-lg shadow-sm p-8">
    <div className="text-center mb-8">
      {/* 프로필 이미지 */}
      <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-gray-500 text-sm">이미지</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">오정재</h1>
      <p className="text-gray-600 mb-1">자기소개입니다.</p>
      <p className="text-gray-600">자기소개입니다.</p>

      <div className="flex justify-center space-x-4 mt-6">
        <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
          축구
        </button>
        <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
          야구
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <button className="bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:border-[#4CA8FF] hover:text-[#4CA8FF] transition-colors">
        프로필 수정
      </button>
      <button className="bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:border-[#4CA8FF] hover:text-[#4CA8FF] transition-colors">
        관심사 설정
      </button>
    </div>
  </div>
);

const MyPageCommunities = () => (
  <div className="bg-white rounded-lg shadow-sm p-8">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">나의 동호회</h1>
    <p className="text-gray-600">가입한 동호회 목록이 표시됩니다.</p>
  </div>
);

const MyPageActivities = () => (
  <div className="bg-white rounded-lg shadow-sm p-8">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">나의 활동</h1>
    <p className="text-gray-600">내 활동 내역이 표시됩니다.</p>
  </div>
);

const MyPageWithdrawal = () => (
  <div className="bg-white rounded-lg shadow-sm p-8">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">회원 탈퇴</h1>
    <p className="text-gray-600">회원 탈퇴 페이지입니다.</p>
  </div>
);

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
  {
    path: '/community',
    element: (
      <MainLayout>
        <TempCommunity />
      </MainLayout>
    ),
  },
  {
    path: '/community/create',
    element: (
      <MainLayout>
        <TempCommunityCreate />
      </MainLayout>
    ),
  },
  {
    path: '/gallery',
    element: (
      <MainLayout>
        <TempGallery />
      </MainLayout>
    ),
  },

  // 마이페이지 레이아웃
  {
    path: '/mypage/profile',
    element: (
      <MyPageLayout>
        <MyPageProfile />
      </MyPageLayout>
    ),
  },
  {
    path: '/mypage/communities',
    element: (
      <MyPageLayout>
        <MyPageCommunities />
      </MyPageLayout>
    ),
  },
  {
    path: '/mypage/activities',
    element: (
      <MyPageLayout>
        <MyPageActivities />
      </MyPageLayout>
    ),
  },
  {
    path: '/mypage/withdrawal',
    element: (
      <MyPageLayout>
        <MyPageWithdrawal />
      </MyPageLayout>
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
