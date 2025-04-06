import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import ListingCreate from "./components/UserGameCreate.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Inbox from "./components/Inbox.vue";

import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

// Define routes
const routes = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/inbox",
    component: Inbox,
    meta: { requiresAuth: true },
  },
  {
    path: "/listings",
    component: ListingCreate,
    meta: { requiresAuth: true },
  },
];

// Create Vue Router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('jwt') !== null; // Check if user is logged in
  
  // If the route requires authentication and the user is not logged in, redirect to login page
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Allow navigation if user is logged in or route doesn't require authentication
  }
});

// Create and mount Vue app
const app = createApp(App);
app.use(router);
app.mount("#app");
