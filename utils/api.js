// 本地地址
export const rootUrl = "http://192.168.1.2:9000";

/**
 * 获取文件url
 * @param {*} filePath 
 */
export function getFileUrl(filePath) {
  if (!filePath) return ""
  return `${rootUrl}/${filePath}`
}

export const api = {
  // 登录 post
  login: rootUrl + "/mmapi/user/login",
  // 更新用户信息 post
  updateUserInfo: rootUrl + "/mmapi/user/update_info",
  // 打卡 post
  sign: rootUrl + "/mmapi/sign",
  // 上传打卡照片 post
  uploadPhoto: rootUrl + "/mmapi/sign/upload_photo",
  // 获取打卡信息列表 post
  getSignList: rootUrl + "/mmapi/sign/list",
  // 删除打卡信息 get
  deleteSign: rootUrl + "/mmapi/sign/delete",
  // 获取打卡信息 get
  getSignDetail: rootUrl + "/mmapi/sign/detail",
  // 获取打卡数 post
  getSignCount: rootUrl + "/mmapi/sign/count"
};
