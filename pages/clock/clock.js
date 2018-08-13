// pages/clock/clock.js

let app = getApp().util;
let clock = {}
let self = null;
let timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canUse: 0,
    ischeck: true,
    selected: [],
    list: [],
    time: {},
    closeAdd: false,
    iconArr: ['icon-niunai', 'icon-meishi1', 'icon-meishi3', 'icon-meishi1', 'icon-meishi4', 'icon-meishi1', 'icon-yundong1']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    timer = null;
    clock = {}
    clock.createImage = false;

    // 添加摄入数据
    self.getCirInit();
    self.getClockData((res) => {
      console.log(1);
      self.setData({
        selected: res.data.data
      })
    })

  },
  onShow() {
    console.log("onshow");
    // addFoodRefresh
    app.refresh('addFoodRefresh').then((res) => {
      wx.showLoading({
        title: '数据更新中...',
      });
      wx.setStorageSync('off', true);
      clock.isLoading = true;
      console.log("我刷新了", res);
      self.getCalorieRecard(res.time);
    })
    app.refresh('addFoodRefresh:photo').then((res) => {
      wx.showLoading({
        title: '数据更新中...',
      });
      wx.setStorageSync('off', true);
      clock.isLoading = true;
      console.log("我刷新了", res);
      self.getCalorieRecard(res.time);
    })
  },
  link(){
    wx.navigateTo({
      url: '/pages/reports/reports'
    })
  },
  /**
   * 日期选择
   */
  bindselect(e) {
    console.log(e)
    this.setData({
      ischeck: e.detail.ischeck
    })
    console.log(e.detail.ischeck)
  },
  /**
   * 获取选择日期
   */
  bindgetdate(e) {
    let time = e.detail;
    this.setData({ time })
    // 如果超出当前日期
    if (new Date(time.year + "-" + time.month + "-" + time.date + " 00:00:00") > new Date()) {
      self.setData({
        closeAdd: true
      })
    } else {
      self.setData({
        closeAdd: false
      })
    }

    // 获取打卡信息
    this.getCalorieRecard(time)
  },
  /**
   * 添加食物
   */
  add(e) {
    if (this.data.closeAdd) {
      app.toast({
        content: '还没到打卡的时间呢'
      })
      return;
    }
    if (e.currentTarget.dataset.id == 7) {
      wx.navigateTo({
        url: '/pages/addFood/addFood?id=' + e.currentTarget.dataset.id + "&time=" + this.data.time.month + "月" + this.data.time.date + "日&date=" + this.data.time.year + "-" + this.data.time.month + "-" + this.data.time.date
      })
      return;
    }

    wx.navigateTo({
      url: '/pages/Issue/Issue?type=photo&id=' + e.currentTarget.dataset.id + "&time=" + this.data.time.year + "-" + this.data.time.month + "-" + this.data.time.date
    })
  },
  /**
   * 编辑食物
   */
  editFood(e) {
    console.log(e.currentTarget.dataset.food)
    let data = e.currentTarget.dataset.food;
    let url = ''
    wx.setStorageSync("foodDataObject", data)

    if (data.type === 3) {
      console.log("拍照打卡")
      url = '/pages/photoDetail/photoDetail'
    } else {
      url = "/pages/addFood/addFood?id=" + e.currentTarget.dataset.id + "&time=" + this.data.time.month + "月" + this.data.time.date + "日&date=" + this.data.time.year + "-" + this.data.time.month + "-" + this.data.time.date + "&type=edit"
    }

    wx.navigateTo({ url })
  },
  /**
   * 删除食物
   */
  deleteFood(e) {
    let id = e.currentTarget.dataset.id;
    console.log(id)
    this.delFoodData(id);
  },
  /**
   * 初始化进度条
   */
  getCirInit(max = 100, ac = 0) {

    if (max < 100) {
      max = 100
    }
    let self = this;
    let conut = max
    ac = max - ac
    console.log(max, ac)
    clearInterval(timer)
    timer = setInterval(() => {
      this.getCircle(max, conut)
      self.setData({
        canUse: parseInt(max - conut)
      })
      conut -= max / 100 * 2
      if (conut < ac) {
        clearInterval(timer)
        self.setData({
          canUse: parseInt(max - ac)
        })
        console.log(self.data.canUse, 'test')

        clock.createImage = true;
      }
    }, 30)
  },
  /**
   * 更新进度条信息
   */
  getCalorieRecard(time) {
    if (typeof time !== 'string') {
      time = self.data.time.year + "-" + self.data.time.month + "-" + self.data.time.date
    }
    self.getClockData((data) => {
      let list = data.data.data
      self.setData({
        list
      })
      if (clock.isLoading) {
        wx.hideLoading();
        clock.isLoading = false;
      }
      console.log(list.can + list.food, list.can)
      self.getCirInit(list.can + list.food, list.can);
    }, { date: time })
  },
  /**
   * 接口方法
   */
  getClockData(fn, data = {}) {
    app.request({
      url: app.URL.calorie_recard,
      data,
      success(e) {
        if (e.data.code === 1) {
          typeof fn === 'function' && fn(e)
        }
      }
    })
  },
  /**
   * 删除食物接口
   */
  delFoodData(id) {
    app.toast(true, {
      title: '删除',
      content: '是否删除当前打卡记录',
      success() {
        wx.showLoading({
          title: '删除中...',
        })
        app.request({
          url: app.URL.calorie_recard_del,
          data: { id },
          success(e) {
            wx.hideLoading()
            if (e.data.code === 1) {
              wx.showToast({
                title: e.data.msg,
                duration: 2000
              })
              // self.getClockData((res) => {
              //     console.log(1)
              //     self.setData({
              //         selected: res.data.data
              //     })
              // })
              self.getCalorieRecard(self.data.time);
            }
          }
        })
      }
    })

  },
  /**
   * 获取进度条数据
   */
  getCircle(max, ac) {
    let min = 0;
    let num = 2 / (max - min) * ac - 0.5
    let count = min;

    // 页面渲染完成 
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。 
    cxt_arc.save()
    cxt_arc.setLineWidth(5);
    cxt_arc.setStrokeStyle('#d2d2d2');
    cxt_arc.setLineCap('butt')
    cxt_arc.beginPath();//开始一个新的路径 
    cxt_arc.arc(63, 63, 60, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径 
    cxt_arc.stroke();//对当前路径进行描边 
    cxt_arc.restore()
    cxt_arc.setLineWidth(5);
    cxt_arc.setStrokeStyle('#3ea6ff');
    cxt_arc.setLineCap('butt')
    cxt_arc.beginPath();//开始一个新的路径 
    cxt_arc.arc(63, 63, 60, -Math.PI * 0.5, Math.PI * num, false);
    cxt_arc.stroke();//对当前路径进行描边 
    cxt_arc.draw(false, () => {

    });
  }

})