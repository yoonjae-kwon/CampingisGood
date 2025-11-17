import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

function MapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. 쿼리 파라미터(검색 조건)를 state로 가져오기
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    province: searchParams.get('province') || '전체/도',
    city: searchParams.get('city') || '전체/시/군',
    theme: searchParams.get('theme') || '테마 선택',
    facility: searchParams.get('facility') || '시설 선택',
  });

  // 2. 캠핑장 목록과 선택된 캠핑장을 state로 관리
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(null); // 현재 클릭된 카드의 인덱스

  // 3. 카카오맵 인스턴스와 마커들을 Ref로 관리 (state가 아님!)
  // Ref는 리렌더링을 유발하지 않으면서 값을 보관할 수 있습니다.
  const mapRef = useRef(null);
  const mapContainer = useRef(null); // 지도를 담을 div
  const markersRef = useRef([]); // 마커 객체들을 담을 배열
  
  // 4. 필터 함수
  const filterCamps = (list) => {
    return list.filter(item => {
      const { keyword, province, city, theme, facility } = filters;
      if (keyword && !(item.id.includes(keyword) || item.addr.includes(keyword))) return false;
      if (province && province !== "전체/도" && province !== item.province) return false;
      if (city && city !== "전체/시/군" && city !== item.city) return false;
      if (theme && theme !== "테마 선택" && (!item.theme || !item.theme.includes(theme))) return false;
      if (facility && facility !== "시설 선택" && (!item.facility || !item.facility.includes(facility))) return false;
      return true;
    });
  };

  // 5. Effect 1: 캠핑장 데이터 로드 및 필터링
  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.BASE_URL}camps.json`)
      .then(res => res.json())
      .then(campingList => {
        setFilteredCamps(filterCamps(campingList));
        setIsLoading(false);
      })
      .catch(err => {
        console.error("데이터 로드 실패:", err);
        setIsLoading(false);
      });
  }, [filters]); // filters가 바뀔 때마다 (검색 조건이 바뀔 때마다) 다시 로드

  // 6. Effect 2: 카카오맵 초기화 및 마커 생성 (데이터 로드가 완료되면)
  useEffect(() => {
    // 로딩 중이거나 데이터가 없으면 실행 안 함
    if (isLoading || filteredCamps.length === 0) return;

    // kakao.maps API가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵 SDK가 로드되지 않았습니다.");
      return;
    }
    
    const { kakao } = window;
    const options = {
      center: new kakao.maps.LatLng(filteredCamps[0].lat, filteredCamps[0].lng),
      level: 8
    };
    
    // 맵 생성
    const map = new kakao.maps.Map(mapContainer.current, options);
    mapRef.current = map; // Ref에 맵 인스턴스 저장
    const bounds = new kakao.maps.LatLngBounds();
    
    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 생성
    filteredCamps.forEach((item, idx) => {
      const position = new kakao.maps.LatLng(item.lat, item.lng);
      const marker = new kakao.maps.Marker({ position, map });

      // 마커 클릭 이벤트: state를 변경하여 카드 활성화
      kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedIdx(idx);
        // (나중에 추가) 클릭된 카드로 스크롤
        const cardNode = document.querySelector(`.camp-card[data-idx="${idx}"]`);
        if (cardNode) {
          cardNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      markersRef.current.push(marker); // Ref에 마커 저장
      bounds.extend(position);
    });

    // 모든 마커가 보이도록 지도 범위 재설정
    map.setBounds(bounds);

  }, [isLoading, filteredCamps]); // 로딩 상태나 캠핑장 목록이 바뀔 때마다 맵을 다시 그림

  // --- JSX 렌더링 ---
  return (
    <div className="container">
      <div className="map-area">
        {/* 지도가 이 div에 렌더링됩니다 */}
        <div id="map" ref={mapContainer}>
          {isLoading && <p>지도 로딩 중...</p>}
          {!isLoading && filteredCamps.length === 0 && (
            <div style={{ padding: '2em', color: '#888' }}>
              조건에 맞는 캠핑장이 없습니다.
            </div>
          )}
        </div>
      </div>
      
      <aside className="side-panel">
        <div className="top-search">
          <button onClick={() => navigate(-1)} className="back-btn">
            다시 찾기 (이전 작업으로 돌아감)
          </button>
          <span className="search-icon">&#128269;</span>
        </div>
        
        <div className="result-list" id="result-list">
          {isLoading && <p>목록 로딩 중...</p>}
          {!isLoading && filteredCamps.length === 0 && (
            <div style={{ padding: '2em', color: '#888' }}>
              조건에 맞는 캠핑장이 없습니다.
            </div>
          )}
          
          {/* DOM 조작 대신 state를 .map()으로 렌더링합니다.
          */}
          {filteredCamps.map((item, idx) => (
            <div 
              // 'key'는 React가 각 항목을 식별하기 위해 필수
              key={item.id + idx} 
              // data-idx는 마커 클릭 시 스크롤을 위해 유지
              data-idx={idx}
              // 'active' 클래스를 state(selectedIdx)에 따라 동적으로 부여
              className={`camp-card ${selectedIdx === idx ? 'active' : ''}`}
              // 카드 클릭 시 state 변경
              onClick={() => setSelectedIdx(idx)}
            >
              <img src={item.img} alt="캠핑장 이미지" style={{ width: 92, height: 65, objectFit: 'cover', borderRadius: 13, background: '#eee', flexShrink: 0 }} />
              <div className="card-info">
                <div className="camp-name">{item.id}</div>
                <div className="camp-addr">{item.addr}</div>
              </div>

              {/* 상세 정보 <div>도 state에 따라 조건부 렌더링
                (CSS의 'active' 클래스에 따라 처리되므로 'none' 스타일 불필요)
              */}
              {selectedIdx === idx && (
                <div className="camp-detail">
                  <div className="detail-desc">{item.desc || ""}</div>
                  <div className="detail-row">
                    <span>운영기간: {item.season || "-"}</span>
                    <span>가격: {item.price || "-"}</span>
                  </div>
                  <div className="detail-row">
                    <span>테마: {item.theme ? item.theme.join(', ') : ""}</span>
                    <span>시설: {item.facility ? item.facility.join(', ') : ""}</span>
                  </div>
                  <div className="detail-row">
                    <span>연락처: {item.phone || "-"}</span>
                    <span>⭐ {item.rating || "-"} ({item.review || 0}건)</span>
                  </div>
                  <div className="detail-btns">
                    {/* Link 태그를 사용하되, 새 창에서 열려면 
                      <a> 태그를 사용해야 합니다. 
                      /camp/:id 페이지로 연결하는 것이 좋습니다.
                    */}
                    <Link to={`/camp/${item.id}`} className="detail-link">
                      우리 앱에서 상세 보기
                    </Link>
                    <a href={item.link || '#'} className="detail-link" target="_blank" rel="noopener noreferrer">
                      원래 링크 (새 창)
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default MapPage;