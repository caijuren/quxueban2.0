const auth = require('../../utils/auth');
const storage = require('../../utils/storage');

Page({
  data: {
    loading: true,
    statusBarHeight: 0,
  },

  onLoad() {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 0 });
    this.checkAuthState();
  },

  onShow() {
    this.checkAuthState();
  },

  checkAuthState() {
    const token = storage.getToken();
    const activeRole = auth.getActiveRole();

    if (token && activeRole) {
      wx.reLaunch({ url: '/pages/tasks/tasks' });
      return;
    }

    this.setData({ loading: false });
  },

  goTasks() {
    wx.reLaunch({ url: '/pages/tasks/tasks' });
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },
});
