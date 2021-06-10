// pages/user/index.js
import Toast from "@vant/weapp/toast/toast";
import { wxLogin, wxUpdateUserInfo } from "../../biz/wxBiz.js";
import { getList, deleteSign } from "../../biz/signBiz.js";
const consoleUtil = require("../../utils/consoleUtil.js");
const defaultPageSize = 10;
const defaultDate = new Date().getTime();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUseOpenData: false,
    loading: false,
    list: [], // 打卡信息列表
    current: 1, //当前页
    total: 0, //打卡信息总数
    calendarShow: false,
    currentDate: defaultDate, //日历选择器当前日期
    maxDate: defaultDate, //日历选择器最大时间
    queryDate: [], //查询日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.canIUse("open-data.type.userAvatarUrl") && wx.canIUse("open-data.type.userNickName")) {
      this.setData({
        canIUseOpenData: true
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
      this.querySignList()
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
    consoleUtil.log("滚动到界面底部")
    let current = this.data.current;
    const total = this.data.total;
    consoleUtil.log(`current=${current}，size=${defaultPageSize}，total=${total}`)
    if (current * defaultPageSize < total) {
      consoleUtil.log("请求翻页")
      current++;
      this.querySignList(current);
    } else {
      consoleUtil.log("已到最后一页")
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  /**
   * 获取用户信息
   */
  onLoginClick() {
    // 微信登录、获取用户信息两个异步操作，因为获取用户信息需要用户确认，所以通常情况下微信登录会先完成，再进行获取用户信息。
    wxLogin((res) => {
      consoleUtil.log("微信登录结果")
      consoleUtil.log(res)
    })
    wxUpdateUserInfo((res) => {
      if (res.code === 1) {
        Toast.success("登录成功");
        this.setData({
          hasUserInfo: true
        })
        this.querySignList()
      }
    })
  },
  /**
   * 启动月份查询
   */
  onSearchClick() {
    this.setData({ calendarShow: true });
  },
  /**
   * 重置月份查询
   */
  onResetClick() {
    consoleUtil.log("清空查询时间")
    this.setData({
      queryDate: [],
      currentDate: defaultDate
    });
    this.querySignList();
  },
  /**
   * 关闭日历选择器
   */
  onCalendarClose() {
    this.setData({ calendarShow: false })
  },
  /**
   * 确认选择查询月份
   * @param {*} e 
   */
  onConfirmDate(e) {
    consoleUtil.log("确认查询时间")
    consoleUtil.log(e.detail)
    let tempTime = new Date();
    tempTime.setTime(e.detail);
    const queryDate = [];
    queryDate.push(tempTime.getFullYear());
    queryDate.push(tempTime.getMonth() + 1);
    this.setData({
      currentDate: e.detail,
      queryDate: queryDate
    });
    this.onCalendarClose();
    this.querySignList();
  },
  /**
   * 查询打卡信息列表
   */
  querySignList(current = 1) {
    if (current === 1) {  // 第一页时，还原数据
      this.setData({
        list: [],
        total: 0
      })
    }
    let queryDate = this.data.queryDate
    if(queryDate.length>0){
      queryDate = `${queryDate[0]}-${queryDate[1]}-1`
    }
    const queyData = {
      current: current,
      size: defaultPageSize,
      query_date: queryDate
    };
    consoleUtil.log(queyData)
    this.setData({ loading: true });
    getList(queyData, (res) => {
      this.setData({ loading: false })
      if (res.code === 0) {
        if (current > 1) Toast.success("没有更多了");
      } else if (res.code === 1) {
        this.setData({
          list: [...this.data.list, ...res.data.page.records],
          current: res.data.page.current,
          total: res.data.page.total
        })
      } else {
        Toast.success(res.msg);
      }
    })
  },
  /**
   * 打卡信息点击事件
   * @param {*} e 
   */
  onCellClick(e) {
    let id = e.target.dataset["id"]
    wx.navigateTo({
      url: "../signDetail/index?scene=" + id,
    })
  },
  /**
   * 删除打卡信息
   * @param {*} e 
   */
  onDeleteSignClick(e) {
    if(e.detail !== "right") return;
    const requestData = {
      id: e.target.dataset.id
    };
    consoleUtil.log(requestData)
    deleteSign(requestData, (res) => {
      Toast.success(res.msg);
      if (res.code === 1) {
        this.querySignList()
      } 
    })
  }
})