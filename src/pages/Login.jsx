import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅

function Login() {
  // 1. state로 폼 입력값 관리
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. navigate 함수 가져오기
  const navigate = useNavigate();

  // 3. 폼 제출 이벤트 핸들러
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 것을 방지

    // 4. 쿠키에 username 저장
    document.cookie = `username=${encodeURIComponent(userid)}; path=/; max-age=86400`;
    
    // 5. window.location.href 대신 navigate 사용
    navigate('/'); // 홈으로 이동
  };

  // 6. 최상위 div에 className="login-container" 추가
  return (
    <div className="login-container"> 
      <h1 className="login-title">로그인</h1>
      <div className="login-card">
        <form id="login-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="login-row">
            <label htmlFor="userid">아이디</label>
            <input 
              type="text" 
              id="userid" 
              autoComplete="username" 
              required 
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
            />
          </div>
          <div className="login-row">
            <label htmlFor="password">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              autoComplete="current-password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn">Log in</button>
        </form>
      </div>
    </div>
  );
}

export default Login;