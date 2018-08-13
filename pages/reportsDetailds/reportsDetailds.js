// pages/reportsDetailds/reportsDetailds.js
let app = getApp().util;
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this
    console.log(options)
    let id = options.id
    this.getReportDetailData(id)
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
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  getReportDetailData(id) {
    app.request({
      url: app.URL.report_detile,
      data: { id },
      success(e) {
        console.log(e.data.data)
        if (e.data.code === 1) {
          let mother_status = self.fileter(e.data.data.mother_status);
          let fetus_status = self.fileter(e.data.data.fetus_status);
          self.setData({
            detail: e.data.data,
            mother_status,
            fetus_status,
            report_number: e.data.data.report_number
          });
          wx.setStorageSync('off', true);
        }
      }
    })
  },
  fileter(num) {
    let obj = {
      text: '',
      color: ''
    };
    switch (num) {
      case 1:
        obj.text = '良好';
        obj.color = '#6bce73';
        break;
      case 2:
        obj.text = '中等';
        obj.color = '#6bce73';
        break;
      case 3:
        obj.text = '不良';
        obj.color = '#fa7070';
        break;
      default:
        break;
    }
    return obj;
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