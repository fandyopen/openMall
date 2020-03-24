module.exports = {
    currentPage: null,
    gSpecificationsModel: null,
    init: function(t) {
        this.currentPage = t;
        var e = this;
        this.gSpecificationsModel = require("../../components/goods/specifications_model.js"), 
        this.gSpecificationsModel.init(t), void 0 === t.showNotice && (t.showNotice = function() {
            e.showNotice();
        }), void 0 === t.closeNotice && (t.closeNotice = function() {
            e.closeNotice();
        }), void 0 === t.play && (t.play = function(t) {
            e.play(t);
        }), void 0 === t.receive && (t.receive = function(t) {
            e.receive(t);
        }), void 0 === t.closeCouponBox && (t.closeCouponBox = function(t) {
            e.closeCouponBox(t);
        }), void 0 === t.catBind && (t.catBind = function(t) {
            e.catBind(t);
        }), void 0 === t.modalShowGoods && (t.modalShowGoods = function(t) {
            e.modalShowGoods(t);
        }), void 0 === t.modalConfirmGoods && (t.modalConfirmGoods = function(t) {
            e.modalConfirmGoods(t);
        }), void 0 === t.modalCloseGoods && (t.modalCloseGoods = function(t) {
            e.modalCloseGoods(t);
        }), void 0 === t.setTime && (t.setTime = function(t) {
            e.setTime(t);
        }), void 0 === t.closeActModal && (t.closeActModal = function(t) {
            e.closeActModal(t);
        }), void 0 === t.goto && (t.goto = function(t) {
            e.goto(t);
        }), void 0 === t.go && (t.go = function(t) {
            e.go(t);
        });
    },
    showNotice: function() {
        this.currentPage.setData({
            show_notice: !0
        });
    },
    closeNotice: function() {
        this.currentPage.setData({
            show_notice: !1
        });
    },
    play: function(t) {
        this.currentPage.setData({
            play: t.currentTarget.dataset.index
        });
    },
    receive: function(t) {
        var a = this.currentPage, e = t.currentTarget.dataset.index;
        getApp().core.showLoading({
            title: "领取中",
            mask: !0
        }), a.hideGetCoupon || (a.hideGetCoupon = function(t) {
            var e = t.currentTarget.dataset.url || !1;
            a.setData({
                get_coupon_list: null
            }), wx.navigateTo({
                url: e || "/pages/list/list"
            });
        }), getApp().request({
            url: getApp().api.coupon.receive,
            data: {
                id: e
            },
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code ? a.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                }) : (getApp().core.showToast({
                    title: t.msg,
                    duration: 2e3
                }), a.setData({
                    coupon_list: t.data.coupon_list
                }));
            }
        });
    },
    closeCouponBox: function(t) {
        this.currentPage.setData({
            get_coupon_list: ""
        });
    },
    catBind: function(t) {
        var e = this.currentPage, a = t.currentTarget.dataset.template, o = t.currentTarget.dataset.index, i = e.data.template;
        i[a].param.cat_index = o, e.setData({
            template: i
        });
    },
    modalShowGoods: function(t) {
        var e = this.currentPage, a = e.data.template, o = t.currentTarget.dataset.template, i = t.currentTarget.dataset.cat, s = t.currentTarget.dataset.goods, n = a[o].param.list[i].goods_list[s];
        "goods" == a[o].type ? (n.id = n.goods_id, e.setData({
            goods: n,
            show_attr_picker: !0,
            attr_group_list: n.attr_group_list,
            pageType: "STORE",
            id: n.id
        }), this.gSpecificationsModel.selectDefaultAttr()) : getApp().core.navigateTo({
            url: n.page_url
        });
    },
    modalConfirmGoods: function(t) {
        var e = this.currentPage, a = (e.data.pageType, require("../../components/goods/goods_buy.js"));
        a.currentPage = e, a.submit("ADD_CART"), e.setData({
            form: {
                number: 1
            }
        });
    },
    modalCloseGoods: function(t) {
        this.currentPage.setData({
            show_attr_picker: !1,
            form: {
                number: 1
            }
        });
    },
    template_time: null,
    setTime: function(t) {
        var o = this.currentPage, i = o.data.time_all;
        this["template_time_" + o.data.options.page_id] && clearInterval(this["template_time_" + o.data.options.page_id]), 
        this["template_time_" + o.data.options.page_id] = setInterval(function() {
            for (var t in i) if ("time" == i[t].type && (0 < i[t].param.start_time ? (i[t].param.start_time--, 
            i[t].param.end_time--, i[t].param.time_list = o.setTimeList(i[t].param.start_time)) : 0 < i[t].param.end_time && (i[t].param.end_time--, 
            i[t].param.time_list = o.setTimeList(i[t].param.end_time))), "miaosha" == i[t].type || "bargain" == i[t].type || "lottery" == i[t].type) {
                var e = i[t].param.cat_index;
                for (var a in i[t].param.list[e].goods_list) 0 < i[t].param.list[e].goods_list[a].time ? (i[t].param.list[e].goods_list[a].time--, 
                i[t].param.list[e].goods_list[a].time_list = o.setTimeList(i[t].param.list[e].goods_list[a].time), 
                0 < i[t].param.list[e].goods_list[a].time_end && (i[t].param.list[e].goods_list[a].time_end--, 
                1 == i[t].param.list[e].goods_list[a].time && (i[t].param.list[e].goods_list[a].is_start = 1, 
                i[t].param.list[e].goods_list[a].time = i[t].param.list[e].goods_list[a].time_end, 
                i[t].param.list[e].goods_list[a].time_end = 0, i[t].param.list[e].goods_list[a].time_content = 1 == i[t].param.list_style ? "仅剩" : "距结束仅剩"))) : (i[t].param.list[e].goods_list[a].is_start = 1, 
                i[t].param.list[e].goods_list[a].time = 0, i[t].param.list[e].goods_list[a].time_content = "活动已结束", 
                i[t].param.list[e].goods_list[a].time_list = {});
            }
            o.setData({
                time_all: i
            });
        }, 1e3);
    },
    closeActModal: function() {
        var t, e = this.currentPage, a = e.data.act_modal_list, o = !0;
        for (var i in a) {
            var s = parseInt(i);
            a[s].show && (a[s].show = !1, void 0 !== a[t = s + 1] && o && (o = !1, setTimeout(function() {
                e.data.act_modal_list[t].show = !0, e.setData({
                    act_modal_list: e.data.act_modal_list
                });
            }, 500)));
        }
        e.setData({
            act_modal_list: a
        });
    },
    goto: function(e) {
        var a = this;
        "undefined" != typeof my ? a.location(e) : getApp().core.getSetting({
            success: function(t) {
                t.authSetting["scope.userLocation"] ? a.location(e) : getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    author: "scope.userLocation",
                    success: function(t) {
                        console.log(t), t.authSetting["scope.userLocation"] && a.location(e);
                    }
                });
            }
        });
    },
    location: function(t) {
        var e = this.currentPage, a = [], o = t.currentTarget.dataset.template;
        a = void 0 !== o ? e.data.template[o].param.list : e.data.list;
        var i = t.currentTarget.dataset.index;
        getApp().core.openLocation({
            latitude: parseFloat(a[i].latitude),
            longitude: parseFloat(a[i].longitude),
            name: a[i].name,
            address: a[i].address
        });
    },
    go: function(t) {
        var e = this.currentPage, a = t.currentTarget.dataset.template, o = [];
        o = void 0 !== a ? e.data.template[a].param.list : e.data.list;
        var i = t.currentTarget.dataset.index;
        getApp().core.navigateTo({
            url: "/pages/shop-detail/shop-detail?shop_id=" + o[i].id
        });
    }
};