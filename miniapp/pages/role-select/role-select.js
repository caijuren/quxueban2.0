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
    from: '',
  },

  onLoad(options) {
    const app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight || 0,
      from: options?.from || '',
    });

    const user = storage.getUser();
    const selectedChild = storage.getSelectedChild();
    this.setData({ user, selectedChild });

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
        this.setData({ step: 'child', selectedChild: storage.getSelectedChild() });
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

    if (this.data.from === 'profile') {
      wx.navigateBack();
      return;
    }

    wx.switchTab({ url: '/pages/tasks/tasks' });
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
    const pages = getCurrentPages();
    if (this.data.from === 'profile' && pages.length > 1) {
      wx.navigateBack();
      return;
    }
    this.setData({ step: 'role', selectedChild: null, selectedRole: '' });
  },
});
