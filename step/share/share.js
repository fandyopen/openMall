Page({
    data: {
        img: [],
        todayStep: 0,
        pic_list: "",
        save: !0,
        page: 1,
        left: !1,
        right: !0,
        get: !1
    },
    tagChoose: function(t) {
        var e = this, o = t.currentTarget.dataset.id, a = e.data.num;
        e.setData({
            currentItem: o
        }), getApp().core.showLoading({
            title: "分享图片生成中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.qrcode,
            data: {
                goods_id: o,
                num: a
            },
            success: function(t) {
                console.log(t), 0 == t.code ? e.setData({
                    img: t.data.pic_url
                }) : getApp().core.showModal({
                    content: t.msg,
                    showCancel: !1
                }), setTimeout(function() {
                    getApp().core.hideLoading();
                }, 1e3);
            },
            fail: function(t) {
                getApp().core.showModal({
                    content: t.msg,
                    showCancel: !1
                });
            }
        });
    },
    screen: function() {
        var t = this.data.img;
        getApp().core.previewImage({
            urls: [ t ]
        });
    },
    saveImage: function() {
        var t = this;
        getApp().core.authorize({
            scope: "scope.writePhotosAlbum",
            success: function(e) {
                "authorize:ok" == e.errMsg && getApp().core.getImageInfo({
                    src: t.data.img,
                    success: function(t) {
                        getApp().core.saveImageToPhotosAlbum({
                            filePath: t.path,
                            success: function(t) {
                                getApp().core.showToast({
                                    title: "保存成功，快去发朋友圈吧！",
                                    icon: "success",
                                    duration: 2e3
                                });
                            },
                            fail: function(t) {
                                getApp().core.showModal({
                                    content: "授权失败",
                                    showCancel: !1
                                });
                            }
                        });
                    }
                });
            },
            fail: function(e) {
                getApp().core.showModal({
                    content: "为确保您的正常使用，请点击下方按钮授权",
                    showCancel: !1
                }), t.setData({
                    save: !1,
                    get: !0
                });
            }
        });
    },
    openSetting: function() {
        var t = this;
        wx.openSetting({
            success: function(e) {
                1 == e.authSetting["scope.writePhotosAlbum"] && t.setData({
                    save: !0,
                    get: !1
                });
            },
            fail: function(t) {
                getApp().core.showModal({
                    content: "为确保您的正常使用，请点击下方按钮授权",
                    showCancel: !1
                });
            }
        });
    },
    chooseImg: function(t) {
        var e = this, o = this.data.page, a = !0, s = !0, i = t.currentTarget.dataset.id;
        1 == i ? o-- : 2 == i && o++, getApp().request({
            url: getApp().api.step.pic_list,
            data: {
                page: o
            },
            success: function(t) {
                var i = t.data.pic_list;
                0 == i.length ? (getApp().core.showToast({
                    title: "没有更多了",
                    icon: "none",
                    duration: 1e3
                }), s = !1, e.setData({
                    right: s
                })) : (1 == o && (a = !1), i.length < 4 && (s = !1), e.setData({
                    page: o,
                    pic_list: i,
                    left: a,
                    right: s
                }));
            }
        });
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this, o = 0;
        t.todayStep && (o = t.todayStep), e.setData({
            num: o
        });
        getApp().core.showLoading({
            title: "分享图片生成中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.pic_list,
            data: {
                page: 1
            },
            success: function(t) {
                var a = t.data.pic_list, s = !0;
                a[0].pic_url.length > 0 ? (a.length < 4 && (s = !1), e.setData({
                    pic_list: a,
                    currentItem: a[0].id,
                    right: s
                }), getApp().request({
                    url: getApp().api.step.qrcode,
                    data: {
                        goods_id: a[0].id,
                        num: o
                    },
                    success: function(t) {
                        setTimeout(function() {
                            0 == t.code ? e.setData({
                                img: t.data.pic_url
                            }) : getApp().core.showModal({
                                content: t.msg,
                                showCancel: !1
                            }), getApp().core.hideLoading();
                        }, 1e3);
                    }
                })) : (getApp().core.hideLoading(), getApp().core.showToast({
                    title: "暂无海报模板",
                    icon: "none",
                    duration: 1e3
                }), setTimeout(function() {
                    getApp().core.navigateTo({
                        url: "../index/index"
                    });
                }, 1e3));
            }
        });
    }
});