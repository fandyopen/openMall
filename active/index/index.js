const regeneratorRuntime = require('../../libs/runtime');
var a = getApp(), t = a.api,
  un = require("../../utils/underscore-min.js");
Page({
  data: {
    isClick: false,
    communityList: [],
    commentList:[],
    moduleList:[],
    clenght: 0,
    num: "",
    cate: 0,
    page: 1,
    pagesize: 10,
    initload: 1,
    isFisrtLoad:true,
    isReloadList:false,
    loadingstutas: 0, //0代表没有，1代表加载更多，2代表没有更多了




  },
  onLoad: async function(t) {
    var _this = this;


    a.page.onLoad(this, t);
    //_this.loadData(t);
    var r = wx.getStorageSync("USER_INFO");
   // a.goLogin(r); //获取个人用户信息
    r && _this.setData({
      user_info: r
   
    });

      _this.init();

  },
    onShow: async function(ee) {

        var _this = this;
        _this.getAutoHeight();

        if(_this.data.isReloadList){_this.init();}


    },
    async init(){
        //////////初始化
        var _this = this;
        let Module = await _this.getModuleList();
        //1、获取当前位置坐标
        wx.getLocation({
            type: 'wgs84', // 默认wgs84
            success: function (res) {

                _this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                });


                _this.setData({
                    page: 1,
                    initload: 1,
                    communityList: []
                });
                _this.getCommunityList();

            },
            fail: function (res) {
                wx.navigateTo({
                    url: '/active/authorization/authorization'
                }) },
            complete: function () { }
        });
    },
  ///////屏蔽当前圈子信息
  hideInfo: function (e){
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
            title:t.msg,
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
        else{
          wx.showToast({
            title: t.msg,
            icon: "loading",
            duration: 3000
          });
        }

      },
      fail:function(){
        wx.showToast({
          title: t.msg,
          icon: "loading",
          duration: 5000
        });
      }
    });
  },

  ////////////点赞
  dzFn: async function (e){
   
    var _this = this;
    let source = e.detail.id;
    let mode = e.detail.mode;
    let praise_status, praise_num;
    if (mode =="live"){
    praise_status = e.detail.praise_status;
    praise_num = e.detail.praise_num;
    }
    else {
     
   //////////点赞评论先去查询下是否已经点赞过
      const checkDzStutasFn = await _this.checkDzStutasFn(e.detail);
      
     
    
    }
 
    a.request({
      url: t.active.praisehandle,
      data: { source: source, mode: mode},
      success: function (t) {

        if (0 == t.code) {
          if (mode == "live") {
          var communityList = _this.data.communityList;
   
          let stutas = praise_status=="0"?"1":"0";
            praise_num = praise_status == "0" ? parseFloat(praise_num) + parseFloat(1) : parseFloat(praise_num) - parseFloat(1);
          let nn = un._.find(communityList, { id: source }).praise_status = stutas;
          let ss = un._.find(communityList, { id: source }).praise_num = praise_num;
          }
          else{
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
    
          if (t.data.length > 0){
            wx.showToast({
              icon: "none",
              title: "已经点赞过啦！",
              duration: 1000
            });
            return false;
          }
          resolve(t);
      
        }
        else{
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
    //////选择类型
  typeFn: function(e) {
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
  onReady: function() {

  },


  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {
    var _this = this;
    _this.setData({
      page: 1,
      initload: 1,
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
  loadData: function(e) {
    var o = this,
      s = wx.getStorageSync("pages_index_index");
    s && (s.act_modal_list = [], o.setData(s)), a.request({
      url: t.default.index,
      success: function(t) {
        if (0 == t.code) {

          i ? i = !1 : t.data.act_modal_list = [];
          var a = t.data.topic_list,
            e = [];
          if (a && 1 != t.data.update_list.topic.count) {
            if (1 == a.length) e[0] = [], e[0] = a;
            else
              for (var s = 0, n = 0; s < a.length; s += 2,
                n++) void 0 != a[s + 1] && (e[n] = [], e[n][0] = a[s], e[n][1] = a[s + 1]);
            t.data.topic_list = e;
          }

          o.setData(t.data), wx.setStorageSync("store", t.data.store), wx.setStorageSync("pages_index_index", t.data);

          var r = wx.getStorageSync("USER_INFO");
          r && o.setData({
            _user_info: r
          }), o.miaoshaTimer();
        }

      },
      complete: function() {
        wx.stopPullDownRefresh();
      }
    });
  },
  miaoshaTimer: function() {
    var t = this;
    t.data.miaosha && t.data.miaosha.rest_time && (s = setInterval(function() {
      t.data.miaosha.rest_time > 0 ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1,
        t.data.miaosha.times = t.getTimesBySecond(t.data.miaosha.rest_time), t.setData({
          miaosha: t.data.miaosha
        })) : clearInterval(s);
    }, 1e3));
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
        else { reject(t);}

      },
      fail: function (res){
        reject(res);
      }
    });
    })
  },
  //////////获取圈子内容列表
   getCommunityList() {
    var _this = this;
    _this.setData({
      loadingstutas: 1
    });

    a.request({
      url: t.active.list,
      data: {
        cate: _this.data.cate,
        lat: _this.data.latitude,
        lng: _this.data.longitude,
        page: _this.data.page,
        pagesize: _this.data.pagesize

      },
      success: async function(t) {

        if (0 == t.code) {
        
          var nlist = t.data.list;
          var aaa = _this.data.communityList.concat(nlist);
    
          //_this.hideLoading();
          for (var i in aaa ){
            if (aaa.length>0){
            
            var id=aaa[i].id;
            var live_type = aaa[i].live_type;

            }
          }
          setTimeout(function() {
            _this.setData({
              communityList: aaa,
              clenght: t.data.row_count,
              initload: 0
           
            });
            _this.setData({ isFisrtLoad: false,isReloadList:false });
            if (aaa.length == t.data.row_count){ _this.setData({ loadingstutas: 2 }) }
            wx.stopPullDownRefresh();
          }, 200)

        }

      }
    });
  },
  //////////评论列表
  async getCommentList(id, live_type,callback) {
    var _this = this;
  
    var par = {};
    par.source = id;
    par.mode = live_type == "1"?"拼车":live_type=="2"?"话题":"其他" ;
    par.type = 0;
    return new Promise((resolve, reject) => {
      a.request({
        url: t.active.lists_commentary,
        data: par,
        header: {
          //必须设置参数内容类型为json 
          'Content-Type': 'application/json'
        },
        "success": function (res) {
         
          if (res.code == 0) {
            let commentList = res.data.list;
            if (!_this.data.isFisrtLoad){_this.setData({ commentList: commentList }) }
            resolve(res);
          } else {
            reject(res);
          }
        },
        "fail": function (res) {
          reject(res);
        }
    
      });
    });


  },
  //////////提交评论
  sumbitComment(e) {
    var _this = this;
    let { text, source, mode} = e.detail;
    var par={};
    par.text = text;
    par.source = source;
    par.mode = mode;
    par.type = 0;
    
    a.request({
      url: t.active.create_commentary,
      data: par,
      success: function (t) {
   
        if (0 == t.code) {
          _this.setData({ isFisrtLoad: false });
          _this.getCommentList();
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



  },

  getAutoHeight: function() {
    //  高度自适应
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {

        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        // debugger;
        var calc = clientHeight * rpxR - 10;

        if (parseFloat(clientHeight) >= 700 && parseFloat(clientHeight) < 800) {
          calc = clientHeight * rpxR - 30;
          that.setData({
            size: 20
          });
        } else if (parseFloat(clientHeight) > 800) {

          calc = clientHeight * rpxR - 50;
          that.setData({
            size: 25
          });
        }
        _this.setData({
          winHeight: calc
        })

      }
    });
  }
});