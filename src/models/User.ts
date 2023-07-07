import { NUser, RSetState, ELogin, EGet } from '@/common/action';
import { bindJWTToken, requestGet, requestPost } from '@/utils/dva17';
import Config from '@/common/config';
export default {
  namespace: NUser,
  state: {
    currentUser: null,
    myInfo: null,
  },
  reducers: {
    [RSetState](state: any, payload: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    async [ELogin]({ payload }: any, { reducer }: any) {
      const { data }: any = await requestPost('mi/login', payload);
      bindJWTToken(data?.token);
      localStorage.setItem(Config.PROJECT_TOKEN, data?.token);

      return data?.token;
    },
    async [EGet]({ payload }: any, { reducer }: any) {
      const res = await requestGet('mi/info', payload);
      reducer(RSetState, { currentUser: res?.data });
    },
  },
};
