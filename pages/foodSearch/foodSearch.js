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
        step: 1
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
                dataSubmit.type = 4;
            } else {
                dataSubmit.type = 1;
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
        // 测试搜索
        // this.getFootData("黄")

    },
    /**
     * 打开详细信息
     */
    detail(e) {
        let detail = e.currentTarget.dataset.detail;
        let types = e.currentTarget.dataset.type;
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
            height: true
        })

        this.getUtil(detail);
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
                    step = 10;
                    break;
                case '分钟':
                    max = 60;
                    ints = false;
                    step = 10;
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
    cleartap() { },
    /**
     * 获取卡池数字
     */
    scaleValue(e) {
        // console.log(e)
        let value = e.detail.value;
        let detail = e.currentTarget.dataset.detail;
        let num = food.id === '7' ? 1 : 100;
        this.setData({
            scaVal: value,
            scaValLcil: Math.round(detail / num * value)
        })
        dataSubmit.total = this.data.scaValLcil
        dataSubmit.quantity = this.data.scaVal;
    },

    /**
     * 提交打卡
     */
    submit(e) {
        console.log(dataSubmit)
        if (food.type !== 'edit') {
            dataSubmit.target_id = e.currentTarget.dataset.id;
        }
        // return false;
        this.getAdd(dataSubmit)
    },
    /**
     * 搜索
     */
    getvalue(e){
        food.val = e.detail.value;
    },
    search(e){
        let val = e.detail.value;
        console.log(val)
        this.getFootData(val)
    },
    /**
     * 食物详细列表
     */
    getFootData(keyword) {
        app.request({
            url: app.URL.food_search,
            data: { page: food.page, keyword },
            success(e) {

                self.setData({
                    customList: e.data.data,
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
        app.request({
            url: app.URL.calorie_recard_add,
            data,
            success(e) {
                wx.hideLoading();
                if (e.data.code === 1) {
                    app.emit("addFoodRefresh", {}, false)
                    wx.showToast({
                        title: e.data.msg,
                        time: 1000,
                        success() {
                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }, 1000)
                        }
                    })


                }
            }
        })
    }
})