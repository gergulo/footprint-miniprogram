// pages/statistics/index.js
import Toast from "@vant/weapp/toast/toast";
import { defaultLnglat } from "../../utils/constant.js";
import { getList, getCount } from "../../biz/signBiz.js";
import { formatDate } from "../../utils/util.js"
const consoleUtil = require("../../utils/consoleUtil.js");
const defaultPageSize = 10000;
// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    authorizeShow: false, // 登录授权确认弹框
    latitude: defaultLnglat.latitude,
    longitude: defaultLnglat.longitude,
    list: [], // 打卡信息列表
    totalCount: 0, //打卡信息总数
    todayCount: 0, //今天打卡数
    markers: [], //标记点用于在地图上显示标记的位置
    queryType: 0, //查询类型：0-今日打卡，1-累计打卡
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
      // 初始化数据
      this.initData();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  /**
   * 检查登录
   */
  checkLogin() {
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
      return true
    } else {
      this.setData({
        authorizeShow: true
      })
      return false
    }
  },
  /**
   * 初始化数据
   */
  initData() {
    // 获取当天打卡信息列表
    this.querySignList();
    // 获取累计打卡数量
    this.querySignCount(1);
  },
  /**
   * 查询打卡信息列表
   */
  querySignList(type = 0) {
    this.setData({
      queryType: type
    })
    let query_date = "";
    if (type === 0) {
      query_date = formatDate(new Date())
    }
    const queyData = {
      current: 1,
      size: defaultPageSize,
      query_date: query_date,
      query_type: 1
    };
    consoleUtil.log(queyData)
    Toast.loading({
      message: "加载中...",
      duration: 0,
      forbidClick: true,
    });
    getList(queyData, (res) => {
      Toast.clear()
      consoleUtil.log("getList结果");
      consoleUtil.log(res);
      if (res.code === 1) {
        this.setData({
          list: [...this.data.list, ...res.data.page.records],
        })
        switch (type) {
          case 0:
            this.setData({
              todayCount: res.data.page.total
            })
            break;
          case 1:
            this.setData({
              totalCount: res.data.page.total
            })
            break;
        }
        this.showMap()
      } else {
        Toast.success(res.msg);
      }
    })
  },
  /**
   * 查询打卡信息数量
   */
  querySignCount(type = 0) {
    let query_date = "";
    if (type === 0) {
      query_date = formatDate(new Date())
    }
    const queyData = {
      query_date: query_date
    };
    consoleUtil.log(queyData)
    getCount(queyData, (res) => {
      consoleUtil.log("getCount结果");
      consoleUtil.log(res);
      if (res.code === 1) {
        switch (type) {
          case 0:
            this.setData({
              todayCount: res.data.data_count
            })
            break;
          case 1:
            this.setData({
              totalCount: res.data.data_count
            })
            break;
        }
      }
    })
  },
  /**
   * 地图上面显示定位点
   */
  showMap() {
    const list = this.data.list;
    const markers = [];
    if (list && list.length > 0) {
      consoleUtil.log(list)
      const lastOneData = list[0]
      this.setData({
        latitude: lastOneData.lat,
        longitude: lastOneData.lng
      })
    }
    list.forEach((item) => {
      markers.push({
        id: item.id,
        iconPath: "../../static/loc2.png",
        longitude: item.lng,
        latitude: item.lat,
        width: "40rpx",
        height: "52rpx",
        callout: {
          content: `${item.address}\r\n${item.create_time}`,
          borderRadius: "5rpx",
          padding: "15rpx",
          // bgColor: "rgba(255, 255, 255, 0.8)", // 背景色不支持透明
          bgColor: "#fff",
          textAlign: "left",
          fontSize: "26rpx"
        }
      });
    })
    // consoleUtil.log(markers)
    this.setData({
      markers: markers
    })
  },
})