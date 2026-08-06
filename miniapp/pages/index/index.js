const auth = require('../../utils/auth');
const storage = require('../../utils/storage');
const loginUtil = require('../../utils/login');

Page({
  data: {
    loading: true,
    loginLoading: false,
    statusBarHeight: 0,
  },

  onLoad() {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 0, loading: false });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  goTasks() {
    wx.switchTab({ url: '/pages/tasks/tasks' });
  },

  async loginWithWechat() {
    if (this.data.loginLoading) return;

    this.setData({ loginLoading: true });

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
      this.setData({ loginLoading: false });
    }
  },
});
