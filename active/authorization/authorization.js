var a = getApp(), t = a.api;
Page({
  data: {

  },
  onLoad: function(e) {

  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

      var _this = this;
      const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      const wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
      wxPrevPage.setData({isReloadList: true});


  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function() {}


});