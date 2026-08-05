const api = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: {
    step: 'role',
    user: null,
    children: [],
    selectedChild: null,
    selectedRole: '',
    loading: false,
    statusBarHeight: 0,
  },

  onLoad(options) {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 0 });

    const user = storage.getUser();
    this.setData({ user });

    if (options?.step === 'child') {
      storage.setActiveRole('parent');
      this.setData({ step: 'child' });
      this.loadChildren();
    }
  },

  selectRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({ selectedRole: role });

    if (role === 'parent') {
      setTimeout(() => {
        storage.setActiveRole('parent');
        this.setData({ step: 'child' });
        this.loadChildren();
      }, 180);
    } else {
      setTimeout(() => {
        this.handleChildLogin();
        this.setData({ selectedRole: '' });
      }, 180);
    }
  },

  async loadChildren() {
    this.setData({ loading: true });

    try {
      const res = await api.get('/api/miniapp/children');
      this.setData({ children: res.children || [] });

      if (res.children && res.children.length === 1) {
        this.selectChild({ currentTarget: { dataset: { child: res.children[0] } } });
      }
    } catch (err) {
      wx.showToast({
        title: err.message || '获取孩子列表失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  selectChild(e) {
    const child = e.currentTarget.dataset.child;
    storage.setSelectedChild(child);
    this.setData({ selectedChild: child });

    wx.reLaunch({ url: '/pages/tasks/tasks' });
  },

  handleChildLogin() {
    wx.showModal({
      title: '孩子登录',
      content: '孩子独立登录需要家长先绑定微信，当前版本请先使用家长身份。',
      showCancel: false,
      confirmText: '知道了',
    });
  },

  backToRole() {
    this.setData({ step: 'role', selectedChild: null, selectedRole: '' });
  },
});
