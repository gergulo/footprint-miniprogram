const defaultContentType = "application/x-www-form-urlencoded"
//application/x-www-form-urlencoded
//application/json

/**
 * POST请求接口回调
 * @param {*} url 
 * @param {*} requestData 
 * @param {*} token 
 * @param {*} callback 
 */
function sendPost(url, requestData, token="", callback=null) {
	send(url, "POST", requestData, token, callback)
}

/**
 * GET请求接口回调
 * @param {*} url 
 * @param {*} requestData 
 * @param {*} token 
 * @param {*} callback 
 */
function sendGet(url, requestData, token="", callback=null) {
	send(url, "GET", requestData, token, callback)
}

function send(url, method="POST", requestData, token="", callback=null) {
  wx.request({
		url: url, //请求接口的url
		method: method, //请求方式
		timeout: 30000,
		data: requestData, //请求参数
		header: generateHeader(token),
		success: (res) => {
			if (res.statusCode === 200) {
        if (callback) {
          callback(res.data);
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
		fail: (e) => {
      if (callback) {
        callback({
          "code": -102,
          "msg": "发送请求失败_fail",
        });
      }
		}
	});
}

function generateHeader(token="") {
  if (token) {
    return {
			"x-token": token,
			"Content-Type": defaultContentType
		}
  } else {
    return {
			"Content-Type": defaultContentType
		}
  }
}

module.exports = {
	sendPost: sendPost,
	sendGet: sendGet
}
