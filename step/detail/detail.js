Page({
    data: {
        number: 0,
        _num: 1,
        page: 2,
        list: [],
        over: !1
    },
    tab: function(t) {
        var a = this, e = t.target.dataset.num;
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.log,
            data: {
                status: e
            },
            success: function(t) {
                getApp().core.hideLoading();
                var s = t.data.log;
                a.setData({
                    number: t.data.user.step_currency,
                    list: s,
                    _num: e,
                    page: 2
                });
            }
        });
    },
    onReachBottom: function() {
        var t = this, a = t.data.over;
        if (!a) {
            this.data.id;
            var e = this.data.list, s = this.data._num, p = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.log,
                data: {
                    status: s,
                    page: p
                },
                success: function(s) {
                    for (var o = 0; o < s.data.log.length; o++) e.push(s.data.log[o]);
                    s.data.log.length < 6 && (a = !0), t.setData({
                        list: e,
                        page: p + 1,
                        loading: !1,
                        over: a
                    });
                }
            });
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var a = this;
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.log,
            data: {
                status: 1,
                page: 1
            },
            success: function(t) {
                getApp().core.hideLoading();
                var e = t.data.log;
                a.setData({
                    number: t.data.user.step_currency,
                    list: e
                });
            }
        });
    }
});