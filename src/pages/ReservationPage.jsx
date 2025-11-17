import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ReservationPage() {
  const { campId } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [calendarRows, setCalendarRows] = useState([]);

  // --- Data Fetching ---
  useEffect(() => {
    setLoading(true);
    fetch('/camps.json')
      .then(res => res.json())
      .then(allCamps => {
        const foundCamp = allCamps.find(c => c.id === campId);
        if (foundCamp) {
          setCamp(foundCamp);
        }
        setLoading(false);
      });
  }, [campId]);

  // --- Calendar Logic ---
  useEffect(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const rows = [];
    let cells = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= lastDate; d++) {
      cells.push(d);
      if (cells.length === 7) {
        rows.push(cells);
        cells = [];
      }
    }
    if (cells.length > 0) {
      while (cells.length < 7) cells.push(null);
      rows.push(cells);
    }
    setCalendarRows(rows);
  }, [viewDate]);

  // --- Event Handlers ---
  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  const handleDateClick = (day) => {
    if (!day) return;
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);
    setSelectedTime(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 모두 선택해주세요!');
      return;
    }
    const dateStr = selectedDate.toLocaleDateString('ko-KR', {
      month: 'long', day: 'numeric', weekday: 'long'
    });
    navigate(`/reserve-complete?campId=${camp.id}&date=${dateStr}&time=${selectedTime}`);
  };

  // --- Helper Data & Vars ---
  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  const calLabel = `${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`;
  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return '날짜를 먼저 선택하세요';
    return selectedDate.toLocaleDateString('ko-KR', {
      month: 'long', day: 'numeric', weekday: 'long'
    });
  }, [selectedDate]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>예약 정보를 불러오는 중...</div>;
  if (!camp) return <div style={{ padding: '50px', textAlign: 'center' }}>캠핑장 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="reserve-page-wrapper">
      
      <div className="hero-bg-reserve" style={{ backgroundImage: `url(${camp.img})` }}>
        <div className="hero-title">
          <h1>{camp.name}</h1>
          <p>{camp.addr}</p>
        </div>
      </div>

      <div className="reserve-main">
        {/* [!] '하나의 큰 상자' (.reserve-card) */}
        <div className="reserve-card">
          
          {/* --- 1. 좌측 (3) --- */}
          <div className="reserve-info">
            <div className="reserve-info-inner">
              <div className="camp-desc">
                <b>{camp.desc}</b><br />
                {camp.facility?.join(', ')}<br />
                운영기간 : {camp.season}<br />
                가격 : {camp.price}
              </div>
              <div className="camp-caution">
                <b>이용 시 주의사항</b>
                <ul>
                  <li>쓰레기는 반드시 지정된 장소에 분리수거해 주세요.</li>
                  <li>캠프파이어는 지정 구역에서만 가능합니다.</li>
                  <li>야간 소음에 유의해 주세요.</li>
                  <li>애완동물 동반 시 반드시 목줄 착용 바랍니다.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="reserve-divider"></div>

          {/* --- 2. 중앙 (5) --- */}
          <div className="reserve-calendar">
            <div className="calendar-title">날짜를 선택해주세요.</div>
            <div className="calendar-nav">
              <button id="prev-month" className="cal-btn" onClick={handlePrevMonth}>◀</button>
              <span id="cal-label">{calLabel}</span>
              <button id="next-month" className="cal-btn" onClick={handleNextMonth}>▶</button>
            </div>
            
            <table className="calendar-table">
              <thead>
                <tr>
                  <th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
                </tr>
              </thead>
              <tbody id="cal-body">
                {calendarRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((day, dIdx) => {
                      const isSelected = selectedDate &&
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === viewDate.getMonth() &&
                        selectedDate.getFullYear() === viewDate.getFullYear();
                        
                      return (
                        <td 
                          key={dIdx}
                          className={!day ? 'empty' : `date ${isSelected ? 'active' : ''}`}
                          onClick={() => handleDateClick(day)}
                        >
                          {day}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="calendar-tz">대한민국/서울 (UDT)</div>
          </div>

          <div className="reserve-divider"></div>

          {/* --- 3. 우측 (2) --- */}
          <div className="reserve-times">
            <div className="time-title">시간 선택</div>
            <div className="time-date" id="selected-date">{selectedDateLabel}</div>
            
            <div className="time-list">
              {timeSlots.map(time => (
                <div 
                  key={time}
                  className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </div>
              ))}
            </div>
            
            <form id="reserve-form" onSubmit={handleSubmit}>
              <button type="submit" className="btn-reserve">예약하기</button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ReservationPage;