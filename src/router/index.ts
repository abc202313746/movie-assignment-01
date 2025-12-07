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

export default router