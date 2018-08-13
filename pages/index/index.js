//index.js
//获取应用实例
import * as echarts from '../../ec-canvas/echarts'

const app = getApp().util

function setOption (chart, data) {
  let option = {
    backgroundColor: '#fff',
    color: ['#52b8f5', '#aca3ff'],
    // width:290,
    // height:120,
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      icon: 'circle',
      data: ['体重(kg)', '体脂率(%)'],
      bottom: 30,
      left: 20
    },
    grid: {
      containLabel: true,
      x: 10,
      y: 20
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.time || [''],
      // data: ['', '','','','',''],
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
      name: '体重(kg)',
      type: 'line',
      smooth: true,
      data: data.weight || [''],
      // data: [40,30,60,50,60,70],
      label: {
        normal: {
          show: true,
        }
      },

    }, {
      name: '体脂率(%)',
      type: 'line',
      smooth: true,
      data: data.bodyfatrate,
      // data: [10,30,20,40,50,60],
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
  data: {
    ec: {
      lazyLoad: true
    },
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    self.indexData()
  },
  indexData () {
    let self = this
    self.getIndexData((res) => {
      let meaechart = {
        time: [],
        weight: [],
        bodyfatrate: []
      }
      if (res.data.data.meaechart) {
        res.data.data.meaechart.forEach((value, index, arr) => {
          meaechart['time'].push(value.weeks)
          meaechart['weight'].push(value.weight)
          meaechart['bodyfatrate'].push(value.bodyfatrate)
        })
        meaechart.time.push('')
      }
      let [proteinUrl, fatUrl, carbohydrateUrl, fetusSatus, motherStatus, gestational, eutocia, skeletal, giantBaby] = [null, null, null, null, null, null, null, null, null]
      if (res.data.data.food && res.data.data.food.protein) {
        proteinUrl = self.foodStatusImgUrl(res.data.data.food.protein.text)
        fatUrl = self.foodStatusImgUrl(res.data.data.food.fat.text)
        carbohydrateUrl = self.foodStatusImgUrl(res.data.data.food.carbohydrate.text)
      }
      if (res.data.data.report && res.data.data.report !== null) {
        fetusSatus = self.fillterStatus(res.data.data.report.fetus_weight_status)   // 胎儿体重状态
        motherStatus = self.fillterStatus(res.data.data.report.mother_weight_status)  //孕妇体重状态
        gestational = self.earlYwarning(res.data.data.report.gestational_diabetes)  //  妊娠糖尿病
        eutocia = self.earlYwarning(res.data.data.report.eutocia_rate)            // 顺产率
        skeletal = self.earlYwarning(res.data.data.report.skeletal_fragility)  //孕妇骨骼脆弱
        giantBaby = self.earlYwarning(res.data.data.report.giant_baby)   //巨大儿
        // console.log(gestational, eutocia, skeletal, giantBaby);

        // proteinUrl = self.foodStatusImgUrl(res.data.data.food.protein.text);
        // fatUrl = self.foodStatusImgUrl(res.data.data.food.fat.text);
        // carbohydrateUrl = self.foodStatusImgUrl(res.data.data.food.carbohydrate.text);
      }

      let {is_celiang} = res.data.data
      let Integrated = {
        meaechart,
        fetusSatus,
        motherStatus,
        gestational,
        eutocia,
        skeletal,
        giantBaby,
        proteinUrl,
        fatUrl,
        carbohydrateUrl,
      }
      let {name, avatar} = wx.getStorageSync('userInfo')
      // let {username} = userInfo;
      if(res.data.data.blood_sugar){
        self.fillterNewData(res.data.data.blood_sugar)
      }
      self.setData({
        boxData: res.data.data,
        Integrated,
        is_celiang,
        name,
        avatar,
        blood_pressure: res.data.data.blood_pressure,
        service_type:res.data.data.service_type
      })
      self.ecComponent = this.selectComponent('#mychart-dom-line')
      self.initChart()
    })
  },
  fillterNewData (oldData) {
      let text = ''
      // console.log(typeof item.type)
      switch (oldData.type) {
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
    oldData.text = text
    this.setData({
      blood_sugar: oldData,
    })
  },
  fillterStatus (num) {
    let text = ''
    let obj = {
      text: '',
      color: '',
      imgUrl: ''
    }
    switch (num) {
      case 1:
        obj.text = '严重偏瘦 '
        obj.color = '#fa7070'
        obj.imgUrl = '../../assets/img/hjt@2x.png'
        break
      case 2:
        obj.text = '偏瘦'
        obj.color = '#fa7070'
        obj.imgUrl = '../../assets/img/hjt@2x.png'
        break
      case 3:
        obj.text = '正常'
        obj.color = '#6bce73'
        obj.imgUrl = '../../assets/img/ljt@2x.png'
        break
      case 4:
        obj.text = '偏胖 '
        obj.color = '#fa7070'
        obj.imgUrl = '../../assets/img/hjt@2x.png'
        break
      case 5:
        obj.text = '严重超重'
        obj.color = '#fa7070'
        obj.imgUrl = '../../assets/img/hjt@2x.png'
        break
      default:
        obj.text = '暂无'
        obj.color = '#6bce73'
        obj.imgUrl = '../../assets/img/ljt@2x.png'
        break
    }
    return obj
  },
  earlYwarning (num) {
    let obj = {
      text: '',
      color: '',
      imgUrl: ''
    }
    switch (num) {
      case 1:
        obj.text = '暂无风险'
        obj.color = '#6bce73'
        obj.imgUrl = '../../assets/img/zhengchang@2x.png'
        break
      case 2:
        obj.text = '引起重视'
        obj.color = '#ffaf48'
        obj.imgUrl = '../../assets/img/jinggao@2x.png'
        break
      case 3:
        obj.text = '非常危险'
        obj.color = '#fa7070'
        obj.imgUrl = '../../assets/img/weixian@2x.png'
        break
      default:
        obj.text = '暂无风险'
        obj.color = '#6bce73'
        obj.imgUrl = '../../assets/img/zhengchang@2x.png'
        break
    }

    return obj
  },
  foodStatusImgUrl (text) {
    let obj = {
      url: '',
      class: ''
    }
    switch (text) {
      case '偏高':
        obj.url = '../../assets/img/hsjt@2x.png'
        obj.class = 'stus2'
        break
      case '偏低':
        obj.url = '../../assets/img/hxjt@2x.png'
        obj.class = 'stus2'
        break
      case '合适':
        obj.url = '../../assets/img/gou@2x.png'
        obj.class = 'stus3'
        break
      default:
        break
    }

    return obj
  },
  initChart: function () {
    this.ecComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: this.data.windowWidth !== null ? this.data.windowWidth - 10 : width,
        height: this.data.windowHeight !== null ? this.data.windowHeight / 2.6 : height
      })
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart
      setOption(chart, this.data.Integrated.meaechart)
      // 必须返回示例 不然会屏蔽图标事件
      return chart
    })
  },
  getIndexData (callback, data = {}) {
    app.getlogin(() => {
      app.request({
        url: app.URL.index,
        data,
        success: (res) => {
          // console.log(res.data)
          if (res.data.code === 1) {
            // console.log(res.data.code)
            typeof callback === 'function' && callback(res)
          }
        }
      })
    })

  },
  link (e) {
    // console.log(e);
    let {url} = e.currentTarget.dataset
    console.log(url)
    wx.navigateTo({
      url: url
    })
  },
  onReady: function () {

  },
  getUserInfo: function (e) {

  },
  onShow () {
    let {Integrated, boxData} = this.data
    if (Integrated == 'undefined' || boxData == 'boxData') {
      // console.log(Integrated,boxData)
      this.indexData()
    }
    let off = wx.getStorageSync('off')
    if (off) {
      this.indexData()
      wx.removeStorageSync('off')
    }
  },
  onPullDownRefresh () {
    this.indexData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
