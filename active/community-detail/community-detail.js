const regeneratorRuntime = require('../../libs/runtime');
var a = getApp(), t = a.api,
  un = require("../../utils/underscore-min.js");
Page({
  data: {
    communityList: [],
    communityDetail: {},
    moduleList: [],
    ismaster:0,
    clenght: 0,
    cate: 0,
    page: 1,
    pagesize: 10,
    initload:1,
    is_all:true,
    isReloadList:false,
    loadingstutas: 0, //0代表没有，1代表加载更多，2代表没有更多了


  },
  onLoad: async function(t) {
    var _this=this;
    var r = wx.getStorageSync("USER_INFO");
    //a.goLogin(r);//获取个人用户信息
    r && _this.setData({ user_info: r });
    this.setData({
      cid: t.cid
    });
      a.page.onLoad(this, t);
    // debugger;
    _this.getCommunityDeatil(); ///////详情
    let Module = await _this.getModuleList();
    _this.getLocationInfo();
   
  },
  onReady: function() {
   //debugger;
  },
  onShow: async function(e) {

    var _this = this;
    // let returnReType=_this.data.returnReType;
    if (_this.data.isReloadList){

    this.getCommunityDeatil(); ///////详情
    let Module = await _this.getModuleList();
    this.getLocationInfo();
    }

  
  },
 
  //////////获取模块
  async getModuleList() {
    var _this = this;
    return new Promise((resolve, reject) => {
      a.request({
        url: t.active.permission,
        data: {
        },
        success: async function (t) {

          if (0 == t.code) {
            resolve(t);
            _this.setData({
              moduleList: t.data
            })

          }
          else { reject(t); }

        },
        fail: function (res) {
          reject(res);
        }
      });
    })
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
  ////////////点赞
  dzFn: async function (e) {

    var _this = this;
    let source = e.detail.id;
    let mode = e.detail.mode;
    let praise_status, praise_num;
    if (mode == "live") {
      praise_status = e.detail.praise_status;
      praise_num = e.detail.praise_num;
    }
    else {

      //////////点赞评论先去查询下是否已经点赞过
      const checkDzStutasFn = await _this.checkDzStutasFn(e.detail);



    }

    a.request({
      url: t.active.praisehandle,
      data: { source: source, mode: mode },
      success: function (t) {

        if (0 == t.code) {
          if (mode == "live") {
            var communityList = _this.data.communityList;

            let stutas = praise_status == "0" ? "1" : "0";
            praise_num = praise_status == "0" ? parseFloat(praise_num) + parseFloat(1) : parseFloat(praise_num) - parseFloat(1);
            let nn = un._.find(communityList, { id: source }).praise_status = stutas;
            let ss = un._.find(communityList, { id: source }).praise_num = praise_num;
          }
          else {
            wx.showToast({
              icon: "none",
              title: t.msg,
              duration: 1000
            });
          }
          _this.setData({
            communityList: _this.data.communityList
          });

        }
      },
      fail: function (t) {

        wx.showToast({
          icon: "none",
          title: t.msg,
          duration: 3000
        });
      }

    });
  },
  ////////////查询点赞的状态
  async checkDzStutasFn(obj) {
    var _this = this;
    return new Promise((resolve, reject) => {
      a.request({
        url: t.active.praisestatus,
        data: { sources: obj.id, mode: obj.mode },
        success: function (t) {

          if (0 == t.code) {

            if (t.data.length > 0) {
              wx.showToast({
                icon: "none",
                title: "已经点赞过啦！",
                duration: 1000
              });
              return false;
            }
            resolve(t);

          }
          else {
            reject(t);
            wx.showToast({
              icon: "none",
              title: t.msg,
              duration: 1000
            });
          }
        },
        fail: function (t) {

          reject(t);
          wx.showToast({
            icon: "none",
            title: t.msg,
            duration: 3000
          });
        }

      });
    });
  },
  onPullDownRefresh: function() {
   // debugger;
    var _this = this;
    _this.setData({
      page: 1,
      initload: 1,
      communityList: []
    });
    _this.getCommunityList();
    _this.getCommunityDeatil(); ///////详情
    _this.getModuleList();
  },
  onReachBottom: function() {
    var _this = this;
    if (_this.data.communityList.length < _this.data.clenght && _this.data.initload!=1) {
     
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
  getLocationInfo: function () {//////获取起点位置信息
    var _this = this;
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',// 默认wgs84
      success: function (res) {
  
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          page: 1,
          initload: 1,
          communityList: []
        });
        
        _this.getCommunityList();
        
       },
      fail: function (res) {   wx.navigateTo({
          url: '/active/authorization/authorization'
      })  },
      complete: function () { }
    });
  },

  //////////获取圈子详情内容信息
  getCommunityDeatil: function() {
    var _this = this;
    a.request({
      url: t.active.circle_detail,
      data: {
        cid: _this.data.cid
      },
      success: function(t) {

      
        if (0 == t.code) {

          _this.setData({
            communityDetail: t.data
          });
          _this.getRole(t.data.member);
  
        }

      },
      complete: function(ndata) {

      }
    });


  },
  ///////屏蔽当前圈子信息
  hideInfo: function (e) {
    var _this = this;
    var cid = e.detail.cid;
    var id = e.detail.id;
    a.request({
      url: t.active.live_unfollow,
      data: {
        id: id
      },
      success: function (t) {

        if (0 == t.code) {
          wx.showToast({
            title: t.msg,
            icon: "success",
            duration: 3000
          });
          _this.setData({
            page: 1,
            initload: 1,
            communityList: []
          });
          _this.getCommunityList();

        }
        else {
          wx.showToast({
            title: t.msg,
            icon: "loading",
            duration: 3000
          });
        }

      },
      fail: function () {
        wx.showToast({
          title: t.msg,
          icon: "loading",
          duration: 5000
        });
      }
    });
  },
 
 ////判断用户角色
  getRole(member){
    var _this=this;
    for (var i in member){
      if (member[i].uid == _this.data.user_info.id){
       
        _this.setData({
          roleInfo: member[i],
          ismaster: member[i].is_master
        })
      
      }

    }

 },

  //////////获取圈子内容列表
  getCommunityList: function() {
    
    var _this = this;
    setTimeout(function () {
    _this.setData({loadingstutas: 1});
    },500);
    //let { circle_id, cate, lat, lng, page, pagesize } = _this.data;
    //debugger;
    a.request({
      url: t.active.list,
      data: {
        circle_id: _this.data.cid,
        cate: _this.data.cate,
        lat: _this.data.latitude,
        lng: _this.data.longitude,
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
              initload: 0,
              isReloadList:false////这个参数是给需要重新加载的标识
            });
            if (aaa.length == t.data.row_count) { _this.setData({ loadingstutas: 2 }) }
            wx.stopPullDownRefresh();
          }, 500)
    
        }

      }
    });
  },
  //////////提交评论
  sumbitComment(e) {
    var _this = this;
    let { text, source, mode } = e.detail;
    var par = {};
    par.text = text;
    par.source = source;
    par.mode = mode;
    par.type = 0;
    a.request({
      url: t.active.create_commentary,
      data: par,
      header: {
        //必须设置参数内容类型为json 
        'Content-Type': 'application/json'
      },
      success: function (t) {
        
        if (0 == t.code) {

          wx.showToast({
            icon: "none",
            title: t.msg,
            duration: 2000
          })
        } else {
          wx.showToast({
            icon: "none",
            title: t.msg,
            duration: 2000
          })
        }

      }

    });



  }


});