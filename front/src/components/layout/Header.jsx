// import { Link } from 'react-router-dom';

// const Header = () => {
//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center space-x-8">
//             <Link
//               to="/"
//               className="text-2xl font-bold text-gray-900 hover:text-[#4CA8FF] transition-colors"
//             >
//               Linkle
//             </Link>

//             <nav className="flex items-center space-x-8">
//               <Link
//                 to="/community"
//                 className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
//               >
//                 동호회
//               </Link>
//               <Link
//                 to="/community"
//                 className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
//               >
//                 커뮤니티
//               </Link>
//               <Link
//                 to="/gallery"
//                 className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
//               >
//                 갤러리
//               </Link>
//             </nav>
//           </div>

//           <div className="flex items-center space-x-8">
//             <Link
//               to="/community/create"
//               className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
//             >
//               동호회+
//             </Link>
//             <Link
//               to="/login"
//               className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
//             >
//               로그인
//             </Link>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// import { Link, useNavigate } from 'react-router-dom';
// import useUserStore from '../../store/useUserStore';
// import { authApi } from '../../services/api';

// export default function Header() {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, clearUser } = useUserStore();

//   const handleLogout = () => {
//     authApi.logout();
//     clearUser();
//     navigate('/');
//   };

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-6xl mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           <Link to="/" className="text-2xl font-bold text-slate-700">
//             Linkle
//           </Link>

//           <nav className="hidden md:flex items-center space-x-8">
//             <Link
//               to="/community"
//               className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
//             >
//               동호회
//             </Link>
//             <Link
//               to="/gallery"
//               className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
//             >
//               갤러리
//             </Link>
//           </nav>

//           <div className="flex items-center space-x-4">
//             {isAuthenticated ? (
//               <div className="flex items-center space-x-4">
//                 <span className="text-gray-700 font-medium">
//                   {user?.name || user?.nickname || '사용자'}님
//                 </span>
//                 <Link
//                   to="/mypage/profile"
//                   className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
//                 >
//                   마이페이지
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
//                 >
//                   로그아웃
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link
//                   to="/login"
//                   className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
//                 >
//                   로그인
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="bg-[#4CA8FF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3b8de6] transition-colors"
//                 >
//                   회원가입
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import { authApi } from '../../services/api';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearUser } = useUserStore();

  const handleLogout = () => {
    authApi.logout();
    clearUser();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 hover:text-[#4CA8FF] transition-colors"
            >
              Linkle
            </Link>

            <nav className="flex items-center space-x-8">
              <Link
                to="/community"
                className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
              >
                동호회
              </Link>
              <Link
                to="/community"
                className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
              >
                커뮤니티
              </Link>
              <Link
                to="/gallery"
                className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
              >
                갤러리
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/community/create"
                  className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
                >
                  동호회+
                </Link>
                <Link
                  to="/mypage/profile"
                  className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
                >
                  {user?.name || user?.nickname || '사용자'}님
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/community/create"
                  className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
                >
                  동호회+
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#4CA8FF] font-medium transition-colors"
                >
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
