// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeList: wx.getStorageSync('like') || [],
  },
  onLoad() {
    let likeList = wx.getStorageSync('like') || []
    this.setData({likeList})
  },
  /** 点击喜爱
   * 
   */
  collect(e) {
    let targetInd = e.mark.index

    // 修改 storage 中的 imgList
    let imgList = wx.getStorageSync('imgList')
    imgList = imgList.map((item) => {
      if (item.src === this.data.likeList[targetInd].src) {
        item.like = false
      }
      return item
    })
    wx.setStorageSync('imgList', imgList)

    //修改喜爱的列表
    let likeList = this.data.likeList.filter((item, index) => {
      return index !== targetInd
    })

    // 保存当前种类的图片列表
    this.setData({
      likeList
    })
    wx.setStorageSync('like', likeList)
  },
})