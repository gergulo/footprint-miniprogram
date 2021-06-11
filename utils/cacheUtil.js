const deadlineKey = "_deadline"

/**
 * 设置
 * k 键key
 * v 值value
 * t 秒
 */
function set(k, v, t) {
  wx.setStorageSync(k, v)
  const seconds = parseInt(t)
  if (seconds > 0) {
    let newtime = Date.parse(new Date())
    newtime = newtime / 1000 + seconds;
    wx.setStorageSync(k + deadlineKey, newtime + "")
  } else {
    wx.removeStorageSync(k + deadlineKey)
  }
}
/**
 * 获取
 * k 键key
 */
function get(k) {
  const deadTime = parseInt(wx.getStorageSync(k + deadlineKey))
  if (deadTime) {
    if (parseInt(deadTime) < Date.parse(new Date()) / 1000) {
      remove(k);
      console.log(`缓存${k}过期了`)
      return null
    }
  }
  const res = wx.getStorageSync(k)
  if (res) {
    return res
  } else {
    return null
  }
}

/**
 * 删除
 */
function remove(k) {
  wx.removeStorageSync(k);
  wx.removeStorageSync(k + deadlineKey);
}

/**
 * 清除所有key
 */
function clear() {
  wx.clearStorageSync();
}
module.exports = {
  setCache: set,
  getCache: get,
  removeCache: remove,
  clearCache: clear
}
