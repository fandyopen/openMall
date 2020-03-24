var t = require("../commons/time.js"), a = (getApp(), getApp().api, null), e = !1, i = !0;

Page({
    data: {
        show_more: !0,
        p: 1,
        show_modal: !1,
        show: !1,
        show_more_btn: !0,
        animationData: null,
        show_modal_a: !1
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a);
        var e = this;
        e.setData({
            order_id: a.order_id
        }), e.joinBargain(), t.init(e);
    },
    joinBargain: function() {
        var t = this;
        getApp().request({
            url: getApp().api.bargain.bargain,
            data: {
                order_id: t.data.order_id
            },
            success: function(a) {
                0 == a.code ? (t.getOrderInfo(), t.setData(a.data)) : (t.showToast({
                    title: a.msg
                }), getApp().core.hideLoading());
            }
        });
    },
    getOrderInfo: function() {
        var t = this;
        getApp().request({
            url: getApp().api.bargain.activity,
            data: {
                order_id: t.data.order_id,
                page: 1
            },
            success: function(a) {
                0 == a.code ? (t.setData(a.data), t.setData({
                    time_list: t.setTimeList(a.data.reset_time),
                    show: !0
                }), t.data.bargain_status && t.setData({
                    show_modal: !0
                }), t.setTimeOver(), i = !1, t.animationCr()) : t.showToast({
                    title: a.msg
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
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
        getApp().page.onUnload(this), clearInterval(a), a = null;
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = this;
        return {
            path: "/bargain/activity/activity?order_id=" + t.data.order_id + "&user_id=" + t.data.__user_info.id,
            success: function(t) {},
            title: t.data.share_title || null
        };
    },
    loadData: function() {
        var t = this;
        if (getApp().core.showLoading({
            title: "加载中"
        }), !e) {
            e = !0, getApp().core.showNavigationBarLoading();
            var a = t.data.p + 1;
            getApp().request({
                url: getApp().api.bargain.activity,
                data: {
                    order_id: t.data.order_id,
                    page: a
                },
                success: function(e) {
                    if (0 == e.code) {
                        var o = t.data.bargain_info;
                        o = o.concat(e.data.bargain_info), t.setData({
                            bargain_info: o,
                            p: a,
                            price: e.data.price,
                            money_per: e.data.money_per,
                            money_per_t: e.data.money_per_t
                        }), 0 == e.data.bargain_info.length && (i = !0, a -= 1, t.setData({
                            show_more_btn: !1,
                            show_more: !0,
                            p: a
                        }));
                    } else t.showToast({
                        title: e.msg
                    });
                },
                complete: function(t) {
                    getApp().core.hideLoading(), getApp().core.hideNavigationBarLoading(), e = !1;
                }
            });
        }
    },
    showMore: function(t) {
        var a = this;
        a.data.show_more_btn && (i = !1), i || a.loadData();
    },
    hideMore: function() {
        this.setData({
            show_more_btn: !0,
            show_more: !1
        });
    },
    orderSubmit: function() {
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().core.redirectTo({
            url: "/bargain/goods/goods?goods_id=" + t.data.goods_id
        });
    },
    close: function() {
        this.setData({
            show_modal: !1
        });
    },
    buyNow: function() {
        var t = this, a = [], e = [];
        e.push({
            bargain_order_id: t.data.order_id
        }), a.push({
            mch_id: 0,
            goods_list: e
        }), getApp().core.showModal({
            title: "提示",
            content: "是否确认购买？",
            success: function(t) {
                t.confirm && getApp().core.redirectTo({
                    url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(a)
                });
            }
        });
    },
    goToList: function() {
        getApp().core.redirectTo({
            url: "/bargain/list/list"
        });
    },
    animationCr: function() {
        var t = this;
        t.animationT(), setTimeout(function() {
            t.setData({
                show_modal_a: !0
            }), t.animationBig(), t.animationS();
        }, 800);
    },
    animationBig: function() {
        var t = getApp().core.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%"
        }), a = this, e = 0;
        setInterval(function() {
            e % 2 == 0 ? t.scale(.9).step() : t.scale(1).step(), a.setData({
                animationData: t.export()
            }), 500 == ++e && (e = 0);
        }, 500);
    },
    animationS: function() {
        var t = getApp().core.createAnimation({
            duration: 500
        }), a = this;
        t.width("512rpx").height("264rpx").step(), t.rotate(-2).step(), t.rotate(4).step(), 
        t.rotate(-2).step(), t.rotate(0).step(), a.setData({
            animationDataHead: t.export()
        });
    },
    animationT: function() {
        var t = getApp().core.createAnimation({
            duration: 200
        }), a = this;
        t.width("500rpx").height("500rpx").step(), a.setData({
            animationDataT: t.export()
        });
    }
});