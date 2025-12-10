import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';  // 👈 추가

interface User {
  id: string;
  password: string;
}

const USERS_KEY = 'users';
const TOKEN_KEY = 'TMDb-Key';
const LOGIN_USER_KEY = 'loginUser';

const isLoggedIn = ref(!!localStorage.getItem(TOKEN_KEY));
const currentId = ref(localStorage.getItem(LOGIN_USER_KEY) || '');

export function useAuth() {
  const router = useRouter();
  const toast = useToast();

  // 👇 TMDB API Key 검증 함수 (핵심!)
  const validateApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      // TMDB API 호출 테스트 (가장 간단한 엔드포인트)
      const response = await axios.get(
        `${import.meta.env.VITE_TMDB_BASE_URL}/authentication`,
        {
          params: {
            api_key: apiKey
          },
          headers: {
            accept: 'application/json'
          }
        }
      );
      
      // 응답이 성공하면 유효한 API Key
      return response.status === 200;
    } catch (error) {
      // API 호출 실패 = 유효하지 않은 API Key
      console.error('API Key 검증 실패:', error);
      return false;
    }
  };

  const register = async (id: string, password: string) => {
    // 👇 1단계: TMDB API Key인지 먼저 검증!
    toast.info('API Key 유효성 검증 중...', {
      icon: '🔍',
      timeout: 1000
    });

    const isValidApiKey = await validateApiKey(password);
    
    if (!isValidApiKey) {
      toast.error('유효하지 않은 TMDB API Key입니다! 발급받은 API Key를 입력해주세요.', {
        icon: '❌',
        timeout: 5000
      });
      return false;
    }

    // 👇 2단계: 유효한 API Key이면 회원가입 진행
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find(u => u.id === id)) {
      toast.error('이미 존재하는 아이디입니다!', {
        icon: '😱'
      });
      return false;
    }
    
    users.push({ id, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    toast.success('회원가입 성공! 유효한 API Key가 등록되었습니다.', {
      icon: '🎉'
    });
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

      isLoggedIn.value = true;
      currentId.value = user.id;

      toast.success(`환영합니다, ${id}님!`, {
        icon: '💕'
      });
      router.push('/');
      return true;
    } else {
      toast.error('아이디 또는 비밀번호(API Key)가 틀렸어요!', {
        icon: '😢'
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LOGIN_USER_KEY);
    
    isLoggedIn.value = false;
    currentId.value = '';
    
    toast.info('로그아웃 되었습니다.', {
      icon: '👋'
    });
    router.push('/signin');
  };

  return { isLoggedIn, currentId, register, login, logout };
}