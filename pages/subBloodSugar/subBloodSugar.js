// pages/subBloodSugar/subBloodSugar.js
let app = getApp().util
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      type:1,
      blood_sugar:'',
      remarks:''
    },
    time: '',
    date: '',
    typeText:'空腹',
// {val: 2, name: '餐前30分钟'},{val: 3, name: '餐后1小时'}
    objectArray: [{val: 1, name: '空腹'},{val: 4, name: '餐后2小时(早餐)'},{val: 5, name: '餐后2小时(午餐)'},{val: 6, name: '餐后2小时(晚餐)'},{val: 7, name: '睡前'}]
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
  bindType(e){
    let index = Number(e.detail.value)
    console.log(index)
    let val =  Number(e.detail.value)+1
    let text = ''
    switch (val) {
      case 1:
        text = '空腹'
        break
      case 2:
        text= '餐后2小时(早餐)'
        break
      case 3:
        text = '餐后2小时(午餐)'
        break
      case 4:
        text = '餐后2小时(晚餐)'
        break
      case 5:
        text = '睡前'
        break
      // case 6:
      //   text = '餐后2小时(晚餐)'
      //   break
      // case 7:
      //   text = '夜间'
      //   break
      default:
        break
    }
    this.setData({
      'info.type':this.data.objectArray[index].val,
      typeText:text
    })
  },
  bindsugarVal(e){
    let val = e.detail.value
    this.setData({
      'info.blood_sugar':val
    })
  },
  bindremarks(e){
    let val = e.detail.value
    this.setData({
      'info.remarks':val
    })
  },
  next(){
      let num = this.data.info.blood_sugar
      if (num===' '){
        wx.showModal({
          title: '提示',
          showCancel:false,
          content: '请正确填写血糖'
        })
        return
      }
    let time = this.data.date+' '+this.data.time
    let info = this.data.info
    let obj = Object.assign({},info,{measure_time:time})
    app.request({
      url: app.URL.add_blood_sugar,
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
         wx.setStorageSync('gar',true)
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