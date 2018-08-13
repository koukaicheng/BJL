// pages/bloodPressure/bloodPressure.js
import * as echarts from '../../ec-canvas/echarts'

let app = getApp().util
let self = null
let food
let oldData

function setOption (chart, data) {
  console.log(data)
  let option = {
    backgroundColor: '#fff',
    color: ['#FF9800', '#4FAFDD','#66CC33','#999999','#9999FF'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      icon: 'circle',
      data: ['空腹', '早餐','午餐','晚餐','睡前'],
      bottom: 30,
      left: 20
    },
    grid: {
      containLabel: true,
      x: 0,
      y: 20
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
      name: '空腹',
      type: 'line',
      smooth: true,
      data: data.limosis,
      label: {
        normal: {
          show: true,
        }
      },
    }, {
      name: '早餐',
      type: 'line',
      smooth: true,
      data: data.breakfast,
      label: {
        normal: {
          show: true,
        }
      },
    },{
      name: '午餐',
      type: 'line',
      smooth: true,
      data: data.lunch,
      label: {
        normal: {
          show: true,
        }
      },
    },{
      name: '晚餐',
      type: 'line',
      smooth: true,
      data: data.dinner,
      label: {
        normal: {
          show: true,
        }
      },
    },{
      name: '睡前',
      type: 'line',
      smooth: true,
      data: data.bedtime,
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
    self.createdData()

  },
   createdData:function(){
     food = {}
     food.isLoading = true
     food.page = 1
     oldData = []
     wx.getSystemInfo({
       success: function (res) {
         self.setData({
           windowWidth: res.windowWidth,
           windowHeight: res.windowHeight
         })
       }
     })
     this.ecComponent = this.selectComponent('#mychart-dom-line')
     this.getBloodPressure()
     this.getQuestionData()
   },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getQuestionData () {
    app.request({
      url: app.URL.get_blood_sugar_list,
      data: {page: food.page},
      success (e) {
        if (e.data.code !== 1) {
          // console.log(123)
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
        if (total === 1 && newData.length < 4) {
          console.log("小于6条")
          // isLoadShow = false
        }

        // 大约五条显示 加载更多
        console.log(total, page, oldData.length)
        if (total > page) {
          console.log("大约五条显示 加载更多")
          isLoadTitle = '加载更多数据'
          isLoad = true
        }

        //  没有数据
        if (total <= page && oldData.length > 3) {
          console.log("没有更多数据了")
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
          console.log(oldData)
          if (oldData.length===0){
            isLoadTitle = '暂时没有数据'
            isLoad = false
          }
        }
        self.fillterNewData(oldData)
        self.setData({
          isLoad,
          isLoadShow,
          isLoadTitle
        })
      }
    })
  },
  fillterNewData (oldData) {
    oldData.forEach((item, index, arr) => {
      let text = ''
      // console.log(typeof item.type)
      switch (item.type) {
        case 1:
          text = '空腹'
          break
        case 4:
          text = '早餐后2小时'
          break
        case 5:
          text = '午餐后2小时'
          break
        case 6:
          text = '晚餐后2小时'
          break
        case 7:
          text = '睡前'
          break
        default:
          break
      }
      item.text = text
    })
    self.setData({
      list: oldData,
    })
  },
  getBloodPressure () {
    app.request({
      url: app.URL.get_blood_sugar,
      success (e) {
        if (e.data.code === 1) {
          let {guide, chart, last} = e.data.data
          self.setData({
            guide,
            last
          })
          self.filterChartData(chart)
        }
      }
    })
  },
  filterChartData (data) {
    let obj = {
      date: [],
      limosis: [],
      bedtime: [],
      breakfast:[],
      lunch:[],
      dinner:[]
    }
    data.forEach((item, index, arr) => {
      obj.date.push(item.date)
      obj.limosis.push(item.limosis)
      obj.bedtime.push(item.bedtime)
      obj.breakfast.push(item.breakfast)
      obj.lunch.push(item.lunch)
      obj.dinner.push(item.dinner)
    })
    self.setData({
      chart: obj
    })
    self.initChart(obj)
  },
  link (e) {
    let {url} = e.currentTarget.dataset
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
      // return chart
    })
  }
  ,
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let store = wx.getStorageSync('gar')
    if(store) {

      self.createdData()
      console.log(132)
      wx.removeStorageSync('gar');
    }
    // wx.setStorageSync
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