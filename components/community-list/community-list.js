
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      communityList : Array,
      pagetype:String,
      cid: String,
      num: String,
      loadingstutas: String,
      initload: String,
      iscircle_master: String,
      is_all: String,
      moduleList: Array


     
    },

    /**
     * 组件的初始数据
     */
    data: {
      communityList:[],
      isDoComment:false
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
      //////弹窗
      showFn: function (e) {
        var _this = this;
        var list = _this.data.communityList;
        var id = e.currentTarget.dataset.id;
        var cid = e.currentTarget.dataset.cid;
   
        wx.showActionSheet({
          itemList: ['屏蔽活动'],
          itemColor: '#333',
          success(res) {
            if (res.tapIndex == "0") { _this.triggerEvent('hideevent', { cid: cid, id: id }) } //myevent自定义名称事件，父组件中使用
            else if (res.tapIndex == "1"){}
          
          }
        })

      },
      //////选择类型
      typeFn:function(e){

        var _this = this;
        var cate = e.currentTarget.dataset.cate;
        _this.setData({
          num: cate
        });
        _this.triggerEvent('myevent', cate) //myevent自定义名称事件，父组件中使用
        

      },
      // //////////点击评论
      commentFn(e){
        var _this = this;
        var id = e.currentTarget.dataset.id;
        var cid = e.currentTarget.dataset.cid;
        var atype = e.currentTarget.dataset.atype;
        wx.navigateTo({
          url: '/active/active-template/topic-active/detail-topic/detail-topic?id=' + id + '&isFoucsComment=true&cid=' + cid + '&atype=' + atype
        })
  
      },
      // //////////点赞
      dzFn(e) {
    
        var _this = this;
        // var id = e.currentTarget.dataset.id;
        // var mode = e.currentTarget.dataset.mode;
        // var praise_status = e.currentTarget.dataset.praise_status;
        _this.triggerEvent('dzevent', e.currentTarget.dataset) //myevent自定义名称事件，父组件中使用
    
     

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
      }
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
