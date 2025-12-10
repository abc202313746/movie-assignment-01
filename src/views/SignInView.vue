<template>
  <div class="auth-container">
    <div class="background-overlay"></div>

    <div class="auth-wrapper">
      <div class="form-header">
        <div class="header-title login" :class="{ active: isLoginMode }">로그인</div>
        <div class="header-title signup" :class="{ active: !isLoginMode }">회원가입</div>
      </div>
      
      <div class="tab-controls">
        <input type="radio" name="mode" id="login" :checked="isLoginMode" @change="setMode(true)">
        <input type="radio" name="mode" id="signup" :checked="!isLoginMode" @change="setMode(false)">
        
        <label for="login" class="tab-btn login" @click="setMode(true)">Login</label>
        <label for="signup" class="tab-btn signup" @click="setMode(false)">Sign Up</label>
        
        <div class="active-indicator" :style="{ left: isLoginMode ? '0%' : '50%' }"></div>
      </div>

      <div class="forms-wrapper">
        <div class="forms-container" :style="{ marginLeft: isLoginMode ? '0%' : '-100%' }">
          
          <!-- 로그인 폼 -->
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="input-field">
              <input v-model="email" type="email" placeholder="이메일 주소" required>
            </div>
            <div class="input-field">
              <input v-model="password" type="password" placeholder="비밀번호 (API Key)" required>
            </div>
            
            <div class="remember-field">
              <label>
                <input v-model="rememberMe" type="checkbox" />
                <span>아이디 기억하기</span>
              </label>
            </div>

            <div class="submit-field">
              <div class="btn-background"></div>
              <input type="submit" value="로그인">
            </div>
            <div class="switch-text">
              아직 회원이 아니신가요? <a href="#" @click.prevent="setMode(false)">지금 가입하세요</a>
            </div>
          </form>

          <!-- 회원가입 폼 -->
          <form @submit.prevent="handleRegister" class="signup-form">
            <div class="input-field">
              <input v-model="email" type="email" placeholder="이메일 주소" required>
            </div>
            <div class="input-field">
              <input v-model="password" type="password" placeholder="비밀번호 (API Key)" required>
            </div>
            <div class="input-field">
              <input v-model="confirmPassword" type="password" placeholder="비밀번호 확인" required>
            </div>
            
            <div class="remember-field">
               <label>
                 <input v-model="agreed" type="checkbox" required />
                 <span>(필수) 개인정보 처리방침 동의</span>
               </label>
            </div>
            
            <div class="submit-field">
              <div class="btn-background"></div>
              <input type="submit" value="회원가입">
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useToast } from 'vue-toastification';  // 👈 추가

const { login, register } = useAuth();
const toast = useToast();  // 👈 추가

const isLoginMode = ref(true);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreed = ref(false);
const rememberMe = ref(false);

onMounted(() => {
  const savedId = localStorage.getItem('rememberedId');
  if (savedId) {
    email.value = savedId;
    rememberMe.value = true;
  }
});

const setMode = (isLogin: boolean) => {
  isLoginMode.value = isLogin;
  password.value = '';
  confirmPassword.value = '';
};

const handleLogin = () => {
  login(email.value, password.value, rememberMe.value);
};

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error('비밀번호가 일치하지 않아요!', {
      icon: '😡'
    });
    return;
  }
  if (!agreed.value) {
    toast.warning('약관에 동의해주세요!', {
      icon: '⚠️'
    });
    return;
  }
  
  // 👇 await 추가!
  const success = await register(email.value, password.value);
  if (success) {
    setMode(true);
  }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #141414 0%, #000000 50%, #141414 100%);
  font-family: 'Noto Sans KR', sans-serif;
  padding: 20px;
  position: relative;
}

.background-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 20% 50%, rgba(229, 9, 20, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(229, 9, 20, 0.08) 0%, transparent 50%);
}

.auth-wrapper {
  position: relative;
  overflow: hidden;
  max-width: 420px;
  width: 100%;
  background: rgba(0, 0, 0, 0.85);
  padding: 40px 35px;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.form-header {
  display: flex;
  width: 200%;
  margin-bottom: 25px;
}

.header-title {
  width: 50%;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.5s ease-in-out;
}

.header-title.active {
  color: #E50914;
}

.tab-controls {
  position: relative;
  display: flex;
  height: 48px;
  width: 100%;
  overflow: hidden;
  margin: 25px 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.tab-controls .tab-btn {
  height: 100%;
  width: 100%;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  z-index: 1;
  transition: color 0.4s ease;
}

.tab-controls label.tab-btn {
  color: rgba(255, 255, 255, 0.6);
}

.tab-controls .active-indicator {
  position: absolute;
  height: 100%;
  width: 50%;
  left: 0;
  z-index: 0;
  border-radius: 6px;
  background: linear-gradient(90deg, #E50914 0%, #B20710 100%);
  transition: left 0.4s ease-in-out;
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
}

input[type="radio"] {
  display: none;
}

#login:checked ~ label.login,
#signup:checked ~ label.signup {
  color: #fff;
  cursor: default;
  user-select: none;
}

.forms-wrapper {
  width: 100%;
  overflow: hidden;
}

.forms-container {
  display: flex;
  width: 200%;
  transition: margin-left 0.5s ease-in-out;
}

.forms-container form {
  width: 50%;
}

.input-field {
  height: 52px;
  width: 100%;
  margin-top: 18px;
}

.input-field input {
  height: 100%;
  width: 100%;
  outline: none;
  padding: 0 18px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 15px;
  transition: all 0.3s ease;
}

.input-field input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.input-field input:focus {
  border-color: #E50914;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 10px rgba(229, 9, 20, 0.3);
}

.input-field input:focus::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.remember-field {
  margin-top: 18px;
  display: flex;
  align-items: center;
}

.remember-field label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.remember-field input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #E50914;
}

.submit-field {
  height: 52px;
  width: 100%;
  margin-top: 25px;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.btn-background {
  height: 100%;
  width: 300%;
  position: absolute;
  left: -100%;
  background: linear-gradient(90deg, 
    #E50914 0%, 
    #B20710 25%, 
    #E50914 50%, 
    #B20710 75%, 
    #E50914 100%);
  border-radius: 6px;
  transition: left 0.5s ease;
}

.submit-field:hover .btn-background {
  left: 0;
}

.submit-field input[type="submit"] {
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
  background: none;
  border: none;
  color: #fff;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.switch-text {
  text-align: center;
  margin-top: 22px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.switch-text a {
  color: #E50914;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.switch-text a:hover {
  color: #ff0a16;
  text-decoration: underline;
}

/* 반응형 */
@media (max-width: 480px) {
  .auth-wrapper {
    padding: 30px 25px;
  }
  
  .header-title {
    font-size: 26px;
  }
}
</style>