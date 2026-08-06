const api = require('../../utils/api');
const auth = require('../../utils/auth');
const storage = require('../../utils/storage');

const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const dayNameList = dayNames;
const categoryLabels = {
  school: '学科',
  reading: '阅读',
  sport: '运动',
  interest: '兴趣',
  ability: '能力',
  other: '其他',
};
const categoryColors = {
  school: '#06B6D4',
  reading: '#8B5CF6',
  sport: '#22C55E',
  interest: '#F59E0B',
  ability: '#EC4899',
  other: '#94A3B8',
};
const subjectLabels = {
  chinese: '语文',
  math: '数学',
  english: '英语',
};

Page({
  data: {
    statusBarHeight: 0,
    selectedChild: null,
    activeRole: null,
    loading: true,
    weekId: '',
    weekLabel: '',
    todayIndex: 0,
    selectedDayIndex: 0,
    dayNames: dayNameList,
    stats: {
      total: 0,
      done: 0,
      pending: 0,
      completionRate: 0,
      estimatedMinutes: 0,
    },
    dayTasks: [],
  },

  onLoad() {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 0 });
    this.checkAuth();
  },

  onShow() {
    this.checkAuth();
  },

  onPullDownRefresh() {
    this.loadPlan();
    wx.stopPullDownRefresh();
  },

  checkAuth() {
    const activeRole = auth.getActiveRole();
    const selectedChild = auth.getSelectedChild();

    if (!storage.getToken()) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }

    if (!activeRole || !selectedChild) {
      wx.reLaunch({ url: '/pages/role-select/role-select' });
      return;
    }

    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

    this.setData({ activeRole, selectedChild, todayIndex, selectedDayIndex: todayIndex });
    this.loadPlan();
  },

  async loadPlan() {
    if (!this.data.selectedChild) return;

    this.setData({ loading: true });

    try {
      const res = await api.get('/api/miniapp/weekly-plans/current', {
        childId: this.data.selectedChild.id,
      });

      const stats = res.stats || {
        total: 0,
        done: 0,
        pending: 0,
        completionRate: 0,
        estimatedMinutes: 0,
      };

      this.setData({
        weekId: res.weekId || '',
        weekLabel: this.formatWeekLabel(res.weekId),
        stats,
      });

      this.updateDayTasks(res.tasks || []);
    } catch (err) {
      console.error('[weekly] loadPlan failed:', err.message || err);
      wx.showToast({
        title: err.message || '加载周计划失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  formatWeekLabel(weekId) {
    if (!weekId) return '';
    const match = String(weekId).match(/^(\d{4})-W(\d{2})$/);
    if (!match) return weekId;
    return `${match[1]}年 第${parseInt(match[2], 10)}周`;
  },

  updateDayTasks(tasks) {
    const day = dayNames[this.data.selectedDayIndex];
    const filtered = tasks
      .filter((t) => t.day === day)
      .map((t) => ({
        ...t,
        categoryLabel: this.getCategoryLabel(t.category),
        categoryColor: this.getCategoryColor(t.category),
        subjectLabel: subjectLabels[t.subjectId] || '',
        done: t.status === 'done',
      }));

    this.setData({ dayTasks: filtered });
  },

  selectDay(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedDayIndex: index }, () => {
      this.loadPlan();
    });
  },

  getCategoryLabel(category) {
    return categoryLabels[category] || '其他';
  },

  getCategoryColor(category) {
    return categoryColors[category] || '#94A3B8';
  },

  navigateToTask(e) {
    const task = e.currentTarget.dataset.task;
    if (!task) return;

    wx.setStorageSync('task_complete_pending', task);
    wx.navigateTo({ url: '/pages/task-complete/task-complete' });
  },
});
