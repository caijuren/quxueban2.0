const auth = require('../../utils/auth');
const storage = require('../../utils/storage');

Page({
  data: {
    loading: true,
  },

  onLoad() {
    this.checkAuthState();
  },

  onShow() {
    this.checkAuthState();
  },

  checkAuthState() {
    const token = storage.getToken();
    const activeRole = auth.getActiveRole();

    if (!token) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }

    if (!activeRole) {
      wx.reLaunch({ url: '/pages/role-select/role-select' });
      return;
    }

    wx.reLaunch({ url: '/pages/tasks/tasks' });
  },
});
