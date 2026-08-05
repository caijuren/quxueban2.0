const storage = require('./storage');

function getApiBaseUrl() {
  const app = getApp();
  if (!app || !app.globalData) {
    console.error('getApp() 未初始化');
    return '';
  }
  return app.globalData.apiBaseUrl || '';
}

function request(options) {
  return new Promise((resolve, reject) => {
    const token = storage.getToken();
    const activeRole = storage.getActiveRole();
    const selectedChild = storage.getSelectedChild();
    const apiBaseUrl = getApiBaseUrl();

    if (!apiBaseUrl) {
      reject(new Error('API 地址未配置'));
      return;
    }

    const header = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(activeRole ? { 'X-Active-Role': activeRole } : {}),
      ...(selectedChild ? { 'X-Selected-Child': selectedChild.id } : {}),
    };

    wx.request({
      url: `${apiBaseUrl}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: { ...header, ...(options.header || {}) },
      timeout: 30000,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          storage.clearAll();
          wx.reLaunch({ url: '/pages/login/login' });
          reject(new Error('登录已过期'));
        } else {
          const message = res.data?.error || res.data?.message || `请求失败 ${res.statusCode}`;
          reject(new Error(message));
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'));
      },
    });
  });
}

module.exports = {
  get(url, params) {
    return request({ url, method: 'GET', data: params });
  },

  post(url, data) {
    return request({ url, method: 'POST', data });
  },

  put(url, data) {
    return request({ url, method: 'PUT', data });
  },

  del(url) {
    return request({ url, method: 'DELETE' });
  },
};
