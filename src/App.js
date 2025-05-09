import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    busNumber: '',
    driver: '',
    route: '',
    client: '',
    depositAmount: '',
    depositBank: '',
  });

  const [dispatchList, setDispatchList] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  const PASSWORD = 'gn339393**';
   // 🔄 실시간 데이터 불러오기
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "dispatches"), (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setDispatchList(fetchedData);
    });
  
    return () => unsubscribe();
  }, []);
  

  // 🔐 비밀번호 확인
  if (!isAuthorized) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>🔒 가나투어 전용 배차 시스템</h2>
        <p>접속하려면 비밀번호를 입력해주세요</p>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="비밀번호 입력"
          style={{ padding: '0.5rem', marginBottom: '1rem' }}
        />
        <br />
        <button
          onClick={() => {
            if (inputPassword === PASSWORD) {
              setIsAuthorized(true);
            } else {
              alert('비밀번호가 틀렸습니다!');
            }
          }}
        >
          확인
        </button>
      </div>
    );
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEntry = {
      date: selectedDate.toLocaleDateString(),
      ...formData,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'dispatches'), newEntry);
      alert('✅ 배차 정보가 Firebase에 저장되었습니다!');
    } catch (error) {
      console.error('Firestore 저장 에러:', error);
      alert('❌ 저장 중 오류가 발생했어요.');
    }

    setFormData({
      startDate: '',
      endDate: '',
      busNumber: '',
      driver: '',
      route: '',
      client: '',
      depositAmount: '',
      depositBank: '',
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🚌 배차관리 캘린더</h1>

      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        locale="ko-KR"
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const isInRange = dispatchList.some((item) => {
              const start = new Date(item.startDate);
              const end = new Date(item.endDate);
              return date >= start && date <= end;
            });
            return isInRange ? 'highlight' : null;
          }
        }}
      />
      <p>📆 선택한 날짜: {selectedDate.toLocaleDateString()}</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <label>
          행사 시작일:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          행사 종료일:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <h2>배차 정보 입력</h2>
        <label>
          차량 번호:
          <input type="text" name="busNumber" value={formData.busNumber} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          기사 이름:
          <input type="text" name="driver" value={formData.driver} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          노선:
          <input type="text" name="route" value={formData.route} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          거래처:
          <input type="text" name="client" value={formData.client} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          입금 금액:
          <input type="number" name="depositAmount" value={formData.depositAmount} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          입금 은행:
          <input type="text" name="depositBank" value={formData.depositBank} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit" style={{ marginTop: '1rem' }}>등록</button>
      </form>

      <div style={{ marginTop: '3rem' }}>
        <h2>📋 등록된 배차 내역</h2>
        {dispatchList.length === 0 ? (
          <p>아직 등록된 배차가 없습니다.</p>
        ) : (
          <ul>
            {dispatchList.map((item, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>
                📅 {item.startDate} ~ {item.endDate} <br />
                🚌 {item.busNumber} / {item.driver} / {item.route} / {item.client} / {item.depositBank} {item.depositAmount}원
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;