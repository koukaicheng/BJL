// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    age: 22,
    genders: "00",
    height: 180
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();

  },
  init() {
    let that = this;
    wx.showLoading({
      title: '开启蓝牙'
    });
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res,1);
        wx.hideLoading();
        that.getBluetoothAdapterState()
      },
      fail:function (res) {
        console.log(res);
        wx.onBluetoothAdapterStateChange(function (res) {
          console.log(res)
        })
      }
    })
  },
  getBluetoothAdapterState() {
    let that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log(res);
        let available = res.available,
            discovering = res.discovering;
        if (!available) {
          wx.showToast({
            title: '蓝牙初始化失败',
            icon: 'success',
            duration: 2000
          });
        }
        if (!discovering) {
          wx.getConnectedBluetoothDevices({
            success:function (res) {
              console.log(res,'当前没有搜索');
            }
          });
          wx.getBluetoothDevices({
            success:function (res) {
              console.log(res);
              let {devices} = res;
              for (let i=0;i<devices.length;i++){
                if(devices[i].name=="SHHC-5733"){
                  let deviceid = devices[i].deviceId;
                  that.setData({
                    deviceId:deviceid
                  });
                  that.createBLEConnection(deviceid);
                  wx.hideLoading();
                  break;
                }else{
                  that.startBluetoothDevicesDiscovery();
                }
              }
              if(devices.length===0){
                that.startBluetoothDevicesDiscovery();
              }
            },
            fail:function (err) {
              console.log(err);
            }
          })
        }
        else{
          that.startBluetoothDevicesDiscovery();
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    let that = this;
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success: function (res) {
        if (!res.isDiscovering) {
          that.getBluetoothAdapterState();
        } else {
          console.log('查找');
          that.onBluetoothDeviceFound();
        }
      }
    })
  },
  onBluetoothDeviceFound(){
    let that = this;
    // setInterval(function () {
      wx.onBluetoothDeviceFound(function (res) {
        console.log(res,'1');

        if (res.devices[0]&&res.devices[0].deviceId) {
          let deviceId = res.devices[0].deviceId;
          if(res.devices[0].name=="SHHC-5733"){
            console.log('找到');
            that.createBLEConnection(deviceId);
          }
        }

      })
    // },800)
  },
  createBLEConnection(id){

    let that = this;
    wx.createBLEConnection({
      deviceId: id,
      success:function (res) {
        console.log(res,'连接成功');
        // that.stop();
        that.setData({
          deviceId:id
        });
        that.getService(id);
      },
      fail:function (res) {
        if(res.errCode===10003){
          // that.startBluetoothDevicesDiscovery();
          that.createBLEConnection(id);
        }
      }
    })
  },
  getService(id){
    console.log('获取蓝牙设备service值');
    let that = this;
    wx.getBLEDeviceServices({
      deviceId: id,
      success: function (res) {
        console.log(res);
        let {services} = res;
        let uuid ='0000FF12-0000-1000-8000-00805F9B34FB';
        // services.forEach((value,index,arr)=>{
        //   uuid.push(arr[index].uuid)
        // });
        console.log('uuid',uuid);
        wx.getConnectedBluetoothDevices({
          services:[uuid],
          success:function (res) {
            console.log(res);
            that.getBLEDeviceCharacteristics(res.devices[0].deviceId,uuid);
            that.stop();
          },
          fail:function (res) {
            console.log()
          }
        })
      }
    })
  },
  stop(){
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('关闭蓝牙搜索')
      },
      fail(res){
      console.log(res)
      }
    })
  },
  getBLEDeviceCharacteristics:function (deviceId,uuid) {
    let that = this;
    wx.getBLEDeviceCharacteristics({
      deviceId:deviceId,
      serviceId: uuid,
      success:function (res) {
        console.log(res);
        let {characteristics} = res;
        let characteristicId;
        // for(let i = 0;i<characteristics.length;i++){
        //   if(characteristics[i].properties.read){
        //     console.log('ssss');
        //     characteristicId = characteristics[i].uuid;
        //     that.readBLECharacteristicValue(deviceId,uuid[0],"0000FF02-0000-1000-8000-00805F9B34FB");
        //     break;
        //   }
        // }
        that.setData({
          deviceId:deviceId,
          serviceId:uuid,
          characteristicId:"0000FF02-0000-1000-8000-00805F9B34FB"
        });
        that.notifyBLECharacteristicValueChange(deviceId,uuid,"0000FF02-0000-1000-8000-00805F9B34FB");
      },
      fail:function (res) {
        console.log(res)
      }
    })
  },
  Transformation(){
    console.log(this.ab2hex(0x95))
  },
  ab2hex:function (buffer) {
    let hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function(bit) {
          return ('00' + bit.toString(16)).slice(-2)
        }
    );
    return hexArr.join('');
  },

  notifyBLECharacteristicValueChange:function (deviceId,serviceId,characteristicId) {
    let that = this;
    wx.notifyBLECharacteristicValueChange({
      deviceId:deviceId,
      serviceId:serviceId,
      characteristicId:characteristicId,
      state:true,
      success:function (res) {
        console.log(res);
        console.log(deviceId,serviceId,characteristicId);

      }
    })
  },
  readBLECharacteristicValue:function (deviceId,serviceId,characteristicId) {
    this.setData({
      deviceId:deviceId,
      serviceId:serviceId,
      characteristicId:characteristicId
    });
    wx.readBLECharacteristicValue({
      deviceId:deviceId,
      serviceId:serviceId,
      characteristicId:characteristicId,
      success:function (res) {
        console.log(res,'asfasf');

      },
      fail:function (res) {
        console.log(res);
      }
    })
  },
  addchecksum(arr){
    let lastArr = [];
    if(arr.length == 0 ) return null;

    let result = arr[0];
    for(let i=1;i<arr.length;i++){
      result = result ^ arr[i];
    }
    arr.push(result);
    return arr;
  },
  writeBLECharacteristicValue(Buffer){
    let that = this;
    let height = that.data.height.toString(16);
    let age = that.data.height.toString(16);
    let genders = '00';
    let arr = [height, genders, age];
    let buffer_str = that.xor(arr);
    let typedArray = new Uint8Array(buffer_str.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }));

    // let buffer = typedArray.buffer;
    wx.writeBLECharacteristicValue({
      deviceId:that.data.deviceId,
      serviceId:that.data.serviceId,
      characteristicId:"0000FF01-0000-1000-8000-00805F9B34FB",
      value:typedArray.buffer,
      success:(res)=>{
        console.log(res)
      },
      fail:(err)=>{
        console.log(err,'错误')
      }
    })
  },
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
  sunmit(e){
    let value = e.detail.value;
    this.setData({
      value:value
    });
  },
  kkc(){
    let that = this;
    wx.onBLECharacteristicValueChange(function (res) {
      console.log(that.ab2hex(res.value),res)
    })
  },
  close:function () {
    let that = this;
    wx.closeBLEConnection({
      deviceId: that.data.deviceId,
      success:function (res) {
        console.log(res)
      },fail:function () {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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