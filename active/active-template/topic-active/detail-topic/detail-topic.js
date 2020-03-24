var a = getApp(), t = a.api,   un = require("../../../../utils/underscore-min.js");
const regeneratorRuntime = require('../../../../libs/runtime');
Page({
  data: {
    pic_list: [],
    isFoucsComment: false,
    textValue:"",
    praise_status:0,
    praise_num:0,
    _loading: true,
    page: 1,
    size: 10,
    commentList:[],
    loadingstutas: 0, //0代表没有，1代表加载更多，2代表没有更多了


  },

  onLoad: function(t) {
    var _this = this;
      a.page.onLoad(this, t);
    var r = wx.getStorageSync("USER_INFO");
    //a.goLogin(r); //获取个人用户信息
    r && _this.setData({
      user_info: r,
      id: t.id,
      cid:t.cid,
      atype:t.atype
    });

    if (t.isFoucsComment) {
      _this.setData({
        isFoucsComment: true
      })
    }
    _this.init();

    //const commentInfo =await _this.getCommentInfo();
  },
  onUnload:function(){

     var _this = this;

  },

  changeData: function (type,_data){
    var _this = this;
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    let communityList = wxPrevPage.data.communityList;/////
    let id = parseFloat(_this.data.id);
    let curCommunityList = un._.find(communityList, { id: id });
    if (type==1){
    curCommunityList.praise_num = _data.praise_num;
    curCommunityList.praise_status = _data.praise_status;
      if (wxPrevPage) {
        wxPrevPage.setData({ communityList: communityList });
      }
    }
    else{
      curCommunityList.comment_num = _data.length;
      curCommunityList.comment = _data;
      if (wxPrevPage) {
        wxPrevPage.setData({ communityList: communityList });
      }
    }

    _this.setData({communityList:communityList});
  },
  ////////////点赞
  dzFn: async function (e) {
    var _this = this;
    let topicData = _this.data.topicData;
    let source = e.currentTarget.dataset.id;
    let mode = e.currentTarget.dataset.mode;
    if (e.type=="dzevent"){
     source = e.detail.id;
      mode = e.detail.mode;
    }//////评论列表的点赞

    let praise_status, praise_num,stutas;
    if (mode == "live") {

      praise_status = topicData.praise_status;
      praise_num = topicData.praise_num;
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
             stutas = praise_status == "0" ? "1" : "0";
            praise_num = praise_status == "0" ? parseFloat(praise_num) + parseFloat(1) : parseFloat(praise_num) - parseFloat(1);
            topicData.praise_status = stutas;
            topicData.praise_num = praise_num;
            _this.setData({ topicData: topicData });
            _this.changeData(1,topicData);
          }

          else {
            wx.showToast({
              icon: "none",
              title: t.msg,
              duration: 1000
            });
          }

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
  ////////////查询点赞的状态
  async getDzStutasFn(obj) {
    var _this = this;
    return new Promise((resolve, reject) => {
      a.request({
        url: t.active.praisestatus,
        data: { sources: obj.id, mode: obj.mode },
        success: function (t) {
          if (0 == t.code) {
            resolve(t);

          }
          else {
            reject(t);

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
  /////////复制
  copy:function(){
    var that = this;
    console.log(e);
    wx.setClipboardData({
      data: that.data.topicData.content,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })

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
  ////////初始化的方法
  async init() {
    var _this = this;
    const liveDetail = await _this.getLiveDetail();///获取话题信息
    const commentInfo = await _this.getCommentInfo();/////获取评论信息
    const getDzStutasFn = await _this.getDzStutasFn({ id: _this.data.id,mode:"live"});//////初始化时的查询点赞状态
    let topicData=_this.data.topicData;
    topicData.praise_status = "0";
    if (getDzStutasFn.data.length > 0) { topicData.praise_status = "1";}

    _this.setData({ topicData: topicData });

    setTimeout(function () {
      _this.hideLoading();//////////加载完成
    }, 500);
  },
  ///////获取活动详细信息
  async getLiveDetail() {
    var _this = this;
    _this.showLoading();
    return new Promise((resolve, reject) => {
      a.request({
        url: t.active.live_detail,
        data: {
          id: _this.data.id
        },
        success: function(t) {
          resolve(t);
          _this.hideLoading();
          if (0 == t.code) {
            _this.setData({
              topicData: t.data
            });

          } else {
            reject(t);
            wx.showToast({
              icon: "none",
              title: t.msg,
              duration: 3000
            });
          }

        },
        fail: function() {
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
  ///////////处理评论取回复用户
  getReplay(data) {
    var _this = this;
    var namelist = [];
    if (data.list.length > 0) {

      for (var i in data.list) {
        var firstl = data.list[i];
        namelist[firstl.user_id] = firstl.userInfo.nickname;

        var childData = data.list[i].child;

        if (childData.length>0){
        for (var j in childData) {
          var user_id = childData[j].user_id;
          namelist[user_id] = childData[j].userInfo.nickname;
        }
        }
      }
    }
    _this.setData({namelist: namelist});
  },
  ///////获取评论数据
  async getCommentInfo() {

    var _this = this;
    setTimeout(function() {
      _this.setData({
        loadingstutas: 1
      });
    }, 500);
    a.request({
      url: t.active.lists_commentary,
      data: {
        mode: "live",
        source: _this.data.id,
        page: _this.data.page,
        size: _this.data.size
      },
      success: function(t) {

        if (0 == t.code) {
          var nlist = t.data.list;
          var aaa = _this.data.commentList.concat(nlist);
          _this.setData({
            clenght: t.data.row_count,
            commentList: aaa
          });
          _this.changeData(2, aaa);

          if (t.data.list.length == t.data.row_count) {
            _this.setData({
              loadingstutas: 2
            })
          }
        } else {
          wx.showToast({
            icon: "none",
            title: t.msg,
            duration: 3000
          });
        }

      },
      fail: function() {
        wx.showToast({
          icon: "none",
          title: t.msg,
          duration: 3000
        });
      },
      complete: function() {

      }
    });
  },
  onPullDownRefresh: function () {
    var _this = this;
    _this.setData({
      page: 1,
      commentList: [],
      _loading: true
    });
    _this.init();
    wx.stopPullDownRefresh();

  },
    onReachBottom: function() {
     // debugger;
    var _this = this;
      if (_this.data.commentList.length < _this.data.clenght) {
      _this.setData({
        page: parseFloat(_this.data.page) + parseFloat(1)
      });
        _this.getCommentInfo();
    } else {
      _this.setData({
        loadingstutas: 2
      });
    }


  },
  //////////提交评论
  sumbitComment(e) {
    var _this = this;
    // let { text, source, mode } = e.detail;
    var par = {};
    if (e.type == "confirm") {
      par.text = e.detail.value;
    } else {
      par.text = e.detail.value.text;
    }
    if (par.text == "") {return false;}
    par.source = _this.data.id;
    par.mode = "live";
    par.type = 0;
    //debugger;
    if (_this.data.isReply) {
      par.reply = _this.data.reply;
      par.parentID = _this.data.parentid;
    }

    wx.showLoading({
      title: "发表中...",
      mask: !0
    });
    a.request({
      url: t.active.create_commentary,
      data: par,
      header: {
        //必须设置参数内容类型为json
        'Content-Type': 'application/json'
      },
      success: async function(t) {

        if (0 == t.code) {
          _this.setData({
            isFoucsComment: false,
            isReply: false,
            textValue:"",
            page: 1,
            commentList: []
          });

          const commentInfo = await _this.getCommentInfo();/////获取评论信息
          //  debugger;
          //_this.changeData(2,commentInfo);
          wx.showToast({
            icon: "success",
            title: "发表成功",
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
  //////////点击跳到评论框
  commentFn(e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    // wx.redirectTo({
    //   //  url: "/active/community-detail/community-detail?id=" + id
    // });
    _this.setData({
      isFoucsComment: true
    });

  },
  commentevent: function(e) {
    var _this = this;
    var user_id = e.detail.user_id;
    var id = e.detail.id;
    var reply = e.detail.reply ? e.detail.reply : user_id;
    var parentid = e.detail.parentid ? e.detail.parentid : id;
    _this.setData({
      isFoucsComment: true,
      isReply: true,
      reply: reply,
      parentid: parentid,
    });

  }




});