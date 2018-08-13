// pages/communication/communication.js
let app = getApp().util;
let self = null;
let id;
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
        if (options.id) {
            id = options.id
        }
        this.getQuestionDetail(id);
    },
    onShow() {
        app.refresh('addFoodRefresh').then(() => {
            wx.showLoading({
                title: '数据更新中...',
            })
            console.log("我刷新了")
            self.getQuestionDetail(id);
        })
    },
    putQuestions(e) {
        wx.navigateTo({
            url: '/pages/Issue/Issue?questionId=' + id
        })
    },
    /**
       * 问题详情接口
       */
    getQuestionDetail(id) {
        app.request({
            url: app.URL.question_detile,
            data: { id },
            success(e) {
                console.log(e)
                console.log(e.data.data)
                wx.hideLoading();
                self.setData({
                    list: e.data.data
                })
            }
        })
    },
    /**
     * 已解决
     */
    solve_problem() {
        app.request({
            url: app.URL.solve_problem,
            data: { id },
            success(res) {
                app.emit("addFoodRefresh", {}, false)
                wx.showToast({
                    title: res.data.msg,
                    time: 1000,
                    success() {
                        setTimeout(() => {
                            if (res.data.code === 1) {
                                wx.navigateBack({ delta: 1 })
                            }
                        }, 1000)
                    }
                })
            }
        })
    },
    lookImage(e) {
        let url = e.currentTarget.dataset.url;
        let index = e.currentTarget.dataset.index;
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: self.data.list[index].img // 需要预览的图片http链接列表
        })
    }
})