const subscribe = require('./utils/subscribe');

App({
  globalData: {
    userInfo: null,
    activeRole: null,
    selectedChild: null,
    apiBaseUrl: '',
  },

  onLaunch() {
    let env = 'develop';
    try {
      const accountInfo = wx.getAccountInfoSync();
      env = accountInfo?.miniProgram?.envVersion || 'develop';
    } catch (e) {
      console.error('获取账号信息失败:', e);
    }

    const baseUrl = env === 'release'
      ? 'https://edu.quxueban.cn'
      : env === 'trial'
        ? 'https://edu.quxueban.cn'
        : 'http://localhost:3000';

    this.globalData.apiBaseUrl = baseUrl;

    try {
      const windowInfo = wx.getWindowInfo();
      this.globalData.statusBarHeight = windowInfo.statusBarHeight || 0;
      this.globalData.safeAreaBottom = windowInfo.safeArea
        ? windowInfo.screenHeight - windowInfo.safeArea.bottom
        : 0;
    } catch (e) {
      console.error('获取系统信息失败:', e);
      this.globalData.statusBarHeight = 0;
      this.globalData.safeAreaBottom = 0;
    }

    this.loadConfig();
  },

  loadConfig() {
    wx.request({
      url: `${this.globalData.apiBaseUrl}/api/miniapp/config`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data?.templateIds) {
          subscribe.setTemplateIds(res.data.templateIds);
        }
      },
      fail: (err) => {
        console.error('加载小程序配置失败:', err);
      },
    });
  },
});
