var a = getApp(), t = a.api,   un = require("../../utils/underscore-min.js"),
  utils = require("../../utils/utils.js");

Page({
  data: {
    communityDetail: {},
    shareTicket: "",
    cont: "分享好友",
    y: false,
    disabled: false,
    qrcodeUrl: ""

  },
  onLoad: function (options) {
    var _this = this;
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    //  var scene=decodeURIComponent(ts.scene);
    var r = wx.getStorageSync("USER_INFO");
   // a.goLogin(r);//获取个人用户信息
    r && _this.setData({ user_info: r });
    //invite 【管理员ID】公开社圈随意加入，非公开社圈，需管理人员邀请
    var options = options;
    var queryString = decodeURIComponent(options.scene);
    if (queryString != "undefined") {///////扫码口语入口
      var queryStringJsson = utils.scene_decode(queryString);
      var cid = queryStringJsson.cid;
      var i = queryStringJsson.i;
      var y = queryStringJsson.y;
      var from = queryStringJsson.from;
      options = { cid: cid, i: i, from: from, y: y }
    }
    _this.setData({
      cid: options.cid,
      i: options.i ? options.i : null,
      y: options.y ? options.y : null,
      from: options.from ? options.from : "code"
      // shareTicket: wx.getStorageSync("shareTicket")

    });

    a.page.onLoad(this, t);
    _this.getCommunityDeatil();
    _this.getCommunityCode();
    if (options.y == "1") {
      _this.setData({
        y: true
      });
    } else {
      wx.showShareMenu({
        withShareTicket: true,
        success: function (e) {
        }
      });
    }


  },
  onReady: function () {

  },
  onShow: function (e) {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
  },
  ////////点击邀请
  onShareAppMessage: function (res) {
    var _this = this;
    var invite = _this.data.communityDetail.creator;//////创建者即为邀请者
    _this.setData({
      i: invite,
      from: res.from,
      disabled: true
    });
    return {
      title: '进入我的社圈',
      path: '/active/c/c?t=1&cid=' + _this.data.cid + '&y=1&i=' + _this.data.i + '&from=' + res.from,
      //path: '/active/community-member-in/community-member-in?type=1&&cid=' + _this.data.cid + '&isYaq=1&invite=' + invite + '&from=' + res.from,
      //  imageUrl: "/images/1.jpg",
      success: (res) => {


        // 转发成功
        var shareTickets = res.shareTickets ? res.shareTickets[0] : null;
        // var shareTicket = shareTickets;
        //判断是否分享到群
        if (res.hasOwnProperty('shareTickets')) {
          //  console.log(res.shareTickets[0]);
          //分享到群
          _this.data.isshare = 1;
          wx.getShareInfo({
            shareTicket: shareTickets,
            success: function (resd) {
              // _this.setData({
              //   shareTicket: shareTickets
              // });
              //  wx.setStorageSync("shareTicket", shareTickets);
              console.log('success');
              console.log(resd);
              wx.showToast({
                title: '转发到群成功',
                duration: 3000
              })

            },
          })
        } else {
          // 分享到个人
          _this.data.isshare = 0;
          wx.showToast({
            title: '转发到个人成功',
            duration: 3000
          })
        }


      },
      fail: (resd) => {
        console.log("转发失败", resd);
      },
      complete: function () {
        _this.setData({
          disabled: false
        });
      }

    }

  },

  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = [];
    imgList.push(src);
    //  var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  ////////接受邀请
  receiveFn: function () {
    var _this = this;
    _this.setData({
      disabled: true
    });
    _this.showLoading();

    a.request({
      url: t.active.join,
      // method: "POST",
      data: {
        cid: _this.data.cid,
        invite: _this.data.i
        // from: _this.data.from,
        // openGId: _this.data.shareTicket,
      },
      success: function (t) {

        _this.hideLoading();

        if (0 == t.code) {
          wx.showToast({
            title: '加入成功',
            duration: 3000
          });
          setTimeout(function () {
            wx.redirectTo({
              url: '/active/community-detail/community-detail?cid=' + _this.data.cid
            })
          }, 3000)

        } else {

          wx.showToast({
            title: t.msg,
            duration: 3000
          })
        }

      },
      fail: function (ee) {

      },
      complete: function () {

        _this.setData({
          disabled: false
        });
      }
    });
  },
  //////////获取圈子详情内容信息
  getCommunityDeatil: function () {
    var _this = this;
    // _this.showLoading();
    a.request({
      url: t.active.circle_detail,
      data: {
        cid: _this.data.cid
      },
      success: function (t) {

        // _this.hideLoading();
        if (0 == t.code) {
          var uid = _this.data.user_info.id;

          let jinfo = un._.find(t.data.member, { uid: uid.toString() });
          if (jinfo && _this.data.y) {////////被邀请的已经加入了改社圈的处理

            wx.showModal({
              title: "你已经是该社圈的成员啦~！",
              content: "你可以选择以下操作哦~",
              showCancel: 1,
              confirmText: "留在本页",
              cancelText: "社圈主页",
              success: function (res) {
                if (res.confirm) {
                  _this.setData({
                    isIn: true
                  });

                } else if (res.cancel) {

                  wx.redirectTo({
                    url: '/active/community-detail/community-detail?cid=' + _this.data.cid
                  });
                }


              }
            })
          }
          _this.setData({
            communityDetail: t.data
          })

        }

      },
      complete: function () {

      }
    });


  },
  //////////获取圈子详情内容信息
  getCommunityCode: function () {
    var _this = this;
    // var url ="http://mall2402.local/web/index.php";
    var url = t.active.getGrcode;
    a.request({
      url: url,
      data: {
        cid: _this.data.cid,
        t: 1,
        y: 1,
        i: _this.data.i,
        form: "code"
      },
      success: function (t) {

        if (0 == t.code) {
          _this.setData({
            qrcodeUrl: t.data
          })

        }

      },
      complete: function () {

      }
    });


  },
  ///////返回首页
  returnFn: function () {
    wx.reLaunch({
      url: '/active/index/index'
    });
  }

});