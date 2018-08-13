// pages/bodtData/bodyData.js
import * as echarts from '../../ec-canvas/echarts';


const LIERDA_SERVICE_UUID = '0000FF12-0000-1000-8000-00805F9B34FB',
  LIERDA_READ_CHARACTERISTIC_UUID = '0000FF02-0000-1000-8000-00805F9B34FB',
  LIERDA_WRITE_CHARACTERISTIC_UUID = '0000FF01-0000-1000-8000-00805F9B34FB',

  //怡可一代的特怔码
  LIERDA_SERVICE_UUID_one = '000018F0-0000-1000-8000-00805F9B34FB',//怡可一代的特怔码
  LIERDA_READ_CHARACTERISTIC_UUID_one = '00002AF0-0000-1000-8000-00805F9B34FB',
  LIERDA_WRITE_CHARACTERISTIC_UUID_one = '00002AF1-0000-1000-8000-00805F9B34FB';

// let getPlatform = getApp().getPlatform;
// console.log(getPlatform);
let app = getApp().util;

function setOption(chart, data) {
  // console.log(data)
  let option = {
    backgroundColor: "#fff",
    color: ["#52b8f5"],
    // width:300,
    // height:190,
    tooltip: {
      trigger: 'axis'
    },

    grid: {
      containLabel: true,
      x: 5,
      y: 20
    },
    textStyle: {
      color: '#999999'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.time,
      nameTextStyle: {
        color: '#999999',
        fontSize: 8,
        align: "left"
      },

      offset: 6,
      nameLocation: "start",
      axisLine: {
        lineStyle: {
          color: "#52b8f5"
        },
      }
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        show: true
      },
      axisLine: {
        lineStyle: {
          color: "#52b8f5"
        }
      },
      nameTextStyle: {
        color: '#999999'
      },
    },
    series: [{
      name: '体重(kg)',
      type: 'line',
      smooth: true,
      data: data.data,
      label: {
        normal: {
          show: true,
        }
      },

    }]
  };

  chart.setOption(option);
}

