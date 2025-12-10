<template>
  <div class="popular-container">
    <div class="header-area">
      <h1>🔥 대세 콘텐츠</h1>
      <div class="view-toggles">
        <button 
          :class="{ active: viewMode === 'infinite' }" 
          @click="changeMode('infinite')"
        >
          <i class="fas fa-stream"></i> 무한 스크롤
        </button>
        <button 
          :class="{ active: viewMode === 'table' }" 
          @click="changeMode('table')"
        >
          <i class="fas fa-list"></i> 테이블 뷰
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'infinite'" class="infinite-view">
      <div class="movie-grid">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" @toggle-like="toggleWishlist" />
      </div>
      <div v-if="loading" class="loading-bar">
        열심히 불러오는 중... 🏃‍♂️
      </div>
    </div>

    <div v-else class="table-view">
      <div class="movie-list">
        <div v-for="(movie, index) in movies" :key="movie.id" class="list-item">
          <span class="rank">{{ (currentPage - 1) * 20 + index + 1 }}</span>
          <img :src="movieApi.getImageUrl(movie.poster_path, 'w92')" alt="poster" class="tiny-poster">
          <div class="list-info">
            <h3>{{ movie.title }}</h3>
            <p>평점 ⭐️ {{ movie.vote_average }}</p>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>
        <span class="page-num">{{ currentPage }} 페이지</span>
        <button @click="changePage(currentPage + 1)">다음</button>
      </div>
    </div>
    
    <button v-show="showTopBtn" class="top-btn" @click="scrollToTop">
      ⬆ TOP
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { movieApi } from '@/api/tmdb';
import type { Movie } from '@/types';
import MovieCard from '@/components/common/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist';

const { toggleWishlist } = useWishlist();
// 상태 관리
const viewMode = ref<'infinite' | 'table'>('infinite'); // 기본은 무한 스크롤
const movies = ref<Movie[]>([]);
const currentPage = ref(1);
const loading = ref(false);
const showTopBtn = ref(false);

// 데이터 가져오기 함수
const fetchMovies = async (page: number, append: boolean = false) => {
  if (loading.value) return;
  loading.value = true;
  
  try {
    const res = await movieApi.getPopular(page);
    if (append) {
      // 무한 스크롤이면 기존 목록 뒤에 붙이기
      movies.value = [...movies.value, ...res.data.results];
    } else {
      // 테이블 뷰면 싹 갈아엎기
      movies.value = res.data.results;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// 모드 변경 시 초기화
const changeMode = (mode: 'infinite' | 'table') => {
  viewMode.value = mode;
  currentPage.value = 1;
  movies.value = [];
  fetchMovies(1, mode === 'infinite'); // 모드에 따라 데이터 로딩 방식 다름
};

// 페이지 변경 (테이블 뷰용)
const changePage = (page: number) => {
  if (page < 1) return;
  currentPage.value = page;
  fetchMovies(page, false);
  window.scrollTo(0, 0); // 페이지 넘기면 맨 위로
};

// 무한 스크롤 이벤트 핸들러
const handleScroll = () => {
  // 맨 위로 가기 버튼 표시 여부
  showTopBtn.value = window.scrollY > 300;

  // 무한 스크롤 로직 (뷰 모드가 infinite일 때만)
  if (viewMode.value !== 'infinite' || loading.value) return;

  // 화면 바닥에 거의 닿았는지 계산
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    currentPage.value++;
    fetchMovies(currentPage.value, true);
  }
};

// 맨 위로 가기
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  fetchMovies(1, true); // 처음엔 무한 스크롤 모드로 시작
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.popular-container {
  padding: 20px 4%;
  color: white;
  min-height: 100vh;
}

.header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.view-toggles button {
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 8px 16px;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 4px;
}

.view-toggles button.active {
  background: #E50914;
  border-color: #E50914;
}

/* 무한 스크롤 그리드 */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.loading-bar {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
}

/* 테이블 뷰 스타일 */
.list-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #333;
  transition: background 0.3s;
}
.list-item:hover {
  background: #222;
}

.rank {
  font-size: 24px;
  font-weight: bold;
  width: 50px;
  color: #888;
}

.tiny-poster {
  width: 50px;
  border-radius: 4px;
  margin-right: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 20px;
}

.pagination button {
  padding: 8px 16px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 탑 버튼 */
.top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #E50914;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  z-index: 100;
}

/* 👇 맨 아래에 추가: 모바일 테이블 뷰 최적화 */
@media (max-width: 768px) {
  .popular-container {
    padding: 10px 3%; /* 전체 여백 줄임 */
  }

  .list-item {
    padding: 10px 5px; /* 리스트 내부 여백 줄임 */
  }

  .rank {
    width: 30px;      /* 순위 숫자 칸 줄임 */
    font-size: 16px;  /* 숫자 크기 줄임 */
    margin-right: 5px;
  }

  .tiny-poster {
    width: 40px;      /* 포스터 크기 조금 줄임 */
    margin-right: 10px;
  }

  .list-info h3 {
    font-size: 14px;  /* 제목 글자 크기 줄임 */
    /* 제목이 너무 길면 두 줄까지만 보여주고 ... 처리 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .list-info p {
    font-size: 12px; /* 평점 글자 줄임 */
  }
  
  /* 페이지네이션 버튼도 모바일에선 작게 */
  .pagination {
    gap: 10px;
  }
  .pagination button {
    padding: 5px 10px;
    font-size: 12px;
  }
}

</style>