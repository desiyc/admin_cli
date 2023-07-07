import { defineConfig } from 'umi';

import defaultSettings from './defaultSettings';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  publicPath: './',
  history: {
    type: 'hash',
  },
  antd: false,
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  // fastRefresh: {},
  exportStatic: {},
  define: {
    'process.env': {
      UMI_SERVER: process.env.UMI_SERVER,
    }, // 修改process.env对象数据
  },
});
