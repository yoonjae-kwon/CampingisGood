import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function CampDetail() {
  // 1. URL 파라미터(campId) 가져오기
  const { campId } = useParams();
  const navigate = useNavigate();

  // 2. state 관리
  const [camp, setCamp] = useState(null); // 찾은 캠핑장 객체
  const [loading, setLoading] = useState(true);
  const [activePopup, setActivePopup] = useState(null); 

  // 3. campId가 바뀔 때마다 실행되는 Effect
  useEffect(() => {
    setLoading(true);
    
    // Vite의 BASE_URL을 사용해 GitHub Pages 호환성 확보
    fetch(`${import.meta.env.BASE_URL}camps.json`) 
      .then(res => {
         if (!res.ok) { // 404 등 에러 체크
           throw new Error(`HTTP error! status: ${res.status}`);
         }
         return res.json();
      })
      .then(allCamps => {
        // 4. URL의 campId와 일치하는 캠핑장 찾기
        const foundCamp = allCamps.find(c => c.id === campId);
        
        if (foundCamp) {
          setCamp(foundCamp); // state에 저장
        } else {
          setCamp(null); // 못 찾음
        }
        setLoading(false); // 로딩 완료
      })
      .catch(err => {
        // fetch 자체를 실패 (파일이 public 폴더에 없거나 오타)
        console.error("camps.json 로드 실패:", err);
        setLoading(false);
      });
      
  }, [campId]); // campId가 바뀔 때마다 다시 실행

  
  // --- 팝업 핸들러 ---
  const closePopup = () => {
    setActivePopup(null);
    document.body.classList.remove('popup-open');
  };
  const openPopup = (popupName) => {
    setActivePopup(popupName);
    document.body.classList.add('popup-open');
  };

  // --- 예약 페이지 이동 핸들러 ---
  const goReservePage = () => {
    // [!] 새로 만든 ReservationPage로 이동
    navigate(`/camp/${campId}/reserve`);
  };

  // --- 렌더링 로직 ---

  // 5. 로딩 중
  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>캠핑장 정보를 불러오는 중...</div>;
  }

  // 6. 못 찾음 (fetch는 성공했으나 json 안에 id가 없는 경우)
  if (!camp) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>해당 캠핑장 정보를 찾을 수 없습니다. (ID: {campId})</div>;
  }

  // 7. 성공: 찾은 camp 객체로 렌더링
  return (
    <div className="camp-detail-wrapper">
      {/* [!] 배경 이미지 설정
        camps.json의 img 경로가 "/images/..." 로 시작해야 합니다.
        BASE_URL을 사용해 GitHub Pages의 subdirectory 대응
      */}
      <div
        className="hero-camp-detail"
        style={{ backgroundImage: camp.img ? `url("${import.meta.env.BASE_URL}${camp.img.replace(/^\//, '')}")` : undefined }}
      >
        <div className="hero-content">
          <h1 className="camp-name">{camp.name}</h1>
          <div className="camp-address">{camp.addr}</div>
        </div>
      </div>
      
      <div className="main-content">
        <div className="detail-box">
          <div className="star-rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.round(camp.rating) ? 'orange' : 'gray'}`}>★</span>
            ))}
            <span style={{ fontSize: '1.5rem', marginLeft: '10px' }}>({camp.rating})</span>
          </div>
          <div className="btn-row">
            <button className="popup-btn" onClick={() => openPopup('notice')}>관리자 공지 확인</button>
            <button className="popup-btn" onClick={() => openPopup('link')}>다른 페이지에서 확인</button>
          </div>
          
          <div className="camp-description">
            {camp.desc}
          </div>
           
           <div className="camp-detail-info">
             <div className="info-title">참고사항들</div>
             <div className="info-list">
                 <div><b>체크인:</b> 오후 2시</div>
                 <div><b>체크아웃:</b> 오전 11시</div>
                 <div><b>운영기간:</b> {camp.season}</div>
                 <div><b>운영일:</b> 평일+주말</div>
                 <div><b>가격:</b> {camp.price}</div>
                 <div><b>연락처:</b> {camp.phone}</div>
                 <div><b>테마:</b> {camp.theme?.join(', ') || '정보 없음'}</div>
                 <div><b>시설:</b> {camp.facility?.join(', ') || '정보 없음'}</div>
             </div>
           </div>
           
           <div className="best-review-title">Best Review ({camp.review}건)</div>
           
           {/* [!] 첫 번째 샘플 리뷰만 표시 */}
           {camp.reviews && camp.reviews.length > 0 && (
             <div className="review-box">
               <div className="review-user">
                 <span className="user-icon">👤</span>
                 <span className="review-text">{camp.reviews[0].text}</span>
               </div>
               <Link to={`/camp/${camp.id}/reviews`} className="review-detail-btn">
                 리뷰 전체보기
               </Link>
             </div>
           )}

        </div>
        
        <div className="side-menu">
          <button className="icon-btn calendar" onClick={goReservePage} title="예약하기">
            <img src="/images/calendar.png" alt="달력" width="36" height="36" />
          </button>
          <button className="icon-btn heart" onClick={() => openPopup('like')} title="찜하기">
            <img src="/images/17.png" alt="찜" width="36" height="36" />
          </button>
        </div>
      </div>

      {/* --- 팝업들 --- */}
      {activePopup === 'notice' && (
        <div className="popup" id="notice-popup" style={{ display: 'flex' }}>
          <div className="popup-inner">
            <h2>공지사항</h2>
             <ul>
               <li>시설 점검: 6월 24일(월) 10:00~13:00</li>
               <li>바베큐장 이용 시 화기 주의</li>
               <li>애완동물 동반 불가</li>
             </ul>
            <button onClick={closePopup}>닫기</button>
          </div>
        </div>
      )}

      {activePopup === 'link' && (
        <div className="popup" id="link-popup" style={{ display: 'flex' }}>
          <div className="popup-inner">
            <h2>다른 예약 사이트 모음</h2>
             <ul>
               <li><a href="https://naver.com" target="_blank" rel="noopener noreferrer">네이버 캠핑 예약</a></li>
               <li><a href="https://daum.net" target="_blank" rel="noopener noreferrer">다음 캠핑존</a></li>
               <li><a href="https://google.com" target="_blank" rel="noopener noreferrer">기타 예약 링크</a></li>
             </ul>
            <button onClick={closePopup}>닫기</button>
          </div>
        </div>
      )}

      {activePopup === 'like' && (
        <div className="popup" id="like-popup" style={{ display: 'flex' }}>
          <div className="popup-inner">
            <h2>찜했습니다!</h2>
            <button onClick={closePopup}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampDetail;