var a = getApp(), t = a.api,   un = require("../../utils/underscore-min.js");
Page({
  data: {
    communityDetail: {},
    shareTicket: "",
    cont: "分享活动",
    isYaq: false,
    disabled: false,
    role: 3,
    ///////0当前用户是司机不是创建者
    ////////1当前用户是创建者不是司机
    ////////2当前用户既是司机也是创建者
    ///////3当前用户只是普通乘客

  },
  onLoad: function(t) {
    var _this = this;
    var r = wx.getStorageSync("USER_INFO");
   // a.goLogin(r); //获取个人用户信息
    r && _this.setData({
      user_info: r
    });
    //invite 【管理员ID】公开社圈随意加入，非公开社圈，需管理人员邀请
    _this.setData({
      cid: t.cid,
      id: t.id,
      atype: t.atype,
      invite: t.invite ? t.invite : null,
      from: t.from ? t.from : "button"
      // shareTicket: wx.getStorageSync("shareTicket")

    });
      a.page.onLoad(this, t);
    _this.getActiveDeatil();
    if (t.isYaq == "1") {
      _this.setData({ isYaq: true });
    } else {
      wx.showShareMenu({
        withShareTicket: true,
        success: function(e) {}
      });
    }


  },
  onReady: function() {

  },
  onShow: function(e) {

  },
  onHide: function() {

  },
  onUnload: function() {

  },

  ////////点击邀请
  onShareAppMessage: function(res) {
    var _this = this;
    var invite = _this.data.user_info.id; //////当前点击分享的用户肯定是邀请人
      var inviteName = _this.data.user_info.nickname; //////当前点击分享的用户肯定是邀请人
    _this.setData({
      invite: invite,
      from: res.from,
      disabled: true
    });
    return {
      title: '欢迎进入'+inviteName+'参加的活动',
      path: '/active/share-active/share-active?type=2&&cid=' + _this.data.cid + '&isYaq=1&invite=' + invite + '&from=' + res.from + '&atype=' + _this.data.atype + '&id=' + _this.data.id,
      //  imageUrl: "/images/1.jpg",
      success: (res) => {
        // 转发成功  
        var shareTickets = res.shareTickets ? res.shareTickets[0] : null;
        //判断是否分享到群      
        if (res.hasOwnProperty('shareTickets')) {              
          //分享到群      
          _this.data.isshare = 1;
          wx.getShareInfo({
            shareTicket: shareTickets,
            success: function(resd) {
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
      complete: function() {
        _this.setData({
          disabled: false
        });
      }
    }
  },

  ////////接受邀请
  receiveFn: function() {
    var _this = this;
    var url = '/active/active-template/carpool-active/join-active/join-active?id=' + _this.data.id + '&cid=' + _this.data.cid + '&atype=' + _this.data.atype +'&isYaq=1';
    if (_this.data.atype == "2") {
      url = '/active/active-template/topic-active/detail-topic/detail-topic?id=' + _this.data.id + '&cid=' + _this.data.cid + '&atype=' + _this.data.atype +'&isYaq=1';
    }
    wx.redirectTo({
      url: url
    });
  },
  //////////获取圈子详情内容信息
  getActiveDeatil: function() {
    var _this = this;
   // _this.showLoading();
    a.request({
      url: t.active.live_detail,
      data: {
        id: _this.data.id
      },
      success: function(t) {
       // _this.hideLoading();
        if (0 == t.code) {
          _this.setData({  activeDetail: t.data  });
          if (_this.data.atype == 1 && t.data.joinList.length > 0) {
         ///////////获创建者信息
            _this.getCreateInfo(t.data.joinList);
     
            //if (joinlist[i].uid == _this.data.user_info.id) {}
          }
          if (_this.data.atype == 2) {
            var masterInfo = {
              avatar: t.data.avatar,
              nickname: t.data.nickname,
              uid: t.data.uid
            };

            _this.setData({
              masterInfo: masterInfo
            });

          }


        }

      },
      complete: function() {

      }
    });


  },

  ///////////获取创建者信息
  getCreateInfo(joinlist) {
    var _this = this;
    let isjoin = un._.findWhere(joinlist, { uid: _this.data.user_info.id });
    if(isjoin){
      _this.setData({ isjoin: true });
    }
    
    for (var i in joinlist) {
  
      //////获取创建者信息
      if (joinlist[i].is_master == 1) {
        _this.setData({
          masterInfo: joinlist[i]

        });
      }
      
    }
  },


  ///////返回首页
  returnFn: function() {
    wx.reLaunch({
      url: '/active/index/index'
    });

  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  }

});