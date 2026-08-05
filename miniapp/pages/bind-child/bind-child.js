const api = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: {
    bindCode: '',
    loading: false,
  },

  onInput(e) {
    this.setData({ bindCode: e.detail.value });
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

      const res = await api.post('/api/miniapp/auth/bind-child', {
        code: wxCode,
        bindCode: code,
      });

      storage.setToken(res.token);
      storage.setUser(res.child);
      storage.setActiveRole('child');
      storage.setSelectedChild(res.child);

      wx.showToast({ title: '绑定成功', icon: 'success' });

      wx.reLaunch({ url: '/pages/tasks/tasks' });
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
