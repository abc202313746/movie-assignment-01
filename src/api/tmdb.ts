/**
 * @fileoverview TMDB (The Movie Database) API 통신 모듈
 * @description 
 * Axios 인스턴스 기반의 TMDB API 호출 함수 모음.
 * 사용자별 API Key를 동적으로 주입하여 인증된 요청을 수행합니다.
 * 
 * @author 인숙영 (202313746)
 * @module api/tmdb
 * @requires axios
 * @requires @/types
 * 
 * @see {@link https://developers.themoviedb.org/3|TMDB API v3 Documentation}
 */

import axios from 'axios';
import type { MovieResponse, GenreResponse } from '../types';

/**
 * 동적으로 API Key를 가져오는 헬퍼 함수
 * 
 * @function getApiKey
 * @returns {string} 로컬 스토리지의 사용자 API Key 또는 환경변수의 기본 Key
 * 
 * @description 
 * API Key 우선순위:
 * 1. localStorage의 'TMDb-Key' (사용자가 회원가입 시 입력한 유효한 Key)
 * 2. 환경변수 VITE_TMDB_API_KEY (개발용 폴백 Key)
 * 
 * 로그인/로그아웃 시에도 항상 최신 Key를 가져오도록 동적으로 호출됩니다.
 * 
 * @example
 * // 로그인한 사용자의 경우
 * const apiKey = getApiKey();
 * // 반환: "eyJhbGciOiJIUzI1NiJ9..." (유저의 실제 TMDB API Key)
 * 
 * @example
 * // 비로그인 상태 (개발 모드)
 * const apiKey = getApiKey();
 * // 반환: "default_dev_key..." (환경변수의 Key)
 */
const getApiKey = (): string => {
  return localStorage.getItem('TMDb-Key') || import.meta.env.VITE_TMDB_API_KEY;
};

/**
 * TMDB API용 Axios 인스턴스
 * 
 * @constant {import('axios').AxiosInstance} tmdbApi
 * @description 
 * TMDB API v3와 통신하기 위한 사전 설정된 Axios 인스턴스.
 * 
 * **기본 설정:**
 * - Base URL: TMDB API v3 엔드포인트 (환경변수)
 * - 기본 헤더: application/json
 * - 기본 파라미터: 한국어(ko-KR) 설정
 * - Request Interceptor: 모든 요청에 동적으로 API Key 주입
 * 
 * **인증 방식:**
 * - Authorization 헤더: Bearer Token
 * - Query Parameter: api_key (v3 호환성)
 * 
 * @see {@link https://axios-http.com/docs/instance|Axios Instance}
 */
const tmdbApi = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  headers: {
    accept: 'application/json',
  },
  params: {
    language: 'ko-KR',
  }
});

/**
 * 요청 인터셉터: 모든 API 호출 전에 인증 정보 자동 주입
 * 
 * @description
 * **처리 내용:**
 * 1. localStorage에서 최신 API Key를 동적으로 가져옴
 * 2. Authorization 헤더에 Bearer 토큰 방식으로 추가
 * 3. Query Parameter에도 api_key 추가 (v3 API 호환성)
 * 
 * **동작 시점:**
 * - 매 요청마다 실행되어 최신 인증 정보 반영
 * - 로그인/로그아웃 후에도 별도 설정 없이 자동 적용
 * 
 * **에러 처리:**
 * - API Key가 없거나 유효하지 않으면 TMDB에서 401 에러 반환
 * 
 * @param {import('axios').InternalAxiosRequestConfig} config - Axios 요청 설정 객체
 * @returns {import('axios').InternalAxiosRequestConfig} 인증 정보가 추가된 설정 객체
 */
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

/**
 * TMDB API 호출 함수 모음
 * 
 * @namespace movieApi
 * @description 
 * 영화 정보 조회, 검색, 이미지 URL 생성 등을 위한 헬퍼 함수들.
 * 모든 함수는 타입 안정성을 위해 TypeScript Generic을 활용합니다.
 */
