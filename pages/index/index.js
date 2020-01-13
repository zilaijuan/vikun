//index.js
//获取应用实例
const app = getApp()
var pageThis = this
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    daily_forecast: [],
    today: {},
    context: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  bindTodayTap: function(){
    wx.navigateTo({
      url: '../today/today'
    })
  },
  
  onLoad: function () {
    var daily_forecast = wx.getStorageSync('daily_forecast')
    var today = wx.getStorageSync('today')
    var context = wx.getStorageSync('context')
    this.setData({
      daily_forecast: daily_forecast,
      today: today,
      context: context
    })

    this.getUserLoction(this.getWeather)
    this.getLovely()

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getUserLoction: function (weather){
    wx.getLocation({
      success: function (res) {
        app.globalData.userLocation = res
        location = res
        weather(location)
      },
    })
  },
  getWeather: function (location){
    wx.request({
      url: app.globalData.weatherApi + 'forecast',
      data: {
        key: app.globalData.weatherKey,
        location: location.latitude + ',' + location.longitude
      },
      success:(res)=> {
        this.setData({
          daily_forecast:res.data.HeWeather6[0].daily_forecast,
        })
        wx.setStorageSync('daily_forecast', res.data.HeWeather6[0].daily_forecast)
      }
    })
    wx.request({
      url: app.globalData.weatherApi + 'now',
      data: {
        key: app.globalData.weatherKey,
        location: location.latitude + ',' + location.longitude
      },
      success: (res) => {
        this.setData({
          today: res.data.HeWeather6[0].now
        })
        wx.setStorageSync('today', res.data.HeWeather6[0].now)
      }
    })
  },
  getLovely: function(){
    wx.request({
      url:  'https://api.ooopn.com/ciba/api.php?type=json',
      success: (res) => {
        this.setData({
          context: res.data
        })
        wx.setStorageSync('context', res.data)
      }
    })
  }

})
