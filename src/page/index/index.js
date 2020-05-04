import Vue from "vue";
import Tpl from "./index.vue";
import "@assets/style/main.scss";
// import "@util/vconsoleUtil.js";

new Vue({
  render:h => h(Tpl),
}).$mount("#app");
