const storage = require('../../utils/storage');
const loginUtil = require('../../utils/login');

Page({
  data: {
    loading: false,
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

  async loginAsParent() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      await loginUtil.performWechatLogin();
    } catch (err) {
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
    } finally {
      this.setData({ loading: false });
    }
  },

  goBindChild() {
    wx.navigateTo({ url: '/pages/bind-child/bind-child' });
  },
});
