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
        <router-link to="/signin" class="login-btn">로그인</router-link>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);

// 스크롤 감지해서 헤더 색깔 바꾸기 (과제 요구사항: 애니메이션 필수 [cite: 319])
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
</style>