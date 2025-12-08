import axios from 'axios';
import type { MovieResponse, GenreResponse } from '../types';

// 1. Axios 인스턴스 생성 (공통 설정)
const tmdbApi = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}` // (선택) v4 auth key 있다면 사용
  },
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY, // v3 key 사용 시
    language: 'ko-KR', // 한국어 데이터 주세요
  }
});

// 2. API 요청 함수들 정의
export const movieApi = {
  // 인기 영화 목록 가져오기
  getPopular: (page = 1) => 
    tmdbApi.get<MovieResponse>('/movie/popular', { params: { page } }),
  
  // 현재 상영작
  getNowPlaying: (page = 1) => 
    tmdbApi.get<MovieResponse>('/movie/now_playing', { params: { page } }),
  
  // 영화 검색
  search: (query: string, page = 1) => 
    tmdbApi.get<MovieResponse>('/search/movie', { params: { query, page } }),

  getGenres: () => 
    tmdbApi.get<GenreResponse>('/genre/movie/list'),
  
  // 영화 상세 정보 (이미지 경로 생성용 헬퍼 함수)
  getImageUrl: (path: string | null, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';
  }
};

export default tmdbApi;