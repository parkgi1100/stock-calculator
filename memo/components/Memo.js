// src/components/Memo.js

import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';

// Comments 컴포넌트를 가져옵니다.
import Comments from './Comments';

const Memo = ({ memo, currentUser }) => {
  const [inviteInput, setInviteInput] = useState('');

  // 체크박스 클릭 핸들러
  const handleCheck = async (itemIndex) => {
    const memoRef = doc(db, 'memos', memo.id);
    
    // 원본 배열을 복사하여 불변성을 유지합니다.
    const newItems = [...memo.items];
    const targetItem = newItems[itemIndex];
    
    const isCompleted = targetItem.completedBy.includes(currentUser.uid);

    if (isCompleted) {
      // 이미 완료했다면, currentUser.uid를 배열에서 제거
      targetItem.completedBy = targetItem.completedBy.filter(uid => uid !== currentUser.uid);
    } else {
      // 완료하지 않았다면, currentUser.uid를 배열에 추가
      targetItem.completedBy.push(currentUser.uid);
    }

    // 수정된 newItems 배열로 Firestore 문서를 업데이트합니다.
    await updateDoc(memoRef, { items: newItems });
  };
  
  // 초대 기능 핸들러
  const handleInvite = async () => {
    if (!inviteInput) return;
    
    // 1. 초대 코드로 Firestore의 'users' 컬렉션에서 사용자 검색
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("inviteCode", "==", inviteInput.trim()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert("존재하지 않는 초대코드입니다.");
        return;
    }

    // 2. 검색된 사용자를 현재 메모의 'members' 배열에 추가
    const invitedUser = querySnapshot.docs[0].data();
    if(memo.members.includes(invitedUser.uid)) {
        alert("이미 참여하고 있는 사용자입니다.");
        return;
    }

    const memoRef = doc(db, 'memos', memo.id);
    await updateDoc(memoRef, {
        members: arrayUnion(invitedUser.uid) // arrayUnion으로 중복 없이 추가
    });
    
    alert(`${invitedUser.displayName}님을 초대했습니다!`);
    setInviteInput('');
  };

  // 할 일 항목의 달성률 계산 함수
  const calculateProgress = (item) => {
    if (!memo.members || memo.members.length === 0) return 0;
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
      <p><strong>참여자:</strong> {memo.members.length}명</p>

      {/* 할 일 목록 (체크리스트) */}
      <ul>
        {memo.items && memo.items.map((item, index) => (
          <li key={index} style={{ listStyle: 'none', marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={item.completedBy.includes(currentUser.uid)}
              onChange={() => handleCheck(index)}
            />
            <span style={{ textDecoration: item.completedBy.includes(currentUser.uid) ? 'line-through' : 'none' }}>
              {item.task}
            </span>
            
            {/* 달성률 프로그레스 바 */}
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '4px' }}>
                <span>달성률: {Math.round(calculateProgress(item))}%</span>
                <div style={{ width: '100px', height: '10px', backgroundColor: '#eee', marginLeft: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${calculateProgress(item)}%`, height: '100%', backgroundColor: '#4caf50' }}></div>
                </div>
            </div>
          </li>
        ))}
      </ul>
      
      {/* [추가된 부분]
        메모의 고유 id와 현재 사용자 정보를 Comments 컴포넌트에 props로 전달하여
        해당 메모에 대한 댓글 기능을 렌더링합니다.
      */}
      <Comments memoId={memo.id} currentUser={currentUser} />
    </div>
  );
};

export default Memo;
