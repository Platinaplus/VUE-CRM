import * as Vue from "vue";
import App from "./App.vue";
import Pagination from 'v-pagination-3'
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import messagePlagin from "./utils/message.plagin";
import formatDate from "./utils/date";
import * as M from "materialize-css";
import CommonLoader from "./components/common/CommonLoader.vue";
import tooltipDirective from './directives/tooltip.directive';

import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize";
import "@/assets/index.css";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyDkjqgpQ44ZOvv-rKthp3qEDjJb3QVNLlc",
  authDomain: "vue-crm-b711f.firebaseapp.com",
  projectId: "vue-crm-b711f",
  storageBucket: "vue-crm-b711f.appspot.com",
  messagingSenderId: "1034649975577",
  appId: "1:1034649975577:web:1aa8769f9f22a398ab6388",
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = Vue.createApp(App)
      .use(store)
      .use(router)
      .use(M)
      .use(messagePlagin)
      .use(formatDate)
      .directive('tooltip', tooltipDirective)
      .component("Loader", CommonLoader)
      .component('Pagination', Pagination)
      .mount("#app");
  }
});
