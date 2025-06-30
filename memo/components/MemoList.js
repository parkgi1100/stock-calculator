// src/components/MemoList.js
import React from 'react';
import Memo from './Memo';

const MemoList = ({ memos, currentUser }) => {
  // memos 배열이 비어있거나 없을 경우를 대비
  if (!memos || memos.length === 0) {
    return <p>표시할 메모가 없습니다. 새 메모를 만들어보세요!</p>;
  }

  return (
    <div className="memo-list-container">
      {/* memos 배열을 map 함수로 순회하면서 
        각각의 memo 데이터를 <Memo /> 컴포넌트에 props로 전달합니다.
      */}
      {memos.map(memo => (
        <Memo key={memo.id} memo={memo} currentUser={currentUser} />
      ))}
    </div>
  );
};

export default MemoList;
