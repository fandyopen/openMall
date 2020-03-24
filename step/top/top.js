Page({
    data: {
        friend: !0,
        country: !1,
        avatar: "",
        name: "",
        noun: "",
        bg: "../image/topBG.png",
        id: 1,
        page: 2,
        money: "",
        loading: !1,
        unit_id: "",
        list: [],
        over: !1,
        ad: !1
    },
    adError: function(a) {
        console.log(a.detail);
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a);
        var t = this;
        this.data.list;
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.ranking,
            data: {
                status: 1,
                page: 1
            },
            success: function(a) {
                getApp().core.hideLoading();
                var e = a.data.user, i = a.data.list, n = a.data.ad_data;
                if (i.length > 3) {
                    for (var g = 3; g < i.length; g++) i[g].noun = g + 1;
                    i[0].img = "../image/top1.png", i[1].img = "../image/top2.png", i[2].img = "../image/top3.png";
                } else i.length > 0 && i.length <= 3 && (i[0].img = "../image/top1.png", i.length > 1 && (i[1].img = "../image/top2.png"), 
                i.length > 2 && (i[2].img = "../image/top3.png"));
                var o = !1, p = !1;
                null !== a.data.ad_data && (o = a.data.ad_data.unit_id, p = !0), t.setData({
                    list: i,
                    name: e.user.nickname,
                    avatar: e.user.avatar_url,
                    noun: e.raking,
                    money: e.step_currency,
                    unit_id: o,
                    ad_data: n,
                    ad: p
                });
            }
        });
    },
    onReachBottom: function() {
        var a = this, t = a.data.over;
        if (!t) {
            var e = this.data.id, i = this.data.list, n = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.ranking,
                data: {
                    status: e,
                    page: n
                },
                success: function(g) {
                    var o = g.data.list;
                    i = i.concat(o), this.data.loading = !1;
                    for (var p = 10 * (n - 1); p < i.length; p++) i[p].noun = p + 1;
                    o.length < 10 && (t = !0), a.setData({
                        list: i,
                        id: e,
                        page: n + 1,
                        loading: !1,
                        over: t
                    });
                }
            });
        }
    },
    change: function(a) {
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        });
        var t = a.target.id, e = void 0, i = void 0, n = this;
        this.data.list;
        1 == t ? (e = !0, i = !1) : 2 == t && (e = !1, i = !0), getApp().request({
            url: getApp().api.step.ranking,
            data: {
                status: t
            },
            success: function(a) {
                getApp().core.hideLoading();
                var g = a.data.user, o = a.data.list;
                if (o.length > 3) {
                    for (var p = 3; p < o.length; p++) o[p].noun = p + 1;
                    o[0].img = "../image/top1.png", o[1].img = "../image/top2.png", o[2].img = "../image/top3.png";
                } else o.length > 0 && o.length <= 3 && (o[0].img = "../image/top1.png", o.length > 1 && (o[1].img = "../image/top2.png"), 
                o.length > 2 && (o[2].img = "../image/top3.png"));
                n.setData({
                    list: o,
                    id: t,
                    name: g.user.nickname,
                    avatar: g.user.avatar_url,
                    noun: g.raking,
                    money: g.step_currency,
                    friend: e,
                    page: 2,
                    over: !1,
                    country: i
                });
            }
        });
    }
});