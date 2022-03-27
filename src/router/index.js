import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: guard,
  },
  {
    path: '/add-partner',
    name: 'AddPartner',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    beforeEnter: guard,
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AddPartner.vue'),
  },
  {
    path: '/matches',
    name: 'Matches',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    beforeEnter: guard,
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Matches.vue'),
  },
  {
    path: '/',
    name: 'SignIn',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/SignIn.vue'),
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/SignUp.vue'),
  },
];

function guard(to, from, next) {
  if (store.state.user.id) {
    next();
  } else {
    next('/');
  }
}

const router = new VueRouter({
  routes,
});

export default router;
