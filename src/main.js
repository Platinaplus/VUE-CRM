import * as Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import messagePlagin from "./utils/message.plagin";
import * as M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize";
import "@/assets/index.css";

Vue.createApp(App)
  .use(store)
  .use(router)
  .use(M)
  .use(messagePlagin)
  .mount("#app");
