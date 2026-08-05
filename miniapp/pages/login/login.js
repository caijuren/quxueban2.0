const api = require('../../utils/api');
const storage = require('../../utils/storage');
const subscribe = require('../../utils/subscribe');

Page({
  data: {
    loading: false,
    showRolePanel: false,
    wxCode: null,
    statusBarHeight: 0,
  },

  onLoad() {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 0 });

    const token = storage.getToken();
    const activeRole = storage.getActiveRole();

    if (token && activeRole) {
      wx.reLaunch({ url: '/pages/tasks/tasks' });
    }
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
        const message = err.message || '';
        if (message.includes('未绑定')) {
          wx.showActionSheet({
            itemList: ['绑定家长账号', '绑定孩子账号'],
            success: (res) => {
              if (res.tapIndex === 0) {
                wx.navigateTo({ url: '/pages/bind-parent/bind-parent' });
              } else {
                wx.navigateTo({ url: '/pages/bind-child/bind-child' });
              }
            },
          });
        } else {
          wx.showToast({
            title: message || '登录失败',
            icon: 'none',
          });
        }
      }
    } finally {
      this.setData({ loading: false });
    }
  },
});
