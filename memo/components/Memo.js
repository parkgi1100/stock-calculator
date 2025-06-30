// components/Memo.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';

// 현재 로그인한 사용자 정보 (App.js에서 props로 받아옴)
const currentUser = { uid: "user_id_1", displayName: "김메모" }; 

const Memo = ({ memo }) => {
  const [inviteInput, setInviteInput] = useState('');

  // 체크박스 클릭 핸들러
  const handleCheck = async (item) => {
    const memoRef = doc(db, 'memos', memo.id);
    const isCompleted = item.completedBy.includes(currentUser.uid);

    // 아이템 객체 전체를 찾아서 업데이트
    const newItems = memo.items.map(i => {
      if (i.task === item.task) { // task 내용으로 아이템 식별
        return {
          ...i,
          completedBy: isCompleted 
            ? arrayRemove(currentUser.uid) 
            : arrayUnion(currentUser.uid)
        };
      }
      return i;
    });

    await updateDoc(memoRef, { items: newItems });
  };
  
  // 초대 기능 핸들러
  const handleInvite = async () => {
    if (!inviteInput) return;
    
    // 1. 초대 코드로 사용자 검색
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("inviteCode", "==", inviteInput));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert("존재하지 않는 초대코드입니다.");
        return;
    }

    // 2. 검색된 사용자를 멤버에 추가
    const invitedUser = querySnapshot.docs[0].data();
    if(memo.members.includes(invitedUser.uid)) {
        alert("이미 참여하고 있는 사용자입니다.");
        return;
    }

    const memoRef = doc(db, 'memos', memo.id);
    await updateDoc(memoRef, {
        members: arrayUnion(invitedUser.uid)
    });
    
    alert(`${invitedUser.displayName}님을 초대했습니다!`);
    setInviteInput('');
  };

  // 달성률 계산
  const calculateProgress = (item) => {
    if (memo.members.length === 0) return 0;
    return (item.completedBy.length / memo.members.length) * 100;
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>{memo.title}</h3>
      
      {/* 초대 기능 UI */}
      <div>
        <input 
          value={inviteInput} 
          onChange={(e) => setInviteInput(e.target.value)}
          placeholder="친구의 초대코드 입력"
        />
        <button onClick={handleInvite}>초대</button>
      </div>
      <p><strong>참여자:</strong> {memo.members.join(', ')}</p>

      {/* 할 일 목록 (체크리스트) */}
      <ul>
        {memo.items.map((item, index) => (
          <li key={index} style={{ listStyle: 'none' }}>
            <input
              type="checkbox"
              checked={item.completedBy.includes(currentUser.uid)}
              onChange={() => handleCheck(item)}
            />
            <span style={{ textDecoration: item.completedBy.includes(currentUser.uid) ? 'line-through' : 'none' }}>
              {item.task}
            </span>
            
            {/* 달성률 프로그레스 바 */}
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                <span>달성률: {Math.round(calculateProgress(item))}%</span>
                <div style={{ width: '100px', height: '10px', backgroundColor: '#eee', marginLeft: '10px' }}>
                    <div style={{ width: `${calculateProgress(item)}%`, height: '100%', backgroundColor: 'green' }}></div>
                </div>
            </div>
          </li>
        ))}
      </ul>
      {/* 여기에 <Comments memoId={memo.id} /> 컴포넌트 추가 */}
    </div>
  );
};

export default Memo;
