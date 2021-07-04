// app.js
import consoleUtil from "utils/consoleUtil.js";
import { userInfoKey, tokenKey } from "utils/constant.js";
import { getCache } from "utils/cacheUtil.js";

App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync("logs") || []
    // logs.unshift(Date.now())
    // wx.setStorageSync("logs", logs)
    // 检测小程序更新
    // this.checkUpdate();
    // 检测token
    this.checkToken();
  },
  /**
   * 检测小程序更新
   */
  checkUpdate(){
    if (wx.canIUse("getUpdateManager")) {
      consoleUtil.log("检测小程序更新")
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        consoleUtil.log("检测小程序更新成功")
        consoleUtil.log(res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启小程序？",
              success: (res) => {
                consoleUtil.log("用户确认重启小程序进行更新")
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(() => {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            })
          })
        }
      })
    } 
  },
  /**
   * 检测token
   */
  checkToken(){
    consoleUtil.log("检测token")
    const token = getCache(tokenKey)
    if (!token) {
      consoleUtil.log("token过期")
      wx.removeStorageSync(userInfoKey);
      this.globalData.userInfo = null;
      this.globalData.openid = "";
    } else {
      consoleUtil.log("token有效，读取用户信息")
      const userInfo = wx.getStorageSync(userInfoKey);
      consoleUtil.log(userInfo)
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.openid = userInfo.openid;
      }
    }
  },
  /**
   * 全局信息
   */
  globalData: {
    userInfo: null,
    openid:""
  }
})
