const storage = require('./storage');

function isLoggedIn() {
  return !!storage.getToken();
}

function getActiveRole() {
  return storage.getActiveRole();
}

function setActiveRole(role) {
  storage.setActiveRole(role);
}

function getSelectedChild() {
  return storage.getSelectedChild();
}

function setSelectedChild(child) {
  storage.setSelectedChild(child);
}

function logout() {
  storage.clearAll();
  wx.reLaunch({ url: '/pages/login/login' });
}

function checkLogin() {
  if (!isLoggedIn()) {
    wx.reLaunch({ url: '/pages/login/login' });
    return false;
  }
  return true;
}

module.exports = {
  isLoggedIn,
  getActiveRole,
  setActiveRole,
  getSelectedChild,
  setSelectedChild,
  logout,
  checkLogin,
};
