/**
 * 格式化时间
 */
function getFriendlyTime(time_stamp) {
  var now_d = new Date();
  var now_time = now_d.getTime() / 1000;//获取当前时间的秒数
  var f_d = new Date();
  f_d.setTime(time_stamp * 1000);
  var f_time = f_d.toLocaleDateString();

  var ct = now_time - time_stamp;
  var day = 0;
  if (ct < 0) {
    f_time = f_d.toLocaleDateString();
  }
  else if (ct < 60) {
    f_time = Math.floor(ct) + "秒前";
  }
  else if (ct < 3600) {
    f_time = Math.floor(ct / 60) + "分钟前";
  }
  else if (ct < 86400)//一天
  {
    f_time = Math.floor(ct / 3600) + "小时前";
  }
  else if (ct < 604800)//7天
  {
    day = Math.floor(ct / 86400);
    if (day < 2)
      f_time = "昨天";
    else
      f_time = day + "天前";
  }
  return f_time;
}

/**
 * 获取图片
 * @param {*} url 
 */
function downloadImage(url) {
  console.log(url)
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success(res) {
        resolve(res.path)
      },
      fail(e) {
        reject(ee)
      }
    })
  })
}

/**
 * 获取rpx与px的比率，用于将rpx换算成px
 */
function getDeviceXS() {
  return wx.getSystemInfoSync().windowWidth / 750;
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join("-")
}

function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join("-") + " " + [hour, minute, second].map(formatNumber).join(":")
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : "0" + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getFriendlyTime: getFriendlyTime,
  downloadImage: downloadImage,
  getDeviceXS: getDeviceXS
}