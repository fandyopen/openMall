// components/banner/banner.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        banner_list : Array
    },

    /**
     * 组件的初始数据
     */
    data: {
        circular: true,
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 300,
        loaded:false
    },
  attached: function () {

    var _this=this;
   
    },
    
  moved: function () { var _this = this; },
  detached: function () { var _this = this; },
    /**
     * 组件的方法列表
     */
    methods: {
      imageLoad:function(){
        var _this = this;
       

          _this.setData({
            loaded: true
          });
      
     
       
      }
    }
});
