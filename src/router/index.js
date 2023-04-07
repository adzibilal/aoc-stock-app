import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

let routes = [
  {
    // will match everything
    path: "*",
    component: () => import("../views/404.vue"),
  },
  {
    path: "/",
    name: "Home",
    redirect: "/sign-in",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    layout: "dashboard",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
  },
  {
    path: "/layout",
    name: "Layout",
    layout: "dashboard",
    component: () => import("../views/Layout.vue"),
  },
  {
    path: "/tables",
    name: "Tables",
    layout: "dashboard",
    component: () => import("../views/Tables.vue"),
  },
  {
    path: "/inventory",
    name: "Inventory",
    layout: "dashboard",
    component: () => import("../views/Inventory.vue"),
  },
  {
    path: "/select-cabang",
    name: "Select Cabang",
    component: () => import("../views/SelectCabang.vue"),
  },
  {
    path: "/billing",
    name: "Billing",
    layout: "dashboard",
    component: () => import("../views/Billing.vue"),
  },
  {
    path: "/rtl",
    name: "RTL",
    layout: "dashboard-rtl",
    meta: {
      layoutClass: "dashboard-rtl",
    },
    component: () => import("../views/RTL.vue"),
  },
  {
    path: "/Profile",
    name: "Profile",
    layout: "dashboard",
    meta: {
      layoutClass: "layout-profile",
    },
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/sign-in",
    name: "Sign-In",
    component: () => import("../views/Sign-In.vue"),
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("user")) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: "/sign-up",
    name: "Sign-Up",
    meta: {
      layoutClass: "layout-sign-up",
    },
    component: () => import("../views/Sign-Up.vue"),
  },
];

// Adding layout property from each route to the meta
// object so it can be accessed later.
function addLayoutToRoute(route, parentLayout = "default") {
  route.meta = route.meta || {};
  route.meta.layout = route.layout || parentLayout;

  if (route.children) {
    route.children = route.children.map((childRoute) =>
      addLayoutToRoute(childRoute, route.meta.layout)
    );
  }
  return route;
}

routes = routes.map((route) => addLayoutToRoute(route));

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: "smooth",
      };
    }
    return {
      x: 0,
      y: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem("user");
  if (!user && to.path !== "/sign-in") {
    next("/sign-in");
  } else {
    next();
  }
});

export default router;
