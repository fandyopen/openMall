const regeneratorRuntime = require('../../libs/runtime');
var a = getApp(), t = a.api,   un = require("../../utils/underscore-min.js");
Page({
  data: {
    is_open: 0,
    publishAllArray: [],
    labelList: [],
    ischeck: false,
    checkArry: [],
    disabled: false
    //access_token:wx.getStorageSync("access_token")

  },
  onLoad: function(t) {
    var _this = this;
      a.page.onLoad(this,t);
    _this.setData({
      cid: t.cid ? t.cid : null,
      btnStr: t.cid ? "保存设置" : "确认创建"
    });

    var r = wx.getStorageSync("USER_INFO");
   // a.goLogin(r); //获取个人用户信息
    r && _this.setData({
      user_info: r
    });

      _this.getLabel(); ////获取标签
   

  },
  //////隐私开关
  switch1Change: function(e) {
    var _this = this;
 
    _this.setData({
      is_open: e.detail.value?1:0
    })
  },
  //////发布设置-拼车
  switchChange2: function(e) {

    var _this = this;
    var aobj = _this.data.publishAllArray;
    aobj[0].value = e.detail.value == true ? 0 : 1;
    _this.setData({
      publishAllArray: aobj 
    })
  },
  //////发布设置-话题
  switchChange3: function(e) {
    var _this = this;
    var aobj = _this.data.publishAllArray;
    aobj[1].value = e.detail.value == true ? 0 : 1;
    _this.setData({
      publishAllArray: aobj
    })
  },
  onReady: function() {

  },
  ////////选中标签
  selectLabelFn: function(e) {
    var _this = this;
    var checkArry = _this.data.checkArry;
    var labelList = _this.data.labelList;
    var id = e.currentTarget.dataset.id;

    for (var i in labelList) {

      if (id == labelList[i].id) {
        if (labelList[i].ischeck) {
          labelList[i].ischeck = false;
          // var index = checkArry.indexOf(labelList[i].id);
          // if (index > -1) {
          //   checkArry.splice(index, 1);
          // }

        } else {
          labelList[i].ischeck = true;
          checkArry[0] = labelList[i].id; ///////这里控制只允许一个
          // checkArry.push(labelList[i].id);

        }
      } else {
        labelList[i].ischeck = false;


      }

    }
    _this.setData({
      labelList: labelList,
      checkArry: checkArry
    })
  },
  // ////////选中标签
  // selectLabelFn:function(e){
  //   var _this = this;
  //   var checkArry = _this.data.checkArry;
  //   var labelList = _this.data.labelList;
  //   var id = e.currentTarget.dataset.id;

  //   for (var i in labelList){

  //     if (id == labelList[i].id){
  //       if (labelList[i].ischeck) { 
  //         labelList[i].ischeck = false;
  //         var index = checkArry.indexOf(labelList[i].id);
  //         if (index > -1) {
  //           checkArry.splice(index, 1);
  //         }

  //         }
  //       else { 
  //         labelList[i].ischeck = true;
  //         checkArry.push(labelList[i].id);

  //       }
  //     }

  //   }

  //   _this.setData({ labelList: labelList, checkArry: checkArry })
  // },
  /////////获取标签
  getLabel: function() {
    var _this = this;
      _this.showLoading();
    a.request({
      url: t.active.circle_tag,
      data: {},
      success: async function(t) {
        if (0 == t.code) {
            _this.hideLoading();
          _this.setData({
            labelList: t.data.list
          });
          if (_this.data.cid) {
           
           let moduleList= await _this.getPermission();
            _this.getCommunityInfo(_this.data.cid, moduleList.data);///////编辑社圈拿社圈信息
          }
        

        } else {

        }

      },
      complete: function() {

      }
    });
  },
  /////////获取后台开启的模块
  async getPermission () {
    var _this = this;
    return new Promise((resolve, reject) => {
    a.request({
      url: t.active.permission,
      data: {},
      success: function (t) {
   
        if (0 == t.code) {
          resolve(t);
          _this.setData({
            moduleList: t.data
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
  /////////获取社圈详情
  getCommunityInfo: function (cid, moduleList) {
    var _this = this;
    wx.showLoading({
      title: "加载中",
      mask: !0
    });
    a.request({
      url: t.active.circle_detail,
      data: {
        cid: cid
      },
      success: function(t) {
        if (0 == t.code) {
        
          wx.setNavigationBarTitle({
            title: t.data.name
          });
          var checkArry = _this.data.checkArry;
          var labelList = _this.data.labelList;
          if (!t.data) {
            return false;
          }
         
          var aa = t.data.permission;
          let parray = [];

          // // ///////处理发布设置的选中

          for (var i in moduleList) {
            var publishObj = { title: moduleList[i].display_name, name: moduleList[i].name, value: 1 };
            for(var j in aa ){
              if (aa[j].name == moduleList[i].name){
                publishObj.value = aa[j].is_all;
              }
            }
              parray.push(publishObj)
          }
      
          let communityInfo = t.data;
          communityInfo.moduleList = moduleList;
          _this.setData({
            communityInfo: communityInfo,
            publishAllArray: parray,
            is_open: t.data.is_open
          });
          //////处理标签选中(现在只能选一个)
          for (var i in labelList) {
            //  for (var j in t.data.tag) {
            var tag = t.data.tag[0];
            if (tag.tagId == labelList[i].id) {
              if (labelList[i].ischeck) {
                labelList[i].ischeck = false;
              } else {
                labelList[i].ischeck = true;
                checkArry.push(labelList[i].id);

              }
              // }

            }

            _this.setData({
              labelList: labelList,
              checkArry: checkArry
            })


          }
          wx.hideLoading();

        } else {

        }

      },
      complete: function() {

      }
    });
  },
  //////////创建/编辑圈子
  creatCommunity: function(e) {
    var _this = this;
    var moduleArry = [];
    var moduleJson = {}; 
    var par = {};
    if (_this.data.cid) {
      par.id = _this.data.cid;
    }
    if (e.detail.value.name == "") {
      wx.showToast({
        icon: "none",
        title: "请输入社圈名称",
        duration: 2000
      });
      return false;
    }
    if (e.detail.value.describe == "") {
      wx.showToast({
        icon: "none",
        title: "请输入社圈简介",
        duration: 2000
      });
      return false;
    }
    par.name = e.detail.value.name;
    par.describe = e.detail.value.describe;
    par.is_open = _this.data.is_open;
    // par.cover_pic = "",
    par.tag = _this.data.checkArry;
    //par.tag = JSON.stringify(_this.data.checkArry);
    if (_this.data.cid) {
    var parray = _this.data.publishAllArray;
    for (var i in parray) {
      var moduleJson = {};
      moduleJson.name = parray[i].name;
      moduleJson.all = parray[i].value;
      moduleArry.push(moduleJson);
    }

     par.module = moduleArry;
    }

    _this.setData({
      disabled: true
    });

    a.request({
      url: t.active.store + "&access_token=" + _this.data.user_info.access_token,
      data: par,
      header: {
        //必须设置参数内容类型为json 
        'Content-Type': 'application/json'
      },
      method: "POST",
      success: function(t) {
        if (0 == t.code) {
          wx.showToast({
            title: t.msg,
            duration: 1000
          });
          setTimeout(function() {
            if (_this.data.cid) {
              wx.navigateBack({//返回
                delta: 1
              })

            } else {
              wx.redirectTo({
                url: '/active/community/community'
              })
            }
            _this.setData({
              disabled: false
            })

          }, 1000)


        } else {

        }

      },
      complete: function() {

      }
    });
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  }

});