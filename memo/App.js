// src/App.js

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

// 필요한 컴포넌트들을 가져옵니다.
import Auth from './components/Auth';
import MemoList from './components/MemoList'; // Memo 컴포넌트 대신 MemoList를 가져옵니다.

function App() {
  const [user, setUser] = useState(null);
  const [memos, setMemos] = useState([]);

  // 컴포넌트가 처음 렌더링될 때 사용자의 로그인 상태를 감지합니다.
  useEffect(() => {
    // onAuthStateChanged는 로그인, 로그아웃 등 인증 상태가 변할 때마다 호출됩니다.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // user 상태를 업데이트합니다.
    });
    // 클린업 함수: 컴포넌트가 사라질 때 감시를 중단하여 메모리 누수를 방지합니다.
    return () => unsubscribe();
  }, []); // 빈 배열을 전달하여 최초 1회만 실행되도록 합니다.

  // 사용자가 로그인하면(user 상태가 바뀌면) 해당 사용자의 메모 목록을 실시간으로 가져옵니다.
  useEffect(() => {
    // 로그아웃 상태이면 아무 작업도 하지 않고 메모 목록을 비웁니다.
    if (!user) {
      setMemos([]);
      return;
    }

    // Firestore의 'memos' 컬렉션에 대한 참조를 만듭니다.
    const memosRef = collection(db, 'memos');
    
    // 쿼리 생성: 'memos' 컬렉션에서 'members' 필드에 현재 사용자(user.uid)가 포함된 모든 문서를 찾습니다.
    const q = query(memosRef, where("members", "array-contains", user.uid));

    // onSnapshot으로 실시간 데이터 변경을 감시합니다.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userMemos = [];
      querySnapshot.forEach((doc) => {
        userMemos.push({ id: doc.id, ...doc.data() });
      });
      setMemos(userMemos); // memos 상태를 업데이트합니다.
    });

    // 클린업 함수: user가 바뀌거나 컴포넌트가 사라질 때 감시를 중단합니다.
    return () => unsubscribe();
  }, [user]); // user 상태가 변경될 때마다 이 useEffect가 다시 실행됩니다.

  // 만약 로그인한 사용자가 없다면 Auth 컴포넌트를 보여줍니다.
  if (!user) {
    return <Auth />;
  }

  // 로그인한 사용자가 있다면 메인 앱 화면을 보여줍니다.
  return (
    <div className="App">
      <h1>{user.displayName}님, 환영합니다!</h1>
      <button onClick={() => auth.signOut()}>로그아웃</button>
      <hr />
      <h2>내 메모 목록</h2>
      
      {/* [이전 코드]
        memos.map(memo => <Memo key={memo.id} ... />)
        
        [수정된 코드]
        가져온 memos 데이터와 user 정보를 MemoList 컴포넌트에 props로 전달합니다.
        이제 메모 목록을 그리는 모든 로직은 MemoList가 담당합니다.
      */}
      <MemoList memos={memos} currentUser={user} />

    </div>
  );
}

export default App;
