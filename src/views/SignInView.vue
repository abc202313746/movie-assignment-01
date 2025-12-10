<template>
  <div class="auth-container">
    <div class="background-overlay"></div>

    <div class="wrapper">
      <div class="title-text">
        <div class="title login" :class="{ active: isLoginMode }">Login Form</div>
        <div class="title signup" :class="{ active: !isLoginMode }">Signup Form</div>
      </div>
      
      <div class="slide-controls">
        <input type="radio" name="slide" id="login" :checked="isLoginMode" @change="setMode(true)">
        <input type="radio" name="slide" id="signup" :checked="!isLoginMode" @change="setMode(false)">
        <label for="login" class="slide login" @click="setMode(true)">Login</label>
        <label for="signup" class="slide signup" @click="setMode(false)">Signup</label>
        <div class="slider-tab" :style="{ left: isLoginMode ? '0%' : '50%' }"></div>
      </div>

      <div class="form-container">
        <div class="form-inner" :style="{ marginLeft: isLoginMode ? '0%' : '-100%' }">
          
          <form @submit.prevent="handleLogin" class="login">
            <div class="field">
              <input v-model="email" type="email" placeholder="Email Address" required>
            </div>
            <div class="field">
              <input v-model="password" type="password" placeholder="Password (API Key)" required>
            </div>
            
            <div class="field checkbox-field">
              <label>
                <input v-model="rememberMe" type="checkbox" />
                <span>아이디 기억하기</span>
              </label>
            </div>

            <div class="field btn">
              <div class="btn-layer"></div>
              <input type="submit" value="Login">
            </div>
            <div class="signup-link">
              Not a member? <a href="#" @click.prevent="setMode(false)">Signup now</a>
            </div>
          </form>

          <form @submit.prevent="handleRegister" class="signup">
            <div class="field">
              <input v-model="email" type="email" placeholder="Email Address" required>
            </div>
            <div class="field">
              <input v-model="password" type="password" placeholder="Password (API Key)" required>
            </div>
            <div class="field">
              <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required>
            </div>
            
            <div class="field checkbox-field">
               <label>
                 <input v-model="agreed" type="checkbox" required />
                 <span>(필수) 개인정보 처리방침 동의</span>
               </label>
            </div>
            
            <div class="field btn">
              <div class="btn-layer"></div>
              <input type="submit" value="Signup">
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

const { login, register } = useAuth();

const isLoginMode = ref(true);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreed = ref(false);
const rememberMe = ref(false); // 👇 변수 추가

// 👇 초기화: 저장된 아이디 불러오기 (필수 기능 복구!)
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
  // 👇 로그인 시 rememberMe 상태 전달
  login(email.value, password.value, rememberMe.value);
};

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않아요! 😡');
    return;
  }
  if (!agreed.value) {
    alert('약관에 동의해주세요!');
    return;
  }
  const success = register(email.value, password.value);
  if (success) {
    setMode(true);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(-135deg, #c850c0, #4158d0);
  font-family: 'Poppins', sans-serif;
  padding: 15px;
}
.wrapper {
  overflow: hidden;
  max-width: 390px;
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 15px 20px rgba(0,0,0,0.1);
}
.wrapper .title-text { display: flex; width: 200%; }
.wrapper .title { width: 50%; font-size: 35px; font-weight: 600; text-align: center; transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.slide-controls { position: relative; display: flex; height: 50px; width: 100%; overflow: hidden; margin: 30px 0 10px 0; justify-content: space-between; border: 1px solid lightgrey; border-radius: 15px; }
.slide-controls .slide { height: 100%; width: 100%; color: #fff; font-size: 18px; font-weight: 500; text-align: center; line-height: 48px; cursor: pointer; z-index: 1; transition: all 0.6s ease; }
.slide-controls label.slide { color: #000; }
.slide-controls .slider-tab { position: absolute; height: 100%; width: 50%; left: 0; z-index: 0; border-radius: 15px; background: -webkit-linear-gradient(left, #a445b2, #fa4299); transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
input[type="radio"] { display: none; }
#login:checked ~ label.login { color: #fff; cursor: default; user-select: none; }
#signup:checked ~ label.signup { color: #fff; cursor: default; user-select: none; }
#login:checked ~ .slider-tab { left: 0%; }
#signup:checked ~ .slider-tab { left: 50%; }
.form-container { width: 100%; overflow: hidden; }
.form-container .form-inner { display: flex; width: 200%; }
.form-container .form-inner form { width: 50%; transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.field { height: 50px; width: 100%; margin-top: 20px; }
.field input { height: 100%; width: 100%; outline: none; padding-left: 15px; border-radius: 15px; border: 1px solid lightgrey; border-bottom-width: 2px; font-size: 17px; transition: all 0.3s ease; }
.field input:focus, .field input:valid { border-color: #fa4299; }
.pass-link { margin-top: 5px; }
.pass-link a, .signup-link a { color: #fa4299; text-decoration: none; }
.pass-link a:hover, .signup-link a:hover { text-decoration: underline; }
.signup-link { text-align: center; margin-top: 20px; }
.btn { height: 50px; width: 100%; border-radius: 15px; position: relative; overflow: hidden; }
.btn .btn-layer { height: 100%; width: 300%; position: absolute; left: -100%; background: -webkit-linear-gradient(right, #a445b2, #fa4299, #a445b2, #fa4299); border-radius: 15px; transition: all 0.4s ease; }
.btn:hover .btn-layer { left: 0; }
.btn input[type="submit"] { height: 100%; width: 100%; z-index: 1; position: relative; background: none; border: none; color: #fff; padding-left: 0; border-radius: 15px; font-size: 20px; font-weight: 500; cursor: pointer; }

/* 👇 추가된 체크박스 스타일 (높이 문제 해결) */
.checkbox-field {
  height: auto;
  display: flex;
  align-items: center;
  margin-top: 15px;
  font-size: 14px;
}
.checkbox-field label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
}
.checkbox-field input {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  accent-color: #fa4299; /* 체크박스 색상 맞춤 */
}
</style>