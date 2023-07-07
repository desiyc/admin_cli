import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';
import { Provider } from 'react-redux';
import models from '@/models';
import { bindJWTToken, initRequest, requestGet, initModels } from '@/utils/dva17';
import Config from '@/common/config';
import { notification } from 'antd';
import React from 'react';
const loginPath = '/user/login';

initRequest(
  Config.SERVER_HOME,
  (status: any, data: any) => {
    if (401 == status) {
      localStorage.removeItem(Config.PROJECT_TOKEN);
    } else {
      const { message } = data;
      notification.error({ message, duration: 2 });
    }
  },
  false, //是否打印request记录
);
bindJWTToken(localStorage.getItem(Config.PROJECT_TOKEN));

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

const fetchUserInfo = async () => {
  try {
    const userInfo: any = await requestGet('mi/info');
    return userInfo;
  } catch (error) {
    history.push(loginPath);
  }
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
}> {
  let currentUser: any = null;
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    currentUser = await fetchUserInfo();
  }
  return {
    currentUser,
    settings: defaultSettings,
  };
}

/***
 *
 *  修改交给 react-dom 渲染时的根组件 */
export function rootContainer(container: any) {
  // 比如用于在外面包一个 Provider
  const ThemeProvider = ({ children, routes }: any) => (
    // @ts-ignore，忽略store类型JSX报错
    <Provider store={initModels(models, false)}>
      <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
        {React.cloneElement(children, {
          ...children.props,
          routes,
        })}
      </StyleProvider>
    </Provider>
  );
  return React.createElement(ThemeProvider, null, container);
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }: any) => {
  const { currentUser }: any = initialState || {};
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: currentUser?.data?.username + currentUser?.data?.phone,
    },
    menuHeaderRender: undefined,
    itemRender: (route: any) => {
      return <span>{route.breadcrumbName}</span>;
    },
    onMenuHeaderClick: () => {
      return false;
    },

    unAccessible: <div />,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: any) => {
      // if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },

    token: {
      pageContainer: {
        paddingInlinePageContainerContent: 16,
      },
    },
    ...initialState?.settings,
  };
};
