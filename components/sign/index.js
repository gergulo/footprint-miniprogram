// components/sign/index.js
import Toast from "@vant/weapp/toast/toast";
import { uploadPhoto, sign } from "../../biz/signBiz.js";
const consoleUtil = require("../../utils/consoleUtil.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    latitude: {
      type: Number,
      value: 0
    },
    longitude: {
      type: Number,
      value: 0
    },
    address: {
      type: String,
      value: ""
    },
    addressInfo: {
      type: () => { },
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    uploadImagePath: "",
    remark: ""
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 关闭
     */
    onClose() {
      this.setData({ show: false });
    },
    /**
     * 文本变化
     */
    onRemarkBlur(e) {
      this.setData({ remark: e.detail.value })
    },
    /**
     * 取图片
     */
    onTakeImage() {
      wx.chooseImage({
        count: 1,
        sizeType: ["original"],
        sourceType: ["album", "camera"],
        success: (res) => {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          if (tempFilePaths && tempFilePaths.length > 0) {
            this.setData({
              "uploadImagePath": tempFilePaths[0]
            })
          }
        },
        fail: (e) => {
          consoleUtil.log(e)
        }
      })
    },
    /**
     * 删除图片
     */
    onDeleteImage() {
      this.setData({
        "uploadImagePath": ""
      })
    },
    /**
     * 预览图片
     */
    onPreviewImage() {
      wx.previewImage({
        urls: [this.data.uploadImagePath,],
      })
    },
    /**
     * 提交
     */
    onConfirmClick() {
      const requestData = {
        "lng": this.data.longitude,
        "lat": this.data.latitude,
        "address": this.data.address,
        "nation": this.data.addressInfo.address_component.nation,
        "province": this.data.addressInfo.address_component.province,
        "city": this.data.addressInfo.address_component.city,
        "district": this.data.addressInfo.address_component.district,
        "street": this.data.addressInfo.address_component.street,
        "street_number": this.data.addressInfo.address_component.street_number,
        "remark": this.data.remark,
        "photo_url": "",
        "thumbnail_url": ""
      }
      consoleUtil.log(requestData)
      Toast.loading({
        message: "加载中...",
        duration: 0,
        forbidClick: true,
      });
      if (this.data.uploadImagePath) {
        uploadPhoto(this.data.uploadImagePath, (res) => {
          consoleUtil.log(res)
          if (res.code === 1) {
            requestData.photo_url = res.data.photo_url;
            requestData.thumbnail_url = res.data.thumbnail_url;
            this.doSign(requestData);
          } else {
            Toast.success("照片上传失败");
          }
        });
      } else {
        this.doSign(requestData);
      }
    },
    /**
     * 打卡
     * @param {*} requestData 
     * @param {*} callback 
     */
    doSign(requestData) {
      sign(requestData, (res) => {
        if (res.code === 1) {
          Toast.success("打卡成功");
            this.setData({
              remark: "",
              uploadImagePath: "",
              show: false
            })
        } else {
          Toast.success(res.msg);
        }
      })
    }
  }
})
