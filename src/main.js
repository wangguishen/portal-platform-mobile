// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from 'vue'
import axios from 'axios';
import FastClick from 'fastclick'
import router from './router/index';
// import { configRouter } from './router/router-config';
import App from './App'
import './assets/transition.css'
// import './assets/main.css'
import  { ConfirmPlugin } from 'vux'
import  { ToastPlugin } from 'vux'
import  { LoadingPlugin } from 'vux'
import './assets/icon_font.css'
import store from './store/store'
import './assets/main.less'

// import vueXlsxTable from 'vue-xlsx-table'
// Vue.use(vueXlsxTable, {rABS: false}) //HTML5 FileReader API 有两个方法可以读取本地文件 readAsBinaryString 和 readAsArrayBuffer, 默认rABS为true，也就是使用readAsBinaryString
// const VueUploadComponent = require('vue-upload-component')
// Vue.component('file-upload', VueUploadComponent)


FastClick.attach(document.body)

Vue.config.productionTip = false;

Vue.prototype.BP_HOST = '/basic-platform'; //测试地址
// Vue.prototype.BP_HOST = 'http://openplatform.weilian.cn/basic-platform'; //正式地址
// Vue.prototype.BP_HOST = 'http://172.19.5.98:8080/basic-platform';
Vue.prototype.PIC_HOST = '/file-service/file-api.download?useOld=false&domain=user&type=photo&fileName=';  //图片上传地址

//Excel模板下载地址
Vue.prototype.EXCEL_TEMPLATE_URL = 'http://vr12.weilian.cn/account_auth_admin_page/images/user.import.template.xls'

//修改企业logo(测试环境)
Vue.prototype.LOGO_UPDATE_URL = '/vr-content/file/upload'

Vue.prototype.$axios = axios;
Vue.prototype.VISITORS = "visitors";//游客
Vue.prototype.PLAT_ADMIN = "plat_admin";//平台管理
Vue.prototype.ENTERPRISE_ADMIN = "enterprise_admin";//企业管理
Vue.prototype.PLAT_COMPCODE = 'SYSTEM' //企业管理员
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
