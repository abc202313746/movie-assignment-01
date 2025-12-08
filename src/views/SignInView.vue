<template>
  <div class="auth-container">
    <div class="background-overlay"></div>

    <div class="auth-box">
      <transition name="fade" mode="out-in">
        
        <div v-if="isLoginMode" key="login" class="form-container">
          <h2>로그인</h2>
          <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="이메일 주소" required />
            <input v-model="password" type="password" placeholder="비밀번호 (TMDB API Key)" required />
            
            <button type="submit" class="submit-btn">로그인</button>
            
            <div class="options">
              <label>
                <input v-model="rememberMe" type="checkbox" /> 로그인 정보 저장
              </label>
              <span class="help">도움이 필요하신가요?</span>
            </div>
          </form>
          
          <p class="switch-msg">
            Netflix 회원이 아니신가요? 
            <a href="#" @click.prevent="toggleMode">지금 가입하세요.</a>
          </p>
        </div>

        <div v-else key="signup" class="form-container">
          <h2>회원가입</h2>
          <form @submit.prevent="handleRegister">
            <input v-model="email" type="email" placeholder="이메일 주소" required />
            <input v-model="password" type="password" placeholder="비밀번호 (TMDB API Key 입력!)" required />
            <input v-model="confirmPassword" type="password" placeholder="비밀번호 확인" required />
            
            <label class="terms">
              <input v-model="agreed" type="checkbox" required />
              (필수) 개인정보 처리방침에 동의합니다.
            </label>

            <button type="submit" class="submit-btn">회원가입</button>
          </form>
          
          <p class="switch-msg">
            이미 회원이신가요? 
            <a href="#" @click.prevent="toggleMode">로그인하기</a>
          </p>
        </div>

      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { login, register } = useAuth();

// 상태 관리
const isLoginMode = ref(true); // true: 로그인, false: 회원가입
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const rememberMe = ref(false);
const agreed = ref(false);

// 초기화: 저장된 아이디 불러오기
onMounted(() => {
  const savedId = localStorage.getItem('rememberedId');
  if (savedId) {
    email.value = savedId;
    rememberMe.value = true;
  }
});

// 화면 전환 토글
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  // 입력창 초기화
  password.value = '';
  confirmPassword.value = '';
};

// 로그인 처리
const handleLogin = () => {
  login(email.value, password.value, rememberMe.value);
};

// 회원가입 처리
const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않아요! 😡');
    return;
  }
  if (!agreed.value) {
    alert('약관에 동의해야 합니다!');
    return;
  }
  
  // 비밀번호가 API Key 역할을 하므로, 여기서 API Key를 입력받아 저장함
  const success = register(email.value, password.value);
  if (success) {
    toggleMode(); // 성공하면 로그인 화면으로 이동
  }
};
</script>

<style scoped>
.auth-container {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/KR-ko-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg') no-repeat center center/cover;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* 어두운 배경 처리 */
}

.auth-box {
  position: relative;
  background: rgba(0, 0, 0, 0.75);
  padding: 60px 68px 40px;
  width: 450px;
  min-height: 500px;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  z-index: 10;
}

h2 {
  color: white;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 28px;
}

input {
  width: 100%;
  background: #333;
  border: none;
  border-radius: 4px;
  color: white;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  margin-bottom: 16px;
  font-size: 16px;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  background: #E50914;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 16px;
  margin-top: 24px;
  cursor: pointer;
  margin-bottom: 10px;
}

.options {
  display: flex;
  justify-content: space-between;
  color: #b3b3b3;
  font-size: 13px;
}

.switch-msg {
  color: #737373;
  margin-top: 16px;
  font-size: 16px;
}

.switch-msg a {
  color: white;
  text-decoration: none;
}
.switch-msg a:hover {
  text-decoration: underline;
}

.terms {
  display: block;
  color: #b3b3b3;
  font-size: 13px;
  margin-bottom: 10px;
}

/* 전환 애니메이션 (Vue Transition) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>