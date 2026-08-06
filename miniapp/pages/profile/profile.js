const api = require('../../utils/api');
const auth = require('../../utils/auth');
const storage = require('../../utils/storage');

Page({
  data: {
    user: null,
    displayName: '用户',
    displayFirstChar: '用',
    activeRole: null,
    roleLabel: '',
    roleThemeColor: '#F43F7A',
    roleThemeColor2: '#E11D5D',
    selectedChild: null,
    selectedChildName: '未选择',
    selectedChildGradeText: '未设置',
    children: [],
    bindCode: null,
    bindCodeExpiry: null,
    generatingChildId: null,
    loading: false,
    statusBarHeight: 0,
  },

  onLoad() {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 0 });
    this.loadProfile();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.loadProfile();
  },

  async loadProfile() {
    const user = storage.getUser();
    const activeRole = auth.getActiveRole();
    const selectedChild = auth.getSelectedChild();

    const displayName = user?.name || user?.username || '用户';
    const displayFirstChar = (displayName && displayName[0]) || '用';
    const selectedChildName = selectedChild?.name || '未选择';
    const selectedChildGradeText = selectedChild?.grade ? selectedChild.grade + '年级' : '未设置';
    const isParent = activeRole === 'parent';

    this.setData({
      user,
      displayName,
      displayFirstChar,
      activeRole,
      roleLabel: isParent ? '家长身份' : '孩子身份',
      roleThemeColor: isParent ? '#F43F7A' : '#8B5CF6',
      roleThemeColor2: isParent ? '#E11D5D' : '#7C3AED',
      selectedChild,
      selectedChildName,
      selectedChildGradeText,
    });

    if (activeRole === 'parent') {
      this.setData({ loading: true });
      await this.loadChildren();
      this.setData({ loading: false });
    }
  },

  async loadChildren() {
    try {
      const res = await api.get('/api/miniapp/children');
      this.setData({ children: res.children || [] });
    } catch (err) {
      console.error('加载孩子列表失败:', err);
    }
  },

  async generateBindCode(e) {
    const childId = e.currentTarget.dataset.childId;
    this.setData({ generatingChildId: childId });

    try {
      const res = await api.post(`/api/miniapp/children/${childId}/bind-code`);
      this.setData({
        bindCode: res.bindCode,
        bindCodeExpiry: res.expiresAt,
      });
    } catch (err) {
      wx.showToast({
        title: err.message || '生成失败',
        icon: 'none',
      });
    } finally {
      this.setData({ generatingChildId: null });
    }
  },

  copyBindCode() {
    wx.setClipboardData({
      data: this.data.bindCode,
      success() {
        wx.showToast({ title: '已复制', icon: 'success' });
      },
    });
  },

  closeBindModal() {
    this.setData({ bindCode: null, bindCodeExpiry: null });
  },

  switchChild() {
    wx.navigateTo({ url: '/pages/role-select/role-select?step=child&from=profile' });
  },

  switchRole() {
    wx.navigateTo({ url: '/pages/role-select/role-select' });
  },

  async logout() {
    const { confirm } = await wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
    });

    if (confirm) {
      auth.logout();
    }
  },

  preventTouchMove() {
    // 阻止遮罩层下方内容滚动
  },
});
