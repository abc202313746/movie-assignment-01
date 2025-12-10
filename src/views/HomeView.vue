<template>
  <div class="home-container">
    <section class="movie-section">
      <h2>🔥 지금 뜨는 콘텐츠</h2>
      <div v-if="loadingPopular" class="loading">로딩중...</div>
      <div v-else class="movie-row">
        <MovieCard 
          v-for="movie in popularMovies.slice(0, 6)" 
          :key="movie.id" 
          :movie="movie" 
          @toggle-like="toggleWishlist"
        />
      </div>
    </section>

    <section class="movie-section">
      <h2>🎬 현재 상영 중</h2>
      <div v-if="loadingNowPlaying" class="loading">로딩중...</div>
      <div v-else class="movie-row">
        <MovieCard 
          v-for="movie in nowPlayingMovies.slice(0, 6)" 
          :key="movie.id" 
          :movie="movie" 
          @toggle-like="toggleWishlist"
        />
      </div>
    </section>

    <section class="movie-section">
      <h2>⭐️ 평점 높은 영화</h2>
      <div v-if="loadingTopRated" class="loading">로딩중...</div>
      <div v-else class="movie-row">
        <MovieCard 
          v-for="movie in topRatedMovies.slice(0, 6)" 
          :key="movie.id" 
          :movie="movie" 
          @toggle-like="toggleWishlist"
        />
      </div>
    </section>

    <section class="movie-section">
      <h2>📅 곧 개봉해요</h2>
      <div v-if="loadingUpcoming" class="loading">로딩중...</div>
      <div v-else class="movie-row">
        <MovieCard 
          v-for="movie in upcomingMovies.slice(0, 6)" 
          :key="movie.id" 
          :movie="movie" 
          @toggle-like="toggleWishlist"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useWishlist } from '@/composables/useWishlist';
import { ref, onMounted } from 'vue';
import { movieApi } from '@/api/tmdb';
import type { Movie } from '@/types';
import MovieCard from '@/components/common/MovieCard.vue';

const { toggleWishlist } = useWishlist();

// 4개의 다른 API 결과를 위한 변수들
const popularMovies = ref<Movie[]>([]);
const nowPlayingMovies = ref<Movie[]>([]);
const topRatedMovies = ref<Movie[]>([]);
const upcomingMovies = ref<Movie[]>([]);

const loadingPopular = ref(true);
const loadingNowPlaying = ref(true);
const loadingTopRated = ref(true);
const loadingUpcoming = ref(true);

onMounted(async () => {
  // Promise.all을 사용하면 4개의 API를 동시에 호출하여 로딩 시간을 줄일 수 있지만, 
  // 과제 요건에 맞게 명확히 분리하여 순차적으로 호출합니다.

  // API 1: 인기 영화
  try {
    const res = await movieApi.getPopular();
    popularMovies.value = res.data.results;
  } catch (error) {
    console.error('인기 영화 로딩 실패:', error);
  } finally {
    loadingPopular.value = false;
  }

  // API 2: 현재 상영 중
  try {
    const res = await movieApi.getNowPlaying();
    nowPlayingMovies.value = res.data.results;
  } catch (error) {
    console.error('상영 중 영화 로딩 실패:', error);
  } finally {
    loadingNowPlaying.value = false;
  }

  // API 3: 평점 높은 영화
  try {
    const res = await movieApi.getTopRated();
    topRatedMovies.value = res.data.results;
  } catch (error) {
    console.error('평점 높은 영화 로딩 실패:', error);
  } finally {
    loadingTopRated.value = false;
  }

  // API 4: 개봉 예정
  try {
    const res = await movieApi.getUpcoming();
    upcomingMovies.value = res.data.results;
  } catch (error) {
    console.error('개봉 예정 영화 로딩 실패:', error);
  } finally {
    loadingUpcoming.value = false;
  }
});
</script>

<style scoped>
.home-container {
  padding: 80px 4% 20px 4%; /* 헤더 때문에 상단 여백 추가 */
  min-height: 100vh;
}

.movie-section {
  margin-bottom: 40px;
}

.movie-section h2 {
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
}

.movie-row {
  display: grid;
  /* 모바일 반응형에 맞게 180px 대신 150px로 조정 */
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
  gap: 20px;
}

.loading {
  text-align: center;
  color: #888;
  padding: 20px;
}

/* 768px 이하 모바일 화면 대응 */
@media (max-width: 768px) {
  .home-container {
    padding-top: 100px; /* 헤더 높이만큼 여백 확보 */
    padding-left: 5%;
    padding-right: 5%;
  }
  .movie-row {
    /* 모바일에서는 더 작게 보이도록 minmax 값 조정 */
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); 
    gap: 10px;
  }
  .movie-section h2 {
    font-size: 1.2rem;
  }
}
</style>