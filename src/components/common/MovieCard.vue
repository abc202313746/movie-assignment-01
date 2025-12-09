<template>
  <div class="movie-card" @click="toggle">
    <div class="poster-wrapper">
      <img 
        :src="imageUrl" 
        :alt="movie.title" 
        loading="lazy"
      />
      
      <div class="overlay">
        <div class="content">
          <h4>{{ movie.title }}</h4>
          <p class="meta">
            <span>⭐️ {{ movie.vote_average.toFixed(1) }}</span>
            <span>•</span>
            <span>{{ movie.release_date.split('-')[0] }}</span>
          </p>
          <p class="overview">{{ truncatedOverview }}</p>
        </div>
      </div>

      <div class="wishlist-icon" :class="{ active: isLiked }">
        <i class="fas fa-heart"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Movie } from '@/types';
import { movieApi } from '@/api/tmdb';
import { useWishlist } from '@/composables/useWishlist';

const props = defineProps<{ movie: Movie }>();

// 이벤트 정의 (기존 유지)
const emit = defineEmits<{
  (e: 'toggle-like', movie: Movie): void
}>();

const { isInWishlist } = useWishlist();
const imageUrl = computed(() => movieApi.getImageUrl(props.movie.poster_path));
const isLiked = computed(() => isInWishlist(props.movie.id));

// 👇 추가됨: 줄거리가 너무 길면 잘라서 보여주기
const truncatedOverview = computed(() => {
  if (!props.movie.overview) return '상세 설명이 없습니다.';
  return props.movie.overview.length > 60 
    ? props.movie.overview.substring(0, 60) + '...' 
    : props.movie.overview;
});

const toggle = () => {
  emit('toggle-like', props.movie);
};
</script>

<style scoped>
.movie-card {
  position: relative;
  cursor: pointer;
  /* 호버 시 확대 효과를 위해 부모에 transition 필요 */
  transition: transform 0.3s ease, z-index 0.3s;
}

.movie-card:hover {
  transform: scale(1.1); /* 확대 효과 */
  z-index: 100; /* 다른 카드들보다 위에 뜨게 */
}

.poster-wrapper {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  aspect-ratio: 2/3; /* 포스터 비율 유지 */
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 👇 오버레이 스타일 (평소엔 안 보임) */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 15px;
  box-sizing: border-box;
}

/* 호버 했을 때 오버레이 보이기 */
.movie-card:hover .overlay {
  opacity: 1;
}

.content {
  color: white;
  text-align: left;
}

.content h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: bold;
}

.meta {
  font-size: 12px;
  color: #46d369; /* 넷플릭스 매칭률 초록색 느낌 */
  margin-bottom: 8px;
  font-weight: bold;
}

.meta span {
  margin-right: 5px;
}

.overview {
  font-size: 11px;
  color: #ddd;
  margin: 0;
  line-height: 1.4;
}

/* 하트 아이콘 */
.wishlist-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s, transform 0.2s;
  z-index: 101; /* 오버레이보다 위에 */
}

.wishlist-icon.active {
  color: #E50914;
  transform: scale(1.2);
}
</style>