// src/App.jsx

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import MapPage from './pages/MapPage';
import HallOfFame from './pages/HallOfFame';
import Login from './pages/Login';
import ReserveComplete from './pages/ReserveComplete';
import CampDetail from './pages/CampDetail';

// 1. 새로 만들 페이지들을 import 합니다.
import ReservationPage from './pages/ReservationPage'; 
import ReviewPage from './pages/ReviewPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 1레벨 페이지 */}
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="map" element={<MapPage />} />
          <Route path="hall-of-fame" element={<HallOfFame />} />
          <Route path="login" element={<Login />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="reserve-complete" element={<ReserveComplete />} />

          {/* 2. 상세 페이지 (기존) */}
          <Route path="camp/:campId" element={<CampDetail />} />
          
          {/* 3. [신규] 예약 및 리뷰 페이지 라우트 추가 */}
          <Route path="camp/:campId/reserve" element={<ReservationPage />} />
          <Route path="camp/:campId/reviews" element={<ReviewPage />} />

        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;