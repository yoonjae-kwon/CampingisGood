// src/pages/ReviewPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// 별점을 렌더링하는 헬퍼 함수
function renderStars(n) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="star${i <= n ? ' filled' : ''}">★</span>`;
  }
  return stars;
}

function ReviewPage() {
  const { campId } = useParams();

  // --- State ---
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 1. 리뷰 목록을 state로 관리 (camps.json에서 가져옴)
  const [reviews, setReviews] = useState([]);
  
  // 2. 필터/정렬 기준을 state로 관리
  const [filterStar, setFilterStar] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  
  // 3. 새 리뷰 폼 입력을 state로 관리
  const [formStar, setFormStar] = useState(5);
  const [formText, setFormText] = useState('');

  // --- Data Fetching ---
  useEffect(() => {
    setLoading(true);
    fetch('/camps.json')
      .then(res => res.json())
      .then(allCamps => {
        const foundCamp = allCamps.find(c => c.id === campId);
        if (foundCamp) {
          setCamp(foundCamp);
          // 4. 찾은 캠핑장의 리뷰 목록을 state에 저장
          setReviews(foundCamp.reviews || []);
        }
        setLoading(false);
      });
  }, [campId]);

  // --- Logic (Memoization) ---
  
  // 5. 필터링 및 정렬된 리뷰 목록 (renderList() 대체)
  // filterStar나 sortOrder, reviews가 바뀔 때만 재계산
  const filteredAndSortedReviews = useMemo(() => {
    let arr = reviews.slice();
    
    // 필터
    if (filterStar !== 'all') {
      arr = arr.filter(r => r.rating === Number(filterStar));
    }
    
    // 정렬
    arr.sort((a, b) => {
      if (sortOrder === 'latest') return b.date.localeCompare(a.date);
      if (sortOrder === 'oldest') return a.date.localeCompare(b.date);
      if (sortOrder === 'highstar') return b.rating - a.rating || b.date.localeCompare(a.date);
      if (sortOrder === 'lowstar') return a.rating - b.rating || b.date.localeCompare(a.date);
      return 0;
    });
    
    return arr;
  }, [reviews, filterStar, sortOrder]);

  // 6. 평균 별점 계산 (avg 변수 대체)
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "-";
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);
  
  // --- Event Handlers ---

  // 7. 새 리뷰 제출 핸들러 (onsubmit 대체)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formText.trim()) return;

    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

    const newReview = {
      id: `r${Date.now()}`,
      user: "NewUser", // (임시 사용자)
      rating: formStar,
      text: formText,
      photo: false,
      date: dateStr
    };

    // 새 리뷰를 목록 맨 앞에 추가
    setReviews([newReview, ...reviews]);
    
    // 폼 리셋
    setFormText('');
    setFormStar(5);
  };
  
  // --- 렌더링 ---
  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>리뷰 정보를 불러오는 중...</div>;
  }
  if (!camp) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>캠핑장 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="review-bg">
      <div className="review-hero" style={{ backgroundImage: `url(${camp.img})` }}>
        <div className="review-rating" id="hero-rating">{averageRating}</div>
        <div className="review-camp">{camp.name}</div>
        <div className="review-address">{camp.addr}</div>
      </div>
      
      <div className="review-main">
        <div className="review-toolbar">
          {/* select 태그를 state와 연결 */}
          <select id="filter-star" value={filterStar} onChange={(e) => setFilterStar(e.target.value)}>
            <option value="all">별점 전체</option>
            <option value="5">⭐️ 5점만</option>
            <option value="4">⭐️ 4점만</option>
            <option value="3">⭐️ 3점만</option>
            <option value="2">⭐️ 2점만</option>
            <option value="1">⭐️ 1점만</option>
          </select>
          <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="highstar">별점높은순</option>
            <option value="lowstar">별점낮은순</option>
          </select>
        </div>

        <div className="review-list-wrapper">
          <div className="review-list" id="review-list">
            {/* 8. 필터/정렬된 state를 .map()으로 렌더링 */}
            {filteredAndSortedReviews.length > 0 ? (
              filteredAndSortedReviews.map(r => (
                <div className="review-item" key={r.id}>
                  {/* renderStars()는 HTML 문자열을 반환하므로 위험할 수 있음
                      (우선은 그대로 사용하지만, 나중에 컴포넌트로 바꾸는 게 좋음)
                  */}
                  <span 
                    className="review-stars"
                    dangerouslySetInnerHTML={{ __html: renderStars(r.rating) }} 
                  />
                  <span className="review-item-text">
                    {r.text}
                    {r.photo && <span className="review-photo-icon" title="사진첨부">📷</span>}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: '#aaa', textAlign: 'center', marginTop: '55px' }}>후기가 없습니다.</div>
            )}
          </div>
        </div>
        
        <form className="review-form" id="review-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="review-form-row">
            <div className="review-form-stars" id="form-stars">
              {/* 9. 별점 폼도 state와 .map()으로 렌더링 */}
              {[1, 2, 3, 4, 5].map(starValue => (
                <span 
                  key={starValue}
                  className={`star ${starValue > formStar ? 'inactive' : ''}`}
                  data-val={starValue}
                  onClick={() => setFormStar(starValue)}
                >
                  ★
                </span>
              ))}
            </div>
            <label className="review-photo-label">
              📷 사진첨부
              <input type="file" id="photo-upload" accept="image/*" disabled title="사진 업로드 기능은 구현되지 않았습니다." />
            </label>
          </div>
          <textarea 
            placeholder="여기에 후기를 남겨보세요!" 
            maxLength="300" 
            required
            value={formText}
            onChange={(e) => setFormText(e.target.value)}
          />
          <button type="submit">후기 등록</button>
        </form>
      </div>
    </div>
  );
}

export default ReviewPage;