
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
      typenum: String
    },

    /**
     * 组件的初始数据
     */
    data: {
      communityList:[],
      selectArry: ["全部", "拼车", "团购", "社交","其他"]
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
        //////选择类型
        typeFn:function(e){

            var _this = this;
            var typenum = e.currentTarget.dataset.type;
            _this.setData({
                num: typenum
            });
            _this.triggerEvent('myevent', typenum) //myevent自定义名称事件，父组件中使用


        }


    }
});
