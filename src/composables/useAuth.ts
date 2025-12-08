import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 사용자 데이터 타입 정의
interface User {
  id: string;       // 이메일
  password: string; // API Key
}

// 로컬 스토리지 키
const USERS_KEY = 'users';
const TOKEN_KEY = 'TMDb-Key'; // API 통신에 쓸 키 이름
const LOGIN_USER_KEY = 'loginUser'; // 현재 로그인한 사람 ID

export function useAuth() {
  const router = useRouter();
  const isLoggedIn = ref(!!localStorage.getItem(TOKEN_KEY)); // 토큰 있으면 로그인 상태

  // 1. 회원가입 (Local Storage에 저장)
  const register = (id: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // 중복 체크
    if (users.find(u => u.id === id)) {
      alert('이미 존재하는 아이디입니다! 😱');
      return false;
    }

    // 저장
    users.push({ id, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    alert('회원가입 성공! 이제 로그인해주세요. 🎉');
    return true;
  };

  // 2. 로그인 (저장된 정보와 비교)
  const login = (id: string, password: string, remember: boolean) => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.id === id && u.password === password);

    if (user) {
      // 로그인 성공! API Key를 토큰으로 저장
      localStorage.setItem(TOKEN_KEY, user.password);
      localStorage.setItem(LOGIN_USER_KEY, user.id);
      
      if (remember) {
        localStorage.setItem('rememberedId', id);
      } else {
        localStorage.removeItem('rememberedId');
      }

      isLoggedIn.value = true;
      alert(`환영합니다, ${id}님! 💕`);
      router.push('/'); // 메인으로 이동
      // 새로고침해야 API 키 적용되므로 강제 리로드 (확실한 방법)
      window.location.href = '/'; 
      return true;
    } else {
      alert('아이디 또는 비밀번호(API Key)가 틀렸어요! 😢');
      return false;
    }
  };

  // 3. 로그아웃
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LOGIN_USER_KEY);
    isLoggedIn.value = false;
    alert('로그아웃 되었습니다. 👋');
    router.push('/signin');
  };

  return { isLoggedIn, register, login, logout };
}