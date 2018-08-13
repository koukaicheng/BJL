// pages/addFood/addFood.js
let app = getApp().util;
let self = null;
let food;
let dataSubmit;
let oldData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_type: [],
    customList: [],
    tabIndex: '0',
    maskShow: false,
    detailShow: true,
    detailLIst: {},
    scaleActive: 'min',
    height: false,
    max: 500,
    ints: true,
    step: 1,
    isOk: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    food = {}
    dataSubmit = {}
    food.isLoading = true;
    food.page = 1;
    oldData = []
    if (options.id) {
      food.id = options.id;
      dataSubmit.category = food.id;

      if (food.id === '7') {
        dataSubmit.type = 5;
        wx.setNavigationBarTitle({
          title: '添加自定义运动'
        })
      } else {
        dataSubmit.type = 2;
      }
      this.setData({
        category: food.id
      })

    }


    if (options.time) {
      food.time = options.time
    }
    if (options.date) {
      food.date = options.date;
      dataSubmit.date = food.date;

    }

    if (options.type === 'edit') {
      food.type = options.type
      let foodDataObject = wx.getStorageSync('foodDataObject');
      console.log(foodDataObject);
      let eatName = this.getFoodMarkName(food.id)
      let time = foodDataObject.date.split('-')
      dataSubmit.category = foodDataObject.category;
      dataSubmit.total = foodDataObject.total;
      dataSubmit.quantity = foodDataObject.quantity;
      dataSubmit.type = foodDataObject.type;
      dataSubmit.target_id = foodDataObject.target_id;
      dataSubmit.date = foodDataObject.date;
      dataSubmit.id = foodDataObject.id;
      console.log(dataSubmit, 1111111)
      this.getUtil(foodDataObject);

      this.setData({
        maskShow: true,
        detailShow: false,
        detailLIst: foodDataObject,
        scaleActive: foodDataObject.quantity,
        time: time[1] + "月" + time[2] + "日",
        eatName,
        height: true

      })
      wx.removeStorageSync('foodDataObject');

    }

    this.getCustomData();
    app.request({
      url: app.URL.get_food_type,
      success(e) {
        self.setData({
          list_type: e.data.data
        })
        // console.log(e)
      }
    })
  },
  onShow() {
    app.refresh('addFoodRefresh').then(() => {
      food.isLoading = true;
      food.page = 1;
      oldData = []
      self.getCustomData();
    })
  },
  tab(e) {
    let index = e.currentTarget.dataset.index;
    let code = e.currentTarget.dataset.code;
    // 初始化上拉加载
    food.page = 1;
    food.isLoading = true;
    clearTimeout(this.timer)
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.setData({
      tabIndex: index
    })
    food.code = code;
    food.types = index === '0' ? 2 : 1;
    dataSubmit.type = index === '0' ? 2 : 1;

    if (food.id === '7') {
      dataSubmit.type = index === '0' ? 5 : 4;
    }


    if (index !== '0') {
      this.getFootData(code);
    } else {
      this.getCustomData();
    }
  },
  /**
   * 打开详细信息
   */
  detail(e) {
    let detail = e.currentTarget.dataset.detail;
    let types = e.currentTarget.dataset.type;
    let eatName = this.getFoodMarkName(food.id)

    if (this.data.tabIndex === '0' || this.data.category === '7') {
      this.setData({
        maskShow: true,
        detailShow: false,
        detailLIst: detail,
        time: food.time,
        eatName,
        height: true,
        scaleActive: detail.number
      })

      this.getUtil(detail);
      return;
    }

    // if (this.data.tabIndex === '0' || this.data.category === '7') {
    //     app.toast({ content: `${this.data.category === '7' ? '运动不支持查看详情' : '自定义食物不支持查看详情'}` })
    //     return false;
    // }
    this.setData({
      maskShow: true,
      detailShow: true,
      detailLIst: detail,
      height: true
    })
  },
  /**
   * 添加食物
   */
  addFood(e) {
    let detail = e.currentTarget.dataset.detail;
    let eatName = this.getFoodMarkName(food.id)
    console.log(detail)
    this.setData({
      maskShow: true,
      detailShow: false,
      detailLIst: detail,
      time: food.time,
      eatName,
      height: true,
      scaleActive: detail.number
    })
    console.log(detail)
    this.getUtil(detail);
  },

  /**
   * 搜索
   */
  searchFn() {
    wx.navigateTo({
      url: '/pages/foodSearch/foodSearch?id=' + food.id + "&time=" + food.time + "&date=" + food.date
    })
  },
  /**
   * 获取单位
   */
  getUtil(detail) {
    if (food.id === '7') {
      console.log(detail.unit)
      // 次 级 小时 分钟 组 套 TODO
      let max = 100;
      let ints = true;
      let step = 1;
      switch (detail.unit) {
        case '小时':
          max = 24;
          ints = false;
          step = 5;
          break;
        case '分钟':
          max = 60;
          ints = true;
          step = 10;
          break;
        case '级':
          max = 1500;
          ints = true;
          step = 1;
          break;
      }
      this.setData({
        max,
        ints,
        step
      })

    }
  },
  getFoodMarkName(id) {
    let eatName = ''
    switch (id) {
      case '1':
        eatName = "早餐"
        break;
      case '2':
        eatName = "早加餐"
        break;
      case '3':
        eatName = "午餐"
        break;
      case '4':
        eatName = "午加餐"
        break;
      case '5':
        eatName = "晚餐"
        break;
      case '6':
        eatName = "晚加餐"
        break;
      case '7':
        eatName = "运动"
        break;
    }
    return eatName;
  },
  /**
   * 关闭遮罩层
   */
  closeMark(e) {
    let id = e.currentTarget.dataset.id;
    if (food.type === 'edit') {
      if (id === '0') {
        wx.navigateBack()
      }
      return;
    }
    this.setData({
      maskShow: false,
      height: false
    })
  },
  /**
   * 取消冒泡事件
   */
  cleartap() {
  },
  /**
   * 获取卡池数字
   */
  scaleValue(e) {
    // console.log(e)
    let value = e.detail.value;
    let energy = e.currentTarget.dataset.energy;
    let num = e.currentTarget.dataset.number;
    this.setData({
      scaVal: value,
      scaValLcil: Math.round(energy / num * value)
    })
    dataSubmit.total = this.data.scaValLcil
    dataSubmit.quantity = this.data.scaVal;
  },
  /**
   * 拍照打卡
   */
  photo() {
    wx.navigateTo({
      url: "/pages/Issue/Issue?type=photo&id=" + food.id + "&time=" + food.date
    })
  },
  /**
   * 添加自定义食物
   */
  tapcustom(e) {
    let types = e.currentTarget.dataset.type;
    console.log(types)

    wx.navigateTo({
      url: "/pages/addCustomFood/addCustomFood?types=" + types
    })
  },
  /**
  * 删除自定义食物
  */
  delFood(e) {
    let id = e.currentTarget.dataset.id;
    self.delFoodData(id)
  },
  /**
   * 提交打卡
   */
  submit(e) {
    console.log(dataSubmit)
    if (food.type !== 'edit') {
      dataSubmit.target_id = e.currentTarget.dataset.id;
    }

    // 避免重复提交
    if (!this.data.isOk) {
      console.log('避免重复打卡')
      return
    }
    // return false;
    this.getAdd(dataSubmit)
  },
  /**
   * 获取自定义食物列表
   */
  getCustomData() {
    app.request({
      url: food.id === '7' ? app.URL.exercise_consumption_list : app.URL.custom_food_list,
      // url: app.URL.custom_food_list,
      data: { page: food.page },
      success(e) {
        let newData = e.data.data.list;
        if (e.data.code !== 1) {
          console.log('sss');
          self.setData({
            customList: [],
            customListType: food.id === '7' ? 'motion' : 'food',
            isLoadShow: false,
          })
          return
        }
        console.log(newData, 'newdata');
        let page = e.data.data.page;
        let total = e.data.data.total;
        let isLoad = true;
        let isLoadShow = true;
        let isLoadTitle = '加载更多数据';

        console.log(page, total)
        // 小于6条数据 ，不显示加载更多
        if (total === 1 && newData.length < 6) {
          console.log("小于6条")
          isLoadShow = false;
        }

        // 大约五条显示 加载更多
        if (total > page) {
          console.log("加载更多数据")
          isLoadTitle = '加载更多数据'
          isLoad = true;
        }

        //  没有数据
        if (total <= page && oldData.length > 5) {
          console.log("没有数据了")
          isLoadTitle = '没有更多数据了'
          isLoad = false;
          food.isLoading = false;
        } else {
          food.page++
        }

        for (let i = 0; i < newData.length; i++) {
          oldData.push(newData[i])
        }
        if (page === 1) {
          oldData = newData
        }
        self.setData({
          customList: oldData,
          customListType: food.id === '7' ? 'motion' : 'food',
          isLoad,
          isLoadShow,
          isLoadTitle
        })


      }
    })
  },
  /**
   * 食物详细列表
   */
  getFootData(id) {
    app.request({
      url: food.id === "7" ? app.URL.common_movement : app.URL.get_food_energy,
      data: { type_code: id, page: food.page },
      success(e) {
        let newData = e.data.data.list;
        console.log(newData)
        if (e.data.code !== 1) {
          self.setData({
            customList: [],
            customListType: food.id === '7' ? 'motion' : 'food',
            isLoadShow: false,
          })
          return
        }
        let page = e.data.data.page;
        let total = e.data.data.total;
        let isLoad = true;
        let isLoadShow = true;
        let isLoadTitle = '加载更多数据';

        console.log(page, total)
        // 小于五条数据 ，不显示加载更多
        if (total === 1 && newData.length < 6) {
          console.log("小于五条")
          isLoadShow = false;
        }

        // 大约五条显示 加载更多
        if (total > page) {
          console.log("加载更多数据")
          isLoadTitle = '加载更多数据'
          isLoad = true;
        }

        //  没有数据
        if (total <= page && oldData.length > 4) {
          console.log("没有数据了")
          isLoadTitle = '没有更多数据了'
          isLoad = false;
          food.isLoading = false;
        } else {
          food.page++
        }

        for (let i = 0; i < newData.length; i++) {
          oldData.push(newData[i])
        }
        if (page === 1) {
          oldData = newData
        }
        self.setData({
          customListType: food.id === '7' ? 'motion' : 'food',
          customList: oldData,
          isLoad,
          isLoadShow,
          isLoadTitle
        })
      }
    })
  },
  /**
   * 打卡提交
   */
  getAdd(data) {
    wx.showLoading({
      title: '打卡中...'
    })
    this.setData({
      isOk: false
    })
    console.log('打卡中。。。。开始请求数据')
    app.request({
      url: app.URL.calorie_recard_add,
      data,
      success(e) {
        console.log('请求完成，开始加载数据')
        wx.hideLoading();
        if (e.data.code === 1) {
          if (food.type === 'edit') {
            console.log('加载完成，开始渲染')
            wx.showToast({
              title: e.data.msg,
              duration: 1000,
              success() {
                setTimeout(() => {
                  app.emit("addFoodRefresh")
                }, 1000)
              }
            })
            self.setData({
              isOk: true
            })
            return;
          }
          self.setData({
            maskShow: false,
            height: false
          }, () => {
            app.emit("addFoodRefresh", { time: data.date }, false);
            wx.setStorageSync('off', true);
            wx.showToast({
              title: e.data.msg,
              time: 1000,
              success() {
                setTimeout(() => {
                  self.setData({
                    isOk: true
                  })
                }, 1000)
              }
            })
          })

        }
      }
    })
  },
  /**
  * 删除食物接口
  */
  delFoodData(id) {
    let url = ''
    let str = ''
    if (food.id === '7') {
      url = app.URL.exercise_consumption_del
      str = '是否删除当前自定义运动'
    } else {
      url = app.URL.custom_food_del;
      str = '是否删除当前自定义食物'
    }

    app.toast(true, {
      title: '删除',
      content: str,
      success() {
        wx.showLoading({
          title: '删除中...',
        })
        app.request({
          url: url,
          data: { id },
          success(e) {
            wx.hideLoading()
            if (e.data.code === 1) {
              wx.showToast({
                title: e.data.msg,
                duration: 2000
              })
              food.isLoading = true;
              food.page = 1;
              oldData = []
              self.getCustomData();
            }
          }
        })
      }
    })

  },
  onReachBottom(e) {
    if (food.isLoading) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (food.types === 1) {
          this.getFootData(food.code);
        } else {
          this.getCustomData();
        }
      }, 1000)

    }
  }
})