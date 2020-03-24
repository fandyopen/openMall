var t = require("../../wxParse/wxParse.js"), e = require("../../components/shopping_cart/shopping_cart.js"), o = require("../../components/specifications_model/specifications_model.js"), a = require("../../components/goods/specifications_model.js"), i = require("../../components/goods/goods_banner.js"), s = require("../../components/goods/goods_info.js"), r = require("../../components/goods/goods_buy.js"), n = require("../../components/quick-navigation/quick-navigation.js"), d = 1, p = !1, c = !0, g = 0;

Page({
    data: {
        pageType: "STEP",
        id: null,
        goods: {},
        show_attr_picker: !1,
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight - 20,
        page: 1,
        drop: !1,
        goodsModel: !1,
        goods_num: 0,
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        goodNumCount: 0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        g = 0, d = 1, p = !1, c = !0;
        var o = t.quick;
        if (o) {
            var a = getApp().core.getStorageSync(getApp().const.ITEM);
            if (a) var i = a.total, s = a.carGoods; else var i = {
                total_price: 0,
                total_num: 0
            }, s = [];
            e.setData({
                quick: o,
                quick_list: a.quick_list,
                total: i,
                carGoods: s,
                quick_hot_goods_lists: a.quick_hot_goods_lists
            });
        }
        if ("undefined" == typeof my) {
            var r = decodeURIComponent(t.scene);
            if (void 0 !== r) {
                var n = getApp().helper.scene_decode(r);
                n.uid && n.gid && (t.id = n.gid);
            }
        } else if (null !== getApp().query) {
            var u = app.query;
            getApp().query = null, t.id = u.gid;
        }
        e.setData({
            id: t.goods_id,
            user_id: t.user_id
        }), e.getGoods();
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this), e.init(this), o.init(this, e), a.init(this), i.init(this), 
        s.init(this), r.init(this), n.init(this);
        var t = this, d = getApp().core.getStorageSync(getApp().const.ITEM);
        if (d) var p = d.total, c = d.carGoods, g = t.data.goods_num; else var p = {
            total_price: 0,
            total_num: 0
        }, c = [], g = 0;
        t.setData({
            total: p,
            carGoods: c,
            goods_num: g
        });
    },
    onHide: function() {
        getApp().page.onHide(this), e.saveItemData(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this), e.saveItemData(this);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = this, e = getApp().getUser();
        return {
            path: "/step/goods/goods?goods_id=" + this.data.id + "&user_id=" + e.id,
            success: function(e) {
                1 == ++g && t.shareSendCoupon(t);
            },
            title: t.data.goods.name,
            imageUrl: t.data.goods.pic_list[0]
        };
    },
    play: function(t) {
        var e = t.target.dataset.url;
        this.setData({
            url: e,
            hide: "",
            show: !0
        }), getApp().core.createVideoContext("video").play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), getApp().core.createVideoContext("video").pause();
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    to_dial: function(t) {
        var e = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: e
        });
    },
    getGoods: function() {
        var e = this;
        if (e.data.quick) {
            var o = e.data.carGoods;
            if (o) {
                for (var a = o.length, i = 0, s = 0; s < a; s++) o[s].goods_id == e.data.id && (i += parseInt(o[s].num));
                e.setData({
                    goods_num: i
                });
            }
        }
        getApp().request({
            url: getApp().api.step.goods,
            data: {
                goods_id: e.data.id,
                user_id: e.data.user_id
            },
            success: function(o) {
                if (0 == o.code) {
                    var a = o.data.goods.detail;
                    t.wxParse("detail", "html", a, e);
                    var i = o.data.goods;
                    i.attr_pic = o.data.goods.attr_pic, i.cover_pic = o.data.goods.pic_list[0].pic_url;
                    var s = i.pic_list, r = [];
                    for (var n in s) r.push(s[n].pic_url);
                    i.pic_list = r, e.setData({
                        goods: i,
                        attr_group_list: o.data.goods.attr_group_list,
                        btn: !0
                    }), e.selectDefaultAttr();
                }
                1 == o.code && getApp().core.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    tabSwitch: function(t) {
        var e = this;
        "detail" == t.currentTarget.dataset.tab ? e.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : e.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var e = this, o = t.currentTarget.dataset.index, a = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: e.data.comment_list[o].pic_list[a],
            urls: e.data.comment_list[o].pic_list
        });
    },
    exchangeGoods: function() {
        var t = this;
        if (!t.data.show_attr_picker) return t.setData({
            show_attr_picker: !0
        }), !0;
        var e = t.data.attr_group_list, o = [];
        for (var a in e) {
            var i = !1;
            for (var s in e[a].attr_list) if (e[a].attr_list[s].checked) {
                i = {
                    attr_id: e[a].attr_list[s].attr_id,
                    attr_name: e[a].attr_list[s].attr_name
                };
                break;
            }
            if (!i) return getApp().core.showToast({
                title: "请选择" + e[a].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            o.push({
                attr_group_id: e[a].attr_group_id,
                attr_group_name: e[a].attr_group_name,
                attr_id: i.attr_id,
                attr_name: i.attr_name
            });
        }
        var r = t.data.form.number;
        if (r <= 0) return getApp().core.showToast({
            title: "商品库存不足!",
            image: "/images/icon-warning.png"
        }), !0;
        var n = t.data.goods;
        t.setData({
            show_attr_picker: !1
        }), getApp().core.navigateTo({
            url: "/pages/order-submit/order-submit?step_id=" + n.id + "&goods_info=" + JSON.stringify({
                goods_id: n.id,
                attr: o,
                num: r
            })
        });
    }
});