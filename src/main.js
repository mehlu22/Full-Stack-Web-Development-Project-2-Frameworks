import Vue from "vue";
import App from "./App";
import vuetify from "./vuetify";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import VueToastr from "vue-toastr";
Vue.config.productionTip = false;

Vue.use(VueToastr, {
  defaultTimeout: 3000,
  defaultProgressBar: true,
  defaultPosition: "toast-bottom-right",
  defaultCloseonHover: false
});

new Vue({
  vuetify,
  el: "#app",
  components: { App },
  template: "<App/>"
});
