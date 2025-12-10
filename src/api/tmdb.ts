import axios from 'axios';
import type { MovieResponse, GenreResponse } from '../types';

// 👇 동적으로 API Key 가져오기
const getApiKey = () => {
  return localStorage.getItem('TMDb-Key') || import.meta.env.VITE_TMDB_API_KEY;
};

// 1. Axios 인스턴스 생성 (공통 설정)
const tmdbApi = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  headers: {
    accept: 'application/json',
  },
  params: {
    language: 'ko-KR',
  }
});

// 👇 요청 인터셉터: 매 요청마다 동적으로 API Key 추가
tmdbApi.interceptors.request.use((config) => {
  const apiKey = getApiKey();
  
  // Authorization 헤더 추가 (Bearer 토큰 방식)
  config.headers.Authorization = `Bearer ${apiKey}`;
  
  // api_key 파라미터 추가 (v3 방식)
  config.params = {
    ...config.params,
    api_key: apiKey
  };
  
  return config;
});

// 2. API 요청 함수들 정의
export const movieApi = {
  getPopular: (page = 1) => 
    tmdbApi.get<MovieResponse>('/movie/popular', { params: { page } }),
  
  getNowPlaying: (page = 1) => 
    tmdbApi.get<MovieResponse>('/movie/now_playing', { params: { page } }),
  
  getTopRated: (page = 1) =>
    tmdbApi.get<MovieResponse>('/movie/top_rated', { params: { page } }),

  getUpcoming: (page = 1) =>
    tmdbApi.get<MovieResponse>('/movie/upcoming', { params: { page } }),
  
  search: (query: string, page = 1) => 
    tmdbApi.get<MovieResponse>('/search/movie', { params: { query, page } }),

  getGenres: () => 
    tmdbApi.get<GenreResponse>('/genre/movie/list'),
  
  getImageUrl: (path: string | null, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';
  }
};

export default tmdbApi;