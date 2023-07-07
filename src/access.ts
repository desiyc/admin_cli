/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser: any } | undefined) {
  const { currentUser } = initialState ?? {};
  const { permissions = [] } = currentUser?.data?.role || {};
  return {
    '/DataKanBan': permissions.includes('/DataKanBan'),
  };
}
