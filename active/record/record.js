var a = getApp(), t = a.api;
Page({
  data: {
    communityList: [],
    ismaster:0,
    clenght: 0,
    cate: 1,
    typenum:0,
    page: 1,
    pagesize: 10,
    initload:1,
      // isReloadList:false,
    loadingstutas: 0, //0代表没有，1代表加载更多，2代表没有更多了


  },
  onLoad: function(t) {
    var _this=this;
    var r = wx.getStorageSync("USER_INFO");
   // a.goLogin(r);//获取个人用户信息
    r && _this.setData({ user_info: r });

    wx.showShareMenu({
      withShareTicket: true
    });
     this.setData({
       typenum:t.type
     });
      a.page.onLoad(this,t);
    _this.getCommunityList();

  },
  onReady: function() {

  },
  onShow: function() {
      var _this = this;
      // debugger;
      // if(_this.data.isReloadList){
      //     _this.getCommunityList();
      // }
     // _this.getCommunityList();
  },
    //////选择类型
    typeFn: function (e) {
        var _this = this;
        var cate = e.detail;

        _this.setData({
            cate: cate,
            page: 1,
            initload: 1,
            communityList: []
        });
        _this.getCommunityList();
    },
  onPullDownRefresh: function() {
    var _this = this;
    _this.setData({
      page: 1,
      communityList: []
    });
    _this.getCommunityList();
  },
  onReachBottom: function() {
    var _this = this;
    if (_this.data.communityList.length < _this.data.clenght) {

      _this.setData({
        page: parseFloat(_this.data.page) + parseFloat(1)
      });
      _this.getCommunityList();
    } else {
      _this.setData({
        loadingstutas: 2
      });
    }
  },

  //////////获取圈子内容列表
  getCommunityList: function() {
 
    var _this = this;
    setTimeout(function () {
    _this.setData({
      loadingstutas: 0
   
    });
    },500);
    var url= t.active.record_list;
    if (_this.data.typenum == 2) { url = t.active.topic_record_list;}
 
    a.request({
      url: url,
      data: {
        status: _this.data.cate,
        page: _this.data.page,
        pagesize: _this.data.pagesize
      },
      success: function (t) {
        if (0 == t.code) {
        
          var nlist = t.data.list;
          var aaa = _this.data.communityList.concat(nlist);
          //_this.hideLoading();
          
          setTimeout(function () {
            _this.setData({
              communityList: aaa,
              clenght: t.data.row_count,
              initload: 0
            });
            if (aaa.length == t.data.row_count) { _this.setData({ loadingstutas: 2 }) }
            wx.stopPullDownRefresh();
          }, 500)
    
        }

      }
    });
  }

});