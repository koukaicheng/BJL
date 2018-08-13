// pages/subBloodSugar/subBloodSugar.js
let app = getApp().util
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      diastolic_pressure:'',
      systolic_pressure:'',
      remarks:'',
      heart_rate:''
    },
    time: '',
    date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNowDate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getNowDate () {
    let date = new Date()
    let sign1 = '-'
    let sign2 = ':'
    let year = date.getFullYear() // 年
    let month = date.getMonth() + 1 // 月
    let day = date.getDate() // 日
    let hour = date.getHours() // 时
    let minutes = date.getMinutes() // 分
    // 给一位数数据前面加 “0”
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (day >= 0 && day <= 9) {
      day = '0' + day
    }
    if (hour >= 0 && hour <= 9) {
      hour = '0' + hour
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = '0' + minutes
    }
    let currentdate = year + sign1 + month + sign1 + day
    let currenttime = hour + sign2 + minutes
    this.setData({
      date: currentdate,
      time: currenttime
    })
  },
  bindData (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTime (e) {
    this.setData({
     time: e.detail.value
    })
  },
  binddiastolicPressure(e){
    let val = e.detail.value
    this.setData({
      'info.diastolic_pressure':val
    })
  },
  bindsystolicPressure(e){
    let val = e.detail.value
    this.setData({
      'info.systolic_pressure':val
    })
  },
  bindheartRate(e){
    let val = e.detail.value
    this.setData({
      'info.heart_rate':val
    })
  },
  bindRemarks(e){
    let val = e.detail.value
    this.setData({
      'info.remarks':val
    })
  },
  next(){
    let { diastolic_pressure, systolic_pressure, heart_rate} = this.data.info;
    if (diastolic_pressure === '' || systolic_pressure === '' || Number(diastolic_pressure) > 360 || Number(systolic_pressure)>360){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请正确填写血压，血压最高不可超出360'
      })
      return
    }
    if (heart_rate!==''){
      if (Number(heart_rate)>300){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请正确填写心率，心率最高不可超出300'
        })
        return
      }
    }

    let time = this.data.date+' '+this.data.time
    let info = this.data.info
    let obj = Object.assign({},info,{measure_time:time})
    app.request({
      url: app.URL.add_blood_pressure,
      data:obj,
      success (e) {
        if(e.data.code!==1){
          wx.showToast({
            title:e.data.msg,
            icon:'none'
          })
          return
        }
        wx.showToast({
          title:e.data.msg,
          icon:'none'
        })
        setTimeout(()=>{
          wx.setStorageSync('ure',true)
          wx.setStorageSync('off', true);
          wx.navigateBack()
        },1000)
      }
    })
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