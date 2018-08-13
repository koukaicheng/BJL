// pages/reports/reports.js
let app = getApp().util;
let self;
let pageNum = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    detail: {},
    guidance: [],
    isShowTab: true,
    calorie_guide_num: 0,
    report_number: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    self.getReportList();
  },
  /**
   * 选项卡切换
   */
  tabFn(e) {
    console.log(e.target.dataset.show)
    var isShow = true;
    if (e.target.dataset.show === 'false') isShow = false;
    self.setData({
      isShowTab: isShow
    });
  },
  getReportList() {
    app.request({
      url: app.URL.report_list,
      success(e) {


        if (e.data.code === 1) {
          let list = e.data.data
          let num = list.reduce((a, item) => item.is_read === 0 ? a + 1 : a +0,0)
          console.log(num)
          self.setData({
            list: e.data.data,
            report_number:num
          });
        }
      }
    })
  },
  /**
   * 获取每日指导信息
   */
  details(e) {
    let id = e.target.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '/pages/reportsDetailds/reportsDetailds?id=' + id
    })
  },
  getGuidance(time) {
    app.request({
      url: app.URL.get_calorie_guide_list,
      data: {
        date: time
      },
      success(e) {
        console.log(e.data.data)
        if (e.data.code === 1) {
          self.setData({
            guidance: e.data.data.list,
            calorie_guide_num: e.data.data.calorie_guide_num
          })
        }
      }
    })
    wx.setStorageSync('off', true);
  },
  /**
   * 获取详情
   */
  /**
   * 日期选择
   */
  bindselect(e) {
    // console.log(e.detail.ischeck)
  },
  /**
   * 获取选择日期
   */
  bindgetdate(e) {
    let time = e.detail;
    console.log(time)

    self.getGuidance(time.year + "-" + time.month + "-" + time.date)
    // this.setData({ time })
    // 如果超出当前日期
    // if (new Date(time.year + "-" + time.month + "-" + time.date + " 00:00:00") > new Date()) {} else { }
  },
  onShow: function () {
    let off = wx.getStorageSync('off')
    if (off) {
      self.getReportList();
    }
  }
});
