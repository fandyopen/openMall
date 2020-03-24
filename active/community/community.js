var a = getApp(), t = a.api;
Page({
    data: {
        communityList: [],
        cid: 0,
        clenght: 0,
        page: 1,
        pagesize: 100,
        initload: 1,
        loadingstutas: 0, //0代表没有，1代表加载更多，2代表没有更多了
    },
    onLoad: function (t) {
        var _this = this;
        a.page.onLoad(this, t);
        var r = wx.getStorageSync("USER_INFO");
        r && _this.setData({user_info: r});
        _this.showLoading();
        this.getCommunityList();
    },
    onPullDownRefresh: function () {
        var _this = this;
        _this.setData({
            page: 1,
            initload: 1,
            communityList: []
        });
        _this.getCommunityList();

    },
    onReachBottom: function () {
        var _this = this;
        if (_this.data.communityList.length < _this.data.clenght) {
            _this.setData({
                page: parseFloat(_this.data.page) + parseFloat(1)
            });
            _this.getCommunityList();
        } else {
            _this.setData({
                loadingstutas: 2
            });
        }


    },
    //////////获取圈子内容列表
    getCommunityList: function () {
        wx.stopPullDownRefresh();
        var _this = this;
        _this.setData({loadingstutas: 1});
        a.request({
            url: t.active.circle,
            data: {
                page: _this.data.page,
                limit: _this.data.pagesize
            },
            success: function (t) {
                _this.hideLoading();
                if (0 == t.code) {
                    var nlist = t.data.list;
                    var aaa = _this.data.communityList.concat(nlist);
                    setTimeout(function () {
                        _this.setData({
                            communityList: aaa,
                            clenght: t.data.row_count,
                            initload: 0,
                            loadingstutas: 0
                        });
                        if (aaa.length == t.data.row_count) {
                            _this.setData({loadingstutas: 2})
                        }


                    }, 200)

                }

            },
            fail: function () {
            },
            complete: function () {

            }
        });


    }

});