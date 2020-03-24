getApp(), getApp().api;

var t = !1, e = !0, a = null;

Page({
    data: {
        naver: "order",
        status: -1,
        intval: [],
        p: 1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        void 0 == t.status && (t.status = -1), e.setData(t), e.getList();
    },
    getList: function() {
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.order_list,
            data: {
                status: t.data.status || -1
            },
            success: function(e) {
                0 == e.code ? (t.setData(e.data), t.setData({
                    p: 1
                }), t.getTimeList()) : t.showLoading({
                    title: e.msg
                });
            },
            complete: function(t) {
                getApp().core.hideLoading(), e = !1;
            }
        });
    },
    getTimeList: function() {
        clearInterval(a);
        var t = this, e = t.data.list;
        a = setInterval(function() {
            for (var a in e) if (e[a].reset_time > 0) {
                var i = e[a].reset_time - 1, s = t.setTimeList(i);
                e[a].reset_time = i, e[a].time_list = s;
            }
            t.setData({
                list: e
            });
        }, 1e3);
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onReachBottom: function() {
        var t = this;
        e || t.loadData();
    },
    loadData: function() {
        var a = this;
        if (!t) {
            t = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var i = a.data.p + 1;
            getApp().request({
                url: getApp().api.bargain.order_list,
                data: {
                    status: a.data.status,
                    page: i
                },
                success: function(t) {
                    if (0 == t.code) {
                        var s = a.data.list.concat(t.data.list);
                        a.setData({
                            list: s,
                            p: i
                        }), 0 == t.data.list.length && (e = !0), a.getTimeList();
                    } else a.showLoading({
                        title: t.msg
                    });
                },
                complete: function(e) {
                    getApp().core.hideLoading(), t = !0;
                }
            });
        }
    },
    submit: function(t) {
        var e = [], a = [];
        a.push({
            bargain_order_id: t.currentTarget.dataset.index
        }), e.push({
            mch_id: 0,
            goods_list: a
        }), getApp().core.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(e)
        });
    }
});