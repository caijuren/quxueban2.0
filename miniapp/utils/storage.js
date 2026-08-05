const TOKEN_KEY = 'miniapp_token';
const USER_KEY = 'miniapp_user';
const ROLE_KEY = 'miniapp_active_role';
const CHILD_KEY = 'miniapp_selected_child';

module.exports = {
  setToken(token) {
    return wx.setStorageSync(TOKEN_KEY, token);
  },

  getToken() {
    return wx.getStorageSync(TOKEN_KEY);
  },

  removeToken() {
    return wx.removeStorageSync(TOKEN_KEY);
  },

  setUser(user) {
    return wx.setStorageSync(USER_KEY, user);
  },

  getUser() {
    return wx.getStorageSync(USER_KEY) || null;
  },

  removeUser() {
    return wx.removeStorageSync(USER_KEY);
  },

  setActiveRole(role) {
    return wx.setStorageSync(ROLE_KEY, role);
  },

  getActiveRole() {
    return wx.getStorageSync(ROLE_KEY) || null;
  },

  removeActiveRole() {
    return wx.removeStorageSync(ROLE_KEY);
  },

  setSelectedChild(child) {
    return wx.setStorageSync(CHILD_KEY, child);
  },

  getSelectedChild() {
    return wx.getStorageSync(CHILD_KEY) || null;
  },

  removeSelectedChild() {
    return wx.removeStorageSync(CHILD_KEY);
  },

  clearAll() {
    wx.removeStorageSync(TOKEN_KEY);
    wx.removeStorageSync(USER_KEY);
    wx.removeStorageSync(ROLE_KEY);
    wx.removeStorageSync(CHILD_KEY);
  },
};
