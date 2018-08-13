// pages/Issue/Issue.js
let self = null
let app = getApp().util
let imgArr = []
let uploadImg = []
let uploadTask = null
let uploadGroup = {}
let uploadData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: false,
    imageData: [],
    isName: '',
    isOk: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this
    let types = false
    imgArr = []
    uploadData = {content:''}
    uploadImg = []
    if (options.type === 'photo') {
      types = true
      uploadData.type = 3
    }
    if (options.id) {
      uploadData.category = options.id
      if (options.id === '7') {
        this.setData({
          isName: '运动'

        })
      } else {
        this.setData({
          isName: '饮食'

        })
      }
    }
    if (options.time) {
      uploadData.date = options.time
    }
    if (options.questionId) {
      uploadData.id = options.questionId
    }

    wx.setNavigationBarTitle({
      title: types ? '拍照打卡' : '发布问题'
    })
    self.setData({
      types
    })

  },
  off: function (e) {
    let val = e.detail.value
    uploadData.content = val
  },
  // 选择图片
  chooseImage: function () {
    wx.chooseImage({
      count: 9 - imgArr.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        for (let i = 0; i < tempFilePaths.length; i++) {
          imgArr.unshift({url: tempFilePaths[i]})
          self.setData({
            imageData: imgArr
          })
          self.upload(tempFilePaths[i], i).then((res) => {
            console.log(res)
            uploadImg.unshift(res.data.imgurl)
          })
        }
      }
    })
  },
  // 删除图片
  delImage: function (e) {
    let index = e.currentTarget.id
    imgArr.splice(index, 1)
    uploadImg.splice(index, 1)
    self.setData({
      imageData: imgArr
    })
  },
  // 预览图片
  previewImage: function (e) {
    let image = e.currentTarget.dataset.image
    let arr = []
    for (let i = 0; i < imgArr.length; i++) {
      arr.push(imgArr[i].url)
    }
    wx.previewImage({
      current: image, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  save: function () {
    // self.submit(intro);
    // if (this.data.types) {
    uploadData.images = uploadImg
    // } else {
    //     uploadData.image = uploadImg;
    // }
    if (!uploadData.content && uploadData.content === '') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请正确填写您的饮食情况'
      })
      return
    }
    if (self.data.isOk) {
      self.photos(uploadData);
    }
  },
  /**
   * 添加图片
   */
  photos: function (photos) {
    let types = this.data.types
    let url = ''
    let delta = 1
    if (types) {
      url = app.URL.calorie_recard_add
      delta = 1
    } else {
      url = app.URL.question_add
      delta = 1
    }
    self.setData({
      isOk: false
    })
    app.request({
      url: url,
      data: photos,
      success (res) {
        console.log(res)
        if (res.data.code !== 1) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          })
          self.setData({
            isOk: true
          })
          return
        }
        app.emit('addFoodRefresh:photo', {}, false)
        wx.showToast({
          title: res.data.msg,
          time: 1000,
          success () {
            setTimeout(() => {
              self.setData({
                isOk: true
              })
              wx.navigateBack({delta})
            }, 1000)
          }
        })

      }
    })

  },

  upload: function (src, index) {
    let user = wx.getStorageSync('userInfo')
    console.log(src, index, user)
    return new Promise((reslove, reject) => {
      uploadTask = wx.uploadFile({
        url: app.URL.upload,
        filePath: src,
        name: 'image',
        header: {'content-type': 'application/json'},
        formData: {
          path: 'photo',
          // user_id: user.user_id,
          token: user.token
        },
        success: function (res) {
          let data = JSON.parse(res.data)
          reslove(data)
        },
        fail: function (e) {
          reject(e)
        }
      })
      uploadTask.onProgressUpdate((res) => {
        // let pro = res.progress ;
        imgArr[index]['num'] = res.progress
        console.log('第' + index + '个是：' + imgArr[index]['num'])
        self.setData({
          imageData: imgArr
        })

      })
    })
  }
})