const api = require('../../utils/api');
const auth = require('../../utils/auth');
const storage = require('../../utils/storage');

Page({
  data: {
    user: null,
    displayName: '用户',
    displayFirstChar: '用',
    activeRole: null,
    selectedChild: null,
    selectedChildName: '未选择',
    selectedChildGradeText: '未设置',
    children: [],
    bindCode: null,
    bindCodeExpiry: null,
    generatingChildId: null,
  },

  onLoad() {
    this.loadProfile();
  },

  onShow() {
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

    this.setData({
      user,
      displayName,
      displayFirstChar,
      activeRole,
      selectedChild,
      selectedChildName,
      selectedChildGradeText,
    });

    if (activeRole === 'parent') {
      this.loadChildren();
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
});
