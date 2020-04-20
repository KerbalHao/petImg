
/** 首页
 * 实现轮播图，选择种类，上拉显示轮播图，上拉刷新图片，下拉隐藏轮播图，底部下拉实现再次拉取数据
 * 难点：1. 下拉刷新事件中，下拉状态无法自动复原，需要在 wxml 中设置 refresh-trigger 
 *      2. 对于元素的操作需要使用 class 动态加载实现
 */
import {require} from '../../utils/util.js';

Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },

  data: {
    visiableCls: '',
    selected: '',
    background: [{
      img: 'https://cdn.shibe.online/shibes/1178b80624703d5b749dea43ddb67071da163bb2.jpg',
    },
    {
      img: 'https://cdn.shibe.online/cats/fa7e0bf9244182b6e588bcac6c827010a8650870.jpg',
    },
    {
      img:'https://cdn.shibe.online/birds/ae0afbfd0df936703b65b81ad253ed3b912c50b4.jpg',
    }],
    imgList: [],
    flag: '',
    currentScroll: 0,
    refreshed: false,
    currentCate: 'shibes'
  },
  onLoad: function() {
    this.fetchImgs()
  },

  /** 请求图片资源
   * @method fetchImg
   * @param {Object: {category: String, count: Number, method: String, data: Object}} obj
   *  
 */
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
        let imgList = currentList.concat(res)
        that.setData({
          imgList,
          currentCate: category
        })
        wx.hideLoading()
    })
  },
  loaded: function(e) {
    // console.log(e)
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

  /** 向上滚动显示图片轮播图，向下滚动隐藏
   * @method scroll
   * @param {Object} 滚动事件
   */
  scroll: function(e) {
    let newScroll = e.detail.scrollTop
    let currentScroll = this.data.currentScroll
    // 设定一个阈值，防止频繁触发 setData 函数
    if (Math.abs(newScroll - currentScroll) > 100) {
      let flag = newScroll - currentScroll >= 0 ?  'hide' : 'show'
      currentScroll = newScroll
      this.setData(({
        currentScroll
      }))
      if (flag !== this.data.flag) {
        this.setData({
          flag,
        })
      }
    }
  },

  /** 到底部则拉去更多图片
   * @method lower
   * @param {Object} e 
   */
  lower: function() {
    this.fetchImgs()
  },

  /** 点击筛选
   * 
   */
  filter() {
    let currentCate = this.data.currentCate
    let reFetchImgs = this.refresh
    let itemList = ['狗图', '猫图', '鸟图']
    wx.showActionSheet({
      itemList,
      success (res) {
        switch (res.tapIndex) {
          case 0: currentCate !== 'shibes' ?reFetchImgs(undefined) : wx.showModal({
            showCancel: false,
            content: `您正在浏览该类图片`,
          })
            break;
      
          case 1: currentCate !== 'cats' ?reFetchImgs(undefined,{category: 'cats'}): wx.showModal({
            showCancel: false,
            content: `您正在浏览该类图片`,
          })
            break;
      
          case 2: currentCate !== 'birds' ?reFetchImgs(undefined,{category: 'birds'}): wx.showModal({
            showCancel: false,
            content: `您正在浏览该类图片`,
          })
            break
        }
      }
    })
  },

  showImg(e) {
    this.setData({
      selected: e.mark.src,
      visiableCls: 'visiability'
    })
  },
  hideBigImg(e) {
    if (e.target.id !== 'origin') {
      this.setData({
        visiableCls: ''
      })
    }
  }
})
