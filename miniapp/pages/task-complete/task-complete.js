const api = require('../../utils/api');
const storage = require('../../utils/storage');
const upload = require('../../utils/upload');

const categoryLabels = {
  chinese: '语文',
  math: '数学',
  english: '英语',
  science: '科学',
  art: '美术',
  music: '音乐',
  sport: '体育',
  thinking: '思维',
  habit: '习惯',
  other: '其他',
};

const difficultyLabels = {
  easy: '简单',
  medium: '适中',
  hard: '困难',
};

const statusOptions = [
  { value: 'done', label: '完成' },
  { value: 'partially_done', label: '部分完成' },
  { value: 'pending', label: '未完成' },
];

const qualityOptions = [
  { value: 'excellent', label: '优秀', icon: '/assets/icons/star.svg' },
  { value: 'good', label: '良好', icon: '/assets/icons/thumb-up.svg' },
  { value: 'average', label: '一般', icon: '/assets/icons/face-neutral.svg' },
  { value: 'needs_work', label: '需努力', icon: '/assets/icons/target.svg' },
];

let recordTimer = null;

Page({
  data: {
    statusBarHeight: 0,
    task: null,
    categoryLabel: '',
    taskFocus: '',
    taskDurationText: '',
    taskDifficulty: '',
    statusOptions,
    qualityOptions,
    form: {
      status: 'done',
      progress: 100,
      actualDurationMinutes: 0,
      quality: 'good',
      note: '',
    },
    imageUrls: [],
    audioUrl: '',
    recordingTranscript: '',
    isRecording: false,
    recordingDuration: 0,
    recordingDurationText: '00:00',
    submitting: false,
  },

  onLoad() {
    const app = getApp();
    this.setData({ statusBarHeight: app.globalData.statusBarHeight || 0 });

    const task = wx.getStorageSync('task_complete_pending') || null;
    wx.removeStorageSync('task_complete_pending');
    if (!task) {
      wx.showToast({ title: '未找到任务', icon: 'none' });
      wx.navigateBack();
      return;
    }

    console.log('[task-complete] loaded task:', task.id, task.focus);
    this.setTaskData(task);
  },

  onUnload() {
    this.stopRecordTimer();
  },

  setTaskData(task) {
    const duration = this.parseDuration(task.duration);
    const activeRole = storage.getActiveRole();
    const defaultNote = activeRole === 'parent' ? '家长代打卡' : '孩子自己打卡';

    this.setData({
      task,
      categoryLabel: categoryLabels[task.category] || '其他',
      taskFocus: task.focus || '未命名任务',
      taskDurationText: task.duration || '未设置',
      taskDifficulty: difficultyLabels[task.difficulty] || '',
      form: {
        status: 'done',
        progress: 100,
        actualDurationMinutes: duration,
        quality: 'good',
        note: defaultNote,
      },
    });
  },

  parseDuration(duration) {
    const match = String(duration || '').match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  },

  onStatusChange(e) {
    const status = e.currentTarget.dataset.value;
    let progress = this.data.form.progress;
    if (status === 'done') progress = 100;
    if (status === 'pending') progress = 0;
    this.setData({ 'form.status': status, 'form.progress': progress });
  },

  onProgressChange(e) {
    this.setData({ 'form.progress': e.detail.value });
  },

  onProgressChanging(e) {
    this.setData({ 'form.progress': e.detail.value });
  },

  onDurationInput(e) {
    const value = parseInt(e.detail.value, 10);
    this.setData({ 'form.actualDurationMinutes': isNaN(value) ? 0 : value });
  },

  onQualityChange(e) {
    this.setData({ 'form.quality': e.currentTarget.dataset.value });
  },

  onNoteInput(e) {
    this.setData({ 'form.note': e.detail.value });
  },

  chooseImage() {
    const remain = 9 - this.data.imageUrls.length;
    if (remain <= 0) {
      wx.showToast({ title: '最多9张照片', icon: 'none' });
      return;
    }

    upload.chooseImage(remain)
      .then((files) => {
        if (!files.length) return;
        wx.showLoading({ title: '上传中...', mask: true });
        const uploads = files.map((file) => upload.uploadFile(file.path, 'image'));
        return Promise.all(uploads);
      })
      .then((results) => {
        wx.hideLoading();
        if (!results) return;
        const urls = results.map((r) => r.url);
        this.setData({ imageUrls: this.data.imageUrls.concat(urls) });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({ title: err.message || '上传失败', icon: 'none' });
      });
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.imageUrls,
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const urls = this.data.imageUrls.slice();
    urls.splice(index, 1);
    this.setData({ imageUrls: urls });
  },

  onVoiceStart() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: () => this.startVoiceRecord(),
            fail: () => {
              wx.showModal({
                title: '需要录音权限',
                content: '请在设置中开启录音权限，用于语音转文字。',
                confirmText: '去设置',
                success: (r) => {
                  if (r.confirm) wx.openSetting();
                },
              });
            },
          });
        } else {
          this.startVoiceRecord();
        }
      },
    });
  },

  startVoiceRecord() {
    this.setData({ recordingTranscript: '', isRecording: true, recordingDuration: 0, recordingDurationText: '00:00' });
    this.startRecordTimer();
    upload.startRecord().catch((err) => {
      this.stopRecordTimer();
      this.setData({ isRecording: false });
      wx.showToast({ title: err && err.errMsg ? err.errMsg : '录音启动失败', icon: 'none' });
    });
  },

  onVoiceEnd() {
    if (!this.data.isRecording) return;

    upload.stopRecord()
      .then((file) => {
        this.stopRecordTimer();
        this.setData({ isRecording: false });

        wx.showLoading({ title: '上传语音...', mask: true });
        return upload.uploadFile(file.path, 'audio');
      })
      .then((data) => {
        this.setData({ audioUrl: data.url });
        wx.showToast({ title: '语音已保存', icon: 'success' });
        return this.transcribeAudio(data.url);
      })
      .catch((err) => {
        wx.hideLoading();
        this.stopRecordTimer();
        this.setData({ isRecording: false });
        wx.showToast({ title: err.message || '语音处理失败', icon: 'none' });
      });
  },

  transcribeAudio(audioUrl) {
    wx.showLoading({ title: '识别中...', mask: true });
    return api.post('/api/miniapp/transcribe', { audioUrl })
      .then((res) => {
        wx.hideLoading();
        if (res && res.transcript) {
          this.setData({ recordingTranscript: res.transcript });
        }
      })
      .catch((err) => {
        wx.hideLoading();
        console.log('[transcribe] error:', err.message || err);
      });
  },

  startRecordTimer() {
    this.stopRecordTimer();
    recordTimer = setInterval(() => {
      const duration = this.data.recordingDuration + 1;
      const m = Math.floor(duration / 60).toString().padStart(2, '0');
      const s = (duration % 60).toString().padStart(2, '0');
      this.setData({ recordingDuration: duration, recordingDurationText: `${m}:${s}` });
    }, 1000);
  },

  stopRecordTimer() {
    if (recordTimer) {
      clearInterval(recordTimer);
      recordTimer = null;
    }
  },

  clearTranscript() {
    this.setData({ recordingTranscript: '' });
  },

  appendTranscriptToNote() {
    const note = this.data.form.note || '';
    const transcript = this.data.recordingTranscript || '';
    const newNote = note ? `${note}\n${transcript}` : transcript;
    this.setData({ 'form.note': newNote, recordingTranscript: '' });
  },

  playAudio() {
    const url = this.data.audioUrl;
    if (!url) return;
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = url;
    innerAudioContext.play();
    innerAudioContext.onEnded(() => {
      innerAudioContext.destroy();
    });
  },

  deleteAudio() {
    this.setData({ audioUrl: '' });
  },

  preventTouchMove() {
    // 阻止录音时页面滚动
  },

  cancel() {
    wx.navigateBack();
  },

  submit() {
    if (this.data.submitting) return;

    const { task, form, imageUrls, audioUrl } = this.data;
    if (!task) return;

    const payload = {
      status: form.status,
      progress: form.progress,
      actualDurationMinutes: form.actualDurationMinutes || 0,
      quality: form.quality,
      note: form.note,
      imageUrls,
      audioUrls: audioUrl ? [audioUrl] : [],
      audioTranscript: this.data.recordingTranscript || undefined,
    };

    this.setData({ submitting: true });
    console.log('[task-complete] submit payload:', payload);
    api.post(`/api/miniapp/tasks/${task.id}/complete`, payload)
      .then((res) => {
        console.log('[task-complete] submit success:', res);
        wx.showToast({ title: '打卡成功', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 800);
      })
      .catch((err) => {
        const message = err.message || '打卡失败';
        console.error('[task-complete] submit failed:', message);
        wx.showModal({
          title: '打卡失败',
          content: `${message}\n\n如持续失败，请截图并检查网络。`,
          showCancel: false,
          confirmText: '知道了',
        });
      })
      .finally(() => {
        this.setData({ submitting: false });
      });
  },
});
