import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyPage() {
  const [likedCamps, setLikedCamps] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 찜한 캠핑장 불러오기
    const savedLikes = JSON.parse(localStorage.getItem('likedCamps')) || [];
    setLikedCamps(savedLikes);

    // localStorage에서 작성한 후기 불러오기
    const savedReviews = JSON.parse(localStorage.getItem('myReviews')) || [];
    setMyReviews(savedReviews);

    setLoading(false);
  }, []);

  // 찜 해제 핸들러
  const handleRemoveLike = (campId) => {
    const updated = likedCamps.filter(c => c.id !== campId);
    setLikedCamps(updated);
    localStorage.setItem('likedCamps', JSON.stringify(updated));
  };

  // 후기 삭제 핸들러
  const handleDeleteReview = (index) => {
    const updated = myReviews.filter((_, idx) => idx !== index);
    setMyReviews(updated);
    localStorage.setItem('myReviews', JSON.stringify(updated));
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>마이페이지를 불러오는 중...</div>;
  }

  return (
    <div className="mypage-wrapper">
      <div className="mypage-header">
        <h1>마이페이지</h1>
        <p>내가 찜한 캠핑장과 작성한 후기를 확인하세요</p>
      </div>

      <div className="mypage-container">
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 섹션 1: 찜한 캠핑장 */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="mypage-section">
          <h2 className="section-title">❤️ 찜한 캠핑장</h2>

          {likedCamps.length === 0 ? (
            <div className="empty-message">
              <p>찜한 캠핑장이 없습니다.</p>
              <Link to="/search" className="btn-search">캠핑장 둘러보기</Link>
            </div>
          ) : (
            <div className="camps-grid">
              {likedCamps.map((camp) => (
                <div key={camp.id} className="camp-card-mypage">
                  <div className="camp-image">
                    <img src={`${import.meta.env.BASE_URL}${camp.img}`} alt={camp.name} />
                    <button 
                      className="btn-remove-like"
                      onClick={() => handleRemoveLike(camp.id)}
                      title="찜 해제"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="camp-info">
                    <h3 className="camp-name">{camp.name}</h3>
                    <p className="camp-addr">{camp.addr}</p>
                    <div className="camp-meta">
                      <span className="rating">⭐ {camp.rating}</span>
                      <span className="price">{camp.price}</span>
                    </div>
                    <Link to={`/camp/${camp.id}`} className="btn-view">
                      상세보기
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 섹션 2: 작성한 후기 */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="mypage-section">
          <h2 className="section-title">📝 내가 작성한 후기</h2>

          {myReviews.length === 0 ? (
            <div className="empty-message">
              <p>작성한 후기가 없습니다.</p>
              <Link to="/search" className="btn-search">후기 작성하러 가기</Link>
            </div>
          ) : (
            <div className="reviews-list">
              {myReviews.map((review, idx) => (
                <div key={idx} className="review-card-mypage">
                  <div className="review-header">
                    <h3 className="camp-title">{review.campName}</h3>
                    <span className="review-rating">⭐ {review.rating}</span>
                  </div>
                  <div className="review-meta">
                    <span className="review-date">{review.date}</span>
                    <button 
                      className="btn-delete-review"
                      onClick={() => handleDeleteReview(idx)}
                      title="후기 삭제"
                    >
                      삭제
                    </button>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MyPage;
