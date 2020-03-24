var e = getApp(), t = getApp().api, o = getApp().helper, a = "", i = null, s = require("../../wxParse/wxParse.js"), n = null, r = null, d = !1;

Page({
    data: {
        hide: "hide",
        time_list: {
            day: 0,
            hour: "00",
            minute: "00",
            second: "00"
        },
        p: 1,
        user_index: 0,
        show_content: !1
    },
    onLoad: function(t) {
        if (getApp().page.onLoad(this, t), "undefined" == typeof my) {
            var a = decodeURIComponent(t.scene);
            if (void 0 !== a) {
                var i = o.scene_decode(a);
                i.gid && (t.goods_id = i.gid);
            }
        } else if (null !== e.query) {
            var s = e.query;
            e.query = null, t.goods_id = s.gid;
        }
        this.getGoods(t.goods_id);
    },
    getGoods: function(e) {
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.goods,
            data: {
                goods_id: e,
                page: 1
            },
            success: function(e) {
                if (0 == e.code) {
                    var o = e.data.goods.detail;
                    s.wxParse("detail", "html", o, t), t.setData(e.data), t.setData({
                        reset_time: t.data.goods.reset_time,
                        time_list: t.setTimeList(e.data.goods.reset_time),
                        p: 1,
                        foreshow_time: t.data.goods.foreshow_time,
                        foreshow_time_list: t.setTimeList(t.data.goods.foreshow_time)
                    }), t.setTimeOver(), e.data.bargain_info && t.getUserTime();
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.navigateBack({
                            delta: -1
                        });
                    }
                });
            },
            complete: function(e) {
                getApp().core.hideLoading();
            }
        });
    },
    onReady: function() {
        e.page.onReady(this);
    },
    onShow: function() {
        e.page.onShow(this);
    },
    onHide: function() {
        e.page.onHide(this);
    },
    onUnload: function() {
        e.page.onUnload(this), clearInterval(i), i = null, clearInterval(n), n = null, clearInterval(r), 
        r = null;
    },
    play: function(e) {
        var t = e.target.dataset.url;
        this.setData({
            url: t,
            hide: "",
            show: !0
        }), (a = getApp().core.createVideoContext("video")).play();
    },
    close: function(e) {
        if ("video" == e.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), a.pause();
    },
    onGoodsImageClick: function(e) {
        var t = this, o = [], a = e.currentTarget.dataset.index;
        for (var i in t.data.goods.pic_list) o.push(t.data.goods.pic_list[i].pic_url);
        getApp().core.previewImage({
            urls: o,
            current: o[a]
        });
    },
    hide: function(e) {
        0 == e.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    setTimeOver: function() {
        var e = this;
        i = setInterval(function() {
            e.data.resset_time <= 0 && clearInterval(i);
            var t = e.data.reset_time - 1, o = e.setTimeList(t), a = e.data.foreshow_time - 1, s = e.setTimeList(a);
            e.setData({
                reset_time: t,
                time_list: o,
                foreshow_time: a,
                foreshow_time_list: s
            });
        }, 1e3);
    },
    orderSubmit: function() {
        var e = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.bargain_submit,
            method: "POST",
            data: {
                goods_id: e.data.goods.id
            },
            success: function(t) {
                0 == t.code ? getApp().core.redirectTo({
                    url: "/bargain/activity/activity?order_id=" + t.data.order_id
                }) : e.showToast({
                    title: t.msg
                });
            },
            complete: function(e) {
                getApp().core.hideLoading();
            }
        });
    },
    buyNow: function() {
        var e = [], t = [], o = this.data.bargain_info;
        o && (t.push({
            bargain_order_id: o.order_id
        }), e.push({
            mch_id: 0,
            goods_list: t
        }), getApp().core.redirectTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(e)
        }));
    },
    getUserTime: function() {
        var e = this;
        n = setInterval(function() {
            e.loadData();
        }, 1e3), r = setInterval(function() {
            var t = e.data.user_index;
            e.data.bargain_info.bargain_info.length - t > 3 ? t += 3 : t = 0, e.setData({
                user_index: t
            });
        }, 3e3);
    },
    loadData: function() {
        var o = this, a = o.data.p;
        d || (d = !0, e.request({
            url: t.bargain.goods_user,
            data: {
                page: a + 1,
                goods_id: o.data.goods.id
            },
            success: function(e) {
                if (0 == e.code) {
                    var t = o.data.bargain_info.bargain_info, i = e.data.bargain_info;
                    0 == i.bargain_info.length && (clearInterval(n), n = null), i.bargain_info = t.concat(i.bargain_info), 
                    o.setData({
                        bargain_info: i,
                        p: a + 1
                    });
                } else o.showToast({
                    title: e.msg
                });
            },
            complete: function() {
                d = !1;
            }
        }));
    },
    contentClose: function() {
        this.setData({
            show_content: !1
        });
    },
    contentOpen: function() {
        this.setData({
            show_content: !0
        });
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var e = this;
        return {
            path: "/bargain/list/list?goods_id=" + e.data.goods.id + "&user_id=" + e.data.__user_info.id,
            success: function(e) {},
            title: e.data.goods.name,
            imageUrl: e.data.goods.pic_list[0].pic_url
        };
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active"
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: ""
        });
    },
    getGoodsQrcode: function() {
        var e = this;
        if (e.setData({
            qrcode_active: "active",
            share_modal_active: ""
        }), e.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.bargain.qrcode,
            data: {
                goods_id: e.data.goods.id
            },
            success: function(t) {
                0 == t.code && e.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (e.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm;
                    }
                }));
            }
        });
    },
    qrcodeClick: function(e) {
        var t = e.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ t ]
        });
    },
    qrcodeClose: function() {
        this.setData({
            qrcode_active: ""
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveQrcode: function() {
        var e = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: e.data.goods_qrcode,
            success: function(e) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: e.tempFilePath,
                    success: function() {
                        getApp().core.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(e) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: e.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(e) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function(t) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: t.errMsg + ";" + e.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(e) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    }
});