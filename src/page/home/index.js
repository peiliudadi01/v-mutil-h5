import Vue from "vue";
import Tpl from "./home.vue";
import "@assets/style/main.scss";

new Vue({
  render:h => h(Tpl),
}).$mount("#app");
