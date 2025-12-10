// src/stores/wishlist.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Movie } from '@/types';


export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const wishlist = ref<Movie[]>([]);

  // 초기화 (로컬 스토리지에서 불러오기)
  const initWishlist = () => {
    const stored = localStorage.getItem('movieWishlist');
    if (stored) {
      wishlist.value = JSON.parse(stored);
    }
  };

  // 👇 Getters: 인자가 필요하면 일반 '함수'로 정의합니다.
  const isInWishlist = (movieId: number) => {
    return wishlist.value.some(m => m.id === movieId);
  };
  
  // Actions
  const toggleWishlist = (movie: Movie) => {
    const index = wishlist.value.findIndex(m => m.id === movie.id);
    
    if (index === -1) {
      wishlist.value.push(movie);
    } else {
      wishlist.value.splice(index, 1);
    }
    
    // 저장
    localStorage.setItem('movieWishlist', JSON.stringify(wishlist.value));
  };

  initWishlist();

  // return에서 함수를 내보냄
  return { wishlist, isInWishlist, toggleWishlist };
});