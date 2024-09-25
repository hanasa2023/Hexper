import { createRouter, createWebHashHistory } from "vue-router";
import MainPage from "../pages/MainPage.vue";
import Experiment7Page from "../pages/Experiment7Page.vue";

const routes = [
  { path: "/", component: MainPage },
  { path: "/experiment/7", component: Experiment7Page },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
