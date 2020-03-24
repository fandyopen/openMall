
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      member : Array,
      width:String,
      height: String,
      count: String,
      offset: String,
      position: String


     
    },

    /**
     * 组件的初始数据
     */
    data: {
     

    },
  attached: function () {
    var _this=this;
    var a = getApp()
   
    },
  moved: function () { var _this = this; },
  detached: function () { var _this = this; },
    // ready:function(){var _this = this;debugger;},
    /**
     * 组件的方法列表
     */ 
    methods: {

      //       //////////提交评论
      // sumbitComment(e) {
      //   var _this = this;
      //   let par={};
      //   par.text = e.detail.value;
      //   par.source = e.currentTarget.dataset.id;
      //   par.mode = e.currentTarget.dataset.mode;
      //   par.type=0;
    
      //  // _this.triggerEvent('commentevent', par) //myevent自定义名称事件，父组件中使用
      // }


    }
});
