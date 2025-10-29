import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { clubApi } from '../services/api/clubApi';

const ClubSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('keyword');

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const observer = useRef();
  const lastClubElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    if (!keyword) {
      navigate('/');
      return;
    }
    fetchClubs();
  }, [keyword]);

  useEffect(() => {
    if (page > 1) {
      loadMore();
    }
  }, [page]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const data = await clubApi.searchClubs(keyword);
      setClubs(data);
      setHasMore(data.length >= 10);
      setPage(1);
    } catch (error) {
      console.error('검색 실패:', error);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const data = await clubApi.searchClubs(keyword);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setClubs((prev) => [...prev, ...data]);
        setHasMore(data.length >= 10);
      }
    } catch (error) {
      console.error('추가 로딩 실패:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClubClick = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  const handleSearch = (newKeyword) => {
    if (newKeyword.trim()) {
      navigate(`/clubs/search?keyword=${encodeURIComponent(newKeyword.trim())}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="relative w-full max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="검색어를 입력해 주세요"
              defaultValue={keyword}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e.target.value);
                }
              }}
              className="w-full px-6 py-5 text-lg border-2 border-primary rounded-full focus:outline-none bg-white shadow-sm"
            />
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-primary text-xl">
              🔍
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">&quot;{keyword}&quot; 검색 결과</h2>
        </div>

        {loading && clubs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">검색 중...</div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">검색 결과가 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {clubs.map((club, index) => (
              <div
                key={club.clubId}
                ref={index === clubs.length - 1 ? lastClubElementRef : null}
                onClick={() => handleClubClick(club.clubId)}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex gap-6"
              >
                <div className="w-48 h-32 bg-gray-300 rounded flex-shrink-0 flex items-center justify-center">
                  {club.fileLink ? (
                    <img
                      src={club.fileLink}
                      alt={club.clubName}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">이미지</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{club.clubName}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {club.description || '동호회 소개가 없습니다.'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{club.categoryName}</span>
                    <span>•</span>
                    <span>{club.region}</span>
                    <span>•</span>
                    <span>
                      멤버 {club.currentMembers}/{club.maxMembers}명
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {loading && <div className="text-center py-6 text-gray-500">로딩 중...</div>}

            {!hasMore && clubs.length > 0 && (
              <div className="text-center py-6 text-gray-500">마지막 결과입니다.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubSearch;
