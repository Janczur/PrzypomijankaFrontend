import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/public/Home.vue";
import PublicLayout from "@/layouts/Public.vue";
import AppLayout from "@/layouts/App.vue";
import NotFound from "@/components/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    component: NotFound
  },
  {
    path: "/",
    component: PublicLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: Home
      },
      {
        path: "/login",
        name: "Login",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/views/public/Login.vue")
      },
      {
        path: "/register",
        name: "Register",
        component: () =>
          import(
            /* webpackChunkName: "register" */ "@/views/public/Register.vue"
          )
      }
    ]
  },
  {
    path: "/dashboard",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/views/app/Dashboard.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
