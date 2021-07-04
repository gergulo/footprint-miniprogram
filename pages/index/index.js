// index.js
import Dialog from "@vant/weapp/dialog/dialog";
import Toast from "@vant/weapp/toast/toast";
import { tencentAk, defaultLnglat } from "../../utils/constant.js";
import consoleUtil from "../../utils/consoleUtil.js";
const QQMapWX = require("../../libs/qqmap-wx-jssdk.min.js");
// 获取应用实例
const app = getApp()
const mapId = "map";
let qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    centerLatitude: defaultLnglat.latitude,
    centerLongitude: defaultLnglat.longitude,
    centerAddress: "",
    //搜索到的中心区域地址信息,用于携带到选择地址页面
    centerAddressInfo: {},
    markers: [],
    hasUserInfo: false,
    authorizeShow: false, // 登录授权确认弹框
    signShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 检查设置
    this.checkSetting()
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
   * 检查设置
   */
  checkSetting() {
    // 查询用户授权
    wx.getSetting({
      success: (res) => {
        consoleUtil.log("查询用户授权配置成功")
        consoleUtil.log(res)
        if (res.authSetting["scope.userLocation"]) {
          // 已授权，直接初始化地图
          this.initMap()
        } else {
          consoleUtil.log("用户未授权获取用户位置")
          // 获取授权
          wx.authorize({
            scope: "scope.userLocation",
            success: () => {
              consoleUtil.log("用户同意小程序获取位置消息")
              // 初始化地图
              this.initMap()
            },
            fail: (e) => {
              consoleUtil.log("获取用户位置授权失败")
              consoleUtil.log(e)
              this.setData({
                isLocation: false // 定位失败
              })
              Dialog.alert({
                message: "请允许小程序获取位置消息",
              }).then(() => {
                // 打开设置界面
                wx.openSetting({
                  success: (res) => {
                    // 判断是否授权成功
                    if (res.authSetting["scope.userLocation"]) {
                      consoleUtil.log("用户修改设置，同意小程序获取位置消息")
                      // 初始化地图
                      this.initMap()
                    }
                  }
                })
              });
            }
          })
        }
      }
    })
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
   * 初始化地图
   */
  initMap() {
    // 实例化qqmapsdk
    qqmapsdk = new QQMapWX({ key: tencentAk });
    this.requestLocation();
  },
  /**
   * 获取定位
   */
  requestLocation() {
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        consoleUtil.log("获取定位");
        consoleUtil.log(res);
        // 移动到中心点
        this.moveToLocation(res.latitude, res.longitude);
      },
      fail: (e) => {
        consoleUtil.log("获取定位失败");
        consoleUtil.log(e);
      }
    });
  },
  /**
   * 移动到中心点
   */
  moveToLocation(latitude, longitude) {
    //mapId 就是你在 map 标签中定义的 id
    let mapCtx = wx.createMapContext(mapId);
    mapCtx.moveToLocation({
      latitude: latitude,
      longitude: longitude,
      success: () => {
        consoleUtil.log(`移动到定位点, latitude=${latitude}, longitude=${longitude}`)
        // 设置中心点
        this.setCenterLocation(latitude, longitude);
        // 识别地址
        this.regeocodeAddress(latitude, longitude);
      },
    });

  },
  /**
   * 拖动地图回调
   * @param {*} res
   */
  onRegionChange(res) {
    consoleUtil.log(`地图移动，type=${res.type}，causedBy=${res.causedBy}`)
    if (res.type === "end" && res.causedBy !== "update") {
      // 地图移动结束
      consoleUtil.log("地图拉动结束")
      // 获取中心点坐标
      let mapCtx = wx.createMapContext(mapId);
      mapCtx.getCenterLocation({
        success: (res) => {
          consoleUtil.log("获取中心点坐标");
          consoleUtil.log(res);
          // 设置中心点坐标
          this.setCenterLocation(res.latitude, res.longitude);
          // 识别地址
          this.regeocodeAddress(res.latitude, res.longitude);
        }
      })
    }
  },
  /**
   * 设置中心点坐标
   */
  setCenterLocation(latitude, longitude) {
    this.setData({
      centerLatitude: latitude,
      centerLongitude: longitude
    })
  },
  /**
   * 点击按钮返回定位点
   */
  onSelfLocationClick() {
    //必须请求定位，改变中心点坐标
    this.requestLocation();
  },
  /**
   * 根据经纬度从qqmapsdk反向出地址信息
   * @param {*} latitude 
   * @param {*} longitude 
   */
  regeocodeAddress(latitude, longitude) {
    Toast.loading({
      duration: 0, // 持续展示 toast
      message: "加载中...",
      forbidClick: true,
    });
    //根据坐标获取当前位置名称
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: (res) => {
        Toast.clear();
        const newData = {
          centerAddressInfo: res.result,
          centerAddress: res.result.formatted_addresses.recommend,
        }
        consoleUtil.log("解析新地址")
        consoleUtil.log(newData)
        this.setData(newData)
      }
    })
  },
  /**
   * 打卡按钮
   */
  onSignClick() {
    if (this.checkLogin()) {
      this.setData({
        signShow: true
      })
    }
  },
  /**
   * 询问授权组件成功回调
   */
  onAuthorizeCallBack() {
    this.onSignClick()
  }
})
