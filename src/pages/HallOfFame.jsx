import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function groupByProvince(list) {
  const result = {};
  list.forEach(item => {
    if (!result[item.province]) result[item.province] = [];
    result[item.province].push(item);
  });
  const fameData = [];
  Object.entries(result).forEach(([province, arr]) => {
    arr.sort((a, b) => b.rating - a.rating); 
    fameData.push({
      city: province,
      sites: arr.slice(0, 3).map(item => ({
        // [!] 수정된 부분
        id: item.id,                // 1. 고유한 key로 사용하기 위해 id 전달
        name: item.name,              // 2. name: item.id -> name: item.name 으로 수정
        address: item.addr,
        img: item.img,
        link: `/camp/${encodeURIComponent(item.id)}` // 3. item.link 제거하고 id로 링크 고정
      }))
    });
  });
  return fameData;
}

function HallOfFame() {
  const [data, setData] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/camps.json')
      .then(res => res.json())
      .then(camps => {
        setData(groupByProvince(camps));
        setCurrentIndex(0);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("데이터 로드 실패:", err);
        setIsLoading(false);
      });
  }, []); 

  const changeCity = (direction) => {
    if (data.length === 0) return;
    const newIndex = (currentIndex + direction + data.length) % data.length;
    setCurrentIndex(newIndex);
  };

  const currentCity = data[currentIndex];

  return (
    <div className="hall-of-fame-wrapper"> 
      <header className="hero-hall-of-fame">
        <h1>명예의 전당</h1>
        <p>명예의 전당은 지역 내 가장 후기가 좋은 캠핑장들만을 특별히 선별하여 추천해드리는 시스템입니다</p>
      </header>
      
      <section className="section"> 
        <h2>
          {currentCity ? `${currentCity.city}의 명예로운 캠핑장` : "명예로운 캠핑장"}
        </h2>
        <div className="carousel-container">
          <button className="nav-btn prev" onClick={() => changeCity(-1)}>&#9664;</button>
          
          <div className="carousel" id="carousel">
            {isLoading && <p>로딩 중...</p>}
            
            {currentCity && currentCity.sites.map(site => (
              // [!] 수정된 부분: key={site.name} -> key={site.id} (더 고유한 값)
              <div className="card" key={site.id}>
                <img src={site.img} alt={site.name} />
                {/* [!] 수정된 부분: 이제 site.name이 올바른 이름입니다. */}
                <h3>{site.name}</h3>
                <p>{site.address}</p>
                <Link to={site.link}>
                  <button>상세보기</button>
                </Link>
              </div>
            ))}
            
            {!isLoading && !currentCity && (
              <p style={{ color: 'red' }}>데이터를 불러올 수 없습니다.</p>
            )}
          </div>
          
          <button className="nav-btn next" onClick={() => changeCity(1)}>&#9654;</button>
        </div>
      </section>
    </div>
  );
}

export default HallOfFame;