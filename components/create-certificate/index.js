// components/share/index.js
import Toast from "@vant/weapp/toast/toast";
import { getPixelRatio } from "../../utils/util.js"
import consoleUtil from "../../utils/consoleUtil.js";
const app = getApp()
let xs = 1;
const defaultCanvasWidth = 1360;
const defaultCanvasHeight = 970;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    signDetail: { // 当前打卡信息
      type: () => { },
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: false,
    picPath: "", // 生成的分享图片 临时路径
    canvasWidth: 0,
    canvasHeight: 0
  },

  /**
   * 监听器
   */
  observers: {
    "show": function (val) {
      if (val) {
        xs = getPixelRatio()
        this.setData({
          canvasWidth: defaultCanvasWidth / xs,
          canvasHeight: defaultCanvasHeight / xs
        })
        this.createPicture()
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 保存图片到系统相册
    savePicture() {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.picPath,
        success: () => {
          Toast.success("保存成功")
          this.onClose()
        },
        fail: (e) => {
          if (e.errMsg === "saveImageToPhotosAlbum:fail:auth denied"
            || e.errMsg === "saveImageToPhotosAlbum:fail auth deny"
            || e.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
            wx.showModal({
              title: "提示",
              content: "需要您授权保存相册",
              showCancel: false,
              success: (modalSuccess) => {
                wx.openSetting({
                  success(settingdata) {
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      consoleUtil.log("获取权限成功，给出再次点击图片保存到相册的提示。")
                    } else {
                      consoleUtil.log("获取权限失败，给出不给权限就无法正常使用的提示")
                    }
                  }
                })
              }
            })
          } else {
            consoleUtil.log("保存失败", e)
          }
        }
      });
    },
    //生成图片 绘制画布
    createPicture() {
      let userInfo = app.globalData.userInfo
      // let avatarUrl = userInfo.avatar // 用户头像
      let item = this.data.signDetail
      let signTime = item.create_time.substring(0, 11)
      let address = item.address
      const lineHeight = 70 / xs
      let initTop = 450 / xs
      let initLeft = 140 / xs
      let sealSize = 200 / xs
      this.setData({ loading: true })
      wx.createSelectorQuery()
        .in(this)
        .select("#canvas-id")
        .fields({ node: true, size: true, })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext("2d")
          canvas.width = this.data.canvasWidth;
          canvas.height = this.data.canvasHeight;
          // 背景色
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // 字体
          ctx.font = "24px serif"
          // 字体颜色
          ctx.fillStyle = "#707070";
          // 背景图
          let bgImg = canvas.createImage();
          bgImg.src = "../../static/share_bg.png";
          bgImg.onload = () => {
            //img.complete表示图片是否加载完成，结果返回true和false;
            // consoleUtil.log(img.complete);//true
            // 背景图加载完成
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            // 用户名1
            ctx.fillText("尊敬的_________________：", initLeft, initTop)
            // 用户名2
            ctx.fillText(userInfo.nickname, initLeft + 160 / xs, initTop - 4 / xs)
            initTop += lineHeight
            // 打卡时间1
            ctx.fillText("您于_________________，成功打卡", initLeft + 90 / xs, initTop)
            // 打卡时间2
            ctx.fillText(signTime, initLeft + 210 / xs, initTop - 4 / xs)
            initTop += lineHeight
            // 打卡地点1
            ctx.fillText("______________________________________________。", initLeft, initTop)
            // 打卡地点2
            ctx.fillText(address, initLeft + 20 / xs, initTop - 4 / xs)
            initTop += lineHeight
            // 说明
            ctx.fillText("特发此状，以资鼓励。", initLeft + 90 / xs, initTop)
            initTop += 1.2 * lineHeight
            // 落款
            ctx.fillText("格格足迹小程序",  initLeft + 680 / xs, initTop)
            // 公章图
            let sealImg = canvas.createImage();
            sealImg.src = "../../static/seal.png";
            sealImg.onload = () => {
              ctx.drawImage(sealImg, initLeft + 760 / xs, initTop - 120 / xs, sealSize , sealSize);
              // 生成完整图片
              this.drawPicture(canvas);
            };
            
          };
        })
    },
    //生成图片 输出
    drawPicture(canvas) {
      wx.canvasToTempFilePath({ //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
        x: 0,
        y: 0,
        width: this.data.canvasWidth,
        height: this.data.canvasHeight,
        destWidth: this.data.canvasWidth,
        destHeight: this.data.canvasHeight,
        canvas: canvas,
        fileType: "jpg",
        quality: 1,
        success: (res) => {
          this.setData({ loading: false })
          this.setData({ picPath: res.tempFilePath })
        },
        fail: (e) => {
          this.setData({ loading: false })
          consoleUtil.log("生成证书文件失败：", e)
        }
      }, this)
    },
    /**
     * 关闭
     */
    onClose() {
      this.setData({
        show: false
      })
    }
  }
})
