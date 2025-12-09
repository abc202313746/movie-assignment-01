<template>
  <div class="search-container">
    <div class="search-header">
      <h1>🔍 영화 찾아보기</h1>
      <div class="controls">
        <input 
          ref="inputRef" 
          v-model="keyword" 
          @keyup.enter="searchMovies"
          type="text" 
          placeholder="영화 제목을 검색해보세요..." 
          class="search-input"
        />
        
        <select v-model="selectedGenre" class="filter-select">
          <option :value="null">모든 장르</option>
          <option v-for="g in genres" :key="g.id" :value="g.id">
            {{ g.name }}
          </option>
        </select>

        <select v-model="minRating" class="filter-select">
          <option :value="0">모든 평점</option>
          <option :value="5">⭐️ 5점 이상</option>
          <option :value="7">⭐️ 7점 이상</option>
          <option :value="9">⭐️ 9점 이상</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">검색 중... 🏃‍♂️</div>
    
    <div v-else-if="filteredMovies.length === 0 && searched" class="no-result">
      검색 결과가 없어요 😢
    </div>

    <div v-else class="movie-grid">
      <MovieCard 
        v-for="movie in filteredMovies" 
        :key="movie.id" 
        :movie="movie" 
        @toggle-like="toggleWishlist"
      />

      <div v-if="recentKeywords.length > 0" class="history-area">
        <span class="history-label">최근 검색어:</span>
        <div class="history-tags">
          <span 
            v-for="word in recentKeywords" 
            :key="word" 
            class="tag"
          >
            <span @click="clickKeyword(word)">{{ word }}</span>
            <button @click.stop="removeKeyword(word)" class="del-btn">x</button>
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useWishlist } from '@/composables/useWishlist';
import { ref, computed, onMounted, watch } from 'vue';
import { movieApi } from '@/api/tmdb';
import type { Movie, Genre } from '@/types';
import MovieCard from '@/components/common/MovieCard.vue';

const { toggleWishlist } = useWishlist();
const inputRef = ref<HTMLInputElement | null>(null);
const keyword = ref('');
const recentKeywords = ref<string[]>([]);
const movies = ref<Movie[]>([]);
const genres = ref<Genre[]>([]);
const loading = ref(false);
const searched = ref(false); // 검색을 한번이라도 했는지 체크

// 필터 상태
const selectedGenre = ref<number | null>(null);
const minRating = ref(0);

// 초기화: 장르 목록 미리 가져오기
onMounted(async () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
  const stored = localStorage.getItem('searchHistory');
  if (stored) {
    recentKeywords.value = JSON.parse(stored);
  }
  try {
    const res = await movieApi.getGenres();
    genres.value = res.data.genres;
  } catch (e) {
    console.error('장르 로딩 실패', e);
  }
});

// 영화 검색 함수
const searchMovies = async () => {
  if (!keyword.value.trim()) return;
  // (1) 기록에 추가 (중복 제거 & 최신순 정렬)
  const currentHistory = recentKeywords.value.filter(k => k !== keyword.value);
  currentHistory.unshift(keyword.value);
  // (2) 최대 5개까지만 유지
  if (currentHistory.length > 5) currentHistory.pop();
  
  recentKeywords.value = currentHistory;
  
  // (3) 로컬 스토리지에 저장 (JSON 형식)
  localStorage.setItem('searchHistory', JSON.stringify(recentKeywords.value));
  loading.value = true;
  searched.value = true;
  
  try {
    const res = await movieApi.search(keyword.value);
    movies.value = res.data.results;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// 👇 4. 최근 검색어 클릭 시 검색 실행 기능
const clickKeyword = (word: string) => {
  keyword.value = word;
  searchMovies();
};

// 👇 5. 기록 삭제 기능 (보너스)
const removeKeyword = (word: string) => {
  recentKeywords.value = recentKeywords.value.filter(k => k !== word);
  localStorage.setItem('searchHistory', JSON.stringify(recentKeywords.value));
};

// 핵심: 받아온 영화 목록을 필터링하는 Computed 속성 
const filteredMovies = computed(() => {
  return movies.value.filter(movie => {
    // 1. 장르 필터
    const genreMatch = selectedGenre.value 
      ? movie.genre_ids.includes(selectedGenre.value) 
      : true;
      
    // 2. 평점 필터
    const ratingMatch = movie.vote_average >= minRating.value;

    return genreMatch && ratingMatch;
  });
});
</script>

<style scoped>
  /* 👇 7. 스타일 추가 */
.history-area {
  margin-top: 15px;
  font-size: 14px;
  color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.history-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background-color: #333;
  padding: 4px 10px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.tag:hover {
  background-color: #555;
}

.del-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
}
.del-btn:hover {
  color: #E50914;
}
.search-container {
  padding: 20px 4%;
  color: white;
}

.search-header {
  margin-bottom: 30px;
  text-align: center;
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap; /* 모바일 대응 */
}

.search-input {
  padding: 10px 20px;
  width: 300px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
}

.filter-select {
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #333;
  color: white;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.no-result {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 50px;
}
</style>