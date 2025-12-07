<template>
  <div class="app-container">
    <Header />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './components/layout/Header.vue';
</script>

<style>
/* 전역 스타일: 배경 검은색으로 */
body {
  margin: 0;
  padding: 0;
  background-color: #141414;
  color: white;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 페이지 전환 애니메이션 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

main {
  padding-top: 80px; /* 헤더에 가려지지 않게 여백 */
}
</style>