
var a = getApp(), t = a.api;
Page({
  data: {
    driver_info:{},
    phone:false
  },
  onLoad: function (t) {
   var _this=this;
      a.page.onLoad(this,t);
    var r = wx.getStorageSync("USER_INFO");
    //a.goLogin(r);//获取个人用户信息
    r && _this.setData({ user_info: r,is_passenger: t.is_passenger});
    _this.getDriver();//获取司机信息


  },

  // 表单手机号
  blurPhone: function (e) {
    var _this = this;
    if(a.checkPhone(e)){
      _this.setData({ phone: true });
    }
    else{
      _this.setData({ phone: false }); 
    }
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  changeData: function (_data) {
    var _this = this;
    
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    let driver_info = wxPrevPage.data.driver_info;/////
    driver_info= _data;
      if (wxPrevPage) {
        wxPrevPage.setData({ driver_info: driver_info });
      }
  
  },
  //////////保存司机信息
  creatDriver: function (e) {
    var _this = this;
 
    var is_passenger = _this.data.is_passenger;
    if (e.detail.value.mobile == "") { wx.showToast({ title: "手机号不能为空", icon: "none",duration: 2000 }); return false; }
    if (e.detail.value.car_number == "" && is_passenger == 0) { wx.showToast({ title: "车牌不能为空", icon: "none", duration: 2000 }); return false; }
    if (e.detail.value.type == "" && is_passenger == 0) { wx.showToast({ title: "车型不能为空", icon: "none", duration: 2000 }); return false; }
    if (!_this.checkNumInt(e.detail.value.seat) && is_passenger == 0) { wx.showToast({ title: "座位不正确", icon: "none", duration: 2000 }); return false; }
  
    if (!_this.data.phone){
      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 2000
      });
      return false;
    }
    var par = {};
    if (e.detail.value.car_number) { par.car_number = e.detail.value.car_number;}
    if (e.detail.value.seat) { par.seat=e.detail.value.seat}
    par.mobile = e.detail.value.mobile;
    if (e.detail.value.type) { par.type=e.detail.value.type}

      par.form_id = e.detail.formId;//formid

      a.request({
      url: t.active.driver_setting + "&access_token=" + _this.data.user_info.access_token,
      data: par,
      // header: {
      //   //必须设置参数内容类型为json 
      //   'Content-Type': 'application/json'
      // },
      method: "POST",
      success: function (t) {
  
        if (0 == t.code) {
          wx.showModal({
            title: "提示",
            content: "保存成功~",
            showCancel: !1,
            success: function (res) {
              _this.getDriver(function(data){
                _this.changeData(data);
                wx.navigateBack({//返回
                  delta: 1
                })

              })
             
            }
          })
  
        }
        else {
          wx.showToast({
            title: "请修改后再保存",
            duration: 1000
          })
        }

      },
      complete: function () {

      }
    });
  },
  //////////获取司机信息
  getDriver: function (callback) {
    var _this = this;
    var par = {};
    a.request({
      url: t.active.driver_getinfo,
      data: par,
      header: {
        //必须设置参数内容类型为json 
        'Content-Type': 'application/json'
      },
      success: function (t) {
        if (0 == t.code) {
          _this.setData({ driver_info: t.data, phone:true });
          if (typeof callback=="function"){
            callback(t.data);
          }
        }
        else {
          wx.showToast({
            title: t.msg,
            duration: 2000
          })
        }

      },
      fail:function(){
       
      },
      complete: function () {

      }
    });
  },
   //////判断是否为正整数
  checkNumInt: function (num) {
    if (!(/(^[1-9]\d*$)/.test(num))) {
      //alert("输入的不是正整数);
      return false;
    } else {
      return true;
      //　alert(‘输入的是正整数’);
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }

});