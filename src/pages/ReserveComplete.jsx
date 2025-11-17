import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

function ReserveComplete() {
  const [searchParams] = useSearchParams();
  const [reserveInfo, setReserveInfo] = useState("예약 정보가 없습니다.");

  useEffect(() => {
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const username = getCookie('username') || "User"; 

    if (date && time) {
      setReserveInfo(`${username} 님 ${date} ${time} 예약 완료`);
    }
  }, [searchParams]);

  // 기존 hero-bg 대신 className="complete-container" 추가
  return (
    <div className="complete-container">
      <div className="complete-card">
        <h1>로즈마리 산골목 캠핑장</h1>
        <p>서울시 성북구 13길 20-3</p>
        <div className="user" id="reserve-info">
          {reserveInfo}
        </div>
        
        <Link to="/" className="home-btn">
          <button>홈으로 돌아가기</button>
        </Link>
      </div>
    </div>
  );
}

export default ReserveComplete;