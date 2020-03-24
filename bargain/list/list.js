var t = getApp(), o = getApp().api, a = !1, e = !0;

Page({
    data: {
        p: 1,
        naver: "list"
    },
    onLoad: function(o) {
        t.page.onLoad(this, o);
        var a = this;
        void 0 !== o.order_id && getApp().core.navigateTo({
            url: "/bargain/activity/activity?order_id=" + o.order_id + "&user_id=" + o.user_id
        }), void 0 !== o.goods_id && getApp().core.navigateTo({
            url: "/bargain/goods/goods?goods_id=" + o.goods_id + "&user_id=" + o.user_id
        }), a.loadDataFirst(o);
    },
    loadDataFirst: function(t) {
        var o = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.index,
            type: "get",
            success: function(t) {
                0 == t.code && (o.setData(t.data), o.setData({
                    p: 2
                }), t.data.goods_list.length > 0 && (e = !1));
            },
            complete: function(o) {
                void 0 === t.order_id && getApp().core.hideLoading(), getApp().core.stopPullDownRefresh();
            }
        });
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
    onPullDownRefresh: function() {
        this.loadDataFirst({});
    },
    onReachBottom: function() {
        e || this.loadData();
    },
    loadData: function() {
        if (!a) {
            a = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var i = this, n = i.data.p;
            t.request({
                url: o.bargain.index,
                data: {
                    page: n
                },
                success: function(t) {
                    if (0 == t.code) {
                        var o = i.data.goods_list;
                        0 == t.data.goods_list.length && (e = !0), o = o.concat(t.data.goods_list), i.setData({
                            goods_list: o,
                            p: n + 1
                        });
                    } else i.showToast({
                        title: t.msg
                    });
                },
                complete: function(t) {
                    getApp().core.hideLoading(), a = !1;
                }
            });
        }
    },
    goToGoods: function(t) {
        var o = t.currentTarget.dataset.index;
        getApp().core.navigateTo({
            url: "/bargain/goods/goods?goods_id=" + o
        });
    },
    onShareAppMessage: function() {
        return getApp().page.onShareAppMessage(this), {
            path: "/bargain/list/list?user_id=" + this.data.__user_info.id,
            success: function(t) {}
        };
    }
});