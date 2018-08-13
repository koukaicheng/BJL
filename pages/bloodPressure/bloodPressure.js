// pages/bloodPressure/bloodPressure.js
import * as echarts from '../../ec-canvas/echarts'

let app = getApp().util
let self = null
let food
let oldData

function setOption (chart, data) {
  console.log(data)
  // data.date.push('')
  let option = {
    backgroundColor: '#fff',
    color: ['#FF9800', '#4FAFDD'],
    // width:290,
    // height:120,
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      icon: 'circle',
      data: ['舒张压', '收缩压'],
      bottom: 35,
      left: 20
    },
    grid: {
      containLabel: true,
      x: 0,
      y: 50
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.date,
      // data: ['6-8', '6-8', '6-8', '6-8', '6-8', '6-8', '6-8',''],
      interval: 10,
      axisLine: {
        lineStyle: {
          color: '#888888'
        }
      },
    },
    yAxis: {
      x: 'center',
      type: 'value',
      // minInterval: 1,
      // nameTextStyle: {
      //   align: "right"
      // }
      axisLine: {
        lineStyle: {
          color: '#888888'
        }
      }
    },
    series: [{
      name: '收缩压',
      type: 'line',
      smooth: true,
      data: data.systolic_pressure,
      // data: ['',90, 10, 20, 40, 50, 60],
      label: {
        normal: {
          show: true,
        }
      },
    }, {
      name: '舒张压',
      type: 'line',
      smooth: true,
      data: data.diastolic_pressure,
      // data: ['',30, 16, 60, 50, 60, 70],
      label: {
        normal: {
          show: true,
        }
      },

    }]
  }

  chart.setOption(option)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    guide: {
      guide: ''
    },
    chart: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    self.createData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  createData () {

    food = {}
    food.isLoading = true
    food.page = 1
    oldData = []
    // this.ecComponent = this.selectComponent('#mychart-dom-line')
    this.getBloodPressure()
    this.getQuestionData()
  },
  getQuestionData () {
    app.request({
      url: app.URL.get_blood_pressure_list,
      data: {page: food.page},
      success (e) {
        if (e.data.code !== 1) {
          self.setData({
            list: [],
            isLoadShow: false
          })
          return
        }
        let newData = e.data.data.list
        let page = e.data.data.page
        let total = e.data.data.total
        let isLoad = true
        let isLoadShow = true
        let isLoadTitle = '加载更多数据'
        // console.log(newData , page ,total)
        // 小于6条数据 ，不显示加载更多
        if (total === 1 && newData.length < 5) {
          // console.log("小于6条")
          isLoadShow = false
        }

        // 大约五条显示 加载更多
        if (total > page) {
          isLoadTitle = '加载更多数据'
          isLoad = true
        }

        //  没有数据

        if (total <= page && oldData.length > 5) {
          isLoadTitle = '没有更多数据了'
          isLoad = false
          food.isLoading = false
        } else {
          food.page++
        }
        for (let i = 0; i < newData.length; i++) {
          oldData.push(newData[i])
        }
        if (page === 1) {
          oldData = newData
          if (oldData.length === 0) {
            isLoadTitle = '暂时没有数据'
            isLoad = false
          }
        }
        self.setData({
          list: oldData,
          isLoad,
          isLoadShow,
          isLoadTitle
        })
      }
    })
  },
  getBloodPressure () {
    app.request({
      url: app.URL.get_blood_pressure,
      success (e) {
        if (e.data.code === 1) {
          let {guide, chart, last} = e.data.data
          self.setData({
            guide,
            last
          })
          // self.filterChartData(chart)
        }
      }
    })
  },
  // filterChartData (data) {
  //   let obj = {
  //     date: [],
  //     diastolic_pressure: [],
  //     systolic_pressure: []
  //   }
  //   data.forEach((item, index, arr) => {
  //     obj.date.push(item.date)
  //     obj.diastolic_pressure.push(item.diastolic_pressure)
  //     obj.systolic_pressure.push(item.systolic_pressure)
  //   })
  //   self.setData({
  //     chart: obj
  //   })
  //   self.initChart(obj)
  // },
  link (e) {
    let {url} = e.currentTarget.dataset
    console.log(url)
    wx.navigateTo({
      url: url
    })
  },
  initChart (data) {
    this.ecComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: this.data.windowWidth !== null ? this.data.windowWidth - 5 : width,
        height: this.data.windowHeight !== null ? this.data.windowHeight / 2 : height
      })
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart
      setOption(chart, data)
      // 必须返回示例 不然会屏蔽图标事件
      return chart
    })
  }
  ,
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let store = wx.getStorageSync('ure')
    if (store) {
      self.createData()
      wx.removeStorageSync('ure')
    }
  }
  ,

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  }
  ,

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
  ,

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
  ,

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (food.isLoading) {
      clearTimeout(self.timer)
      self.timer = setTimeout(() => {
        self.getQuestionData()
      }, 1000)
    }
  }
  ,

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})