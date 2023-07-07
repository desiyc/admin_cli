import styles from './index.less';
import { Spin, Tabs, message } from 'antd';
import { effect, requestGet, requestPost, useLoading } from '@/utils/dva17';
import { ELogin, NUser } from '@/common/action';
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { useModel } from 'umi';
import { useState } from 'react';
import { history } from 'umi';
type LoginType = 'phone' | 'account';

export default () => {
  const [phone, setPhone] = useState('');
  const { setInitialState } = useModel('@@initialState');
  const [loginType, setLoginType] = useState<LoginType>('phone');
  const loginLoading = useLoading(NUser, ELogin).loading;
  const onFinish = async (values: any) => {
    let res: any;
    if (loginType == 'phone') {
      res = await effect(NUser, ELogin, { phone: values.phone, code: values.code });
    } else {
      res = await effect(NUser, ELogin, { phone: values.phone, password: values.password });
    }
    const info = await requestGet('mi/info');
    setInitialState((s: any) => ({ ...s, currentUser: info })).then(() => {
      if (info) {
        history.replace(info?.data?.role?.permissions[0] || '/operations/homePage');
        message.success('登录成功');
      }
    });
  };
  return (
    <Spin spinning={loginLoading}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loginCon}>
            <LoginForm logo={'./logo.png'} title="项目名称" subTitle="平台管理端" onFinish={onFinish}>
              <Tabs
                centered
                activeKey={loginType}
                onChange={(activeKey: any) => setLoginType(activeKey as LoginType)}
              >
                <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
                <Tabs.TabPane key={'phone'} tab={'手机号登录'} />
              </Tabs>
              <ProFormText
                name="phone"
                placeholder={'手机号11'}
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
                fieldProps={{
                  size: 'large',
                  maxLength: 11,
                  prefix: <MobileOutlined className={'prefixIcon'} />,
                  onChange: (e: any) => {
                    setPhone(e.target.value);
                  },
                }}
              />
              {loginType == 'account' && (
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                  }}
                  placeholder={'请输入密码'}
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
              )}
              {loginType == 'phone' && (
                <ProFormCaptcha
                  name="code"
                  placeholder={'请输入验证码'}
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                    maxLength: 6,
                  }}
                  captchaProps={{
                    disabled: phone && !/^1\d{10}$/.test(phone) ? true : false,
                    size: 'large',
                  }}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${'获取验证码'}`;
                    }
                    return '获取验证码';
                  }}
                  onGetCaptcha={async () => {
                    await requestPost('mi/send/code', { phone });
                    message.success('获取验证码成功！');
                  }}
                />
              )}
            </LoginForm>
          </div>
        </div>
      </div>
    </Spin>
  );
};
