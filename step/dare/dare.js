var t = require("../../utils/helper.js");

getApp().helper;

Page({
    data: {
        unit_id: "",
        ad: !1,
        space: !1,
        step: 0,
        page: 2,
        over: !1,
        success: !1
    },
    onReachBottom: function() {
        var t = this, e = t.data.over, a = t.data.activity_data, i = void 0, s = void 0, o = void 0;
        if (!e) {
            var c = this.data.page;
            this.setData({
                loading: !0
            }), getApp().core.login({
                success: function(n) {
                    i = n.code, getApp().core.getWeRunData({
                        success: function(n) {
                            s = n.iv, o = n.encryptedData, getApp().request({
                                url: getApp().api.step.activity,
                                method: "POST",
                                data: {
                                    encrypted_data: o,
                                    iv: s,
                                    code: i,
                                    user_id: void 0,
                                    page: c
                                },
                                success: function(i) {
                                    getApp().core.hideLoading();
                                    for (var s = 0; s < i.list.activity_data.length; s++) a.push(i.list.activity_data[s]);
                                    i.list.activity_data.length < 3 && (e = !0);
                                    for (var o = 0; o < a.length; o++) a[o].date = a[o].open_date.replace("-", "").replace("-", "");
                                    t.setData({
                                        page: c + 1,
                                        over: e,
                                        loading: !1,
                                        activity_data: a
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    openSetting: function() {
        var t = this, e = t.data.user_id;
        getApp().core.openSetting({
            success: function(a) {
                1 == a.authSetting["scope.werun"] && 1 == a.authSetting["scope.userInfo"] && (t.setData({
                    authorize: !0
                }), getApp().core.showLoading({
                    title: "数据加载中...",
                    mask: !0
                }), t.activity(e));
            },
            fail: function(e) {
                t.setData({
                    authorize: !1
                }), getApp().core.hideLoading();
            }
        });
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var a = this, i = !1, s = !1, o = void 0;
        null !== e.user_id && (o = e.user_id), getApp().request({
            url: getApp().api.step.setting,
            success: function(t) {
                0 == t.code && a.setData({
                    title: t.data.title,
                    share_title: t.data.share_title
                });
            }
        });
        var c = t.formatTime(new Date()), n = c[0] + c[1] + c[2] + c[3] + c[5] + c[6] + c[8] + c[9];
        this.setData({
            page: 2,
            time: n
        }), null !== e.open_date && (i = e.open_date), null !== e.join && (s = e.join), 
        a.setData({
            join: s,
            open_date: i
        }), getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().core.getSetting({
            success: function(t) {
                1 == t.authSetting["scope.werun"] && 1 == t.authSetting["scope.userInfo"] ? a.activity(o) : getApp().core.authorize({
                    scope: "scope.userInfo",
                    success: function(t) {
                        getApp().core.authorize({
                            scope: "scope.werun",
                            success: function(t) {
                                "authorize:ok" == t.errMsg && a.activity(o);
                            },
                            fail: function(t) {
                                a.setData({
                                    authorize: !1
                                }), getApp().core.hideLoading();
                            }
                        });
                    }
                });
            },
            fail: function(t) {
                a.setData({
                    authorize: !1
                }), getApp().core.hideLoading();
            }
        });
    },
    activity: function(t) {
        var e = this, a = void 0, i = void 0, s = void 0;
        getApp().core.login({
            success: function(o) {
                a = o.code, getApp().core.getWeRunData({
                    success: function(o) {
                        i = o.iv, s = o.encryptedData, getApp().request({
                            url: getApp().api.step.activity,
                            method: "POST",
                            data: {
                                encrypted_data: s,
                                iv: i,
                                code: a,
                                user_id: t
                            },
                            success: function(t) {
                                var a = t.list.run_data;
                                getApp().core.hideLoading();
                                var i = t.list.ad_data, s = t.list.activity_data, o = void 0;
                                if (o = !1, s.length < 1) o = !0; else for (var c = 0; c < s.length; c++) s[c].date = s[c].open_date.replace("-", "").replace("-", "");
                                var n = !1, p = !1;
                                null !== i && (n = t.list.ad_data.unit_id, p = !0), e.setData({
                                    unit_id: n,
                                    step: a,
                                    space: o,
                                    activity_data: s,
                                    ad_data: i,
                                    ad: p
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    adError: function(t) {
        console.log(t.detail);
    },
    close: function() {
        this.setData({
            join: !1
        });
    },
    onShareAppMessage: function(t) {
        return getApp().page.onShareAppMessage(this), this.setData({
            join: !1
        }), {
            path: "/step/index/index?user_id=" + getApp().getUser().id,
            title: this.data.share_title ? this.data.share_title : this.data.title
        };
    },
    submit: function(t) {
        var e = void 0, a = void 0, i = void 0;
        console.log(t);
        var s = t.currentTarget.dataset.id, o = (t.currentTarget.dataset.step, this), c = this.data.step;
        getApp().core.showLoading({
            title: "正在提交...",
            mask: !0
        }), getApp().core.login({
            success: function(t) {
                e = t.code, getApp().core.getWeRunData({
                    success: function(t) {
                        a = t.iv, i = t.encryptedData, getApp().request({
                            url: getApp().api.step.activity_submit,
                            method: "POST",
                            data: {
                                code: e,
                                iv: a,
                                encrypted_data: i,
                                num: c,
                                activity_id: s
                            },
                            success: function(t) {
                                getApp().core.hideLoading(), 0 == t.code ? o.setData({
                                    success: !0
                                }) : getApp().core.showModal({
                                    content: t.msg,
                                    showCancel: !1
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    success: function() {
        this.setData({
            success: !1
        }), getApp().core.redirectTo({
            url: "../dare/dare"
        });
    }
});