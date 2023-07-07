const env: any = process.env.UMI_SERVER || 'dev';

const BASE_URL: any = {
  //本地：开发用
  local: '',
  //测试服：开发用
  dev: '',
  //生产服：谨慎使用 ！！！！
  prod: '',
};

export default {
  SERVER_HOME: BASE_URL[env],
  PROJECT_TOKEN: 'project_token',
};
