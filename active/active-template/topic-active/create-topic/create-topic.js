var a = getApp(), t = a.api;
const regeneratorRuntime = require('../../../../libs/runtime');
Page({
  data: {
    pic_list: []


  },

  onLoad: function (t) {
    var _this = this;
      a.page.onLoad(this, t);
    _this.setData({
      stype: t.type,
      cid: t.circle_id
    });
      var r = wx.getStorageSync("USER_INFO");
   // a.goLogin(r); //获取个人用户信息
    r && _this.setData({
      user_info: r
    });

  },


  //图片点击事件
  imgYu: function (event) {

    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  chooseImage: function (t) {
    var a = this,
      e = t.currentTarget.dataset.type;
    if (1 == e) {

      var i = a.data,
        d = 0;
      i.pic_list && (d = i.pic_list.length || 0);
      var n = 6 - d;
      wx.chooseImage({
        count: n,
        sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
        sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
        success: function (t) {

          i.pic_list || (i.pic_list = []), i.pic_list = i.pic_list.concat(t.tempFilePaths);
          a.setData({
            pic_list: i.pic_list
          });


        }
      });
    }

  },
  /////删除图片
  deleteImage: function (t) {
    var a = this,
      e = t.currentTarget.dataset.type,
      i = t.currentTarget.dataset.index;
    if (1 == e) {
      var d = a.data;
      var pic_list = d.pic_list.splice(i, 1);
      a.setData({
        pic_list: d.pic_list
      });
    }

  },
  /////发布活动
  async creatActive(ee) {
    var i = this;
    var n = {};
    var o = [];

    var iee = ee.detail.value;
    // if (iee.name == "") {

    //   wx.showToast({
    //     icon: "none",
    //     title: "话题名称不能为空",
    //     duration: 2000
    //   });
    //   return false;
    // }
    if (iee.content == "") {
      wx.showToast({
        icon: "none",
        title: "话题内容不能为空",
        duration: 2000
      });
      return false;
    }
    //debugger;
    if (i.data.pic_list && 0 < i.data.pic_list.length) {
      // for (var rr in i.data.pic_list) {

      wx.showLoading({
        title: "正在上传图片",
        mask: !0
      });


      for (var rr in i.data.pic_list) {

        var uplaodImg = await i.uplaodImg(rr);
      
        var urldata = JSON.parse(uplaodImg.data);
        o[rr] = urldata.data;
      }

      i.saveTopicData(iee, o)
    } else {
      //debugger;
      i.saveTopicData(iee, o)
    }



  },
  /////////asny上传图片到服务器
  async uplaodImg(rr) {
    // debugger;
    var i = this;
    var ndata = i.data.pic_list;
    return new Promise((resolve, reject) => {
      /////////上传图片到服务器
      var url = t.default.upload_image;
      const uploadTask = wx.uploadFile({
        url: t.default.upload_image,
        filePath: ndata[rr],
        name: "file",
        formData: {},
        header: {
          //必须设置参数内容类型为json 
          'Content-Type': 'multipart/form-data'
        },
        success: function (t) {

          if (t.statusCode == 200) {
            resolve(t);
            wx.hideLoading();
            var urldata = JSON.parse(t.data);
          }
          else {
            // debugger;
            reject(t);
          }

        },
        complete: function (t) {

          // wx.hideLoading();


        },
        fail: function (res) {

          reject(res);
        }
      });
      uploadTask.onProgressUpdate((res) => {
        console.log('上传进度', res.progress);
        console.log('已经上传的数据长度', res.totalBytesSent);
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })

      // uploadTask.abort() // 取消上传任务
    });


  },
  /////////保存话题数据
  saveTopicData: function (ee, o) {
    var i = this;
    var par = {};
    par.circleId = i.data.cid;
    // par.name = ee.name;
    par.content = ee.content;
    if (o) {
      var narry = [];

      for (var iii in o) {
        var aa = {
          url: o[iii].url
        };
        narry.push(aa);
      }
      par.pic_list = narry;
    }
    wx.showLoading({
      title: "正在提交",
      mask: !0
    });
    a.request({
      url: t.active.topic + "&access_token=" + i.data.user_info.access_token,
      method: "POST",
      header: {
        //必须设置参数内容类型为json 
        'Content-Type': 'application/json'
      },
      data: par,
      success: function (t) {
        wx.hideLoading(), 0 == t.code && wx.showModal({
          title: "提示",
          content: "发布成功",
          showCancel: !1,
          success: function (t) {
              // /////新建的活动f返回时需要重新刷新
              // const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
              // const wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上上级页面的page对象
              //
              // //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
              // if(wxPrevPage) {
              //     wxPrevPage.setData({isReload: true});
              // }
            // t.confirm&&wx.navigateBack({//返回
            //   delta: 2
            // })
            t.confirm && wx.redirectTo({
              url: "/active/community-detail/community-detail?cid=" + i.data.cid
            });
          }
        }), 1 == t.code && wx.showLoading({
          title: t.msg,
          mask: !0,
          duration: 2000
        });
      },
      complete: function (t) {


      }
    });


  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }


});