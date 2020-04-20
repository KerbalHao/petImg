const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 封装 http 请求函数
 * @method require
 * @param {Object={}} options 
 * @param {Function} cb 
 * 难点: 1.与云函数配合，云服务配置注意事项： 1）部署前需要在云函数文件夹中 npm init，并安装需要的 npm 包
 * 2） 云函数修改后，需要重新打开本地调试
 * 2. 成功请求到数据后，需要在 success 回调函数中处理 this.setData() 函数，用于响应页面和数据，此时，我们可以使用回调函数 cb 来处理，其中传入了请求返回的数据
 * 3. 对于回调函数 cb 中的 this 的处理，使用 声明一个 that 变量来获取  this 的值
 * 4. 在真机调试时，发现返回的数据与在工具端的格式不同，真机中是字符串格式，需要注意使用 JSON.parse 和 保存时使用 JSPN.stringify，在工具端是符合规范的 JSON 格式，可以直接应用于生产
 */
const require = (options={}, cb)  => {
  wx.cloud.init()
  wx.cloud.callFunction({
    name: 'httpRequest',
    data: options,
    success: res => {
      res = res.result
      cb(res)
    },
    fail: err => {
      console.log(err)
      wx.showToast({
      title: '获取图片失败',
      icon: 'none',
      duration: 2000
      })
    }
  })
}
module.exports = {
  formatTime: formatTime,
  require
}
