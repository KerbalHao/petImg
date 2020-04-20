// pages/cart/cart.js
import {require} from '../../utils/util.js';
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // ? typeof wx.getStorageSync('imgList') == 'string' ? JSON.parse(wx.getStorageSync('imgList')) : wx.getStorageSync('imgList')
    imgList: [],
    category: '狗狗',
    visible: 'hide-drawer',
    currentCate: 'shibes',
    click: false,
    petList: [{text:'狗狗', val:'shibes'}, {text:'猫猫', val: 'cats'}, {text:'小鸟', val:'birds'}],
    refreshed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('imgList')) {
      this.fetchImgs() 
    } else {
      let imgList = wx.getStorageSync('imgList')
      this.setData({
        imgList,
        category:  imgList[0].category == 'shibes' ? '狗狗' : imgList[0].category == 'cats' ? '猫猫' : '小鸟'
    })
    }
  },
  
  fetchImgs: function(obj={}) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    let currentList = this.data.imgList
    require(obj, (res) => {
        let category = obj.category || 'shibes'
        if (typeof res === 'string') {
          res = JSON.parse(res)
        }
        let imgs = res.map(item =>{return {src: item, like: false,category}})
        let imgList = currentList.concat(imgs)
        that.setData({
          imgList,
          currentCate: category
        })
        if(typeof res === 'string') imgList = JSON.stringify(imgList)
        wx.setStorageSync('imgList', imgList)
        wx.hideLoading()
    })
  },

    /** 顶部滚动则重新加载所有图片
   * @method refresh
   * @param {Object} e 
   */
  refresh: function(e, obj) {
    this.setData({
      imgList: []
    })
    obj = obj || {category: this.data.currentCate} 
    this.fetchImgs(obj)
    setTimeout(() => {
      this.setData({
        refreshed: false
      })
    }, 300)
  },

  /** 到底部则拉去更多图片
   * @method lower
   * @param {Object} e 
   */
  lower: function() {
    this.fetchImgs()
  },

  /** 点击显示筛选界面
   * 
   */
  showFilter(e) {
    this.setData({
      click: true,
      visible: 'show-drawer'
    })
  },
  /** 隐藏抽屉
   * 
   * @param {*} e 
   */
  hideDrawer(e) {
    if (e.target.id === 'filter' || e.target.id === 'drawer') return 
    if (!this.data.click) return 
    this.setData({
      click: false,
      visible: ''
    })
  },

  /** 执行筛选操作
   * 
   */
  selectItem(e) {
    let selectedCate = e.mark.selected
    if (selectedCate === this.data.currentCate) return 
    this.setData({
      imgList: [],
      category: selectedCate == 'shibes'? '狗狗' : selectedCate == 'cats' ? '猫猫' : '小鸟'
    })
    this.fetchImgs({category: selectedCate})
  },

  /** 点击喜爱
   * 
   */
  collect(e) {
    if (!e.detail.userInfo) return 
    app.globalData.userInfo = e.detail.userInfo
      let targetInd = e.mark.index
      let imgList = this.data.imgList.map((item, index) => {
        if (index == targetInd) {
          item.like = !item.like
        }
        return item
      })
      console.log(imgList[0])
      // 保存当前种类的图片列表
      this.setData({
        imgList,
      })
      wx.setStorageSync('imgList', imgList)

      // 保存收藏的图片
      let saved = wx.getStorageSync('like') || []
      let likeImg=imgList[targetInd]
      saved = likeImg.like ? saved.concat(likeImg) : saved.filter(item => {
        return item.src !== likeImg.src
      })
      wx.setStorageSync('like', saved)
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
    let imgList = wx.getStorageSync('imgList')
    this.setData({imgList})
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})