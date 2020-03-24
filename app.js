var platform = null;

"undefined" != typeof wx && (platform = "wx"), "undefined" != typeof my && (platform = "my");

var modules = [ {
    name: "helper",
    file: "./utils/helper.js"
}, {
    name: "const",
    file: "./core/const.js"
}, {
    name: "getConfig",
    file: "./core/config.js"
}, {
    name: "page",
    file: "./core/page.js"
}, {
    name: "request",
    file: "./core/request.js"
}, {
    name: "core",
    file: "./core/core.js"
}, {
    name: "api",
    file: "./core/api.js"
}, {
    name: "getUser",
    file: "./core/getUser.js"
}, {
    name: "setUser",
    file: "./core/setUser.js"
}, {
    name: "login",
    file: "./core/login.js"
}, {
    name: "trigger",
    file: "./core/trigger.js"
}, {
    name: "uploader",
    file: "./utils/uploader.js"
}, {
    name: "orderPay",
    file: "./core/order-pay.js"
} ], args = {
    _version: "2.8.9",
    platform: platform,
    query: null,
    onLaunch: function() {

        ///////
        let res = wx.getSystemInfoSync(),
            SDKVersion = res.SDKVersion,
            version = res.version;
        SDKVersion = SDKVersion.replace(/\./g, "");
        version = version.replace(/\./g, "");
        if (parseInt(SDKVersion) >= 199 && version >= 661) {// 大于1.99版本才有效
            this.getUpdataVerSion();
        }
        this.getStoreData();

    },
    onShow: function(e) {
        e.scene && (this.onShowData = e), e && e.query && (this.query = e.query), this.getUser() && this.trigger.run(this.trigger.events.login);
    },
    is_login: !1,
    login_complete: !1,
    is_form_id_request: !0
};

for (var i in modules) args[modules[i].name] = require("" + modules[i].file);

var _web_root = args.api.index.substr(0, args.api.index.indexOf("/index.php"));

args.webRoot = _web_root, args.getauth = function(t) {
    var s = this;
    if ("my" == s.platform) {
        if (t.success) {
            var e = {
                authSetting: {}
            };
            e.authSetting[t.author] = !0, t.success(e);
        }
    } else s.core.getSetting({
        success: function(e) {
            console.log(e), void 0 === e.authSetting[t.author] ? s.core.authorize({
                scope: t.author,
                success: function(e) {
                    t.success && (e.authSetting = {}, e.authSetting[t.author] = !0, t.success(e));
                }
            }) : 0 == e.authSetting[t.author] ? s.core.showModal({
                title: "是否打开设置页面重新授权",
                content: t.content,
                confirmText: "去设置",
                success: function(e) {
                    e.confirm ? s.core.openSetting({
                        success: function(e) {
                            t.success && t.success(e);
                        },
                        fail: function(e) {
                            t.fail && t.fail(e);
                        },
                        complete: function(e) {
                            t.complete && t.complete(e);
                        }
                    }) : t.cancel && s.getauth(t);
                }
            }) : t.success && t.success(e);
        }
    });
},
    args.getStoreData = function() {
    var s = this, e = this.api, o = this.core;
    s.request({
        url: e.default.store,
        success: function(t) {
            0 == t.code && (o.setStorageSync(s.const.STORE, t.data.store), o.setStorageSync(s.const.STORE_NAME, t.data.store_name), 
            o.setStorageSync(s.const.SHOW_CUSTOMER_SERVICE, t.data.show_customer_service), o.setStorageSync(s.const.CONTACT_TEL, t.data.contact_tel), 
            o.setStorageSync(s.const.SHARE_SETTING, t.data.share_setting), s.permission_list = t.data.permission_list, 
            o.setStorageSync(s.const.WXAPP_IMG, t.data.wxapp_img), o.setStorageSync(s.const.WX_BAR_TITLE, t.data.wx_bar_title), 
            o.setStorageSync(s.const.ALIPAY_MP_CONFIG, t.data.alipay_mp_config), o.setStorageSync(s.const.STORE_CONFIG, t.data), 
            setTimeout(function(e) {
                s.config = t.data, s.configReadyCall && s.configReadyCall(t.data);
            }, 1e3));
        },
        complete: function() {}
    });
},    /**
 * 版本更新
 */
 args.getUpdataVerSion = function(callback) {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        // console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(function () {
        wx.showModal({
            title: '更新提示',
            content: '有新版本的更新哦，是否重启应用？',
            success: function (res) {

                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                }
            }
        })

    });
    updateManager.onUpdateFailed(function () {

        // 新的版本下载失败
    });
},
    //获取群信息  保存加密信息
    args.getShareInfo= function (e) {

    var that = this;
//////分享活动时要传join【自动加入】0 自动加入， 1 不加入
    if (e.shareTicket) {
        wx.getShareInfo({
            shareTicket: e.shareTicket,
            success: function (res) {

                let vi=encodeURIComponent(res.iv);
                var par = {
                    encryptedData: res.encryptedData,
                    iv: vi,
                    cid: e.query.cid,
                    invite: e.query.invite,
                    from: e.query.from,
                    join:1,
                    type: e.query.type
                };

                if (e.query.id) { par.liveID = e.query.id }
                if (e.query.atype) { par.join=0;}
                that.saveQinfo(par);
            },
            fail: function (res) {

            }
        });
    }
    else{
        var par = {
            cid: e.query.cid,
            invite: e.query.invite,
            form: e.query.from,
            join: 1
        };
        if (e.query.id) { par.liveID = e.query.id }
        if (e.query.atype) { par.join = 0; }
        that.saveQinfo(par);
    }

},
////////////保存群信息
    args.saveQinfo=function (par){
    var _this=this;
    var r = wx.getStorageSync("USER_INFO");

    wx.request({
        url: t.active.share + "&access_token=" + r.access_token,//向后端发起解密请求的URL
        data: par,
        success: function (re) {
            console.log(re);


        }
    })
},
// 表单手机号
    args.checkPhone=function(e) {

    var phone = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        // if (phone.length >= 11) {
        wx.showToast({
            title: '手机号有误',
            icon: 'none',
            duration: 2000
        });
        return false;
        //}
    } else {
        return true;
    }
}
;

var app = App(args);