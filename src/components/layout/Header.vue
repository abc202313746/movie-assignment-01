<template>
  <header :class="{ scrolled: isScrolled }">
    <nav>
      <div class="logo">
        <router-link to="/">NETFLIX</router-link>
      </div>
      
      <ul class="nav-links">
        <li><router-link to="/popular">대세 콘텐츠</router-link></li>
        <li><router-link to="/search">찾아보기</router-link></li>
        <li><router-link to="/wishlist">내가 찜한 콘텐츠</router-link></li>
      </ul>

      <div class="right-menu">
        <div v-if="isLoggedIn" class="user-info">
          <span class="username">{{ currentId }}님</span>
          <button @click="logout" class="logout-btn">로그아웃</button>
        </div>
        
        <router-link v-else to="/signin" class="login-btn">로그인</router-link>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from '@/composables/useAuth'; // 훅 가져오기

const isScrolled = ref(false);

// Auth 기능 연결
const { isLoggedIn, currentId, logout } = useAuth();

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  padding: 0 4%;
  display: flex;
  align-items: center;
  z-index: 1000;
  background: transparent; /* 처음엔 투명 */
  transition: background 0.5s ease; /* 부드럽게 변하는 애니메이션 */
}

/* 스크롤 내렸을 때 적용될 스타일 */
header.scrolled {
  background: #141414;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo a {
  font-size: 30px;
  font-weight: bold;
  color: #E50914; /* 넷플릭스 레드 */
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
  margin-left: 30px;
}

.nav-links a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #b3b3b3;
}

.login-btn {
  background-color: #E50914;
  color: white;
  padding: 7px 17px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-size: 15px;
}
header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  padding: 0 4%;
  display: flex;
  align-items: center;
  z-index: 1000;
  background: transparent;
  transition: background 0.5s ease;
}

header.scrolled {
  background: #141414;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo a {
  font-size: 30px;
  font-weight: bold;
  color: #E50914;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
  margin-left: 30px;
}

.nav-links a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #b3b3b3;
}

.login-btn {
  background-color: #E50914;
  color: white;
  padding: 7px 17px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-size: 15px;
}

/* 👇 추가된 스타일: 유저 정보 및 로그아웃 버튼 */
.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-size: 14px;
}

.username {
  font-weight: bold;
}

.logout-btn {
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}

.logout-btn:hover {
  background: #E50914;
  border-color: #E50914;
}

@media (max-width: 768px) {
  header {
    height: auto; /* 높이 자동 조절 */
    padding: 10px 4%;
    background: #141414; /* 모바일에선 가독성을 위해 배경색 고정 */
  }

  nav {
    flex-direction: column; /* 세로로 쌓기 */
    gap: 15px;
  }

  .nav-links {
    margin-left: 0;
    gap: 15px; /* 간격 줄이기 */
    flex-wrap: wrap; /* 줄바꿈 허용 */
    justify-content: center;
    padding: 0; /* 패딩 초기화 */
  }
  
  .logo a {
    font-size: 24px; /* 로고 크기 살짝 줄이기 */
  }
  
  .right-menu {
    margin-top: 5px;
    margin-bottom: 10px;
  }
  header { height: auto; padding: 10px 4%; background: #141414; }
  nav { flex-direction: column; gap: 15px; }
  .nav-links { margin-left: 0; gap: 15px; flex-wrap: wrap; justify-content: center; padding: 0; }
  .logo a { font-size: 24px; }
  .right-menu { margin-top: 5px; margin-bottom: 10px; }
}

</style>