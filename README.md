# 🎬 Netflix Style Movie Service (Vue 3 + TypeScript)

Vue 3 Composition API와 TypeScript를 활용하여 제작한 **넷플릭스 스타일의 영화 정보 제공 서비스**입니다.
TMDB API를 기반으로 영화 검색, 상세 조회, 찜하기, 회원가입/로그인(API Key 검증) 기능을 제공하며, 반응형 웹 디자인과 다양한 UX 편의 기능을 구현했습니다.

## 🔗 배포 주소 (Deployment)
* **서비스 접속:** https://abc202313746.github.io/movie-assignment-01/
* **GitHub 저장소:** https://github.com/abc202313746/movie-assignment-01.git
---

## 🛠 기술 스택 (Tech Stack)

* **Framework:** Vue.js 3 (Composition API, `<script setup>`)
* **Language:** TypeScript
* **Build Tool:** Vite
* **State Management:** Pinia (Wishlist), Reactivity API (ref/reactive)
* **Network:** Axios (Interceptors 적용)
* **Router:** Vue Router (Hash Mode, Navigation Guard 적용)
* **Style:** CSS3 (Media Queries, Flex/Grid Layout, Animations)
* **Deployment:** GitHub Actions (CI/CD Automated Deployment)

---

## ✨ 주요 기능 (Key Features)

### 1. 🔐 인증 및 보안 (Authentication)
* **로그인/회원가입:** 넷플릭스 스타일의 **슬라이딩 전환 애니메이션** 구현.
* **API Key 검증:** 회원가입 시 입력한 비밀번호가 **유효한 TMDB API Key인지 실시간 검증**하는 로직 탑재.
* **보안:** 라우터 가드(Navigation Guard)를 적용하여 비로그인 사용자의 페이지 접근 차단.
* **편의성:** `localStorage`를 활용한 **아이디 기억하기(Remember Me)** 및 자동 로그인 유지.

### 2. 🏠 메인 페이지 (Home)
* **다중 API 활용:** `Popular`, `Now Playing`, `Top Rated`, `Upcoming` 등 **4종 이상의 TMDB API**를 활용한 섹션 구성.
* **UX/UI:** 영화 카드 호버 시 **상세 정보(줄거리, 평점, 개봉일) 오버레이** 효과 구현.

### 3. 🔍 검색 및 필터링 (Search & Filter)
* **고급 필터링:** 장르별, 평점별(`computed` 활용) 실시간 필터링.
* **정렬(Sorting):** 평점순, 최신순 등 다중 정렬 기능 제공.
* **검색 기록:** `localStorage`를 활용한 **최근 검색어 저장/삭제** 및 태그 UI 제공.
* **초기화:** 모든 필터 상태를 한 번에 리셋하는 초기화 버튼 구현.

### 4. 💖 찜하기 및 상태 관리 (Wishlist)
* **Pinia 활용:** 전역 상태 관리 라이브러리 **Pinia**를 도입하여 찜 목록 관리.
* **데이터 영속성:** 브라우저를 닫아도 찜 목록이 유지되도록 로컬 스토리지 연동.
* **반응형 UI:** 찜 상태 즉시 반영 및 토글 기능.

### 5. 📱 대세 콘텐츠 및 반응형 (Responsive)
* **뷰 모드 전환:** **무한 스크롤(Infinite Scroll)** 모드와 **테이블 뷰(Pagination)** 모드 토글 기능.
* **모바일 최적화:**
    * 모바일 환경을 위한 **햄버거 메뉴(Hamburger Menu)** 구현.
    * 미디어 쿼리를 활용하여 모든 디바이스에서 깨짐 없는 레이아웃 제공.
    * 테이블 뷰 모바일 최적화 (글자 자름 처리 등).

---

## 📂 프로젝트 구조 (Project Structure)

src ├── api # Axios 설정 및 TMDB API 호출 함수 모음 ├── assets # 정적 이미지 및 전역 CSS ├── components # 재사용 가능한 컴포넌트 │ ├── common # MovieCard 등 공통 컴포넌트 │ └── layout # Header (햄버거 메뉴 포함) ├── composables # Vue Composition API 훅 (useAuth 등) ├── router # Vue Router 설정 (Navigation Guard) ├── stores # Pinia Store (wishlist) ├── types # TypeScript 인터페이스 정의 └── views # 페이지 단위 컴포넌트 (Home, Search, SignIn, etc.)


---

## 🚀 실행 방법 (Getting Started)

이 프로젝트는 `Node.js` 환경에서 실행됩니다.

1.  **프로젝트 복제 (Clone)**
    ```bash
    git clone https://github.com/abc202313746/movie-assignment-01.git
    cd WSD-Assignment-02
    ```

2.  **의존성 설치 (Install)**
    ```bash
    npm install
    ```

3.  **개발 서버 실행 (Run)**
    ```bash
    npm run dev
    ```

4.  **로그인 안내 (Login Info)**
    * **아이디:** (자유롭게 입력, 이메일 형식)
    * **비밀번호:** **본인의 유효한 TMDB API Key**를 입력해야 합니다.
    * *(회원가입 시 입력한 API Key로 실제 데이터 통신이 이루어집니다.)*

---

## 📈 Git Flow 전략

본 프로젝트는 체계적인 형상 관리를 위해 **Git Flow** 전략을 준수했습니다.

* `main`: 배포 가능한 정식 출시 버전 (Release v1.0 ~ v2.5)
* `develop`: 기능 통합 및 테스트가 이루어지는 개발 브랜치
* `feature/*`: 단위 기능 개발을 위한 브랜치 (예: `feature/auth-api-validation`, `feature/hamburger-menu`)

---

### 📝 작성자 정보
* **과목:** 초급프로젝트트 (2차 과제)
* **학번:** 202313746
* **이름:** 인숙영