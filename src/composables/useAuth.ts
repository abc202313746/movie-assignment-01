import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface User {
  id: string;
  password: string;
}

const USERS_KEY = 'users';
const TOKEN_KEY = 'TMDb-Key';
const LOGIN_USER_KEY = 'loginUser';

// 전역 상태로 관리 (어디서든 아이디 확인 가능하게)
const isLoggedIn = ref(!!localStorage.getItem(TOKEN_KEY));
const currentId = ref(localStorage.getItem(LOGIN_USER_KEY) || '');

export function useAuth() {
  const router = useRouter();

  const register = (id: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find(u => u.id === id)) {
      alert('이미 존재하는 아이디입니다! 😱');
      return false;
    }
    users.push({ id, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    alert('회원가입 성공! 이제 로그인해주세요. 🎉');
    return true;
  };

  const login = (id: string, password: string, remember: boolean) => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.id === id && u.password === password);

    if (user) {
      localStorage.setItem(TOKEN_KEY, user.password);
      localStorage.setItem(LOGIN_USER_KEY, user.id);
      
      if (remember) localStorage.setItem('rememberedId', id);
      else localStorage.removeItem('rememberedId');

      // 상태 업데이트
      isLoggedIn.value = true;
      currentId.value = user.id; // 👇 아이디 업데이트!

      alert(`환영합니다, ${id}님! 💕`);
      router.push('/');
      return true;
    } else {
      alert('아이디 또는 비밀번호가 틀렸어요! 😢');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LOGIN_USER_KEY);
    
    // 상태 초기화
    isLoggedIn.value = false;
    currentId.value = ''; // 👇 아이디 초기화!
    
    alert('로그아웃 되었습니다. 👋');
    router.push('/signin');
  };

  // currentId도 밖으로 내보냄
  return { isLoggedIn, currentId, register, login, logout };
}