import { createRouter, createWebHashHistory } from 'vue-router'

// 1. 위에서 만든 페이지 파일들을 불러오기
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import PopularView from '../views/PopularView.vue'
import SearchView from '../views/SearchView.vue'
import WishlistView from '../views/WishlistView.vue'

const router = createRouter({
  // 과제 데모처럼 /#/ 주소 사용 (Github Pages 배포 시 404 에러 방지용)
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView
    },
    {
      path: '/popular',
      name: 'popular',
      component: PopularView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: WishlistView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('TMDb-Key');
  const isLoggedIn = !!token;

  // 1. 로그인 페이지로 가는 경우엔 그냥 통과
  if (to.path === '/signin') {
    next();
    return;
  }

  // 2. 로그인이 안 되어 있는데 다른 페이지를 가려고 하면?
  if (!isLoggedIn) {
    // alert('로그인이 필요한 페이지입니다! 👮‍♂️'); // 너무 자주 뜨면 귀찮으니 주석 처리 가능
    next('/signin'); // 로그인 페이지로 강제 납치
  } else {
    // 3. 로그인 되어 있으면 통과
    next(); 
  }
});

export default router