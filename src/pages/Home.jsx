import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <a> 대신 <Link>

// --- JavaScript 로직 (컴포넌트 바깥) ---
function getTopByProvince(list) {
  const result = {};
  list.forEach(item => {
    if (!result[item.province]) result[item.province] = [];
    result[item.province].push(item);
  });
  return Object.entries(result).map(([province, arr]) => {
    arr.sort((a, b) => b.rating - a.rating);
    const top = arr[0];
    return { province, ...top };
  });
}

function Home() {
  // --- React State ---
  const [slidesData, setSlidesData] = useState([]);
  const [index, setIndex] = useState(0);

  // --- React Effects (데이터 로딩, 타이머) ---

  // 1. 컴포넌트가 처음 켜질 때 camps.json 데이터 로드
  useEffect(() => {
    // Vite의 BASE_URL을 사용해 GitHub Pages 호환성 확보
    fetch(`${import.meta.env.BASE_URL}camps.json`)
      .then(res => res.json())
      .then(camps => {
        setSlidesData(getTopByProvince(camps)); // state 업데이트
        setIndex(0);
      })
      .catch(() => {
        console.error("명예의 전당 데이터를 불러올 수 없습니다.");
      });
  }, []); // [] : 처음 한 번만 실행

  // 2. 슬라이드 자동 넘김 타이머
  useEffect(() => {
    if (slidesData.length === 0) return;

    const auto = setInterval(() => {
      // (이전 index + 1) % 전체 개수
      setIndex(prevIndex => (prevIndex + 1) % slidesData.length);
    }, 3000);

    // 컴포넌트가 꺼지거나 index가 바뀌면 이전 타이머를 청소(clear)
    return () => clearInterval(auto);
    
  }, [index, slidesData.length]); // index나 데이터 개수가 바뀔 때마다 타이머 재설정

  // --- Event Handlers (버튼 클릭) ---
  const next = () => {
    if (slidesData.length === 0) return;
    setIndex(prevIndex => (prevIndex + 1) % slidesData.length);
  };
  
  const prev = () => {
    if (slidesData.length === 0) return;
    setIndex(prevIndex => (prevIndex - 1 + slidesData.length) % slidesData.length);
  };

  // --- Dynamic Styles (React State에 따라 동적으로 스타일 변경) ---
  const sliderStyle = {
    display: 'flex',
    transition: 'transform 0.6s cubic-bezier(0.77,0,0.175,1)',
    transform: `translateX(-${index * 100}%)`
  };

  // --- JSX (HTML 렌더링) ---
  return (
    // <main> 태그는 Layout.jsx에 있으므로 여기서는 생략합니다.
    // (만약 Layout에 main이 없다면 <main> 태그로 감싸주세요)
    <>
      <section className="left-panel">
        <h2>캠핑러들을 위한 맞춤 서비스</h2>
        <div className="box">
          <div className="text">
            <h3>캠핑장을 찾고 계신가요?</h3>
            <p>맞춤형 캠핑장을 찾아드립니다!</p>
            {/* a href="search.html" -> Link to="/search" */}
            <Link to="/search" className="main-btn">맞춤형 캠핑장 찾기</Link>
          </div>
          {/* 이미지 경로는 public 폴더 기준, img 태그는 /> 로 닫기 */}
          <img src={`${import.meta.env.BASE_URL}images/캠핑손님.png`} alt="캠핑 일러스트" />
        </div>
        <div className="box">
          <div className="text">
            <h3>캠핑장 주인이신가요?</h3>
            <p>여러분의 캠핑장을 등록하고 운영해보세요!</p>
            <Link to="/administrator_main" className="main-btn">등록하기</Link>
          </div>
          <img src={`${import.meta.env.BASE_URL}images/캠핑관리자.png`} alt="캠핑 일러스트" />
        </div>
      </section>

      <section className="right-panel">
        <h2>명예의 전당</h2>
        <div className="slider-wrapper">
          {/* document.querySelector... 대신 onClick={함수} 사용 */}
          <button className="slide-btn left" onClick={prev}>&#10094;</button>
          
          {/* JavaScript로 innerHTML을 조작하는 대신,
            state(slidesData)를 .map()으로 돌면서 JSX를 직접 렌더링합니다.
          */}
          <div className="slider" id="slider" style={sliderStyle}>
            {slidesData.length === 0 ? (
              <p>로딩 중...</p>
            ) : (
              slidesData.map((site) => (
                // .map() 사용 시 각 항목에 고유한 'key'가 필수입니다.
                <div className="slide" key={site.name} style={{ minWidth: '100%' }}>
                  <img src={site.img} alt={site.name} />
                  <span className="rank">{site.province} 1등</span>
                  <h3>{site.name}</h3>
                  <p>{site.addr}</p>
                  <Link to="/hall-of-fame" className="main-btn">둘러보기</Link>
                </div>
              ))
            )}
          </div>
          
          <button className="slide-btn right" onClick={next}>&#10095;</button>
        </div>
      </section>
    </>
  );
}

export default Home;