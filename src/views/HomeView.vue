<template>
  <div class="home-container">
    <h1>🔥 지금 뜨는 콘텐츠</h1>
    
    <div v-if="loading" class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i> 로딩중...
    </div>

    <div v-else class="movie-grid">
      <MovieCard 
        v-for="movie in movies" 
        :key="movie.id" 
        :movie="movie" 
        @toggle-like="toggleWishlist"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWishlist } from '@/composables/useWishlist';
import { ref, onMounted } from 'vue';
import { movieApi } from '@/api/tmdb';
import type { Movie } from '@/types';
import MovieCard from '@/components/common/MovieCard.vue'; // 컴포넌트 불러오기

const { toggleWishlist } = useWishlist();
const movies = ref<Movie[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await movieApi.getPopular();
    movies.value = response.data.results;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home-container {
  padding: 20px 4%; /* 좌우 여백 넷플릭스처럼 */
}

.movie-grid {
  display: grid;
  /* 반응형 그리드: 화면 크기에 따라 카드 개수 자동 조절 */
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px; /* 카드 사이 간격 */
  padding-bottom: 50px;
}

.loading-spinner {
  text-align: center;
  font-size: 2rem;
  margin-top: 50px;
  color: #E50914;
}

h1 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}
</style>