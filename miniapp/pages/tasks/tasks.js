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

Page({
  data: {
    activeRole: null,
    selectedChild: null,
    todayName: '',
    todayDate: '',
    tasks: [],
    doneCount: 0,
    totalCount: 0,
    hasDoneTasks: false,
    loading: true,
    completingTaskId: null,
    recordingTaskId: null,
    isRecording: false,
    recordDuration: 0,
    recordTimer: null,
  },

  onLoad() {
    this.checkAuth();
  },

  onShow() {
    this.checkAuth();
    if (this.data.activeRole && this.data.selectedChild) {
      this.loadTasks();
    }
  },

  onUnload() {
    this.clearRecordTimer();
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

    const now = new Date();
    this.setData({
      activeRole,
      selectedChild,
      todayName: dayNames[now.getDay()],
      todayDate: now.toISOString().split('T')[0],
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
      this.setData({
        tasks,
        doneCount,
        totalCount,
        hasDoneTasks: doneCount > 0,
      });
    } catch (err) {
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
    if (!task || this.data.completingTaskId) return;

    const isParent = this.data.activeRole === 'parent';

    const { tapIndex } = await wx.showActionSheet({
      itemList: ['直接打卡', '拍照/选图打卡', '语音打卡'],
    });

    if (tapIndex === 0) {
      await this.submitComplete(task, { imageUrls: [], audioUrls: [] });
    } else if (tapIndex === 1) {
      await this.completeWithImage(task);
    } else if (tapIndex === 2) {
      this.startVoiceModal(task);
    }
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

    try {
      await api.post(`/api/miniapp/tasks/${task.id}/complete`, {
        status: 'done',
        progress: 100,
        actualDurationMinutes: this.parseDuration(task.duration),
        note: isParent ? '家长代打卡' : '孩子自己打卡',
        imageUrls: evidence.imageUrls || [],
        audioUrls: evidence.audioUrls || [],
      });

      wx.showToast({
        title: '打卡成功',
        icon: 'success',
      });

      this.loadTasks();
    } catch (err) {
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
    const today = this.data.todayDate;
    const record = records.find((r) => r.date === today);
    if (!record) return { images: [], audios: [] };
    return {
      images: record.imageUrls || [],
      audios: record.audioUrls || [],
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

  goProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },
});
