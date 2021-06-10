// pages/signDetail/index.js
import Toast from "@vant/weapp/toast/toast";
import { defaultLnglat } from "../../utils/constant.js";
import { getFileUrl } from "../../utils/api.js";
import { getDetail } from "../../biz/signBiz.js";
import consoleUtil from "../../utils/consoleUtil.js";
const app = getApp()
const customCallout = {
  anchorY: 0,
  anchorX: 0,
  display: "ALWAYS"
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    latitude: defaultLnglat.latitude,
    longitude: defaultLnglat.longitude,
    markers: [],
    openid: "",
    address: "",
    create_time: "",
    reamrk: "",
    thumbnail_url: "",
    photo_url: "",
    signDetail: {},
    certificateBtnShow: false, // 证书按钮是否显示
    certificateShow: false, // 证书弹框是否显示
    src: "",
    msg: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      this.setData({
        id: options.scene
      })
      this.getSignDetail()
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
    let shareData = {	// 别人的打卡
      title: "你可以用这个小程序记录你去过的地方",
      path: "/pages/index/index"
    }
    if (app.globalData.openid == this.data.openid) {
      let url = "/pages/signDetail/index?scene=" + encodeURIComponent(this.data.id)
      shareData = {	// 自己的打卡分享
        title: this.data.create_time.substring(0, 11) + "我在这里",
        path: url,
      }
    }
    return shareData
  },

  /**
   * 获取打卡信息
   */
  getSignDetail() {
    Toast.loading({
      message: "加载中...",
      duration: 0,
      forbidClick: true,
    });
    const requestData = { id: this.data.id };
    getDetail(requestData, (res) => {
      Toast.clear();
      let locationInfos = [];
      if (res.code === 1) {
        const resData = res.data
        consoleUtil.log(resData)
        locationInfos.push({
          id: 1,
          iconPath: "../../static/imgs/loc2.png",
          longitude: resData.lng,
          latitude: resData.lat,
          width: "48rpx",
          height: "64rpx",
          customCallout: customCallout
        });
        this.setData({
          longitude: resData.lng,
          latitude: resData.lat,
          markers: locationInfos,
          openid: resData.openid,
          address: resData.address,
          create_time: resData.create_time,
          remark: resData.remark,
          photo_url: getFileUrl(resData.photo_url),
          thumbnail_url: getFileUrl(resData.thumbnail_url),
          signDetail: resData,
        })
        this.checkIsSelf()
      } else {
        this.setData({
          address: "查询不到对应的打卡信息，可能是被删除了。",
          create_time: ""
        })
      }
    })
  },
  /**
   * 判断是否自己的打卡信息
   */
  checkIsSelf() {
    if (this.data.openid === app.globalData.openid) {	//并且是本人的打卡 显示分享按钮
      this.setData({ certificateBtnShow: true })
    }
  },
  /**
   * 点击导航按钮
   */
  onNaviClick() {
    wx.getLocation({
      type: "gcj02", //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        wx.openLocation({
          latitude: parseFloat(this.data.latitude),
          longitude: parseFloat(this.data.longitude),
          name: "咱也到此一游",
          address: this.data.address
        })
      }
    })
  },
  /**
   * 点击证书按钮
   */
  onCertificateClick: function () {
    this.setData({
      certificateShow: true
    })
  },
  onRemarkClick() {
  }
})