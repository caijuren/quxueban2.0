const api = require('../../utils/api');
const auth = require('../../utils/auth');
const storage = require('../../utils/storage');
const upload = require('../../utils/upload');

const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
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

const guestTasks = [
  {
    id: 'guest-1',
    focus: '阅读课外书 30 分钟',
    category: 'reading',
    duration: '30分钟',
    status: 'pending',
    evidence: { images: [], audios: [], transcript: '' },
  },
  {
    id: 'guest-2',
    focus: '数学练习',
    category: 'school',
    duration: '20分钟',
    status: 'pending',
    evidence: { images: [], audios: [], transcript: '' },
  },
  {
    id: 'guest-3',
    focus: '跳绳',
    category: 'sport',
    duration: '5分钟',
    status: 'done',
    evidence: { images: [], audios: [], transcript: '' },
  },
];

Page({
  data: {
    activeRole: null,
    selectedChild: null,
    isGuest: true,
    todayName: '',
    todayDate: '',
    tasks: [],
    doneCount: 0,
    totalCount: 0,
    pendingCount: 0,
    hasDoneTasks: false,
    hasPendingTasks: false,
    progressPercent: 0,
    loading: true,
    completingTaskId: null,
    recordingTaskId: null,
    isRecording: false,
    recordDuration: 0,
    recordTimer: null,
    statusBarHeight: 0,
    children: [],
    childPickerVisible: false,
  },

  onLoad() {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 0 });
    this.checkAuth();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    this.checkAuth();
  },

  onUnload() {
    this.clearRecordTimer();
  },

  onPullDownRefresh() {
    console.log('[tasks] pull down refresh');
    this.checkAuth();
    wx.stopPullDownRefresh();
  },

  checkAuth() {
    const activeRole = auth.getActiveRole();
    const selectedChild = auth.getSelectedChild();
    const isGuest = !storage.getToken();

    const now = new Date();
    this.setData({
      activeRole,
      selectedChild,
      isGuest,
      todayName: dayNames[now.getDay()],
      todayDate: `${now.getMonth() + 1}月${now.getDate()}日`,
      todayIso: now.toISOString().split('T')[0],
    });

    if (isGuest) {
      this.loadGuestTasks();
      return;
    }

    if (!activeRole || !selectedChild) {
      wx.reLaunch({ url: '/pages/role-select/role-select' });
      return;
    }

    console.log('[tasks] checkAuth child:', selectedChild.id, selectedChild.name);

    if (activeRole === 'parent') {
      this.loadChildren();
    }

    this.loadTasks();
  },

  async loadChildren() {
    try {
      const res = await api.get('/api/miniapp/children');
      this.setData({ children: res.children || [] });
    } catch (err) {
      console.error('加载孩子列表失败:', err);
    }
  },

  openChildPicker() {
    if (this.data.activeRole !== 'parent') return;

    if (this.data.children.length === 0) {
      wx.showModal({
        title: '暂无孩子',
        content: '当前账号下没有可管理的孩子，请先在 Web 端添加孩子信息。',
        showCancel: false,
        confirmText: '知道了',
      });
      return;
    }

    if (this.data.children.length === 1) {
      wx.showToast({
        title: '只有一个孩子，无需切换',
        icon: 'none',
      });
      return;
    }

    this.setData({ childPickerVisible: true });
  },

  closeChildPicker() {
    this.setData({ childPickerVisible: false });
  },

  selectChildInPicker(e) {
    const child = e.currentTarget.dataset.child;
    auth.setSelectedChild(child);
    this.setData({ selectedChild: child, childPickerVisible: false });
    this.loadTasks();
  },

  loadGuestTasks() {
    const tasks = guestTasks.map((task) => ({
      ...task,
      evidence: { images: [], audios: [], transcript: '' },
    }));
    const doneCount = tasks.filter((t) => t.status === 'done').length;
    const totalCount = tasks.length;
    const pendingCount = totalCount - doneCount;
    this.setData({
      tasks,
      doneCount,
      totalCount,
      pendingCount,
      hasDoneTasks: doneCount > 0,
      hasPendingTasks: pendingCount > 0,
      progressPercent: totalCount ? Math.round((doneCount / totalCount) * 100) : 0,
      loading: false,
    });
  },

  async loadTasks() {
    if (!this.data.selectedChild) return;

    this.setData({ loading: true });

    try {
      const res = await api.get('/api/miniapp/tasks/today', {
        childId: this.data.selectedChild.id,
      });
      const tasks = (res.tasks || []).map((task) => ({
        ...task,
        evidence: this.getEvidence(task),
      }));
      const doneCount = tasks.filter((t) => t.status === 'done').length;
      const totalCount = tasks.length;
      const pendingCount = totalCount - doneCount;
      console.log('[tasks] loaded tasks:', totalCount, 'done:', doneCount);
      this.setData({
        tasks,
        doneCount,
        totalCount,
        pendingCount,
        hasDoneTasks: doneCount > 0,
        hasPendingTasks: pendingCount > 0,
        progressPercent: totalCount ? Math.round((doneCount / totalCount) * 100) : 0,
      });
    } catch (err) {
      console.error('[tasks] loadTasks failed:', err.message || err);
      wx.showToast({
        title: err.message || '获取任务失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  async completeTask(e) {
    const task = e.currentTarget.dataset.task;
    if (!task) return;

    if (this.data.isGuest) {
      const { confirm } = await wx.showModal({
        title: '登录后打卡',
        content: '体验模式下无法打卡，登录后即可记录孩子的学习成长。',
        confirmText: '去登录',
        cancelText: '再看看',
      });
      if (confirm) {
        wx.navigateTo({ url: '/pages/login/login' });
      }
      return;
    }

    wx.setStorageSync('task_complete_pending', task);
    wx.navigateTo({ url: '/pages/task-complete/task-complete' });
  },

  async completeWithImage(task) {
    try {
      const files = await upload.chooseImage(1);
      if (!files.length) return;

      wx.showLoading({ title: '上传中...', mask: true });
      const res = await upload.uploadFile(files[0].path, 'image');
      wx.hideLoading();

      await this.submitComplete(task, { imageUrls: [res.url] });
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: err.message || '上传图片失败',
        icon: 'none',
      });
    }
  },

  startVoiceModal(task) {
    this.setData({ recordingTaskId: task.id, recordDuration: 0 });
  },

  closeVoiceModal() {
    if (this.data.isRecording) {
      this.stopVoiceRecord();
    }
    this.setData({ recordingTaskId: null, isRecording: false, recordDuration: 0 });
  },

  async onVoiceRecordStart() {
    const task = this.data.tasks.find((t) => t.id === this.data.recordingTaskId);
    if (!task) return;

    try {
      await upload.startRecord();
      this.setData({ isRecording: true });
      this.startRecordTimer();
    } catch (err) {
      wx.showToast({
        title: '录音权限被拒绝',
        icon: 'none',
      });
    }
  },

  async onVoiceRecordEnd() {
    if (!this.data.isRecording) return;

    this.clearRecordTimer();
    this.setData({ isRecording: false });

    try {
      wx.showLoading({ title: '上传中...', mask: true });
      const file = await upload.stopRecord();
      const res = await upload.uploadFile(file.path, 'audio');
      wx.hideLoading();

      const task = this.data.tasks.find((t) => t.id === this.data.recordingTaskId);
      this.setData({ recordingTaskId: null, recordDuration: 0 });

      if (task) {
        await this.submitComplete(task, { audioUrls: [res.url] });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: err.message || '录音失败',
        icon: 'none',
      });
      this.setData({ recordingTaskId: null, recordDuration: 0 });
    }
  },

  startRecordTimer() {
    this.clearRecordTimer();
    const timer = setInterval(() => {
      this.setData({ recordDuration: this.data.recordDuration + 1 });
    }, 1000);
    this.setData({ recordTimer: timer });
  },

  clearRecordTimer() {
    if (this.data.recordTimer) {
      clearInterval(this.data.recordTimer);
      this.setData({ recordTimer: null });
    }
  },

  formatDuration(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  },

  async submitComplete(task, evidence) {
    if (this.data.completingTaskId) return;

    const isParent = this.data.activeRole === 'parent';
    this.setData({ completingTaskId: task.id });

    const payload = {
      status: 'done',
      progress: 100,
      actualDurationMinutes: this.parseDuration(task.duration),
      note: isParent ? '家长代打卡' : '孩子自己打卡',
      imageUrls: evidence.imageUrls || [],
      audioUrls: evidence.audioUrls || [],
    };
    console.log('[miniapp complete] quick submit payload:', payload);

    try {
      const res = await api.post(`/api/miniapp/tasks/${task.id}/complete`, payload);
      console.log('[miniapp complete] quick submit success:', res);

      wx.showToast({
        title: '打卡成功',
        icon: 'success',
      });

      this.loadTasks();
    } catch (err) {
      console.error('[miniapp complete] quick submit failed:', err.message || err);
      wx.showToast({
        title: err.message || '打卡失败',
        icon: 'none',
      });
    } finally {
      this.setData({ completingTaskId: null });
    }
  },

  parseDuration(duration) {
    const match = String(duration || '').match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  },

  getCategoryLabel(category) {
    return categoryLabels[category] || '其他';
  },

  getCategoryColor(category) {
    return categoryColors[category] || '#94A3B8';
  },

  getEvidence(task) {
    const records = task.completionRecords || [];
    const today = this.data.todayIso || new Date().toISOString().split('T')[0];
    const record = records.find((r) => r.date === today);
    if (!record) return { images: [], audios: [], transcript: '' };
    return {
      images: record.imageUrls || [],
      audios: record.audioUrls || [],
      transcript: record.audioTranscript || '',
    };
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({ urls: [url], current: url });
  },

  playAudio(e) {
    const url = e.currentTarget.dataset.url;
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = url;
    innerAudioContext.play();
    innerAudioContext.onError(() => {
      wx.showToast({ title: '播放失败', icon: 'none' });
    });
  },

  switchChild() {
    wx.navigateTo({ url: '/pages/role-select/role-select?step=child' });
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  preventTouchMove() {
    // 阻止遮罩层下方内容滚动
  },
});
