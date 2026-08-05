const api = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: {
    bindCode: '',
    codeCells: ['', '', '', '', '', ''],
    inputFocus: true,
    focusIndex: 0,
    loading: false,
    statusBarHeight: 0,
  },

  onLoad() {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 0 });
  },

  onInput(e) {
    const value = e.detail.value || '';
    const digits = value.replace(/\D/g, '').slice(0, 6);
    const codeCells = Array.from({ length: 6 }, (_, i) => digits[i] || '');
    this.setData({
      bindCode: digits,
      codeCells,
      focusIndex: digits.length < 6 ? digits.length : 5,
    });
  },

  onFocus() {
    this.setData({ inputFocus: true, focusIndex: Math.min(this.data.bindCode.length, 5) });
  },

  onBlur() {
    this.setData({ inputFocus: false });
  },

  focusInput() {
    this.setData({ inputFocus: false }, () => {
      this.setData({ inputFocus: true });
    });
  },

  async onBind() {
    const code = this.data.bindCode.trim();

    if (!/^\d{6}$/.test(code)) {
      wx.showToast({ title: '请输入6位绑定码', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    try {
      const { code: wxCode } = await wx.login({ provider: 'weixin' });

      const res = await api.post('/api/miniapp/auth/bind-parent', {
        code: wxCode,
        bindCode: code,
      });

      storage.setToken(res.token);
      storage.setUser(res.user);
      storage.setActiveRole('parent');
      storage.removeSelectedChild();

      wx.showToast({ title: '绑定成功', icon: 'success' });

      wx.reLaunch({ url: '/pages/role-select/role-select' });
    } catch (err) {
      wx.showToast({
        title: err.message || '绑定失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  goBack() {
    wx.navigateBack();
  },
});
