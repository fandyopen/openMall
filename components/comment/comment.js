
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      loadingstutas: String,
      iscircle_master: String,
      commentList: Array,
      activeInfo:Object,
      nameList: Array

     
    },

    /**
     * 组件的初始数据
     */
    data: {
      nameList: []

    },
  attached: function () {
    var _this=this;
    var a = getApp();

   
    },
  moved: function () { var _this = this; },
  detached: function () { var _this = this; },
    // ready:function(){var _this = this;debugger;},
    /**
     * 组件的方法列表
     */ 
    methods: {
  

      //////////点击评论
      commentFn(e){
        var _this = this;
        var id = e.currentTarget.dataset.id;
        wx.redirectTo({
        //  url: "/active/community-detail/community-detail?id=" + id
        });
        // _this.setData({
        //   isDoComment: true,
        //   id: id
        // });
  
      },
      // //////////点赞
      dzFn(e) {
        var _this = this;
        _this.triggerEvent('dzevent', e.currentTarget.dataset) //myevent自定义名称事件，父组件中使用



      },
      //       //////////提交评论
      sumbitSelfComment(e) {
        var _this = this;
        let par={};
        par.user_id = e.currentTarget.dataset.user_id;
        par.id = e.currentTarget.dataset.id;
        par.reply = e.currentTarget.dataset.reply;
        par.parentid = e.currentTarget.dataset.parentid;

        _this.triggerEvent('commentevent', par) //myevent自定义名称事件，父组件中使用
      }


    }
});
