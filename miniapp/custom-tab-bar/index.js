Component({
  data: {
    selected: 0,
    safeAreaBottom: 0,
  },

  lifetimes: {
    attached() {
      const app = getApp();
      this.setData({
        safeAreaBottom: app.globalData.safeAreaBottom || 0,
      });
    },
  },

  methods: {
    switchTab(e) {
      const { index, url } = e.currentTarget.dataset;
      this.setData({ selected: index });
      wx.switchTab({ url });
    },
  },
});
