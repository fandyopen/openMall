var a = getApp(), t = a.api;
Page({
      data: {

        xnum: "",
        loadingPhone:true

      },
      onLoad: function(t) {
    
        var _this = this;
          a.page.onLoad(this, t);
        var r = wx.getStorageSync("USER_INFO");
      //  a.goLogin(r); //获取个人用户信息
        r && _this.setData({
          user_info: r
        });
                                                                                                                                                                                                                                                                                     

      },
      onReady: function() {

      },
      onShow: function() {
        var _this = this;
        var r = wx.getStorageSync("USER_INFO");
        _this.getUserInfo();
      //   if (r.binding){
      //  // _this.withPhone(r.binding);
      //   }
      },
      getUserInfo:function(){
        var _this = this;
        var par = {};
        a.request({
          url: t.active.user_info,
          data: par,
          success: function (t) {
        
            if (0 == t.code) {
      
              if (t.data.binding) {
                _this.withPhone(t.data.binding);
              }
              else { _this.setData({ loadingPhone: false }); }
            }
            else {
     
            }

          },
          fail: function () {

          },
          complete: function () {

          }
        });
      },
      onHide: function() {

      },
      onUnload: function() {

      },
     withPhone: function (str) {
    
       var _this = this;
        let arr = [];
        var str = str.substring(0, 3) + '****' + str.substring(7);
       _this.setData({xnum: str});
       _this.setData({ loadingPhone: false });
       
    
      },
       onPullDownRefresh: function () {
         wx.stopPullDownRefresh();
       }
      // getPhoneNumber: function(e) {
     
      //   console.log(e.detail.errMsg);
      //   console.log(e.detail.iv);
      //   console.log(e.detail.encryptedData);
      //   if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      //     wx.showModal({
      //       title: '提示',
      //       showCancel: false,
      //       content: '未授权',
      //       success: function(res) {}
      //     })
      //   } else {
      //     wx.showModal({
      //       title: '提示',
      //       showCancel: false,
      //       content: '同意授权',
      //       success: function(res) {
      //         debugger;
      //       }
      //     })
      //   }
      // }
      });