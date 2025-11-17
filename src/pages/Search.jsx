import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const cityData = {
  "전체/도": ["전체/시/군"],
  "서울특별시": ["전체/시/군", "강남구", "종로구", "서초구", "강서구", "송파구"],
  "경기도": ["전체/시/군", "수원시", "성남시", "고양시", "용인시", "부천시", "의정부시"],
  "강원도": ["전체/시/군", "춘천시", "원주시", "강릉시", "속초시", "동해시"],
  "충청북도": ["전체/시/군", "청주시", "충주시", "제천시", "단양군"],
  "충청남도": ["전체/시/군", "천안시", "아산시", "서산시", "논산시"],
  "전라북도": ["전체/시/군", "전주시", "군산시", "익산시", "정읍시"],
  "전라남도": ["전체/시/군", "목포시", "여수시", "순천시", "광양시"],
  "경상북도": ["전체/시/군", "포항시", "경주시", "구미시", "안동시"],
  "경상남도": ["전체/시/군", "창원시", "진주시", "김해시", "양산시"],
  "부산광역시":["전체/시/군", "해운대구", "수영구", "동래구", "부산진구"],
  "제주도": ["전체/시/군", "제주시", "서귀포시"],
};

function Search() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [province, setProvince] = useState('전체/도');
  const [city, setCity] = useState('전체/시/군');
  const [theme, setTheme] = useState('테마 선택');
  const [facility, setFacility] = useState('시설 선택');
  const [openDropdown, setOpenDropdown] = useState(null); 
  const [cityList, setCityList] = useState(cityData["전체/도"]);

  useEffect(() => {
    setCityList(cityData[province] || ["전체/시/군"]);
    setCity("전체/시/군");
  }, [province]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      keyword,
      province,
      city,
      theme,
      facility
    });
    navigate(`/map?${params.toString()}`);
  };

  const handleSelect = (dropdownId, value) => {
    if (dropdownId === 'province') setProvince(value);
    if (dropdownId === 'city') setCity(value);
    if (dropdownId === 'theme') setTheme(value);
    if (dropdownId === 'facility') setFacility(value);
    setOpenDropdown(null); 
  };

  const renderDropdown = (id, label, value, list) => (
    <div className={`dropdown ${openDropdown === id ? 'show' : ''}`}>
      <button 
        type="button" 
        className="dropbtn"
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
      >
        {value}
      </button>
      <div className="dropdown-content">
        {list.map(item => (
          <a key={item} onClick={() => handleSelect(id, item)}>{item}</a>
        ))}
      </div>
    </div>
  );

  // 최상위 div에 className="hero-bg" 추가
  return (
    <div className="hero-bg">
      <div className="hero-content">
        <h1>캠핑은 언제나 옳습니다</h1>
        <p className="subtitle">원하는 조건만을 가진 나만의 맞춤형 캠핑장을 추천받아보세요</p>
        <div className="search-box">
          <form id="campForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>키워드 검색</label>
              <input 
                type="text" 
                name="keyword" 
                placeholder="검색어를 입력하세요"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>
            
            <div className="form-row">
              <label>지역별</label>
              <div className="dropdowns">
                {renderDropdown('province', '도', province, Object.keys(cityData))}
                {renderDropdown('city', '시/군', city, cityList)}
              </div>
            </div>

            <div className="form-row">
              <label>테마별</label>
              {renderDropdown('theme', '테마', theme, ['테마 선택', '가족', '커플', '반려동물', '차박', '글램핑', '카라반'])}
            </div>
            
            <div className="form-row">
              <label>시설 조건</label>
              {renderDropdown('facility', '시설', facility, ['시설 선택', '전기', '화장실', '샤워장', '마트/편의점', '물놀이장', '와이파이'])}
            </div>

            <button type="submit" className="search-btn">검색하기</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Search;