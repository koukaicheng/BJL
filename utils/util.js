
import config from '../config'
class Util {
    constructor() {
        this.URL = config.service;
    }
    /**
     * 接口请求重新封装
     * @param option
     */
    request(option) {
        let userInfo = wx.getStorageSync('userInfo');
        if(!option.data){
            option.data = {}
        }
        let url = option.url;
        if (userInfo.token) {
            option.data.token = userInfo.token;
        }
        wx.request({
            'url': url,
            method: 'post',
            'data': option.data ? option.data : {},
            'success': function (response) {
                console.log(response.data.code)
              if (response.data && response.data.code===3){
                wx.removeStorageSync('userInfo');
                wx.redirectTo({
                  url: "/pages/register/register"
                });
                return
              }
                typeof option.success === 'function' && option.success(response)
            },
            'fail': function (response) {
                typeof option.fail === 'function' && option.fail(response)
            },
            'complete': function (response) {
                typeof option.complete === 'function' && option.complete(response)
            }
        })
    }

    /**
     * 获取登陆状态
     * @param fn
     */
    getlogin(fn) {
        let self = this;
        // console.log('登陆状态检测：' + JSON.stringify(wx.getStorageSync('userInfo')));
        wx.checkSession({
            success: function () {
        
              wx.login({
                success: res => {
                  let code = {
                    code: res.code
                  };
                  // console.log(code);
                  wx.request({
                    url: config.service.login,
                    method: 'post',
                    header: { 'content-type': 'application/json' },
                    data: code,
                    success: function (e) {
                      console.log(e.data);
                      if(e.data.data&&e.data.code===0){
                        // typeof fn === 'function' && fn(e);
                        wx.removeStorageSync('userInfo');
                        wx.redirectTo({
                          url: "/pages/register/register"
                        });
                        return ;
                      }
                      if(e.data.data&&e.data.code===1&&e.data.data.is_perfect==="Y"){
                        wx.setStorageSync('userInfo', e.data.data);
                        // console.log('登陆成功返回信息：' , e);
                        typeof fn === 'function' && fn();
                        return ;
                      }
                      if(e.data.code===1&&e.data.data.is_perfect==="N"){
                        wx.setStorageSync('userInfo', e.data.data);
                        typeof fn === 'function' && fn(e);
                        wx.redirectTo({
                          url: "/pages/personalData/personalData?off="+'bd'
                        });
                        return ;
                      }else {
                        console.log('登录失败')
                      }
                    },
                    fail(data) {
                      console.log('登录失败', data)
                      wx.showToast({
                        icon:"none",
                        title:data.msg
                      })
                    },
                    complete() {
                    }
                  })
                }
              })
            },
            fail: function () {
                wx.setStorageSync('userInfo', {});
                self.err('login is overdue');
                login(fn)
            }
        })
    }

    /**
     * 计算日期
     * @param AddDayCount
     * @returns {string}
     */
    getDate(date, AddDayCount) {
        let dd = new Date(date);
        dd.setDate(dd.getDate() + AddDayCount)   ; // 获取AddDayCount天后的日期
        let y = dd.getFullYear();
        let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1) ;  // 获取当前月份的日期，不足10补0
        let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();  // 获取当前几号，不足10补0
        return y + '-' + m + '-' + d;
    }

    /**
     * 提示框
     * @param showCancel
     * @param obj
     */
    toast(showCancel = false, obj) {
        if (typeof showCancel === 'object') {
            obj = showCancel
            showCancel = false
        }
        wx.showModal({
            title: obj.title ? obj.title : '提示',
            showCancel: showCancel,
            content: obj.content ? obj.content : '错误提示',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    typeof obj.success === 'function' && obj.success()
                } else if (res.cancel) {
                    typeof obj.fail === 'function' && obj.fail()
                }
            }
        })
    }

    /**
     * 刷新事件发送数据
     * @param param
     * @param back
     * @returns {boolean}
     */
    emit(param, obj, back = true) {
        if (typeof param !== 'string') {
            console.error('参数必须为String类型')
            return false
        }
        wx.setStorageSync(param, true)
        if (typeof obj === 'object') {
            wx.setStorageSync(param + 'params', obj)
        }
        if (back) {
            wx.navigateBack()
        }
    }

    /**
     * 刷新数据
     * @param param
     * @returns {*}
     */
    refresh(param) {
        if (typeof param !== 'string') {
            console.error('参数必须为String类型');
            return false
        }
        return new Promise((resolve, reject) => {
            let params = wx.getStorageSync(param + 'params');
            if (wx.getStorageSync(param)) {
                resolve(params);
                wx.removeStorageSync(param + 'params');
                wx.removeStorageSync(param);
            }

        })
    }

    /**
     * 正常调试输出
     * @param obj
     */
    log(...obj) {
        if (config.log) {
            console.log(...obj)
        }
    }

    /**
     * 错误调试输出
     * @param obj
     */
    err(...obj) {
        if (config.log) {
            console.error(...obj)
        }
    }
}

function login(fn) {
    wx.login({
        success: res => {
            let code = {
                code: res.code
            };
            console.log(code);
            wx.request({
                url: config.service.login,
                method: 'post',
                header: { 'content-type': 'application/json' },
                data: code,
                success: function (e) {
                    console.log(e.data);
                    if(e.data.data&&e.data.code===0){
                      typeof fn === 'function' && fn(e);
                      wx.removeStorageSync('userInfo');
                      wx.redirectTo({
                        url: "/pages/register/register"
                      });
                      return ;
                    }
                    if(e.data.data&&e.data.code===1&&e.data.data.is_perfect==="Y"){
                      wx.setStorageSync('userInfo', e.data.data);
                      console.log('登陆成功返回信息：' , e);
                      typeof fn === 'function' && fn();
                      return ;
                    }
                    if(e.data.code===1&&e.data.data.is_perfect==="N"){
                      wx.setStorageSync('userInfo', e.data.data);
                      typeof fn === 'function' && fn(e);
                      wx.redirectTo({
                        url: "/pages/personalData/personalData"
                      });
                      return ;
                    }else if(e.data.data&&e.data.code===3){
                     wx.showToast({
                       title:e.data.msg
                     })
                    }
                },
                fail(data) {
                    console.log('登录失败', data)
                },
                complete() {
                }
            })
        }
    })
};


module.exports = Util;
