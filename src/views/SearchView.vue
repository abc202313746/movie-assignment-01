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

        <!-- 👇 추가: 정렬 기능 -->
        <select v-model="sortBy" class="filter-select">
          <option value="default">정렬 안함</option>
          <option value="rating_desc">평점 높은순</option>
          <option value="rating_asc">평점 낮은순</option>
          <option value="date_desc">최신순</option>
          <option value="date_asc">오래된순</option>
        </select>

        <!-- 👇 추가: 초기화 버튼 (필수!) -->
        <button @click="resetFilters" class="reset-btn">
          🔄 초기화
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">검색 중... 🏃‍♂️</div>
    
    <div v-else-if="sortedMovies.length === 0 && searched" class="no-result">
      검색 결과가 없어요 😢
    </div>

    <div v-else class="movie-grid">
      <MovieCard 
        v-for="movie in sortedMovies" 
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
//import { useWishlist } from '@/composables/useWishlist';
import { ref, computed, onMounted } from 'vue';
import { movieApi } from '@/api/tmdb';
import type { Movie, Genre } from '@/types';
import MovieCard from '@/components/common/MovieCard.vue';
import { useWishlistStore } from '@/stores/wishlist';
const wishlistStore = useWishlistStore();
// 템플릿에서 @toggle-like="wishlistStore.toggleWishlist" 로 써도 되지만,
// 기존 코드 유지를 위해 변수에 할당
const toggleWishlist = wishlistStore.toggleWishlist;
//const { toggleWishlist } = useWishlist();
const inputRef = ref<HTMLInputElement | null>(null);
const keyword = ref('');
const recentKeywords = ref<string[]>([]);
const movies = ref<Movie[]>([]);
const genres = ref<Genre[]>([]);
const loading = ref(false);
const searched = ref(false);

// 필터 상태
const selectedGenre = ref<number | null>(null);
const minRating = ref(0);
const sortBy = ref('default'); // 👈 추가: 정렬 상태

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

const searchMovies = async () => {
  if (!keyword.value.trim()) return;
  const currentHistory = recentKeywords.value.filter(k => k !== keyword.value);
  currentHistory.unshift(keyword.value);
  if (currentHistory.length > 5) currentHistory.pop();
  
  recentKeywords.value = currentHistory;
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

const clickKeyword = (word: string) => {
  keyword.value = word;
  searchMovies();
};

const removeKeyword = (word: string) => {
  recentKeywords.value = recentKeywords.value.filter(k => k !== word);
  localStorage.setItem('searchHistory', JSON.stringify(recentKeywords.value));
};

// 👇 추가: 초기화 함수 (필수!)
const resetFilters = () => {
  selectedGenre.value = null;
  minRating.value = 0;
  sortBy.value = 'default';
};

// 1단계: 필터링
const filteredMovies = computed(() => {
  return movies.value.filter(movie => {
    const genreMatch = selectedGenre.value 
      ? movie.genre_ids.includes(selectedGenre.value) 
      : true;
      
    const ratingMatch = movie.vote_average >= minRating.value;

    return genreMatch && ratingMatch;
  });
});

// 👇 추가: 2단계 정렬
const sortedMovies = computed(() => {
  const list = [...filteredMovies.value]; // 원본 보호
  
  switch (sortBy.value) {
    case 'rating_desc':
      return list.sort((a, b) => b.vote_average - a.vote_average);
    case 'rating_asc':
      return list.sort((a, b) => a.vote_average - b.vote_average);
    case 'date_desc':
      return list.sort((a, b) => 
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    case 'date_asc':
      return list.sort((a, b) => 
        new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
      );
    default:
      return list;
  }
});
</script>

<style scoped>
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
  flex-wrap: wrap;
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
  cursor: pointer;
  transition: background 0.3s;
}

.filter-select:hover {
  background-color: #444;
}

/* 👇 추가: 초기화 버튼 스타일 */
.reset-btn {
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: #E50914;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.reset-btn:hover {
  background-color: #b20710;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  padding: 50px;
}

.no-result {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 50px;
}
</style>