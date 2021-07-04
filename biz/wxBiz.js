import { api } from "../utils/api.js";
import { setCache, getCache } from "../utils/cacheUtil.js";
import { sendPost } from "../utils/request.js";
import { userInfoKey, tokenKey, tokenInvalidMsg } from "../utils/constant.js";
import consoleUtil from "../utils/consoleUtil.js";
const app = getApp()

/**
 * 登录
 * @param {*} callback 
 */
function login(callback = null) {
  consoleUtil.log("微信登录")
  wx.login({
    success: (res) => {
      consoleUtil.log("微信登录成功")
      consoleUtil.log(res)
      let requsetData = {
        code: res.code,
      };
      consoleUtil.log("获取token")
      sendPost(api.login, requsetData, "", (response) => {
        consoleUtil.log(response)
        if (response.code === 1) {
          consoleUtil.log("获取token成功")
          // 缓存token
          setCache(tokenKey, response.data.token, response.data.expired_time)
          app.globalData.openid = response.data.user_info.openid
          if (response.data.has_wx_info === 1) {
            app.globalData.userInfo = response.data.user_info
            wx.setStorageSync(userInfoKey, response.data.user_info)
          }
          callback({
            "code": 1,
            "msg": response.msg,
          });
        } else {
          consoleUtil.log("获取token失败")
          callback({
            "code": -1,
            "msg": response.msg,
          });
        }
      });
    },
    fail: (e) => {
      consoleUtil.log("微信登录失败")
      consoleUtil.log(e)
    }
  });
}
/**
 * 更新用户信息
 * @param {*} callback 
 */
function updateUserInfo(callback = null) {
  wx.getUserProfile({
    lang: "zh_CN",
    desc: "完善用户信息",
    success: (res) => {
      consoleUtil.log("获取用户信息成功")
      consoleUtil.log(res)
      let requsetData = {
        encrypted_data: res.encryptedData,
        iv: res.iv
      };
      const token = getCache(tokenKey)
      if (!token) {
        if (callback) callback(tokenInvalidMsg);
      } else {
        sendPost(api.updateUserInfo, requsetData, token, (response) => {
          consoleUtil.log(response)
          if (response.code === 1) {
            consoleUtil.log("更新用户信息成功")
            app.globalData.userInfo = response.data;
            wx.setStorageSync(userInfoKey, response.data);
            callback({
              "code": 1,
              "msg": response.msg,
            });
          } else {
            consoleUtil.log("更新用户信息失败")
            callback({
              "code": -1,
              "msg": response.msg,
            });
          }
        });
      }
    },
    // 失败回调
    fail: (e) => {
      consoleUtil.log("获取用户信息失败")
      consoleUtil.log(e)
      callback({
        "code": -4,
        "msg": "获取用户信息失败",
      })
    }
  });
}

export {
  login,
  updateUserInfo,
}