import { api } from "../utils/api.js";
import { getCache } from "../utils/cacheUtil.js";
import { sendPost, sendGet } from "../utils/request.js";
import { tokenKey, tokenInvalidMsg } from "../utils/constant.js";
const consoleUtil = require("../utils/consoleUtil.js");

/**
 * 打卡
 * @param {*} requsetData 
 * @param {*} callback 
 */
function sign(requsetData, callback = null) {
  const token = getCache(tokenKey)
  if (!token) {
    if (callback) callback(tokenInvalidMsg);
  } else {
    sendPost(api.sign, requsetData, token, (res) => {
      consoleUtil.log(res)
      if (res.code === 1) {
        callback({
          "code": 1,
          "msg": res.msg,
        });
      } else {
        callback({
          "code": -1,
          "msg": res.msg,
        });
      }
    });
  }
}

/**
 * 上传照片
 * @param {*} callback 
 */
function uploadPhoto(filePath, callback = null) {
  const token = getCache(tokenKey)
  if (!token) {
    if (callback) callback(tokenInvalidMsg);
  } else {
    wx.uploadFile({
      url: api.uploadPhoto,
      filePath: filePath,
      header: { "x-token": token },
      name: "file",
      success(res) {
        if (res.statusCode === 200) {
          if (callback) {
            callback(JSON.parse(res.data));
          }
        } else {
          if (callback) {
            callback({
              "code": -101,
              "msg": "请求服务器异常_状态" + res.statusCode,
            });
          }
        }
      },
      fail(err) {
        if (callback) {
          callback({
            "code": -102,
            "msg": "发送请求失败_fail",
          });
        }
      }
    });
  }
}

/**
 * 获取打卡信息列表
 * @param {*} requsetData 
 * @param {*} callback 
 */
function getList(requsetData, callback = null) {
  const token = getCache(tokenKey)
  if (!token) {
    if (callback) callback(tokenInvalidMsg);
  } else {
    sendPost(api.getSignList, requsetData, token, (res) => {
      consoleUtil.log(res)
      if (res.code === 1) {
        callback({
          "code": 1,
          "msg": res.msg,
          "data": res.data
        });
      } else if (res.code === 0) {
        callback({
          "code": 0,
          "msg": res.msg,
        });
      } else {
        callback({
          "code": -1,
          "msg": res.msg,
        });
      }
    });
  }
}

/**
 * 获取打卡信息
 * @param {*} requsetData 
 * @param {*} callback 
 */
function getDetail(requsetData, callback = null) {
  const token = getCache(tokenKey)
  if (!token) {
    if (callback) callback(tokenInvalidMsg);
  } else {
    sendGet(api.getSignDetail, requsetData, token, (res) => {
      consoleUtil.log(res)
      if (res.code === 1) {
        callback({
          "code": 1,
          "msg": res.msg,
          "data": res.data
        });
      } else if (res.code === 0) {
        callback({
          "code": 0,
          "msg": res.msg,
        });
      } else {
        callback({
          "code": -1,
          "msg": res.msg,
        });
      }
    });
  }
}

/**
 * 删除打卡信息
 * @param {*} requsetData 
 * @param {*} callback 
 */
function deleteSign(requsetData, callback = null) {
  const token = getCache(tokenKey)
  if (!token) {
    if (callback) callback(tokenInvalidMsg);
  } else {
    sendGet(api.deleteSign, requsetData, token, (res) => {
      consoleUtil.log(res)
      if (res.code === 1) {
        callback({
          "code": 1,
          "msg": res.msg,
          "data": res.data
        });
      } else if (res.code === 0) {
        callback({
          "code": 0,
          "msg": res.msg,
        });
      } else {
        callback({
          "code": -1,
          "msg": res.msg,
        });
      }
    });
  }
}

/**
 * 获取打卡数
 * @param {*} requsetData 
 * @param {*} callback 
 */
function getCount(requsetData, callback = null) {
  const token = getCache(tokenKey)
  if (!token) {
    if (callback) callback(tokenInvalidMsg);
  } else {
    sendPost(api.getSignCount, requsetData, token, (res) => {
      consoleUtil.log(res)
      if (res.code === 1) {
        callback({
          "code": 1,
          "msg": res.msg,
          "data": res.data
        });
      } else {
        callback({
          "code": -1,
          "msg": res.msg,
        });
      }
    });
  }
}
module.exports = {
  uploadPhoto: uploadPhoto,
  sign: sign,
  getList: getList,
  getDetail: getDetail,
  deleteSign: deleteSign,
  getCount: getCount
}