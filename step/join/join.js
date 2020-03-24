Page({
    data: {
        name: 0,
        open_date: "",
        step_num: 0,
        bail_currency: 0,
        join: !1
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var t = this, a = void 0;
        null == e.id ? getApp().core.reLaunch({
            url: "../index/index"
        }) : a = e.id, getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.activity_detail,
            data: {
                activity_id: a
            },
            success: function(e) {
                getApp().core.hideLoading();
                var i = e.data.list.open_date.replace(".", "/").replace(".", "/");
                t.setData({
                    id: a,
                    name: e.data.list.name,
                    open_date: i,
                    step_num: e.data.list.step_num,
                    bail_currency: e.data.list.bail_currency
                });
            }
        });
    },
    onShareAppMessage: function(e) {
        return getApp().page.onShareAppMessage(this), {
            path: "/step/dare/dare?user_id=" + getApp().getUser().id,
            title: this.data.title ? this.data.title : "步数挑战"
        };
    },
    apply: function() {
        var e = this;
        getApp().request({
            url: getApp().api.step.activity_join,
            data: {
                activity_id: e.data.id
            },
            success: function(t) {
                var a = e.data.open_date.slice(5);
                0 == t.code ? getApp().core.redirectTo({
                    url: "../dare/dare?open_date=" + a + "&join=true"
                }) : "活力币不足" == t.msg && e.data.store.option.step.currency_name ? getApp().core.showModal({
                    content: e.data.store.option.step.currency_name + "不足",
                    showCancel: !1
                }) : getApp().core.showModal({
                    content: t.msg,
                    showCancel: !1
                });
            }
        });
    }
});