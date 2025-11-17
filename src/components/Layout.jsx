import React from 'react';
import { Outlet, Link } from 'react-router-dom'; // <a> 대신 <Link> 사용

function Layout() {
  return (
    <>
      {/* 기존 <a> 태그는 페이지를 새로고침합니다.
        React Router의 <Link> 태그는 페이지 새로고침 없이
        내부 컴포넌트만 부드럽게 교체합니다.
      */}
      <header>
        {/* 로고를 누르면 홈으로 갑니다 */}
        <Link to="/"> 
          <h1>캠핑 이즈 굿</h1>
        </Link>
        <nav className="nav-scroll">
          {/* <a href="mypage.html" ...> -> <Link to="/mypage" ...> */}
          <Link to="/mypage" className="nav-btn">마이페이지</Link>
          <Link to="/customerservice" className="nav-btn">고객센터</Link>
          <Link to="/login" className="nav-btn">로그인</Link>
          <Link to="/createaccount" className="nav-btn">회원가입</Link>
        </nav>
      </header>

      {/* <main> 태그가 실제 페이지 내용이 들어올 자리입니다.
        <Outlet />은 "라우터에서 지정된 현재 페이지 컴포넌트"를 
        이 자리에 렌더링하라는 명령입니다.
      */}
      <main>
        <Outlet />
      </main>

      <footer>
        <p>문의: 010-1234-5678 / campingisgood@gamil.com</p>
      </footer>
    </>
  );
}

// 이 줄이 빠지면 안 됩니다!
export default Layout;