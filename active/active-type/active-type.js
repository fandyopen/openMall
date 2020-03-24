const regeneratorRuntime = require('../../libs/runtime');
var a = getApp(), t = a.api,
    un = require("../../utils/underscore-min.js");
Page({
  data: {
    banner_list: [],
    circular: true,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 300,
    circle_id:null,
    communityDetail:null,
    moduleList:[],
    isCurentUser:false////////当前用户是否为创建者或者管理员
  },
  onLoad: async function(t) {
    var _this = this;
      a.page.onLoad(this, t);
    var r = wx.getStorageSync("USER_INFO");
    //a.goLogin(r); //获取个人用户信息
    r && _this.setData({
      user_info: r
    });

    // var bannerData = {
    //   "code": 0,
    //   "msg": "success",
    //   "data": {
    //     "banner_list": [{
    //       "id": "1",
    //       "store_id": "3",
    //       "pic_url": "http://wxapp.asegene.com/image/34/34788020131d258f4e083294faf56379cc213c51.jpg",
    //       "title": "轮播一",
    //       "page_url": "/pages/quick-purchase/index/index",
    //       "sort": "100",
    //       "addtime": "1530492474",
    //       "is_delete": "0",
    //       "type": "1",
    //       "open_type": "navigate"
    //     }, {
    //       "id": "2",
    //       "store_id": "3",
    //       "pic_url": "http://wxapp.asegene.com/image/34/34788020131d258f4e083294faf56379cc213c51.jpg",
    //       "title": "轮播2",
    //       "page_url": "/pages/index/index",
    //       "sort": "100",
    //       "addtime": "1534513963",
    //       "is_delete": "0",
    //       "type": "1",
    //       "open_type": "navigate"
    //     }]
    //   }
    // };
    // var banner_list = bannerData.data.banner_list;
    _this.setData({ 
      // banner_list: banner_list,
       circle_id: t.circle_id||null});
      
    let moduleList = await _this.getPermission();
  
    _this.getCommunityDeatil();
  },

  ///////////判断是否符合创建拼车的条件
  goCarpool:function(e){
    var _this=this;
    var typenum = e.currentTarget.dataset.type;
    var is_all = e.currentTarget.dataset.is_all;
    var isCurentUser = _this.data.isCurentUser;
    // if (_this.data.communityDetail.member.length<5){ 
    //   wx.showToast({
    //     icon: "none",
    //     title: "成员不足5人不能创建活动",
    //     duration: 3000
    //   });
    //   return false;

    // }

    wx.navigateTo({
      url: '/active/active-template/carpool-active/create-active/create-active?type=' + typenum +'&circle_id='+_this.data.circle_id
    })


  },
  ///////////判断是否符合创建拼车的条件
  goTopic: function (e) {
    var _this = this;
    var typenum = e.currentTarget.dataset.type;
    var is_all = e.currentTarget.dataset.is_all;
    var isCurentUser = _this.data.isCurentUser;
    // if (_this.data.communityDetail.member.length<5){ 
    //   wx.showToast({
    //     icon: "none",
    //     title: "成员不足5人不能创建话题",
    //     duration: 3000
    //   });
    //   return false;

    // }

    wx.navigateTo({
    //  id=35 & circle_id=2& type=2
      url: '/active/active-template/topic-active/create-topic/create-topic?type=' + typenum + '&circle_id=' + _this.data.circle_id
    });
  


  },
  /////////获取后台开启的模块
  async getPermission() {
    var _this = this;
    return new Promise((resolve, reject) => {
      a.request({
        url: t.active.permission,
        data: {},
        success: function (t) {

          if (0 == t.code) {
            resolve(t);
            var aarry=[];
            for (var i in t.data){
              var aaa = { display: t.data[i].display_name, is_all: 0, name: t.data[i].name };
              aarry.push(aaa);
            }
           
            _this.setData({
              moduleList: aarry
            });



          } else {
            reject(res);
          }

        },
        complete: function () {

        },
        fail: function (res) {
          reject(res);
        }
      });
    })
  },
  //////////获取圈子详情内容信息
  getCommunityDeatil: function () {
    var _this = this;
    a.request({
      url: t.active.circle_detail,
      data: {
        cid: _this.data.circle_id
      },
      success: function (t) {
        if (0 == t.code) {
          var user_info = _this.data.user_info;
          var isCurentUser=false;
          if (user_info.id == t.data.creator){ isCurentUser=true; }
            //////////判断是否都没有开放发布权限
      
          let is_no=un._.findWhere(t.data.permission, { is_all: "0" });
  
          let is_allno=false;
          if (is_no) { is_allno=true;}

          _this.setData({
            communityDetail: t.data,
            is_allno: is_allno,
            permission: t.data.permission ? t.data.permission:[],
            isCurentUser: isCurentUser
          });
        }

      },
      complete: function (ndata) {

      }
    });


  },
  onPullDownRefresh: function () {
    // debugger;
    var _this = this;
    wx.stopPullDownRefresh();
  },

});