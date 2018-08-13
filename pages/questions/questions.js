// pages/questions /questions .js
let app = getApp().util;
let self = null;
let food;
let oldData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        self = this;
        food = {}
        food.isLoading = true;
        food.page = 1;
        oldData = []
        this.getQuestionData()
    },
    onShow() { 
      app.refresh('addFoodRefresh:photo').then(() => {
            wx.showLoading({
                title: '数据更新中...',
            })
            food.page =1 ;
            console.log("我刷新了")
            self.getQuestionData();
        })
    },
    /**
     * 我要提问
     */
    putQuestions(e) {
        wx.navigateTo({
            url: '/pages/Issue/Issue'
        })
    },
    questionsDetail(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/communication/communication?id=' + id,
        })

    },
    /**
     * 获取问题数据接口
     */
    getQuestionData() {
        app.request({
            url: app.URL.question_list,
            data: { page: food.page },
            success(e) {
                wx.hideLoading();
                if(e.data.code !== 1){
                    self.setData({
                        list: [],
                        isLoadShow:false
                    })
                    return;
                }
                let newData = e.data.data.list;
                let page = e.data.data.page;
                let total = e.data.data.total;
                let isLoad = true;
                let isLoadShow = true;
                let isLoadTitle = '加载更多数据';
                console.log(newData , page ,total)
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
                    list: oldData,
                    isLoad,
                    isLoadShow,
                    isLoadTitle
                })
            }
        })
    },
    onReachBottom(e) {
        console.log(food)
        if (food.isLoading) {
            clearTimeout(self.timer)
            self.timer = setTimeout(() => {
                self.getQuestionData()
            }, 1000)
        }
    }

})