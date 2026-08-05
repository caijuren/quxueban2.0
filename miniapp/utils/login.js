const api = require('./api');
const storage = require('./storage');
const subscribe = require('./subscribe');

async function performWechatLogin() {
  const loginRes = await wx.login();
  if (!loginRes || !loginRes.code) {
    throw new Error('获取微信登录凭证失败');
  }

  const res = await api.post('/api/miniapp/auth/login', { code: loginRes.code });

  if (!res || !res.token) {
    throw new Error('登录响应异常');
  }

  storage.setToken(res.token);
  storage.setUser(res.user);

  if (res.role) {
    storage.setActiveRole(res.role);
    if (res.selectedChild) {
      storage.setSelectedChild(res.selectedChild);
    }

    if (res.role === 'parent') {
      await subscribe.requestSubscriptions();
      wx.reLaunch({ url: '/pages/role-select/role-select' });
    } else {
      wx.reLaunch({ url: '/pages/tasks/tasks' });
    }
  } else {
    wx.reLaunch({ url: '/pages/role-select/role-select' });
  }
}

module.exports = {
  performWechatLogin,
};
