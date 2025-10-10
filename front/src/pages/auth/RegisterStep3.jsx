import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi, categoryApi } from '../../services/api';

export default function RegisterStep3() {
  const navigate = useNavigate();
  const location = useLocation();
  const memberId = location.state?.memberId;

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!memberId) {
      alert('잘못된 접근입니다.');
      navigate('/signup');
      return;
    }

    // 카테고리 목록 불러오기
    fetchCategories();
  }, [memberId, navigate]);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategoriesHierarchy();
      setCategories(data);
    } catch (error) {
      console.error('카테고리 조회 에러:', error);
      alert('카테고리를 불러오는데 실패했습니다.');
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== categoryId);
      } else {
        // 최대 5개까지만 선택 가능
        if (prev.length >= 5) {
          setError('관심사는 최대 5개까지 선택 가능합니다.');
          return prev;
        }
        setError('');
        return [...prev, categoryId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length < 3) {
      setError('관심사를 최소 3개 선택해주세요.');
      return;
    }

    try {
      await authApi.registerStep3(memberId, selectedCategories);
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (error) {
      console.error('3단계 에러:', error);
      alert(error.message || '관심사 등록에 실패했습니다.');
    }
  };

  const handlePrevious = () => {
    navigate('/signup/step2', { state: { memberId } });
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
      {/* 단계 표시 */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#4CA8FF] text-white rounded-full flex items-center justify-center text-sm font-medium">
            1
          </div>
          <div className="w-12 h-0.5 bg-[#4CA8FF] mx-2"></div>
          <div className="w-8 h-8 bg-[#4CA8FF] text-white rounded-full flex items-center justify-center text-sm font-medium">
            2
          </div>
          <div className="w-12 h-0.5 bg-[#4CA8FF] mx-2"></div>
          <div className="w-8 h-8 bg-[#4CA8FF] text-white rounded-full flex items-center justify-center text-sm font-medium">
            3
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">관심사를 선택해 주세요</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 선택된 관심사 개수 표시 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            선택된 관심사:{' '}
            <span className="font-semibold text-[#4CA8FF]">{selectedCategories.length}개</span>
          </p>
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories.map((id) => {
                const category = categories
                  .flatMap((parent) => parent.children || [])
                  .find((cat) => cat.categoryId === id);
                return category ? (
                  <span
                    key={id}
                    className="px-3 py-1 bg-[#4CA8FF] text-white rounded-full text-sm flex items-center gap-1"
                  >
                    {category.name}
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(id)}
                      className="text-white hover:text-gray-200"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* 카테고리 목록 */}
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4">
          {categories.map((parent) => (
            <div key={parent.categoryId} className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{parent.name}</h3>
              <div className="flex flex-wrap gap-2">
                {parent.children &&
                  parent.children.map((child) => (
                    <button
                      key={child.categoryId}
                      type="button"
                      onClick={() => handleCategoryClick(child.categoryId)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategories.includes(child.categoryId)
                          ? 'bg-[#4CA8FF] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {child.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-4 flex items-center">
            <span className="mr-1">✕</span>
            {error}
          </p>
        )}

        {/* 버튼 그룹 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            이전
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-[#4CA8FF] text-white rounded-lg font-semibold hover:bg-[#3b8de6] transition-colors"
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
}
