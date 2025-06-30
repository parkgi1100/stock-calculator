// App.js
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

import Auth from './components/Auth';
import Memo from './components/Memo'; // 임시로 하나의 메모만 표시

function App() {
  const [user, setUser] = useState(null);
  const [memos, setMemos] = useState([]);

  // 사용자 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 로그인한 사용자의 메모 목록 실시간으로 가져오기
  useEffect(() => {
    if (!user) {
      setMemos([]);
      return;
    }

    const memosRef = collection(db, 'memos');
    // 내가 멤버로 포함된 모든 메모를 가져오는 쿼리
    const q = query(memosRef, where("members", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userMemos = [];
      querySnapshot.forEach((doc) => {
        userMemos.push({ id: doc.id, ...doc.data() });
      });
      setMemos(userMemos);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="App">
      <h1>{user.displayName}님, 환영합니다!</h1>
      <button onClick={() => auth.signOut()}>로그아웃</button>
      <hr />
      <h2>내 메모 목록</h2>
      {memos.map(memo => (
        <Memo key={memo.id} memo={memo} />
      ))}
    </div>
  );
}

export default App;
