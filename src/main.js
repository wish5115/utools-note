import Vue from "vue";
import App from "./App.vue";
// import VueQuillEditor from "vue-quill-editor";
// import "quill/dist/quill.snow.css";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { utools } from "./utils/utools.js";
import Vant from "./vant.js";
import Api from "./utils/index";
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== "production") {
  window.utools = window.utools || utools;
}
Vue.use(Vant);
Vue.use(mavonEditor);
Vue.config.productionTip = false;
// Vue.use(VueQuillEditor, {
//   placeholder: "记个笔记",
// });
Vue.prototype.utools = window.utools;
Vue.prototype.$api = Api;
console.log(111,process.env.NODE_ENV);

window.utools.onPluginReady(() => {
  console.log("插件装配完成，已准备好");
  
  new Vue({
    render: (h) => h(App),
  }).$mount("#app");
  
});

// if (process.env.NODE_ENV === "production") {
//   window.utools.onPluginReady(() => {
//     console.log("插件装配完成，已准备好");
//     new Vue({
//       render: (h) => h(App),
//     }).$mount("#app");
//   });
// } else {
//   new Vue({
//     render: (h) => h(App),
//   }).$mount("#app");
// }
