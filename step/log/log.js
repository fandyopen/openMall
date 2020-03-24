var t = require("../../utils/helper.js");

getApp().helper;

Page({
    data: {
        currency: 0,
        bout_ratio: 0,
        total_bout: 0,
        bout: 0,
        page: 2,
        list: [ {
            name: ""
        }, {
            step_num: 0
        }, {
            user_currency: 0
        }, {
            user_num: 0
        }, {
            status: 0
        } ]
    },
    onReachBottom: function() {
        var t = this, a = t.data.over;
        if (!a) {
            var e = this.data.list, o = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.activity_log,
                data: {
                    page: o
                },
                success: function(i) {
                    for (var r = 0; r < i.data.list.length; r++) e.push(i.data.list[r]);
                    i.data.list.length < 10 && (a = !0), t.setData({
                        list: e,
                        page: o + 1,
                        loading: !1,
                        over: a
                    });
                }
            });
        }
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a);
        var e = this, o = t.formatTime(new Date()), i = o[0] + o[1] + o[2] + o[3] + o[5] + o[6] + o[8] + o[9];
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.activity_log,
            success: function(t) {
                getApp().core.hideLoading();
                var a = t.data.info, o = 0;
                a.currency > 0 && (o = a.currency);
                for (var r = t.data.list, s = 0; s < r.length; s++) void 0 != r[s].open_date && (r[s].date = r[s].open_date.replace("-", "").replace("-", ""));
                e.setData({
                    currency: o,
                    bout_ratio: a.bout_ratio,
                    total_bout: a.total_bout,
                    bout: a.bout,
                    time: i,
                    list: r
                });
            }
        });
    }
});