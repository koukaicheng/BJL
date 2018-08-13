//app.js
import Util from './utils/util'
import Config from './config'
App({
    onLaunch: function () {
        // this.util.getlogin();
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
             // console.log(res,'sssss')
            }
          })
        }
      })
    },
    global: {
        userInfo: null
    },
    util: new Util(),
    config: Config,
    getPlatform: function () {
        let systemInfo = {};
        wx.getSystemInfo({
            success: function (res) {
                systemInfo.version = res.version;
                systemInfo.platform = res.platform;
            }
        });
        return systemInfo;
    }

});
