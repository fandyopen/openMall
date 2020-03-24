var a = getApp(), t = a.api;
//var WxSearch = require('../../commons/wxSearch/wxSearch.js') ;
Page({
    data: {
        memberlist: [],
        isSelect:false,//判断当前是查询还是原来列表
        keyword:"",
        clenght: 0,
        page: 1,
        pagesize: 8,
        initload: 1,
        loadingstutas: 0, //0代表没有，1代表加载更多，2代表没有更多了

    },
    onLoad: function(t) {
        var that = this;
        var r = wx.getStorageSync("USER_INFO");
       // a.goLogin(r);//获取个人用户信息
        r && that.setData({ user_info: r });
        this.setData({
            cid: t.cid
        });
        a.page.onLoad(this, t);
        this.getMemberList();
        this.getCurMemberInfo();

    },
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function () {
        wx.removeStorageSync('memberOrilist')


    },
    onUnload: function () {

        wx.removeStorageSync('memberOrilist')
    },
    onPullDownRefresh: function () {
        var _this = this;
        _this.setData({
            page: 1,
            initload: 1,
            memberlist: []
        });
        _this.getMemberList();

    },
    onReachBottom: function () {
        var _this = this;
        if (_this.data.memberlist.length < _this.data.clenght) {
            _this.setData({
                page: parseFloat(_this.data.page) + parseFloat(1)
            });
            _this.getMemberList();
        } else {
            _this.setData({
                loadingstutas: 2
            });
        }


    },
    setAdminFn: function(e) {
        var _this = this;
        var array = ['设为普通成员', '设为管理员', "设为审核员", "移除成员"];
        var remIndex=3;
        var uid = e.currentTarget.dataset.uid;
        if (uid == _this.data.user_info.id && _this.data.curUserData.role_type!=0){//自己是管理员不是设置自己的角色
            wx.showToast({  icon: "none", title: "不能设置自己的角色", duration: 1000});  return false;}

        if (uid != _this.data.user_info.id && _this.data.curUserData.role_type == 0) {//自己普通成员不能设置别人的角色
            wx.showToast({ icon: "none", title: "不能设置其他成员的角色", duration: 1000 }); return false;
        }

        if (_this.data.curUserData.role_type == 0) {//自己普通成员改变权限只能移除自己
            array = ["退出"];
            remIndex=0;
        }
        wx.showActionSheet({
            itemList: array,
            itemColor: '#333',
            success(res) {
                console.log(res.tapIndex);
                if (res.tapIndex == remIndex) { ///////移除
                    _this.delMember(uid)
                } else {

                    _this.setRole(uid, res.tapIndex)
                }

            }
        })
    },
    /////////移除成员
    delMember: function (uid) {
        var _this = this;
        a.request({
            url: t.active.delete_member + "&access_token=" + _this.data.user_info.access_token,
            method: "POST",
            data: {
                cid: _this.data.cid,
                uid: uid
            },
            success: function (t) {

                if (0 == t.code) {
                    _this.setData({
                        page: 1,
                        initload: 1,
                        memberlist: []
                    });
                    _this.getMemberList();
                    wx.showToast({
                        title: t.msg,
                        duration: 1000
                    })
                }
                else {
                    wx.showToast({
                        title: t.msg,
                        duration: 1000
                    })
                }

            },
            complete: function () {

            }
        });
    },
    /////////设置身份
    setRole: function(uid, role) {

        var _this = this;
        a.request({
            url: t.active.member_role,
            method: "POST",
            data: {
                cid: _this.data.cid,
                handle: role,
                uid: uid
            },
            success: function(t) {

                if (0 == t.code) {
                    _this.setData({
                        page: 1,
                        initload: 1,
                        memberlist: []
                    });
                    _this.getMemberList();

                    wx.showToast({
                        title: t.msg,
                        duration: 1000
                    })
                }
                else{
                    wx.showToast({
                        title: t.msg,
                        duration: 1000
                    })
                }

            },
            complete: function() {

            }
        });
    },
    //////////获取圈子内容列表
    getMemberList: function() {
        var _this = this;
        _this.setData({
            loadingstutas: 1
        });
        a.request({
            url: t.active.member_lists,
            data: {
                cid: _this.data.cid,
                keyword: _this.data.keyword,
                page: _this.data.page,
                limit: _this.data.pagesize
            },
            success: function(t) {

                //  _this.hideLoading();
                if (0 == t.code) {


                    var nlist = t.data.list;
                    var aaa = _this.data.memberlist.concat(nlist);
                    // debugger;
                    //_this.hideLoading();

                    setTimeout(function () {
                        _this.setData({
                            memberlist: aaa,
                            clenght: t.data.row_count,
                            initload: 0
                        });

                        if (!_this.data.isSelect) { wx.setStorageSync("memberOrilist", aaa);}
                        if (aaa.length == t.data.row_count) { _this.setData({ loadingstutas: 2 }) }
                        wx.stopPullDownRefresh();
                    }, 200);

                    // for (var i in t.data.list){
                    //   if (t.data.list[i].user_id == _this.data.user_info.id){
                    //
                    //     _this.setData({
                    //       curUserData: t.data.list[i]
                    //     })
                    //   }
                    // }
                }

            },
            complete: function() {

            }
        });


    },
    //////////获取当前用户在本圈子的成员信息
    getCurMemberInfo: function() {
        var _this = this;
        a.request({
            url: t.active.cur_member_info,
            method:"POST",
            data: {
                cid: _this.data.cid
            },
            success: function(t) {

                if (0 == t.code) {

                    _this.setData({
                        curUserData: t.data
                    })



                }

            },
            complete: function() {

            }
        });


    },
    //////弹起键盘完成
    bindconfirm:function(){

        var _this = this;
        _this.setData({
            page: 1,
            initload: 1,
            memberlist: []
        });
        _this.getMemberList();
    },
//////搜索
    wxSearchInput: function (e) {
        var _this = this;
        var str = e.detail.value;
        _this.setData({
            keyword: str,
        });


    },
    //////点击开始搜索
    wxSearchBtn: function (e) {
        var _this = this;
        _this.setData({
            page: 1,
            initload: 1,
            memberlist: []
        });
        _this.getMemberList();

    },
    //////关闭搜索
    closeSearch:function(){
        var _this = this;
        var memberOrilist = wx.getStorageSync("memberOrilist");
        _this.setData({
            isSelect: false,
            keyword: "",
            memberlist: memberOrilist?memberOrilist : _this.data.memberlist
        })
    },
    //////去搜索页面
    goSearch: function () {
        var _this = this;
        _this.setData({
            isSelect: true
        })
    }


});