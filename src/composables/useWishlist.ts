import { ref } from 'vue';
import type { Movie } from '../types';

// 로컬 스토리지 키 이름 (과제 요건: 키 이름 규칙 준수)
const WISHLIST_KEY = 'movieWishlist';

// 전역 상태처럼 쓰기 위해 함수 밖에서 선언 (state management)
const wishlist = ref<Movie[]>([]);

// 초기화: 저장된 데이터 불러오기
const initWishlist = () => {
  const stored = localStorage.getItem(WISHLIST_KEY);
  if (stored) {
    wishlist.value = JSON.parse(stored);
  }
};

initWishlist(); // 파일 로드될 때 딱 한 번 실행

export function useWishlist() {
  
  // 찜 목록에 있는지 확인하는 함수
  const isInWishlist = (movieId: number) => {
    return wishlist.value.some(m => m.id === movieId);
  };

  // 찜하기 토글 (있으면 삭제, 없으면 추가) [cite: 310, 311]
  const toggleWishlist = (movie: Movie) => {
    const index = wishlist.value.findIndex(m => m.id === movie.id);
    
    if (index === -1) {
      // 없으면 추가
      wishlist.value.push(movie);
      // alert는 촌스러우니까 나중에 Toast로 바꾸면 가산점! 일단 콘솔로 확인
      console.log('찜 추가 완료! 💕'); 
    } else {
      // 있으면 삭제
      wishlist.value.splice(index, 1);
      console.log('찜 삭제 ㅠㅠ 💔');
    }
    
    // 변경될 때마다 로컬 스토리지에 자동 저장 
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist.value));
  };

  return {
    wishlist,
    isInWishlist,
    toggleWishlist
  };
}