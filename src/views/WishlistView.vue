<template>
  <div class="wishlist-container">
    <h1>💖 내가 찜한 콘텐츠</h1>

    <div v-if="wishlist.length === 0" class="empty-state">
      <div class="icon">😢</div>
      <p>아직 찜한 콘텐츠가 없어요!</p>
      <router-link to="/" class="go-home-btn">콘텐츠 구경하러 가기</router-link>
    </div>

    <div v-else class="movie-grid">
      <MovieCard 
        v-for="movie in wishlist" 
        :key="movie.id" 
        :movie="movie" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWishlist } from '@/composables/useWishlist';
import MovieCard from '@/components/common/MovieCard.vue';


const { wishlist } = useWishlist();
</script>

<style scoped>
.wishlist-container {
  padding: 20px 4%;
  color: white;
  min-height: 80vh; /* 컨텐츠 없어도 화면 꽉 차게 */
}

h1 {
  margin-bottom: 30px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

/* 텅 비었을 때 스타일 */
.empty-state {
  text-align: center;
  margin-top: 100px;
  color: #808080;
}

.empty-state .icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.go-home-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #E50914;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}
.go-home-btn:hover {
  background-color: #f40612;
}
</style>