import React, { useState } from 'react';

function CustomerService() {
  const [activeTab, setActiveTab] = useState('notice');
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', title: '', content: '' });

  const notices = [
    { id: 1, date: '2025-11-15', title: '캠핑장 예약 시스템 업데이트 안내', content: '더욱 편리한 예약 환경을 위해 예약 시스템이 업데이트되었습니다. 예약 취소 기한이 1주일로 변경되었습니다.' },
    { id: 2, date: '2025-11-10', title: '겨울 시즌 캠핑장 운영 공지', content: '겨울 시즌이 시작되면서 일부 캠핑장의 운영 일정이 변경됩니다. 예약 전에 공지사항을 확인하세요.' }
  ];

  const faqs = [
    { id: 1, question: '예약은 어떻게 하나요?', answer: '검색에서 캠핑장을 찾아 상세 페이지의 예약하기 버튼을 눌러 예약합니다.' },
    { id: 2, question: '예약 취소는?', answer: '마이페이지에서 예약 내역을 확인 후 취소할 수 있습니다. 취소 정책을 확인하세요.' }
  ];

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.title || !inquiryForm.content) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    // 간단히 localStorage에 저장하거나 서버 전송 로직을 연결할 수 있습니다.
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    inquiries.unshift({ ...inquiryForm, date: new Date().toISOString() });
    localStorage.setItem('inquiries', JSON.stringify(inquiries));

    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    setInquiryForm({ name: '', email: '', title: '', content: '' });
    setActiveTab('inquiry');
  };

  return (
    <div className="customer-service-wrapper">
      <div className="cs-container">
        <aside className="cs-sidebar">
          <nav className="cs-nav">
            <button className={`cs-nav-btn ${activeTab === 'notice' ? 'active' : ''}`} onClick={() => setActiveTab('notice')}>📢 공지사항</button>
            <button className={`cs-nav-btn ${activeTab === 'inquiry' ? 'active' : ''}`} onClick={() => setActiveTab('inquiry')}>💬 1:1 문의</button>
            <button className={`cs-nav-btn ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>❓ 자주하는 질문</button>
          </nav>
        </aside>

        <main className="cs-main">
          <div className="cs-intro">
            <h1>고객센터</h1>
            <p className="cs-description">공지사항, 1:1 문의, 자주하는 질문을 확인하세요.</p>
          </div>
          {activeTab === 'notice' && (
            <section className="cs-section">
              <h2>공지사항</h2>
              <div className="notice-list">
                {notices.map(n => (
                  <article key={n.id} className="notice-item">
                    <div className="notice-header">
                      <h3 className="notice-title">{n.title}</h3>
                      <span className="notice-date">{n.date}</span>
                    </div>
                    <p className="notice-content">{n.content}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'inquiry' && (
            <section className="cs-section">
              <h2>1:1 문의</h2>
              <p className="cs-description">문의 내용을 남겨주시면 등록되어 관리자가 확인합니다.</p>

              <form className="inquiry-form" onSubmit={handleInquirySubmit}>
                <div className="form-group">
                  <label htmlFor="name">이름</label>
                  <input id="name" name="name" value={inquiryForm.name} onChange={handleInquiryChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">이메일</label>
                  <input id="email" name="email" type="email" value={inquiryForm.email} onChange={handleInquiryChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="title">제목</label>
                  <input id="title" name="title" value={inquiryForm.title} onChange={handleInquiryChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="content">내용</label>
                  <textarea id="content" name="content" rows="7" value={inquiryForm.content} onChange={handleInquiryChange} />
                </div>
                <button type="submit" className="btn-submit">문의 접수</button>
              </form>
            </section>
          )}

          {activeTab === 'faq' && (
            <section className="cs-section">
              <h2>자주하는 질문</h2>
              <div className="faq-list">
                {faqs.map(f => (
                  <div key={f.id} className="faq-item">
                    <h3 className="faq-question">{f.question}</h3>
                    <p className="faq-answer">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default CustomerService;
