<template>
  <div class="home-container">
    <h1>🔥 지금 뜨는 콘텐츠</h1>
    
    <div v-if="loading" class="loading">
      열심히 영화 가져오는 중... 🏃‍♂️
    </div>

    <div v-else class="movie-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <div class="poster-wrapper">
          <img 
            :src="movieApi.getImageUrl(movie.poster_path)" 
            :alt="movie.title" 
            loading="lazy"
          />
        </div>
        <h3>{{ movie.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { movieApi } from '../api/tmdb';
import type { Movie } from '../types';

const movies = ref<Movie[]>([]);
const loading = ref(true);

// 컴포넌트가 화면에 뜨자마자 실행됨
onMounted(async () => {
  try {
    const response = await movieApi.getPopular();
    movies.value = response.data.results;
    console.log('영화 데이터 도착! 📦', movies.value);
  } catch (error) {
    console.error('으악! 영화 못 가져옴 😱', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home-container {
  padding: 20px;
  color: white;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie-card {
  text-align: center;
}

.poster-wrapper {
  overflow: hidden;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.poster-wrapper:hover {
  transform: scale(1.05); /* 과제 요구사항: 호버 시 확대 */
  cursor: pointer;
}

img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>