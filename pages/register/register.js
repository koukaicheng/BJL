// pages/register/register.js
const app = getApp().util;
let that = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    this.login();
  },
  login(){
    wx.login({
      success: res => {
        let code = res.code;
        this.setData({
          code
        })
      }})
  },
  userName(e) {
    let username = e.detail.value;
    this.setData({
      username
    });
    console.log(e)
  },
  userPassword(e) {
    let password = e.detail.value;
    this.setData({
      password
    });
  },
  Submit() {
    let {username, password,code} = this.data;
    if (username===''|| password==='') {
      wx.showModal({
        title:"提示",
        content:"请正确填写账号信息"
      })
    }else {
      app.request({
        url:app.URL.binding,
        data:{username,password,code},
        success:(res)=>{
          console.log(res,res.data);
          if(res.data.code!==1){
            wx.showModal({
              title:"提示",
              content:res.data.msg
            });
            that.login();
          }else{
            wx.setStorageSync('userInfo', res.data.data);
            wx.showToast({
              title:"绑定成功"
            });

            if(res.data.data.is_perfect==='Y'){
              setTimeout(()=>{
                wx.redirectTo({
                  url: "/pages/index/index"
                });
              },500)
            }else{
              setTimeout(()=>{
                wx.redirectTo({
                  url: "/pages/personalData/personalData?off="+'bd'
                });
              },500)
            }
          }
        }
      })
    }
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