export const movieApi = {
  /**
   * 인기 영화 목록 조회
   * 
   * @function getPopular
   * @memberof movieApi
   * @param {number} [page=1] - 페이지 번호 (기본값: 1, 최소: 1, 최대: 500)
   * @returns {Promise<import('axios').AxiosResponse<MovieResponse>>} 영화 목록 응답
   * @throws {import('axios').AxiosError} API 호출 실패 시 (401: 인증 실패, 404: 리소스 없음)
   * 
   * @description
   * TMDB의 인기도(popularity) 기준으로 정렬된 영화 목록을 반환합니다.
   * - 매일 업데이트됨
   * - 한 페이지당 최대 20개 결과 반환
   * 
   * @example
   * // 1페이지 조회
   * try {
   *   const response = await movieApi.getPopular(1);
   *   console.log(response.data.results); // Movie[] 배열 (최대 20개)
   *   console.log(response.data.total_pages); // 전체 페이지 수
   * } catch (error) {
   *   console.error('인기 영화 조회 실패:', error);
   * }
   * 
   * @example
   * // 2페이지 조회 (21~40번째 영화)
   * const nextPage = await movieApi.getPopular(2);
   */
  getPopular: (page = 1) => 
    tmdbApi.get<MovieResponse>('/movie/popular', { params: { page } }),
  
  /**
   * 현재 상영 중인 영화 목록 조회
   * 
   * @function getNowPlaying
   * @memberof movieApi
   * @param {number} [page=1] - 페이지 번호
   * @returns {Promise<import('axios').AxiosResponse<MovieResponse>>}
   * 
   * @description 
   * 현재 극장에서 상영 중인 영화 리스트를 반환합니다.
   * - 지역별로 다를 수 있음 (언어 설정: ko-KR)
   * - 개봉일 기준 현재 상영 중인 작품
   * 
   * @example
   * const nowPlaying = await movieApi.getNowPlaying();
   * nowPlaying.data.results.forEach(movie => {
   *   console.log(`${movie.title} - 개봉일: ${movie.release_date}`);
   * });
   */
  getNowPlaying: (page = 1) => 
    tmdbApi.get<MovieResponse>('/movie/now_playing', { params: { page } }),
  
  /**
   * 평점 높은 영화 목록 조회
   * 
   * @function getTopRated
   * @memberof movieApi
   * @param {number} [page=1] - 페이지 번호
   * @returns {Promise<import('axios').AxiosResponse<MovieResponse>>}
   * 
   * @description 
   * TMDB 사용자 평점 기준 상위 영화를 반환합니다.
   * - 최소 평가 수 이상의 영화만 포함
   * - vote_average 기준 정렬
   * 
   * @example
   * const topRated = await movieApi.getTopRated();
   * const bestMovie = topRated.data.results[0];
   * console.log(`최고 평점 영화: ${bestMovie.title} (${bestMovie.vote_average}/10)`);
   */
  getTopRated: (page = 1) =>
    tmdbApi.get<MovieResponse>('/movie/top_rated', { params: { page } }),

  /**
   * 개봉 예정 영화 목록 조회
   * 
   * @function getUpcoming
   * @memberof movieApi
   * @param {number} [page=1] - 페이지 번호
   * @returns {Promise<import('axios').AxiosResponse<MovieResponse>>}
   * 
   * @description 
   * 향후 개봉 예정인 영화 리스트를 반환합니다.
   * - 개봉일(release_date) 기준 미래의 영화
   * - 지역별 개봉일이 다를 수 있음
   * 
   * @example
   * const upcoming = await movieApi.getUpcoming();
   * console.log('곧 개봉할 영화들:');
   * upcoming.data.results.forEach(movie => {
   *   console.log(`- ${movie.title} (${movie.release_date})`);
   * });
   */
  getUpcoming: (page = 1) =>
    tmdbApi.get<MovieResponse>('/movie/upcoming', { params: { page } }),
  
  /**
   * 영화 제목 검색
   * 
   * @function search
   * @memberof movieApi
   * @param {string} query - 검색어 (영화 제목, 최소 1자 이상)
   * @param {number} [page=1] - 페이지 번호
   * @returns {Promise<import('axios').AxiosResponse<MovieResponse>>}
   * @throws {Error} 빈 검색어 입력 시
   * 
   * @description
   * 영화 제목을 기반으로 검색합니다.
   * - 부분 일치 검색 지원
   * - 대소문자 구분 없음
   * - 한글/영문 모두 검색 가능
   * 
   * @example
   * // "어벤져스" 검색
   * const results = await movieApi.search('어벤져스');
   * if (results.data.results.length > 0) {
   *   results.data.results.forEach(movie => {
   *     console.log(`${movie.title} (${movie.release_date.split('-')[0]})`);
   *   });
   * } else {
   *   console.log('검색 결과가 없습니다.');
   * }
   * 
   * @example
   * // 영어 제목 검색
   * const avengers = await movieApi.search('Avengers', 1);
   * console.log(`총 ${avengers.data.total_results}개 결과 발견`);
   */
  search: (query: string, page = 1) => 
    tmdbApi.get<MovieResponse>('/search/movie', { params: { query, page } }),

  /**
   * 영화 장르 목록 조회
   * 
   * @function getGenres
   * @memberof movieApi
   * @returns {Promise<import('axios').AxiosResponse<GenreResponse>>}
   * 
   * @description 
   * TMDB의 모든 영화 장르 리스트를 반환합니다.
   * - 장르 ID와 이름(한글) 매핑
   * - 필터링 UI 구성 시 활용
   * - 캐싱 권장 (자주 변경되지 않음)
   * 
   * @example
   * const response = await movieApi.getGenres();
   * const genres = response.data.genres;
   * 
   * // 장르 목록 출력
   * genres.forEach(genre => {
   *   console.log(`ID ${genre.id}: ${genre.name}`);
   * });
   * // 출력 예시:
   * // ID 28: 액션
   * // ID 12: 모험
   * // ID 16: 애니메이션
   * 
   * @example
   * // 특정 장르 ID로 이름 찾기
   * const actionGenre = genres.find(g => g.id === 28);
   * console.log(actionGenre?.name); // "액션"
   */
  getGenres: () => 
    tmdbApi.get<GenreResponse>('/genre/movie/list'),
  
  /**
   * TMDB 이미지 URL 생성 헬퍼
   * 
   * @function getImageUrl
   * @memberof movieApi
   * @param {string | null} path - TMDB에서 제공한 이미지 경로 (예: "/abc123.jpg")
   * @param {string} [size='w500'] - 이미지 사이즈 옵션
   * @returns {string} 완전한 이미지 URL 또는 플레이스홀더
   * 
   * @description
   * TMDB API에서 받은 이미지 경로를 실제 접근 가능한 URL로 변환합니다.
   * 
   * **사이즈 옵션:**
   * - `w92`: 92px (썸네일)
   * - `w154`: 154px (작은 카드)
   * - `w185`: 185px (모바일 카드)
   * - `w342`: 342px (중간 카드)
   * - `w500`: 500px (데스크탑 카드) - 기본값 ⭐
   * - `w780`: 780px (큰 포스터)
   * - `original`: 원본 해상도 (고용량 주의)
   * 
   * **성능 최적화:**
   * - 필요한 최소 사이즈 사용 권장
   * - 모바일: w185~w342
   * - 데스크탑: w500~w780
   * 
   * @example
   * // 포스터 이미지 (중간 크기)
   * const posterUrl = movieApi.getImageUrl('/abc123.jpg', 'w500');
   * console.log(posterUrl);
   * // "https://image.tmdb.org/t/p/w500/abc123.jpg"
   * 
   * @example
   * // 썸네일 (작은 크기 - 리스트뷰용)
   * const thumbUrl = movieApi.getImageUrl('/abc123.jpg', 'w92');
   * // "https://image.tmdb.org/t/p/w92/abc123.jpg"
   * 
   * @example
   * // 이미지가 없을 때 (플레이스홀더 반환)
   * const noImage = movieApi.getImageUrl(null);
   * console.log(noImage);
   * // "https://via.placeholder.com/500x750?text=No+Image"
   * 
   * @example
   * // Vue 템플릿에서 사용
   * <img :src="movieApi.getImageUrl(movie.poster_path, 'w342')" :alt="movie.title">
   */
  getImageUrl: (path: string | null, size = 'w500'): string => {
    return path 
      ? `https://image.tmdb.org/t/p/${size}${path}` 
      : 'https://via.placeholder.com/500x750?text=No+Image';
  }
};

/**
 * 기본 Axios 인스턴스 export (고급 사용자용)
 * 
 * @exports tmdbApi
 * @type {import('axios').AxiosInstance}
 * 
 * @description 
 * movieApi에 정의되지 않은 커스텀 API 호출이 필요한 경우 직접 사용할 수 있습니다.
 * 
 * @example
 * // 영화 상세 정보 조회 (커스텀 엔드포인트)
 * import tmdbApi from '@/api/tmdb';
 * 
 * const movieId = 550; // Fight Club
 * const response = await tmdbApi.get(`/movie/${movieId}`);
 * console.log(response.data);
 */
export default tmdbApi;