// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(2)
  let options = event;
  let {method='GET', data={}, category='shibes', count=20} = options
  let url = `http://shibe.online/api/${category}?count=${count}&urls=true&httpsUrls=true`
  console.log(1)
  let response = await got(url, {
    method: 'GET',
    data
  })
  
  return response.body
  // }
  // return httpRequest(options)
}