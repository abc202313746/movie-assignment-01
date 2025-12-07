<template>
  <div class="movie-card" @click="toggleWishlist(movie)">
    <div class="poster-wrapper">
      <img 
        :src="imageUrl" 
        :alt="movie.title" 
        loading="lazy"
      />
      <div class="wishlist-icon" :class="{ active: isLiked }">
        <i class="fas fa-heart"></i>
      </div>
    </div>
    <div class="info">
      <h3>{{ movie.title }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Movie } from '@/types';
import { movieApi } from '@/api/tmdb';
import { useWishlist } from '@/composables/useWishlist';

// 부모에게서 영화 데이터 받아오기
const props = defineProps<{
  movie: Movie;
}>();

// 찜하기 기능 가져오기
const { isInWishlist, toggleWishlist } = useWishlist();

// 이미지 URL 생성
const imageUrl = computed(() => movieApi.getImageUrl(props.movie.poster_path));

// 현재 이 영화가 찜 목록에 있는지 확인 (실시간 반응)
const isLiked = computed(() => isInWishlist(props.movie.id));
</script>

<style scoped>
.movie-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: scale(1.05); /* 과제 요구사항: 호버 확대 */
  z-index: 10;
}

.poster-wrapper {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

img {
  width: 100%;
  height: auto;
  display: block;
}

/* 하트 아이콘 스타일 */
.wishlist-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5); /* 평소엔 반투명 흰색 */
  transition: color 0.3s, transform 0.2s;
}

.wishlist-icon.active {
  color: #E50914; /* 찜하면 넷플릭스 레드! */
  transform: scale(1.2);
}

.info {
  margin-top: 8px;
  padding: 0 4px;
}

h3 {
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 제목 길면 ... 처리 */
  color: #e5e5e5;
}
</style>