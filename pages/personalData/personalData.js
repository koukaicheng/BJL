// pages/personalData/personalData.js

const NATION = ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族", "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族", "土族", "达斡尔族", "仫佬族", "羌族", " 布朗族", " 撒拉族", " 毛难族", " 仡佬族", " 锡伯族", " 阿昌族", " 普米族", " 塔吉克族", " 怒族", " 乌孜别克族", " 俄罗斯族", " 鄂温克族", " 崩龙族", " 保安族", " 裕固族", " 京族", " 塔塔尔族", " 独龙族", " 鄂伦春族", " 赫哲族", " 门巴族", " 珞巴族", " 基诺族", "其他"];
let that = null;
let app = getApp().util;
let info = {
    nation: "汉族",
    edc: '',
    height: '',
    weight_before: '',
    name: '',
    birthday: '',
    avatar: 'https://ssl.3wchina.net/kaixinmami/public/avatar/uploads/avatar.png'
};

function getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
let newTime = getNowFormatDate();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        maskShow: false,
        scaVal: 0,
        min: '50',
        nation: NATION,
        nationValue: "汉族",
        height: '',
        weight: '',
        name: '',
        newTime
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;
        let {off} = options;
        console.log(options);
        off = off === 'bd' ? true : false;
        if (off) {
            wx.setNavigationBarTitle({
                title: "注册信息"
            })
        }
        let userInfo = wx.getStorageSync('userInfo');
        let {token} = userInfo;
        if (userInfo) {
            info.token = token;
            info.name = userInfo.name;
            info.nation = userInfo.nation;
            info.height = userInfo.height;
            info.weight_before = userInfo.weight_before;
            info.birthday = userInfo.birthday;
            info.avatar = userInfo.avatar;
            info.edc = userInfo.edc;
        }
        // console.log(userInfo);
        this.setData({
            userInfo,
            off
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    avatar() {
        wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
                let {avatarUrl} = res.userInfo;
                console.log(avatarUrl);
                if (avatarUrl == '' || avatarUrl == null) {
                    avatarUrl = "https://ssl.3wchina.net/kaixinmami/public/avatar/uploads/avatar.png";
                    // return
                }
                info.avatar = avatarUrl;
                that.setData({
                    'userInfo.avatar': avatarUrl
                })
            },
            fail: (err) => {
                console.log(err);
                wx.showModal({
                    title: "提示",
                    content: "您拒绝了授权,可能将会影响您当前的使用,点击确定重新授权",
                    success: function (res) {
                        console.log(res);
                        if (res.confirm) {
                            wx.openSetting({
                                success: function (res) {
                                    console.log(res);
                                    if (res.authSetting["scope.userInfo"]) {
                                        wx.getUserInfo({
                                            success: (res) => {
                                                let {avatarUrl} = res.userInfo;
                                                console.log(avatarUrl)
                                                if (avatarUrl == '') return;
                                                info.avatar = avatarUrl;
                                                that.setData({
                                                    'userInfo.avatar': avatarUrl
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        } else if (res.cancel) {
                        }
                    }
                })
            }
        });
    },
    inputChenage(event) {
        let value = event.detail.value;
        let name = event.currentTarget.dataset.name;
        info[name] = value;
        console.log(info)
    },

    birthday(event) {
        console.log(event);
        let value = event.detail.value;
        console.log(value);
        this.setData({
            'userInfo.birthday': value
        });
        info.birthday = value;
    },
    edc(event) {
        let currentName = event.currentTarget.dataset.name;
        let value = event.detail.value;
        this.setData({
            'userInfo.edc': value,
            edc: value
        });
        info.edc = value;
    },
    nation(event) {
        let value = Number(event.detail.value);
        console.log(event);
        this.setData({
            'userInfo.nation': NATION[value]
        });
        info.nation = NATION[value];
    },
    // weight(){
    //   this.setData({
    //     maskShow:true,
    //     company: "kg"
    //   })
    // },
    logout() {
        // console.log(info)
        app.request({
            url: app.URL.logout,
            success: (res) => {
                console.log(res)
                if (res.data.code === 1) {
                    wx.showToast({
                        title: "退出成功"
                    });
                    wx.removeStorageSync('userInfo');
                    // wx.setStorageSync('off', true);
                    setTimeout(() => {
                        wx.reLaunch({
                            url: "/pages/register/register"
                        });
                    }, 2000)
                } else {
                    wx.showToast({
                        title: res.data.msg
                    })
                }
            }
        })
    },
    currentName(e) {
        console.log(e);
        let currentName = e.currentTarget.dataset.name;
        console.log(currentName);
        switch (currentName) {
            case "height":
                this.setData({
                    currentName,
                    maskShow: true,
                    min: "145",
                    company: "cm",
                    text: "身高"
                });
                break;
            case "weight":
                this.setData({
                    currentName,
                    maskShow: true,
                    company: "kg",
                    text: "体重"
                });
                break;
            default:
                break;
        }
        // this.setData({
        //   maskShow:true,
        //   company: "cm"
        // })
    },
    closeMark(e) {
        this.setData({
            maskShow: false,
            height: false
        })
    },
    submit() {
        let {currentName, scaVal} = this.data;
        console.log(currentName);
        this.setData({
            maskShow: false
        });
        switch (currentName) {
            case "height":
                this.setData({
                    'userInfo.height': scaVal
                });
                info.height = scaVal;
                break;
            case "weight":
                this.setData({
                    'userInfo.weight_before': scaVal
                });
                info.weight_before = scaVal;
                break;
            default:
                break;
        }
    },
    preservation() {
        console.log(info);
        for (let key in info) {
            if (!info[key]) {
                wx.showToast({
                    title: "请正确填写资料",
                    icon: "none"
                });
                return
            }
        }
        wx.showLoading({
            title: "提交中"
        });
        app.request({
            url: app.URL.edit_user,
            data: info,
            success: (res) => {
                console.log(res.data);
                wx.hideLoading();
                if (res.data.code !== 1) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.msg
                    })
                } else {
                    wx.setStorageSync('userInfo', res.data.data);
                    wx.showToast({
                        title: "保存成功"
                    });
                    setTimeout(() => {
                        wx.reLaunch({
                            url: "/pages/index/index"
                        });
                    }, 500)
                }
            }
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
        this.setData({
            scaVal: value
        });
    },
    /**S
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})