import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clubApi, categoryApi, fileApi } from '../../services/api';

export default function ClubManagement() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    sido: '',
    sigungu: '',
    description: '',
    maxMembers: '',
    fileId: null,
  });

  const [errors, setErrors] = useState({});

  const fetchClubData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clubApi.getClubDetail(clubId);
      setClub(data);

      const regionParts = (data.region || '').split(' ');
      const sido = regionParts[0] || '';
      const sigungu = regionParts[1] || '';

      setFormData({
        name: data.clubName || '',
        categoryId: data.categoryId || '',
        sido: sido,
        sigungu: sigungu,
        description: data.description || '',
        maxMembers: data.maxMembers || '',
        fileId: data.fileId || null,
      });

      if (data.fileLink) {
        setImagePreview(data.fileLink);
      }
    } catch (error) {
      console.error('동호회 정보 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [clubId, setClub]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryApi.getCategoriesHierarchy();
      setCategories(data);
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  }, [setCategories]);

  useEffect(() => {
    fetchClubData();
    fetchCategories();
  }, [fetchClubData, fetchCategories]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: '이미지 파일만 업로드 가능합니다.' }));
      return;
    }

    try {
      const uploadResponse = await fileApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, fileId: uploadResponse.fileId }));
      setImagePreview(uploadResponse.fileUrl);
      setErrors((prev) => ({ ...prev, image: '' }));
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      setErrors((prev) => ({ ...prev, image: '이미지 업로드에 실패했습니다.' }));
    }
  };

  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          sido: data.sido,
          sigungu: data.sigungu,
        }));
        setErrors((prev) => ({ ...prev, address: '' }));
      },
    }).open();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '동호회 이름을 입력해주세요.';
    } else if (formData.name.length > 30) {
      newErrors.name = '동호회 이름은 30자 이내로 입력해주세요.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = '관심사를 선택해주세요.';
    }

    if (!formData.sido || !formData.sigungu) {
      newErrors.address = '지역을 선택해주세요.';
    }

    if (formData.description && formData.description.length > 300) {
      newErrors.description = '동호회 설명은 300자 이내로 입력해주세요.';
    }

    if (!formData.maxMembers) {
      newErrors.maxMembers = '모집 정원을 입력해주세요.';
    } else if (formData.maxMembers < 2 || formData.maxMembers > 999) {
      newErrors.maxMembers = '모집 정원은 2명 이상 999명 이하로 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await clubApi.updateClub(clubId, formData);
      navigate(`/clubs/${clubId}/dashboard`);
    } catch (error) {
      console.error('동호회 수정 실패:', error);
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: '동호회 수정에 실패했습니다.' });
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('동호회를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.')) return;

    try {
      await clubApi.deleteClub(clubId);
      navigate('/');
    } catch (error) {
      console.error('동호회 삭제 실패:', error);
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: '동호회 삭제에 실패했습니다.' });
      }
    }
  };

  if (loading) {
    return <div className="bg-white p-8 text-center text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="bg-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">동호회 관리</h1>
        <button
          onClick={handleDelete}
          className="text-sm font-medium text-red-500 hover:text-red-600"
        >
          동호회 삭제
        </button>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {errors.submit}
        </div>
      )}

      <div className="space-y-6">
        {/* 동호회 이미지 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">동호회 이미지</label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="동호회 이미지"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">이미지 없음</span>
              </div>
            )}
            <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium">
              이미지 변경
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
        </div>

        {/* 동호회명 */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <span className="w-2 h-2 rounded-full bg-black mr-2"></span>
            동호회명
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="동호회 이름을 입력해주세요"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
          {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* 동호회 소개 */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <span className="w-2 h-2 rounded-full bg-black mr-2"></span>
            동호회 소개
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="동호회를 소개해주세요"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
          />
          {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* 지역 */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <span className="w-2 h-2 rounded-full bg-black mr-2"></span>
            지역
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={`${formData.sido} ${formData.sigungu}`}
              readOnly
              placeholder="주소를 검색해주세요"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
            />
            <button
              onClick={openAddressSearch}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              주소 검색
            </button>
          </div>
          {errors.address && <p className="mt-2 text-sm text-red-500">{errors.address}</p>}
        </div>

        {/* 카테고리 */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <span className="w-2 h-2 rounded-full bg-black mr-2"></span>
            카테고리
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="">카테고리를 선택해주세요</option>
            {categories.map((parent) => (
              <optgroup key={parent.categoryId} label={parent.name}>
                {parent.children?.map((child) => (
                  <option key={child.categoryId} value={child.categoryId}>
                    {child.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.categoryId && <p className="mt-2 text-sm text-red-500">{errors.categoryId}</p>}
        </div>

        {/* 최대 인원 수 */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <span className="w-2 h-2 rounded-full bg-black mr-2"></span>
            최대 인원 수
          </label>
          <input
            type="number"
            name="maxMembers"
            value={formData.maxMembers}
            onChange={handleChange}
            min="2"
            max="999"
            placeholder="최대 인원을 입력해주세요"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
          {errors.maxMembers && <p className="mt-2 text-sm text-red-500">{errors.maxMembers}</p>}
        </div>
      </div>

      {/* 수정 버튼 */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          수정
        </button>
      </div>
    </div>
  );
}
