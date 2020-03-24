var a = getApp(), t = a.api;
Page({
  data: {
    routeList: []
  },
  onLoad: function(e) {
      a.page.onLoad(this, t);
    var r = wx.getStorageSync("USER_INFO");
    //a.goLogin(r); //获取个人用户信息
    this.getRouteList();
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {},
  //////////获取圈子内容列表
  getRouteList: function() {
  
    var _this = this;
    _this.showLoading();
    a.request({
      url: t.active.get_often,
      success: function(t) {
        _this.hideLoading();
        if (0 == t.code) {
          _this.setData({
            routeList: t.data
          })
        }

      },
      complete: function() {

      }
    });


  },
  //////////移除路线
  delRoute: function (e) {
    var _this = this;
    var id=e.currentTarget.dataset.id;
    a.request({
      url: t.active.del_often,
      data: {id: id},
      success: function (t) {

        if (0 == t.code) {
          _this.getRouteList();
        }

      },
      complete: function () {

      }
    });


  }
});