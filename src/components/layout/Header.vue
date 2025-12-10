<template>
  <header :class="{ scrolled: isScrolled }">
    <nav>
      <div class="logo">
        <router-link to="/">NETFLIX</router-link>
      </div>
      
      <!-- 👇 모바일: 로그인 버튼/사용자 정보가 햄버거 왼쪽에 표시 -->
      <div class="right-menu">
        <div v-if="isLoggedIn" class="user-info">
          <span class="username">{{ currentId }}님</span>
          <button @click="logout" class="logout-btn">로그아웃</button>
        </div>
        
        <!-- 👇 데모처럼 사람 아이콘으로 변경 -->
        <router-link v-else to="/signin" class="login-btn">
          <i class="fas fa-user"></i>
          <span class="login-text">로그인</span>
        </router-link>
      </div>

      <!-- 햄버거 버튼 -->
      <button class="hamburger" @click="toggleMenu" aria-label="메뉴">
        <i class="fas fa-bars"></i>
      </button>
      
      <!-- 메뉴 (데스크탑에서 보임, 모바일에서 토글) -->
      <ul class="nav-links" :class="{ open: isMenuOpen }">
        <li><router-link to="/" @click="closeMenu">🏠 홈</router-link></li>
        <li><router-link to="/popular" @click="closeMenu">대세 콘텐츠</router-link></li>
        <li><router-link to="/search" @click="closeMenu">찾아보기</router-link></li>
        <li><router-link to="/wishlist" @click="closeMenu">내가 찜한 콘텐츠</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

const isScrolled = ref(false);
const isMenuOpen = ref(false);

const { isLoggedIn, currentId, logout } = useAuth();

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
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
  left: 0;
  right: 0;
  width: 100%;
  height: 70px;
  padding: 0 4%;
  display: flex;
  align-items: center;
  z-index: 1000;
  background: transparent;
  transition: background 0.5s ease;
  box-sizing: border-box;
}

header.scrolled {
  background: #141414;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;
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
  white-space: nowrap;
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
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.login-btn:hover {
  background-color: #b20710;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-size: 14px;
}

.username {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
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
  white-space: nowrap;
}

.logout-btn:hover {
  background: #E50914;
  border-color: #E50914;
}

.hamburger {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  transition: transform 0.3s ease;
}

.hamburger:hover {
  transform: scale(1.1);
}

/* 768px 이하 모바일 대응 */
@media (max-width: 768px) {
  header {
    height: 60px;
    padding: 10px 4%;
    background: #141414;
  }

  nav {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    flex-shrink: 0;
  }

  .logo a {
    font-size: 22px;
  }

  /* 👇 핵심: 로그인 버튼을 햄버거 왼쪽에 배치 */
  .right-menu {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  /* 👇 모바일: 아이콘만 표시 */
  .login-btn {
    padding: 8px 12px;
    font-size: 18px;
    background: transparent;
    border: 1px solid white;
  }

  .login-btn:hover {
    background: #E50914;
    border-color: #E50914;
  }

  /* "로그인" 텍스트 숨김 */
  .login-text {
    display: none;
  }

  .user-info {
    gap: 8px;
    font-size: 11px;
  }

  .username {
    max-width: 80px;
    font-size: 11px;
  }

  .logout-btn {
    padding: 4px 8px;
    font-size: 10px;
  }

  /* 햄버거 버튼 */
  .hamburger {
    display: block;
    flex-shrink: 0;
  }

  /* 데스크탑 메뉴 숨김 */
  .nav-links {
    display: none;
  }

  /* 햄버거 메뉴 열렸을 때 */
  .nav-links.open {
    display: flex;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    width: 100vw;
    background: rgba(20, 20, 20, 0.98);
    flex-direction: column;
    padding: 10px 0;
    margin: 0;
    gap: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
    border-top: 1px solid #333;
    z-index: 999;
  }

  .nav-links.open li {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #333;
  }

  .nav-links.open li:last-child {
    border-bottom: none;
  }

  .nav-links.open a {
    display: block;
    padding: 15px 20px;
    font-size: 16px;
    width: 100%;
  }
}

/* 더 작은 화면 (360px 이하) */
@media (max-width: 360px) {
  .username {
    max-width: 60px;
  }
  
  .logo a {
    font-size: 20px;
  }

  .login-btn {
    padding: 6px 10px;
    font-size: 16px;
  }
}
</style>