let that = null;
let services = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: '0',
    ec: {
      lazyLoad: true
    },
    services: [], //设备列表
    off: true,
    loading: true,
    env_status: false,    //  蓝牙是否开启
    age: 18,
    lastDatas: null,
    genders: "1",
    height: '',
    count: 0,
    bodyfatrate: [],  //体脂率
    back_count: 0,
    data_08: '',
    creatBlueStatus: false,
    tip: "轻触此处连接设备",
    dayCharts: [],
    monthCharts: [],
    wholeCharts: [],
    chartsItemText: "weight",   //当前分类
    chartsIndex: "day",  //  当前时间
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    //
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    });
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      age: userInfo.age,
      height: userInfo.height
    });
    that.getIndexData({ type: 1 });
    that.getBLEdata();
    that.getPlatform();
    // if (this.getPlatform() == 'android' && this.versionCompare('6.5.7', this.getVersion())) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，请更新至最新版本',
    //     showCancel: false
    //   })
    // }else if (app.getPlatform() == 'ios' && this.versionCompare('6.5.6', this.getVersion())) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，请更新至最新版本',
    //     showCancel: false
    //   })
    // }

    // let bodyfatrate = '16.9';
    // let typedArray = new Uint8Array(bodyfatrate.match(/[\da-f]{2}/gi).map(function (h) {
    //   return parseInt(h, 16)
    // }));
    // console.log(typedArray)
  },
  link(e) {
    // console.log(e);
    let { url } = e.currentTarget.dataset;
    console.log(url);
    wx.navigateTo({
      url: url
    })
  },
  versionCompare: function (ver1, ver2) { //版本比较
    let version1pre = parseFloat(ver1);
    let version2pre = parseFloat(ver2);
    let version1next = parseInt(ver1.replace(version1pre + ".", ""))
    let version2next = parseInt(ver2.replace(version2pre + ".", ""))
    if (version1pre > version2pre)
      return true;
    else if (version1pre < version2pre)
      return false;
    else {
      if (version1next > version2next)
        return true;
      else
        return false
    }
  },
  getPlatform() {
    let platform = '';
    wx.getSystemInfo({
      success: (res) => {
        platform = res.system;
        console.log(platform);
      }
    })
    return platform;
  },
  getIndexData(data = { type: 1 }, callback) {
    // console.log(data)
    app.getlogin(() => {
      app.request({
        url: app.URL.trend,
        data,
        success: (res) => {
          if (res.data.code === 1) {
            // console.log(res.data.data)
            let chartsData = res.data.data;
            // console.log(data)
            let { type } = data;

            switch (type) {
              case 1:
                that.setData({
                  dayCharts: chartsData
                });
                break;
              case 2:
                that.setData({
                  monthCharts: chartsData
                });
                break;
              case 3:
                that.setData({
                  wholeCharts: chartsData
                });
                break;
              default:
                break;
            }
            typeof callback === "function" && callback(res)
          }
        }
      })
    })
  },
  getBLEdata(callback) {
    app.request({
      url: app.URL.testing_index,
      success: (res) => {
        console.log(res);
        if (res.data.code === 1) {
          let data = res.data.data.data;
          that.setData({
            lastDatas: data,
            jc_time: res.data.data.jc_time
          })
        }
      }
    })
  },
  tab(e) {
    let index = e.currentTarget.dataset.index;
    if (index === this.data.tabIndex) return;
    this.setData({
      tabIndex: index
    });
    if (index == 1) {
      let { chartsIndex, chartsItemText } = this.data;
      let data = this.data[`${chartsIndex}Charts`];
      this.chartsInit(data, chartsItemText, chartsIndex);
    }
  },
  chartsIndex(e) {
    let { name } = e.currentTarget.dataset;
    // console.log(this.data[`${name}Charts`]);
    this.setData({
      chartsIndex: name
    });
    let { chartsItemText } = that.data;
    let chartData = this.data[`${name}Charts`];
    if (chartData.length > 0) {
      that.chartsInit(chartData, chartsItemText, name)
    } else {
      let type = name === 'month' ? 2 : 3;
      that.getIndexData({ type }, (res) => {
        let chartData = that.data[`${name}Charts`];
        that.chartsInit(chartData, chartsItemText, name)
      });

    }
  },
  chartsChange(e) {
    let { name } = e.currentTarget.dataset;
    this.setData({
      chartsItemText: name
    });
    let { chartsIndex } = this.data;
    let data = this.data[`${chartsIndex}Charts`];
    // let chartData = this.data.dayCharts;
    this.chartsInit(data, name, chartsIndex);

  },
  chartsInit(data, name, chartsIndex) {
    console.log(chartsIndex, name);
    let obj = {
      time: [],
      data: []
    };
    data.forEach((value, index, arr) => {
      obj.time.push(value.date);
      obj.data.push(value[name])
    });
    obj.time.push('');
    this.initChart(obj);
  },
  // 蓝牙入口
  init(e) {
    that = this;
    // console.log(e);
    let { status } = e.currentTarget.dataset;

    if (!status) {
      wx.showLoading({
        title: '检测蓝牙状态',
        mask: true
      });
      wx.openBluetoothAdapter({
        success: function (res) {
          console.log(res, 1);
          that.getBluetoothAdapterState();
        },
        fail: function (res) {
          console.log(res, 2);
          if (res.errCode === 10001) {
            wx.hideLoading();
            wx.showModal({
              title: "提示",
              content: "请检查是否开启蓝牙",
              success: () => {
                that.stop();
              }
            })
          }
        }
      });
      that.onBluetoothAdapterStateChange();
    } else {
      wx.showModal({
        title: "提示",
        content: "是否需要断开连接",
        cancelText: "取消",
        success() {
          wx.closeBLEConnection({
            deviceId: that.data.deviceId,
            success: (res) => {
              console.log(res);
              wx.showToast({
                title: "已关闭"
              });
              that.setData({
                tip: "轻触此处连接设备",
                creatBlueStatus: false
              })
            },
            fail: (res) => {
              console.log(res);
            }
          })
        }
      })
    }


  },

  onBluetoothAdapterStateChange() {
    that = this;
    wx.onBluetoothAdapterStateChange(function (res) {
      console.log(res);
      let { available, discovering } = res;
      if (!available) {
        // console.log('适配器状态');
        // that.getBluetoothAdapterState();
        wx.showModal({
          title: '提示',
          content: "请检查当前蓝牙开关"
        });
        that.setData({
          tip: "请打开蓝牙连接设备",
          creatBlueStatus: false
        });

      } else {
        // if (!discovering) {
        // console.log('!discovering');
        // that.startBluetoothDevicesDiscovery();
        // }    
      }
    })
  },
  getBluetoothAdapterState() {
    that = this;
    wx.getBluetoothAdapterState({
      success: (res) => {
        console.log(res, 'state')
        let { discovering, available } = res;
        that.setData({
          env_status: res.available
        });
        wx.showLoading({
          title: '蓝牙初始化'
        });
        setTimeout(() => {
          console.log('开始搜寻附近的蓝牙外围设备')
          that.startBluetoothDevicesDiscovery();
        }, 200)
      },
      fail: (err) => {
      }
    })
  },
  //  开始搜寻附近的蓝牙外围设备
  startBluetoothDevicesDiscovery() {
    that = this;
    wx.startBluetoothDevicesDiscovery({
      services: [],
      allowDuplicatesKey: false,
      success: (res) => {
        // console.log(res,'sssfasgfsdghd')
        console.log(res, 'startBluetoothDevicesDiscovery');
        if (that.data.env_status) {
          that.onBluetoothDeviceFound();
        } else {
          //     console.log('没有开启蓝牙');
        }
      },
      fail: (err) => {
        console.log(err)
      }
    });
  },
  // 监听寻找到新设备的事件
  onBluetoothDeviceFound() {
    that = this;
    wx.onBluetoothDeviceFound(function (res) {
      // console.log(res, '寻找');
      wx.showLoading({
        title: "正在寻找设备"
      });
      if (res !== null) {
        wx.getBluetoothDevices({
          success: function (res) {
            let devices = [];
            console.log(res, '设备列表');
            res.devices.forEach(function (value, index, array) {
              //设备名称过滤
              //console.log(value.localName, value.name);
              if (value.name.indexOf('SHHC-') >= 0) {
                devices.push(value);
                that.setData({ services: devices, off: false });
                console.log('找到目标设备');
                that.stop();
                wx.hideLoading();
              }
            });
          },
        });
        // setTimeout(()=>{
        //   console.log('没有找到目标');
        //   that.stop();
        //   wx.showToast({
        //     title:"没有找到目标"
        //   });
        // },5000)
      } else {
        console.log('res = null');
      };
    });
    // let timer = setTimeout(() => {
    //   if (that.data.services.length === 0) {
    //     console.log('ssss');
    //     wx.hideLoading();
    //     wx.showModal({
    //       title: "提示",
    //       content: "没有找到目标设备",
    //       success: () => {
    //         that.stop();
    //       }
    //     })
    //   } else {
    //     clearTimeout(timer);
    //     timer = null;
    //   }
    // }, 5000)
  },
  // 连接蓝牙设备
  createBLEConnection(deviceId) {
    that = this;
    // that.setData({
    //   deviceId: deviceId
    // });
    // wx.showLoading({
    //   title: '连接设备中'
    // });
    that.setData({
      loading: false
    });
    wx.createBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        // setTimeout(() => {
        //     that.setData({
        //         loading: true
        //     });
        //     wx.showToast({
        //         title: '连接成功'
        //     });
        // }, 1000);
        that.setData({
          deviceId,
          tip: "已连接设备",
          creatBlueStatus: true
        });
        that.getBLEDeviceServices(deviceId);
        wx.onBLEConnectionStateChange((res) => {
          // console.log(res,'sssss.');
          if (res.connected) {
            wx.hideLoading();

            console.log('连接成功');
            let { deviceId } = res;
            //  获取蓝牙的所有ervices特征值
          } else {
            wx.hideLoading();
            console.log('断开链接');
            wx.showToast({
              icon: "none",
              title: "断开连接"
            });
            that.setData({
              tip: "请打开蓝牙连接设备",
              creatBlueStatus: false
            })
          }
        });
      },
      fail: (err) => {
        console.log(err);
        that.onBluetoothDeviceFound();
        wx.hideLoading();
        wx.showModal({
          title: "提示",
          content: "链接失败，请重试",
        });
        that.setData({
          loading: false,
          off: false
        })
      }
    });
  },
  // 蓝牙交互步骤
  getBLEDeviceServices(deviceId) {
    that = this;
    setTimeout(() => {
      that.setData({
        loading: true
      });
      wx.showToast({
        title: '连接成功'
      });
    }, 1000);
    wx.getBLEDeviceServices({
      deviceId: that.data.deviceId,
      success: (res) => {
        let height = that.data.height.toString(16);
        let age = that.data.height.toString(16);
        let genders = '11';
        let arr = [height, genders, age];
        let buffer_str = that.xor(arr);
        wx.showLoading({
          title: "请开始测量"
        });
        that.setData({ off: true });
        res.services.forEach((value, index, arr) => {
          let serviceId = value.uuid;
          if (serviceId === LIERDA_SERVICE_UUID) {
            wx.getBLEDeviceCharacteristics({
              deviceId: that.data.deviceId,
              serviceId: LIERDA_SERVICE_UUID,
              success: (res) => {
                res.characteristics.forEach((value, index, arr) => {
                  if (value.uuid === LIERDA_READ_CHARACTERISTIC_UUID) {
                    setTimeout(function () {
                      wx.notifyBLECharacteristicValueChange({
                        state: true,
                        deviceId: that.data.deviceId,
                        serviceId: LIERDA_SERVICE_UUID,
                        characteristicId: LIERDA_READ_CHARACTERISTIC_UUID,
                        success: (res) => {
                          console.log('notifyBLECharacteristicValueChange success', res.errMsg);
                        },
                        fail: (err) => {
                          console.log('notifyBLECharacteristicValueChange fail', res)
                        }
                      });
                      wx.onBLECharacteristicValueChange((res) => {
                        console.log('解析指令，并回应:' + res.value);
                        let buffer = that.buf2hex(res.value);
                        let instructions = buffer.substr(6, 2);
                        console.log(instructions, '返回数据');
                        if (instructions == "02") {
                          wx.showToast({
                            title: '正在测量，请稍后...',
                            icon: 'loading',
                            duration: 5000
                          });

                          let typedArray = new Uint8Array(buffer_str.match(/[\da-f]{2}/gi).map(function (h) {
                            return parseInt(h, 16)
                          }));
                          wx.writeBLECharacteristicValue({
                            deviceId: that.data.deviceId,
                            serviceId: LIERDA_SERVICE_UUID,
                            characteristicId: LIERDA_WRITE_CHARACTERISTIC_UUID,
                            value: typedArray.buffer,
                            success: function (res) {
                              console.log("基本信息发送成功", res.errMsg);
                              wx.showLoading({
                                title: "正在检测"
                              })
                            },
                            fail: (err) => {
                              console.log(err, "错误")
                            }
                          })

                        } else if (instructions == '04') {
                          let data = buffer.substr(8, 2);
                          if (data == '00') {
                            console.log('请握紧手柄');
                            wx.showToast({
                              title: '请握紧手柄...',
                              icon: 'loading',
                            })

                          } else if (data == '01') {
                            console.log('开始测量');
                            // 回复
                            wx.writeBLECharacteristicValue({
                              deviceId: deviceId,
                              serviceId: LIERDA_SERVICE_UUID,
                              characteristicId: LIERDA_WRITE_CHARACTERISTIC_UUID,
                              value: res.value,
                              success: function (res) {
                                console.log("测量响应成功", res.errMsg);
                              },
                            })
                          }
                        } else if (instructions == '17') {
                          //下传体脂率
                          console.log("下传体脂率");
                          wx.writeBLECharacteristicValue({
                            deviceId: deviceId,
                            serviceId: LIERDA_SERVICE_UUID,
                            characteristicId: LIERDA_WRITE_CHARACTERISTIC_UUID,
                            value: that.data.bodyfatrate,
                            success: function (res) {
                              console.log("体脂率下传成功", res.errMsg);
                            },
                            fail: function () {
                              console.log("调用失败！", res);
                            }
                          })
                        } else {

                          let _data_08 = that.data.data_08;
                          let count = that.data.count;
                          let back_count = that.data.back_count;

                          if (buffer.indexOf('6495') == 0 && count == 0) {
                            console.log('6495');
                            count++;
                            that.setData({ count: count });
                          }

                          if (that.data.count == 1) {
                            console.log('++');
                            _data_08 += buffer;
                            //更新
                            back_count++;
                            that.setData({ data_08: _data_08, back_count: back_count });
                          }
                          if (back_count == 4) {
                            let last_data = that.data.data_08;
                            // 解析数据
                            let data_1 = last_data.substr(0, last_data.lastIndexOf('6495'));
                            let data_2 = last_data.substr(last_data.lastIndexOf('6495'), last_data.length - 1);

                            console.log('data-1', data_1);
                            console.log('data-2', data_2);
                            wx.showLoading({
                              title: "正在计算"
                            });
                            let weight = data_1.substr(10, 8);
                            let data = {};
                            data["valr10"] = data_1.substr(20, 8);
                            data["valr11"] = data_1.substr(28, 8);
                            data["valr12"] = data_1.substr(36, 8);
                            data["valr13"] = data_1.substr(44, 8);
                            data["valr14"] = data_1.substr(52, 8);
                            data["valr20"] = data_2.substr(20, 8);
                            data["valr21"] = data_2.substr(28, 8);
                            data["valr22"] = data_2.substr(36, 8);
                            data["valr23"] = data_2.substr(44, 8);
                            data["valr24"] = data_2.substr(52, 8);
                            data['weight'] = weight;
                            console.log(data);
                            if (data) {
                              wx.showLoading({
                                title: "发送数据",
                              });
                            }
                            that.testingData(data, (res) => {

                            });


                          }
                        }
                      })
                    }, 3000)
                  }
                })
              }
            })
          }
          ;
          if (serviceId === LIERDA_SERVICE_UUID_one) {
            wx.getBLEDeviceCharacteristics({
              deviceId: that.data.deviceId,
              serviceId: LIERDA_SERVICE_UUID_one,
              success: (res) => {
                res.characteristics.forEach((value, index, arr) => {
                  if (value.uuid === LIERDA_READ_CHARACTERISTIC_UUID_one) {
                    setTimeout(function () {
                      wx.onBLECharacteristicValueChange(function (res) {
                        let buffer = that.buf2hex(res.value);
                        let instructions = buffer.substr(6, 2);
                        console.log(instructions, '返回数据');
                        if (instructions == '02') {
                          wx.showToast({
                            title: '测量中...',
                            icon: 'loading',
                            duration: 100000
                          });
                          let typedArray = new Uint8Array(buffer_str.match(/[\da-f]{2}/gi).map(function (h) {
                            return parseInt(h, 16)
                          }));
                          wx.writeBLECharacteristicValue({
                            deviceId: that.data.deviceId,
                            serviceId: that.data.LIERDA_SERVICE_UUID_one,
                            characteristicId: that.data.LIERDA_WRITE_CHARACTERISTIC_UUID_one,
                            value: typedArray.buffer,
                            success: function (res) {
                              console.log("基本信息发送成功", res.errMsg);
                            },
                          });
                        } else if (instructions == '04') {
                          let data = buffer.substr(8, 2);

                          if (data == '00') {
                            console.log('请握紧手柄');
                            wx.showToast({
                              title: '请握紧手柄...',
                              icon: 'loading',
                            })
                          } else if (data == '01') {
                            console.log('开始测量');

                            // 回复
                            wx.writeBLECharacteristicValue({
                              deviceId: that.data.deviceId,
                              serviceId: LIERDA_SERVICE_UUID_one,
                              characteristicId: LIERDA_WRITE_CHARACTERISTIC_UUID_one,
                              value: res.value,
                              success: function (res) {
                                console.log("测量响应成功", res.errMsg);
                              },
                            })
                          } else if (instructions == '17') {
                            //下传体脂率
                            console.log("下传体脂率");
                            wx.writeBLECharacteristicValue({
                              deviceId: that.data.deviceId,
                              serviceId: LIERDA_SERVICE_UUID_one,
                              characteristicId: LIERDA_WRITE_CHARACTERISTIC_UUID_one,
                              value: that.data.bodyfatrate,
                              success: function (res) {
                                console.log("体脂率下传成功", res.errMsg);
                              },
                              fail: function () {
                                console.log("调用失败！", res);
                              }
                            })
                          } else {
                            let _data_08 = that.data.data_08;
                            let count = that.data.count;
                            let back_count = that.data.back_count;

                            if (buffer.indexOf('6495') == 0 && count == 0) {
                              count++;
                              that.setData({ count: count });
                            }

                            if (that.data.count == 1) {
                              _data_08 += buffer;
                              //更新
                              back_count++;
                              that.setData({ data_08: _data_08, back_count: back_count });
                            }
                            if (back_count == 6) {
                              let last_data = that.data.data_08;
                              // 解析数据
                              let data_1 = last_data.substr(0, last_data.lastIndexOf('6495'));
                              let data_2 = last_data.substr(last_data.lastIndexOf('6495'), last_data.length - 1);

                              console.log('data-1', data_1);
                              console.log('data-2', data_2);

                              // var a = data_1.substr(16, 2) + data_1.substr(14, 2) + data_1.substr(12, 2) + data_1.substr(10, 2);
                              // var weight = util.hexToFloat(a);

                              let weight = data_1.substr(10, 8);

                              // that.setData({ height: getApp().globalData.height, birthdate: getApp().globalData.birthdate, phone: getApp().globalData.phone, gender: getApp().globalData.gender});

                              let data = {};
                              data["r10"] = data_1.substr(20, 8);
                              data["r11"] = data_1.substr(28, 8);
                              data["r12"] = data_1.substr(36, 8);
                              data["r13"] = data_1.substr(44, 8);
                              data["r14"] = data_1.substr(52, 8);
                              data["r20"] = data_2.substr(20, 8);
                              data["r21"] = data_2.substr(28, 8);
                              data["r22"] = data_2.substr(36, 8);
                              data["r23"] = data_2.substr(44, 8);
                              data["r24"] = data_2.substr(52, 8);
                              data['weight'] = weight;
                              if (data) {
                                wx.showLoading({
                                  title: "发送数据",
                                });
                              }
                              that.testingData(data, () => {

                              })

                            }
                          }
                        }
                      })
                    }, 3000)
                  }
                })
              }
            })
          }
        })
      }
    });
  },

  //
  createBLEC(e) {
    console.log(e);
    let deviceId = e.currentTarget.dataset.deviceid;
    this.stop();
    this.createBLEConnection(deviceId);
  },
  close: function () {
    this.setData({
      off: true
    })
  },
  stop: function () {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log(res, '关闭查询结果')
      }
    })
  },
  // buffer is an ArrayBuffer
  buf2hex: function (buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  //异或运算
  xor: function (obj) {

    console.log("xor", obj);//身高 性别 年龄
    // 构建字符串
    let buffer_str = '';
    buffer_str += '6495';
    buffer_str += '0c';
    buffer_str += '02';
    // 用户id
    buffer_str += 'DA08000000000000';
    // 身高 整型
    let hex_height = obj[0];
    buffer_str += hex_height.length == 1 ? '0' + hex_height : hex_height;
    let heig = hex_height.length == 1 ? '0' + hex_height : hex_height;
    // 性别 字符串
    buffer_str += obj[1];
    let genders = obj[1]

    // 年龄 整型
    let hex_age = obj[2];
    buffer_str += hex_age.length == 1 ? '0' + hex_age : hex_age;
    let age = hex_age.length == 1 ? '0' + hex_age : hex_age;
    //异或
    let a1 = '2d';
    let a2 = heig;//身高
    let a3 = genders;//性别
    let a4 = age;//年龄
    let a5 = parseInt(a1, 16) ^ parseInt(a2, 16) ^ parseInt(a3, 16) ^ parseInt(a4, 16);
    let a6 = a5.toString(16);
    buffer_str += a6;
    console.log('xor', buffer_str);
    return buffer_str;

  },
  initChart(data) {
    this.ecComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: this.data.windowWidth !== null ? this.data.windowWidth : width,
        height: this.data.windowHeight !== null ? this.data.windowHeight / 2.3 : height
      });
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      setOption(chart, data);
      return chart;
    });
  },
  testingData(data, callback) {
    // app.getlogin(()=>{
    //   console.log(data);
    app.request({
      url: app.URL.testing,
      data,
      success(res) {
        wx.hideLoading();
        console.log(res);
        console.log(res.data);
        if (res.data.code === 1) {
          let { data } = res.data;
          that.setData({
            lastDatas: data
          });
          wx.showToast({
            title: "接受成功"
          });
          wx.setStorageSync('off', true);
          typeof callback === 'function' && callback(res)
        } else {
          wx.showToast({
            title: "接受失败"
          });
        }
      }
    });
    // });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function () {

    // this.initChart();
  },

  /**
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