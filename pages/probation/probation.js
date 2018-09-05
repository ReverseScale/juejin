const WxParse = require('../../wxParse/wxParse.js')
const config = getApp().globalData.config
const utils = require('../../utils/utils.js')
Page({
  data: {
    auth: {},
  },
  onLoad(e) {
    let auth = utils.ifLogined()
    this.setData({
      auth,
    })
    this.getSection(e.id)
  },
  // 获取作者信息
  getSection(id) {
    let auth = this.data.auth
    wx.request({
      url: `${config.xiaoceCacheApiMs}/getSection`,
      data: {
        src: 'web',
        uid: auth.uid || '',
        client_id: auth.clientId,
        token: auth.token,
        sectionId: id,
      },
      success: (res) => {
        let data = res.data
        if (data.s === 1) {
          let d = data.d
          if (!utils.isEmptyObject(d)) {
            // 设置 title 为小册标题
            wx.setNavigationBarTitle({
              title: d.title || '试读',
            })
            let article = (d.html) || ''
            WxParse.wxParse('article', 'html', article, this)
          }
        } else {
          if (data.s === 2) {
            // no result
            this.setData({
              noResult: true,
            })
          } else {
            wx.showToast({
              title: data.m.toString(),
              icon: 'none',
            })
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      },
      complete: () => {
        wx.stopPullDownRefresh()
      },
    })
  },
})