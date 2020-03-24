function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var t, a = require("../../utils/helper.js"), o = getApp().helper;

Page(e({
    data: (t = {
        dare: !1,
        my: "0",
        todayStep: "0",
        authorize: !0,
        overStep: "0",
        banner_list: [],
        useStep: "0",
        nowAdd: "0.00",
        today: "",
        nextAdd: "0.00",
        people: "2153",
        friend: [],
        now: !1,
        convert_ratio: "",
        activity_data: [ {
            id: 0
        }, {
            open_date: ""
        }, {
            name: ""
        }, {
            bail_currency: 0
        }, {
            step_num: 0
        } ],
        convert_max: 0,
        title: "",
        goods: [],
        user_id: 0,
        time: "",
        encrypted_data: "",
        iv: "",
        code: "",
        page: 2,
        unit_id: ""
    }, e(t, "user_id", ""), e(t, "over", !1), t),
    switch: function(e) {
        var t = 0;
        t = 1 == e.detail.value ? 1 : 0, getApp().request({
            url: getApp().api.step.remind,
            data: {
                remind: t
            }
        });
    },
    exchange: function() {
        var e = this, t = void 0, a = void 0, o = void 0, n = e.data.nowAdd, i = e.data.todayStep * (1 + n / 100), d = e.data.useStep, r = e.data.convert_ratio, s = e.data.convert_max, c = parseInt(i);
        s > 0 && c > +s && (c = +s), c -= d;
        var p = e.data.overStep, u = (c / r).toString().match(/^\d+(?:\.\d{0,2})?/);
        u < .01 || 0 == p ? getApp().core.showModal({
            content: "步数不足",
            showCancel: !1
        }) : getApp().core.showModal({
            content: "确认把" + p + "步兑换为" + u + (e.data.store.option.step.currency_name ? e.data.store.option.step.currency_name : "活力币"),
            success: function(n) {
                n.confirm && (getApp().core.showLoading({
                    title: "兑换中...",
                    mask: !0
                }), getApp().core.login({
                    success: function(n) {
                        a = n.code, getApp().core.getWeRunData({
                            success: function(n) {
                                t = n.iv, o = n.encryptedData, getApp().request({
                                    url: getApp().api.step.convert,
                                    method: "post",
                                    data: {
                                        iv: t,
                                        code: a,
                                        encrypted_data: o,
                                        num: e.data.todayStep
                                    },
                                    success: function(t) {
                                        if (getApp().core.hideLoading(), 0 == t.code) {
                                            s > 0 && c > +s && (c = +s), c -= t.list.num;
                                            var a = (+e.data.my + +t.list.convert).toFixed(2);
                                            e.setData({
                                                overStep: c,
                                                my: a,
                                                useStep: t.list.num
                                            });
                                        } else getApp().core.showModal({
                                            content: t.msg,
                                            showCancel: !1
                                        });
                                    }
                                });
                            }
                        });
                    }
                }));
            },
            fail: function(e) {
                getApp().core.hideLoading(), getApp().core.showModal({
                    content: "为确保您的正常使用，请完善授权操作",
                    showCancel: !1
                });
            }
        });
    },
    adError: function(e) {
        console.log(e.detail);
    },
    onShareAppMessage: function(e) {
        return getApp().page.onShareAppMessage(this), {
            path: "/step/dare/dare?user_id=" + getApp().getUser().id,
            title: this.data.title ? this.data.title : "步数挑战"
        };
    },
    onReachBottom: function() {
        var e = this, t = e.data.over;
        if (!t) {
            var a = this.data.encrypted_data, o = this.data.iv, n = this.data.code, i = this.data.user_id, d = this.data.goods, r = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.index,
                method: "POST",
                data: {
                    encrypted_data: a,
                    iv: o,
                    code: n,
                    user_id: i,
                    page: r
                },
                success: function(a) {
                    for (var o = 0; o < a.data.goods_data.length; o++) d.push(a.data.goods_data[o]);
                    a.data.goods_data.length < 6 && (t = !0), e.setData({
                        goods: d,
                        page: r + 1,
                        over: t,
                        loading: !1
                    });
                }
            });
        }
    },
    refresh: function() {
        getApp().core.showLoading({
            title: "步数加载中...",
            mask: !0
        });
        var e = this, t = e.data.convert_max;
        e.runData(e.data.user_id, t);
    },
    onShow: function() {
        if (0 != this.data.now) {
            var e = this, t = void 0, a = void 0, o = void 0, n = e.data.user_id;
            getApp().core.login({
                success: function(i) {
                    t = i.code, getApp().core.getWeRunData({
                        success: function(i) {
                            a = i.iv, o = i.encryptedData, getApp().request({
                                url: getApp().api.step.index,
                                method: "POST",
                                data: {
                                    encrypted_data: o,
                                    iv: a,
                                    code: t,
                                    user_id: n,
                                    page: 1
                                },
                                success: function(t) {
                                    getApp().core.hideLoading();
                                    var a = t.data.activity_data, o = t.data.user_data, n = t.data.user_data.step_currency;
                                    e.setData({
                                        activity_data: a,
                                        user_data: o,
                                        my: n
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    runData: function(t, a) {
        var o = this, n = void 0, i = void 0, d = void 0;
        getApp().core.login({
            success: function(r) {
                n = r.code, getApp().core.getWeRunData({
                    success: function(r) {
                        i = r.iv, d = r.encryptedData, getApp().request({
                            url: getApp().api.step.index,
                            method: "POST",
                            data: {
                                encrypted_data: d,
                                iv: i,
                                code: n,
                                user_id: t,
                                page: 1
                            },
                            success: function(r) {
                                getApp().core.hideLoading();
                                var s = void 0, c = void 0;
                                null == r.data.activity_data.id ? (c = !1, s = []) : (c = !0, s = r.data.activity_data);
                                var p = r.data.run_data.stepInfoList, u = r.data.user_data, g = void 0, h = [ {
                                    pic_url: "../image/ad.png"
                                } ];
                                r.data.banner_list.length > 0 && (h = r.data.banner_list);
                                var l = !1;
                                null !== r.data.ad_data && (l = r.data.ad_data.unit_id);
                                var v = u.step_currency, _ = r.data.ad_data, f = r.data.goods_data, A = p[p.length - 1].step, m = p[p.length - 1].timestamp, w = u.ratio / 10, y = u.invite_list, S = 0, D = 0;
                                u.now_ratio && (D = u.now_ratio / 10);
                                var M = void 0;
                                0 == u.remind ? M = !1 : 1 == u.remind && (M = !0), u.convert_num > 0 && (S = u.convert_num);
                                var x = parseInt(A * (1 + D / 100));
                                a > 0 && x > +a && (x = +a), (x -= +S) >= 1e3 && (x = String(x).replace(/(\d)(?=(\d{3})+$)/g, "$1,"));
                                var L = "";
                                void 0 != s.open_date && (L = s.open_date.replace(".", "").replace(".", "")), g = !(s.step_num > A), 
                                x < 0 && (x = 0);
                                var C = y.length;
                                o.setData(e({
                                    overStep: x,
                                    todayStep: A,
                                    nextAdd: w,
                                    friend: y,
                                    today: m,
                                    finish: g,
                                    nowAdd: D,
                                    my: v,
                                    now: !0,
                                    user: u,
                                    length: C,
                                    banner_list: h,
                                    useStep: S,
                                    goods: f,
                                    user_id: t,
                                    checked: M,
                                    encrypted_data: d,
                                    iv: i,
                                    page: 2,
                                    code: n,
                                    open_date: L,
                                    activity_data: s,
                                    dare: c,
                                    ad_data: _,
                                    unit_id: l
                                }, "user_id", u.user_id));
                            },
                            fail: function(e) {
                                getApp().core.showModal({
                                    content: e.errMsg,
                                    showCancel: !1
                                });
                            }
                        });
                    },
                    fail: function(e) {
                        "getWeRunData:fail cancel" == e.errMsg ? getApp().core.showModal({
                            content: "读取失败，请稍后再试",
                            showCancel: !1
                        }) : "getWeRunData: fail device not support" == e.errMsg ? getApp().core.showModal({
                            content: '请在微信中搜索"微信运动"公众号，并点击关注',
                            showCancel: !1
                        }) : getApp().core.showModal({
                            content: e.errMsg,
                            showCancel: !1
                        });
                    }
                });
            },
            fail: function(e) {
                getApp().core.showModal({
                    content: e.errMsg,
                    showCancel: !1
                });
            }
        });
    },
    openSetting: function() {
        var e = this;
        getApp().core.openSetting({
            success: function(t) {
                if (1 == t.authSetting["scope.werun"] && 1 == t.authSetting["scope.userInfo"]) {
                    e.setData({
                        authorize: !0
                    }), getApp().core.showLoading({
                        title: "步数加载中...",
                        mask: !0
                    });
                    var a = e.data.user_id, o = e.data.convert_max;
                    e.runData(a, o);
                }
            },
            fail: function(t) {
                e.setData({
                    authorize: !1
                }), getApp().core.hideLoading();
            }
        });
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var t = 0;
        if (null !== e.scene) {
            var n = decodeURIComponent(e.scene), i = o.scene_decode(n);
            i.uid > 0 && (t = i.uid);
        }
        e.user_id > 0 && (t = e.user_id), this.setData({
            user_id: t,
            now: !1
        });
        var d = a.formatTime(new Date()), r = d[0] + d[1] + d[2] + d[3] + d[5] + d[6] + d[8] + d[9];
        this.setData({
            time: r
        }), getApp().core.showLoading({
            title: "步数加载中...",
            mask: !0
        }), getApp().page.onShow(this), getApp().core.showShareMenu({
            withShareTicket: !0
        });
        var s = this, c = void 0;
        getApp().request({
            url: getApp().api.step.setting,
            success: function(e) {
                if (0 == e.code) {
                    var a = e.data.title, o = e.data.share_title;
                    c = e.data.convert_max, a && (getApp().core.setNavigationBarTitle({
                        title: a
                    }), s.setData({
                        title: a,
                        share_title: o
                    })), s.setData({
                        convert_ratio: e.data.convert_ratio,
                        convert_max: c
                    }), getApp().core.getSetting({
                        success: function(e) {
                            1 == e.authSetting["scope.werun"] && 1 == e.authSetting["scope.userInfo"] ? s.runData(t, c) : getApp().core.authorize({
                                scope: "scope.userInfo",
                                success: function(e) {
                                    getApp().core.authorize({
                                        scope: "scope.werun",
                                        success: function(e) {
                                            "authorize:ok" == e.errMsg && s.runData(t, c);
                                        },
                                        fail: function(e) {
                                            s.setData({
                                                authorize: !1
                                            }), getApp().core.hideLoading();
                                        }
                                    });
                                }
                            });
                        },
                        fail: function(e) {
                            s.setData({
                                authorize: !1
                            }), getApp().core.hideLoading();
                        }
                    });
                }
            },
            fail: function(e) {
                getApp().core.showModal({
                    content: e.errMsg,
                    showCancel: !1
                });
            }
        });
    }
}, "onShareAppMessage", function(e) {
    return getApp().page.onShareAppMessage(this), {
        path: "/step/index/index?user_id=" + getApp().getUser().id,
        title: this.data.share_title ? this.data.share_title : this.data.title
    };
}));