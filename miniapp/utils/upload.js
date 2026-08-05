const app = getApp();
const storage = require('./storage');

function uploadFile(filePath, type) {
  return new Promise((resolve, reject) => {
    const token = storage.getToken();

    wx.uploadFile({
      url: `${app.globalData.apiBaseUrl}/api/miniapp/upload`,
      filePath,
      name: 'file',
      formData: { type },
      header: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      timeout: 60000,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(res.data);
            resolve(data);
          } catch {
            reject(new Error('解析上传结果失败'));
          }
        } else {
          let message = `上传失败 ${res.statusCode}`;
          try {
            const data = JSON.parse(res.data);
            message = data.error || message;
          } catch {}
          reject(new Error(message));
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '上传失败'));
      },
    });
  });
}

function chooseImage(count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const files = res.tempFiles.map((file) => ({
          path: file.tempFilePath,
          size: file.size,
          type: 'image',
        }));
        resolve(files);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

function chooseVideo() {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      success(res) {
        const file = res.tempFiles[0];
        resolve([{
          path: file.tempFilePath,
          size: file.size,
          type: 'video',
          duration: file.duration,
        }]);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

let recorderManager = null;
let recordingResolve = null;
let recordingReject = null;

function getRecorderManager() {
  if (!recorderManager) {
    recorderManager = wx.getRecorderManager();

    recorderManager.onStop((res) => {
      if (recordingResolve) {
        recordingResolve({
          path: res.tempFilePath,
          duration: res.duration,
          size: res.fileSize,
          type: 'audio',
        });
        recordingResolve = null;
        recordingReject = null;
      }
    });

    recorderManager.onError((err) => {
      if (recordingReject) {
        recordingReject(err);
        recordingResolve = null;
        recordingReject = null;
      }
    });
  }
  return recorderManager;
}

function startRecord(options = {}) {
  return new Promise((resolve, reject) => {
    const manager = getRecorderManager();
    const config = {
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 32000,
      format: 'aac',
      ...options,
    };

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              manager.start(config);
              resolve();
            },
            fail(err) {
              reject(err);
            },
          });
        } else {
          manager.start(config);
          resolve();
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

function stopRecord() {
  return new Promise((resolve, reject) => {
    recordingResolve = resolve;
    recordingReject = reject;
    getRecorderManager().stop();
  });
}

module.exports = {
  uploadFile,
  chooseImage,
  chooseVideo,
  startRecord,
  stopRecord,
};
