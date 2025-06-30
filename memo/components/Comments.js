// src/components/Comments.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const Comments = ({ memoId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // 특정 메모(memoId)에 해당하는 댓글들을 실시간으로 가져오기
  useEffect(() => {
    if (!memoId) return;

    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where("memoId", "==", memoId),
      orderBy("createdAt", "asc") // 작성 시간순으로 정렬
    );

    // onSnapshot은 실시간 리스너로, DB에 변화가 생길 때마다 자동으로 업데이트됨
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    // 컴포넌트가 사라질 때 리스너를 정리하여 메모리 누수 방지
    return () => unsubscribe();
  }, [memoId]); // memoId가 바뀔 때마다 새로 구독

  // 새 댓글 추가 핸들러
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    try {
      // 'comments' 컬렉션에 새 댓글 문서(document) 추가
      await addDoc(collection(db, 'comments'), {
        memoId: memoId,
        text: newComment,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        createdAt: serverTimestamp(), // 서버의 현재 시간을 기록
      });
      setNewComment(''); // 입력창 비우기
    } catch (error) {
      console.error("댓글 추가 중 에러 발생: ", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="comments-section" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
      <h4>댓글</h4>
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} style={{ marginBottom: '5px' }}>
            <strong>{comment.authorName}:</strong> {comment.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleAddComment} style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          style={{ flex: 1, marginRight: '5px' }}
        />
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default Comments;
