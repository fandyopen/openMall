Page({
    data: {
        invite_list: [],
        info: [],
        page: 2,
        loading: !1,
        length: 0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var i = this;
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.invite_detail,
            data: {
                page: 1
            },
            success: function(t) {
                getApp().core.hideLoading();
                var a = t.data.info, e = t.data.invite_list, n = e.length;
                i.setData({
                    info: a,
                    length: n,
                    invite_list: e
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this, i = t.data.over, a = t.data.invite_list;
        if (!i) {
            var e = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.invite_detail,
                data: {
                    page: e
                },
                success: function(n) {
                    for (var o = 0; o < n.data.invite_list.length; o++) a.push(n.data.invite_list[o]);
                    n.data.invite_list.length < 15 && (i = !0), t.setData({
                        page: e + 1,
                        over: i,
                        loading: !1,
                        invite_list: a
                    });
                }
            });
        }
    },
    onShareAppMessage: function() {}
});