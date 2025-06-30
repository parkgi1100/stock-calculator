// components/Auth.js
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(true);

  // 고유 초대코드 생성 함수
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `MEMO-${code}`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // 회원가입
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Firestore에 사용자 정보 및 초대코드 저장
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.email.split('@')[0], // 간단한 이름 설정
          inviteCode: generateInviteCode(),
        });
        alert('회원가입 성공!');
      } else {
        // 로그인
        await signInWithEmailAndPassword(auth, email, password);
        alert('로그인 성공!');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
     const provider = new GoogleAuthProvider();
     try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Firestore에 사용자 정보 저장 (이미 존재하면 덮어쓰지 않음, 필요시 로직 추가)
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          inviteCode: generateInviteCode(),
        }, { merge: true }); // 기존 문서와 병합
        alert('구글 로그인 성공!');
     } catch (error) {
        alert(error.message);
     }
  }

  return (
    <div>
      <h2>{isRegister ? '회원가입' : '로그인'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
        />
        <button type="submit">{isRegister ? '가입하기' : '로그인하기'}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}
      </button>
      <hr />
      <button onClick={handleGoogleLogin}>Google로 로그인</button>
    </div>
  );
};

export default Auth;
