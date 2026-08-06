const api = require('../../utils/api');
const auth = require('../../utils/auth');
const storage = require('../../utils/storage');

const statusLabels = {
  pending: '待完成',
  in_progress: '进行中',
  completed: '已完成',
};

const statusColors = {
  pending: '#94A3B8',
  in_progress: '#F59E0B',
  completed: '#22C55E',
};

Page({
  data: {
    statusBarHeight: 0,
    selectedChild: null,
    activeRole: null,
    loading: true,
    weeklyStats: {
      total: 0,
      done: 0,
      pending: 0,
      completionRate: 0,
      estimatedMinutes: 0,
    },
    streak: 0,
    todayDone: 0,
    todayMinutes: 0,
    badges: [],
    milestones: [],
    completionDeg: 0,
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
    this.loadGrowthCard();
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

    this.setData({ activeRole, selectedChild });
    this.loadGrowthCard();
  },

  async loadGrowthCard() {
    if (!this.data.selectedChild) return;

    this.setData({ loading: true });

    try {
      const res = await api.get('/api/miniapp/growth-card', {
        childId: this.data.selectedChild.id,
      });

      const badges = (res.badges || []).map((b) => ({
        ...b,
        unlockedText: this.formatDate(b.unlockedAt),
      }));

      const milestones = (res.milestones || []).map((m) => ({
        ...m,
        statusLabel: statusLabels[m.status] || '待完成',
        statusColor: statusColors[m.status] || '#94A3B8',
        dateText: m.completedAt ? this.formatDate(m.completedAt) : this.formatTarget(m),
      }));

      const completionRate = res.weeklyStats?.completionRate || 0;
      const completionDeg = Math.round((completionRate / 100) * 360);

      this.setData({
        weeklyStats: res.weeklyStats || this.data.weeklyStats,
        streak: res.streak || 0,
        todayDone: res.todayDone || 0,
        todayMinutes: res.todayMinutes || 0,
        badges,
        milestones,
        completionDeg,
      });
    } catch (err) {
      console.error('[growth-card] load failed:', err.message || err);
      wx.showToast({
        title: err.message || '加载成长卡片失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  },

  formatTarget(milestone) {
    if (milestone.targetPeriod) return milestone.targetPeriod;
    if (milestone.targetGrade) return `${milestone.targetGrade}年级`;
    return '未设定期限';
  },
});
