const api = require('../../utils/api');
const storage = require('../../utils/storage');
const subscribe = require('../../utils/subscribe');

Page({
  data: {
    loading: false,
    showRolePanel: false,
    wxCode: null,
  },

  async onLoad() {
    const token = storage.getToken();
    if (token) {
      wx.reLaunch({ url: '/pages/role-select/role-select' });
      return;
    }

    // 自动尝试静默登录（已绑定微信的家长或孩子）
    await this.doLogin();
  },

  async getWechatCode() {
    const res = await wx.login();
    return res.code;
  },

  async loginAsParent() {
    await this.doLogin({ silent: false });
  },

  goBindChild() {
    wx.navigateTo({ url: '/pages/bind-child/bind-child' });
  },

  async doLogin(options = { silent: true }) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const code = await this.getWechatCode();
      const res = await api.post('/api/miniapp/auth/login', { code });

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
    } catch (err) {
      if (!options.silent) {
        wx.showToast({
          title: err.message || '登录失败',
          icon: 'none',
        });
      }
    } finally {
      this.setData({ loading: false });
    }
  },
});
