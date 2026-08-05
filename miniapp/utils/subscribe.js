const api = require('./api');

const TEMPLATE_IDS = {
  dailyReminder: '',
  taskCompleted: '',
  deadlineWarning: '',
};

function setTemplateIds(ids) {
  Object.assign(TEMPLATE_IDS, ids);
}

function getTemplateIds() {
  return Object.values(TEMPLATE_IDS).filter(Boolean);
}

async function requestSubscriptions() {
  const templateIds = getTemplateIds();
  if (templateIds.length === 0) return;

  try {
    const res = await wx.requestSubscribeMessage({ tmplIds: templateIds });
    await api.post('/api/miniapp/subscriptions', { results: res });
    return res;
  } catch (err) {
    console.error('订阅授权失败:', err);
    return null;
  }
}

async function requestDailyReminderSubscription() {
  if (!TEMPLATE_IDS.dailyReminder) return;

  try {
    const res = await wx.requestSubscribeMessage({
      tmplIds: [TEMPLATE_IDS.dailyReminder],
    });
    await api.post('/api/miniapp/subscriptions', { results: res });
    return res;
  } catch (err) {
    console.error('每日提醒订阅失败:', err);
    return null;
  }
}

module.exports = {
  setTemplateIds,
  getTemplateIds,
  requestSubscriptions,
  requestDailyReminderSubscription,
};
