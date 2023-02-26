import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import App from './App.vue';
import router from './router'
// 预览组件以及样式
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// VuePress主题以及样式（这里也可以选择github主题）
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// hljs
import hljs from 'highlight.js';
//图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 选择使用主题
VMdPreview.use(githubTheme, {Hljs:hljs});

const app = createApp(App);
    
//注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
};

// 引入v-md-editor预览组件
app.use(VMdPreview);

app.use(router)

app.use(ElementPlus);

app.mount('#app');

