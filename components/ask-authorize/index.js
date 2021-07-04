// components/ask-authorize/index.js
import Toast from "@vant/weapp/toast/toast";
import { wxLogin, wxUpdateUserInfo } from "../../biz/wxBiz.js";
import consoleUtil from "../../utils/consoleUtil.js";
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 确认登录
     */
    onConfirm() {
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
          this.triggerEvent("callBack")
        }
      })
    },
    /**
     * 暂不登录
     */
    onClose() {
      this.setData({ show: false });
    }
  }
})
