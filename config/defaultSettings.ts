import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '项目名称',
  pwa: false,
  logo: './logo.png',
  iconfontUrl: '',
};

export default Settings;
