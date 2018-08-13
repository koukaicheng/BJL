// pages/addCustomFood/addCustomFood.js
let data;
let app = getApp().util
let types;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    strName: '',
    array: ['克', '千克', '瓶', '碗', '盘', '个', '组', '分钟', '小时'],
    index: 0,
    types: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = {}
    if (options.types) {
      types = options.types;
      this.setData({
        types: types === 'food' ? true : false
      })
      if (types !== 'food') {
        wx.setNavigationBarTitle({
          title: '添加自定义运动'
        })
      }

    }
  },
  getValue(e) {
    let types = e.currentTarget.dataset.param;
    let val = e.detail.value;
    console.log(val)
    data[types] = val
    console.log(data)
  },
  bindPickerChange(e) {
    let index = e.detail.value
    data.unit = this.data.array[index];
    this.setData({
      strName: this.data.array[index]
    })
  },
  sumbit() {
    if (this.data.types) {

      if (!data.food_name) {
        app.toast({ content: '请输入食物名称' })
        return;
      }
      if (!data.energy) {
        // app.toast({ content: '请输入食物热量' })
        data.energy = 0
        // return;
      }
      if (!data.number) {
        app.toast({ content: '请输入食物数量' })
        return;
      }
      if (!data.unit) {
        app.toast({ content: '请输入食物单位' })
        return;
      }
    } else {
      if (!data.sport_event) {
        app.toast({ content: '请输入运动项目名称' })
        return;
      }
      if (!data.energy) {
        // app.toast({ content: '请输入消耗能量' })
        // return;
        data.energy = 0
      }
      if (!data.number) {
        app.toast({ content: '请输入食物数量' })
        return;
      }
      if (!data.unit) {
        app.toast({ content: '请输入食物单位' })
        return;
      }
    }

    let url = types === 'food' ? app.URL.add_custom_food : app.URL.exercise_consumption_add
    app.request({
      url: url,
      data: data,
      success(res) {
        console.log(res)
        if (res.data.code !== 1) {
          wx.hideLoading();
          wx.showModal({
            title: "提示",
            showCancel: false,
            content: res.data.errmsg
          })
          return;
        }
        app.emit("addFoodRefresh", {}, false)
        wx.showToast({
          title: res.data.msg,
          time: 1000,
          success() {
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          }
        })

      }
    })
  }
})