var a = getApp(), t = a.api,   un = require("../../../../utils/underscore-min.js");
Page({
    data: {
        master_count: 0,
        passenger_count: 0,
        passenger_cur_count: 0,
        is_passenger: 1,
        is_join: false,

        _loading: true,
        disabled: false, ////加入按钮是否禁用
        curreUidCrea: false, ////////当前用户是否是创建者
        isFull: false, ///////是否满员
        initload: 1,
        is_all: true,
        mzsm: false,//////免责声明默认为0
        showMz: false,
        formNum: 1,
        form_id_array: [],
        loadingstutas: 0, //0代表没有，1代表加载更多，2代表没有更多了
        role: 3
        ///////0当前用户是司机不是创建者
        ////////1当前用户是创建者不是司机
        ////////2当前用户既是司机也是创建者
        ///////3当前用户只是普通乘客
    },
    onUnload: function () {
        var _this = this;

    },
    onLoad: function (t) {

        var _this = this;
        //debugger;
        a.page.onLoad(this, t);
        var r = wx.getStorageSync("USER_INFO");

        // var atype = t.atype ? t.atype:null;
        //a.goLogin(r); //获取个人用户信息

        r && _this.setData({
            user_info: r,
            id: t.id,
            cid: t.cid,
            isYaq: t.isYaq || null,
            form: t.form || null
        });


        _this.getLiveDetail();
        //  _this.getCommentInfo();


    },
    onShow: function () {
        var _this = this;
        ////获取本人的司机信息
        _this.getDriver();
    },

    radioChange: function (e) {
        var _this = this;
        var is_passenger = e.detail.value;
        if (is_passenger == 0 && _this.data.joininfo.isDoDriver == 0) {
            wx.showToast({
                icon: "none",
                title: "已经有司机啦!",
                duration: 2000
            });
        }

        _this.setData({
            is_passenger: is_passenger
        })

    },
      ///邀请好友跳转
    inviteFn: function () {
        var _this = this;
        wx.navigateTo({
            url: '/active/share-active/share-active?id=' + _this.data.id + '&cid=' + _this.data.cid + '&atype=1'
        })

    },
    ///////获取活动详细信息
    getLiveDetail: function () {
        var _this = this;
      _this.showLoading();
        a.request({
            url: t.active.live_detail,
            data: {
                id: _this.data.id
            },
            success: function (t) {
                if (0 == t.code) {
                  _this.hideLoading();
                    var joinlist = t.data.joinList;
                    wx.stopPullDownRefresh();
                    if (t.data.is_out == "2") {

                        wx.showModal({
                            title: "提示",
                            content: "你已经被移除，不能再加入本活动~",
                            showCancel: !1,
                            success: function (res) {

                                if (_this.data.isYaq != 1) {
                                    wx.navigateBack({//返回
                                        delta: 1
                                    })
                                }
                                else {
                                    _this.invGoUrl();
                                }


                            }
                        })
                    }

                    _this.setData({
                        joininfo: t.data,
                        master_count: 0,
                        passenger_count: 0,
                    });
                    ////////处理一系权限
                    _this.handleQx(t.data.joinList);
                    //////////自己是创建者并且没人加入
                    if (joinlist.length == 1 && _this.data.curreUidCrea && t.data.status == "0") {

                        wx.showModal({
                            title: "你是创建者但是还没人加入",
                            content: "你可以选择以下操作哦~",
                            showCancel: 1,
                            confirmText: "留在本页",
                            cancelText: "编辑拼车",
                            success: function (res) {
                                if (res.confirm) {
                                    _this.hideLoading();
                                } else if (res.cancel) {

                                    wx.redirectTo({
                                        url: '/active/active-template/carpool-active/create-active/create-active?id=' + _this.data.id + '&circle_id=' + _this.data.cid + '&type=1'
                                    });
                                }


                            }
                        })

                    }
                    //////////
                    else {
                        ////////////已经结束的拼车活动不能再参加
                        let status = t.data.status;
                        if (status == "1" && !_this.data.curreUidCrea) {
                            wx.showModal({
                                title: "提示",
                                content: "该活动已经结束,请参加其他活动!",
                                showCancel: !1,
                                success: function (t) {

                                    if (_this.data.isYaq != 1) {
                                        wx.navigateBack({//返回
                                            delta: 1
                                        })
                                    }
                                    else {
                                        _this.invGoUrl();
                                    }

                                }
                            })
                        }
                    // debugger;
                        /////////////////判断是否满员
                        if (t.data.isHasDriver == 1 && t.data.seat_number == 0 ) {
                            _this.setData({isFull: true})
                        }

                        setTimeout(function () {
                            _this.hideLoading();
                        }, 500)

                    }
                }
                else {
                    wx.showToast({
                        icon: "none",
                        title: t.msg,
                        duration: 3000
                    });
                }

            },
            fail: function () {
                wx.showToast({
                    icon: "none",
                    title: t.msg,
                    duration: 3000
                });
            },
            complete: function () {

            }
        });
    },

    ///////获取评论数据
    getCommentInfo: function () {

        var _this = this;
        setTimeout(function () {
            _this.setData({
                loadingstutas: 0
            });
        }, 500);
        a.request({
            url: t.active.lists_commentary,
            data: {
                mode: "carpool",
                source: _this.data.id
            },
            success: function (t) {

                if (0 == t.code) {

                    _this.setData({
                        commentInfo: t.data,
                        initload: 0
                    });
                    if (t.data.list == t.data.row_count) {
                        _this.setData({
                            loadingstutas: 2
                        })
                    }
                } else {
                    wx.showToast({
                        icon: "none",
                        title: t.msg,
                        duration: 3000
                    });
                }

            },
            fail: function () {
                wx.showToast({
                    icon: "none",
                    title: t.msg,
                    duration: 3000
                });
            },
            complete: function () {

            }
        });
    },
    ///////////判断当前用户是否是创建者
    handleQx(joinlist) {
        var _this = this;
        for (var i in joinlist) {
            //////判断是否创建者
            if (joinlist[i].is_master == 1) {

                _this.setData({
                    masterInfo: joinlist[i]

                });
                if (joinlist[i].uid == _this.data.user_info.id) {
                    var role = 1;//////只是创建者不是司机
                    if (joinlist[i].is_passenger == 0) {//////既是创建者也是司机
                        role = 2;
                    }

                    _this.setData({
                        curreUidCrea: true,
                        is_join: true,
                        role: role
                    });

                }
            } else {
                ////////判断自己是否已加入
                if (joinlist[i].uid == _this.data.user_info.id) {
                    var role = 3;
                    if (joinlist[i].is_passenger == 0) {
                        role = 0
                    }
                    _this.setData({
                        is_join: true,
                        passenger_cur_count: joinlist[i].count_passenger,
                        role: role
                    });
                }
            }

            /////////////////统计司机和乘客的人数
            _this.countNum(joinlist[i]);
        }


    },
    /////////出来如果是邀请进来的活动不跳转的问题//去发现列表
    invGoUrl:function(){
        var _this = this;
        var url="/active/index/index";
        wx.redirectTo({
            url: url
        });
    },
    //////统计乘客和司机人数
    countNum: function (joinlist) {

        var _this = this;
        if (joinlist.is_passenger == 1) {
            var count_passenger = joinlist.count_passenger == 0 ? 1 : joinlist.count_passenger;
            var passenger_count = parseFloat(_this.data.passenger_count) + parseFloat(1 * count_passenger);
            _this.setData({
                passenger_count: passenger_count
            })

        } else {
            var master_count = 1;

            var passenger_count = parseFloat(_this.data.passenger_count) + parseFloat(joinlist.count_passenger - 1);
            if (joinlist.count_passenger == 0) {
                passenger_count = 0
            }
            _this.setData({
                master_count: master_count,
                // masterInfo: joinlist[i],
                passenger_count: passenger_count
            });


        }
    },
    ///移除
    delMembrn: function (e) {

        var uid = e.currentTarget.dataset.uid;
        var _this = this;
        var data = _this.data.joininfo;
        var itemList = ["移除成员"];
        var syi = a.systemData.systemInfo;

        if (uid == _this.data.user_info.id) {
            itemList = ["退出"];
        }
        var version = syi.version;
        version = version.replace(/\./g, "");
        if (syi.platform == "android" && version > 670) {
            itemList.push("关闭")
        }
        wx.showActionSheet({
            itemList: itemList,
            itemColor: '#990000',
            success(res) {
                if (res.tapIndex == 0) { ///////移除
                    wx.showToast({
                        icon: "loading",
                        duration: 10000
                    });

                    var datapar = {
                        id: data.id
                    };
                    if (uid != _this.data.user_info.id) {
                        datapar.uid = uid;
                    }
                    a.request({
                        url: t.active.live_quit,
                        data: datapar,
                        success: function (t) {

                            if (0 == t.code) {


                                if (_this.data.isYaq != 1) {
                                    _this.changeData();///不是邀请的才去编辑页面同步
                                    wx.navigateBack({//返回
                                        delta: 1
                                    });
                                }
                                else {_this.reFreshPage();}



                            } else {
                                if (_this.data.isYaq != 1) {
                                    _this.changeData();///编辑页面同步
                                    wx.navigateBack({//返回
                                        delta: 1
                                    })
                                }
                                else {_this.reFreshPage();}


                            }
                            wx.hideToast({});

                        },
                        fail: function (e) {

                            wx.showToast({
                                icon: "none",
                                title: t.msg,
                                duration: 3000
                            });
                        },
                        complete: function () {

                        }
                    });

                } else {

                }

            }
        })
    },
    //////////获取司机信息
    getDriver: function (e) {
        var _this = this;
        var par = {};
        a.request({
            url: t.active.driver_getinfo,
            data: par,
            header: {
                //必须设置参数内容类型为json
                'Content-Type': 'application/json'
            },
            success: function (t) {
                if (0 == t.code) {

                    _this.setData({
                        driver_info: t.data
                    });
                } else {
                    wx.showToast({
                        title: t.msg,
                        duration: 2000
                    })
                }

            }

        });
    },
    /////////////拨打电话
    callphoneFn: function (e) {

        var phone = e.currentTarget.dataset.phone;
        var _this = this;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    getFormId: function (e) { ///////处理发送模板消息时获取大量form_id
        var _this = this;

        var formNum = _this.data.formNum;
        var formId = e.detail.formId;
        _this.data.form_id_array.push(formId);
        formNum++;
        _this.setData({formNum: formNum, form_id: _this.data.form_id_array});

        if (formNum == 5) { ///////处理发送模板消息时获取大量form_id
            return true;
        }
        return false;
    },
    //////////加入活动
    joinActive: function (e) {
        var _this = this;
        var seat_number = 10000; //////司机没进来的话就默认10000人
        //
        if (!_this.getFormId(e)) {
            //
            return false;
        }///////处理发送模板消息时获取大量form_id
        //
        if (_this.data.joininfo.isHasDriver == 1) {
            seat_number = parseFloat(_this.data.joininfo.total) + parseFloat(_this.data.joininfo.seat_number);
        }
        var passenger_count = _this.data.passenger_count;
        var master_count = _this.data.master_count;
        if (!_this.data.driver_info || (_this.data.is_passenger == 1 && (_this.data.driver_info.mobile == "" || !_this.data.driver_info.mobile)) || (_this.data.is_passenger == 0 && (_this.data.driver_info.car_number == "" || !_this.data.driver_info.car_number))) {
            wx.showModal({
                title: "",
                content: "个人信息还没完善哦~",
                showCancel: 1,
                confirmText: "返回上页",
                cancelText: "完善信息",
                success: function (res) {
                    if (res.confirm) {

                        wx.navigateBack({//返回
                            delta: 1
                        })
                    } else if (res.cancel) {

                        wx.navigateTo({
                            url: '/active/driver-info/driver-info?is_passenger=' + _this.data.is_passenger
                        })
                    }


                }
            });
            _this.setData({
                formNum: 1,
                form_id: [],
                form_id_array: []
            });
            return false;
        }
        if (!parseFloat(e.detail.value.count)) {
            wx.showToast({
                icon: "none",
                title: "人数请填写整数数值",
                duration: 2000
            });
            _this.setData({
                formNum: 1,
                form_id: [],
                form_id_array: []
            });
            return false;
        }
        if (e.detail.value.count == "") {
            wx.showToast({
                icon: "none",
                title: "请填写大于0的人数",
                duration: 2000
            });
            _this.setData({
                formNum: 1,
                form_id: [],
                form_id_array: []
            });
            return false;
        }

        var c = parseFloat(passenger_count) + parseFloat(master_count) + parseFloat(e.detail.value.count);
        if (seat_number < c) {
            wx.showToast({
                icon: "none",
                title: "人数超出了范围",
                duration: 2000
            });
            _this.setData({
                formNum: 1,
                form_id: [],
                form_id_array: []
            });
            return false;
        }
        if (_this.data.is_passenger == 0 && _this.data.joininfo.isDoDriver == 0) {
            wx.showToast({
                icon: "none",
                title: "已经有司机啦!",
                duration: 2000
            });
            _this.setData({
                formNum: 1,
                form_id: [],
                form_id_array: []
            });
            return false;
        }
        if (_this.data.is_passenger == 0) {

            var carseatnum = _this.data.driver_info.seat;
            var num = parseFloat(_this.data.passenger_count) + parseFloat(e.detail.value.count);
            if (carseatnum < num) {
                wx.showToast({
                    icon: "none",
                    title: "人数超过司机座位!",
                    duration: 2000
                });
                _this.setData({
                    formNum: 1,
                    form_id: [],
                    form_id_array: []
                });
                return false;
            }

        }
        if (!_this.data.mzsm) {
            wx.showToast({
                icon: "none",
                title: "确认已阅读拼车声明",
                duration: 2000
            });
            _this.setData({
                formNum: 1,
                form_id: [],
                form_id_array: []
            });
            return false;
        }

        var par = {};
        par.id = _this.data.joininfo.id; //id
        par.is_passenger = _this.data.is_passenger; //是乘客还是司机：1-乘客，0-司机
        par.count = e.detail.value.count; //一起的人数
        par.mark = e.detail.value.mark; //备注
        par.form_id = _this.data.form_id;//formid
        _this.setData({
            disabled: true
        });
        let tipTxt = "加入成功,请及时联系车主!";

        if (_this.data.is_passenger == 0) {
            tipTxt = "加入成功,请及时联系乘客!";
        }

        a.request({
            url: t.active.live_join + "&access_token=" + _this.data.user_info.access_token,
            data: par,
            method: "POST",
            header: {
                //必须设置参数内容类型为json
                'Content-Type': 'application/json'
            },
            success: function (t) {

                _this.setData({
                    disabled: false,
                    formNum: 1,
                    form_id: [],
                    form_id_array: []
                }); ////加入按钮是否禁用

                if (0 == t.code) {
                    wx.showModal({
                        title: "提示",
                        content: tipTxt,
                        showCancel: !1,
                        success: function (t) {

                             _this.reFreshPage();
                            if (_this.data.isYaq != 1) {
                                _this.changeData();///编辑页面同步
                            }


                        }
                    })


                } else {

                    wx.showToast({
                        icon: "none",
                        title: t.msg,
                        duration: 2000
                    });
                    _this.getLiveDetail();
                }

            },
            fail: function () {
                wx.showToast({
                    icon: "none",
                    title: t.msg,
                    duration: 3000
                });
            },
            complete: function () {

            }
        });
    },
    ///////获取更新后活动详细信息
    getNewLiveDetail: function (callback) {
        var _this = this;
        a.request({
            url: t.active.live_detail,
            data: {
                id: _this.data.id
            },
            success: function (t) {
                if (0 == t.code) {

                    if (typeof callback == "function") {
                        callback(t.data);
                    }

                }

            },
            fail: function () {

            },
            complete: function () {

            }
        });
    },
    /////////////改变同步上个页面的值
    changeData: function () {

        var _this = this;
        const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
        const wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
        let communityList = wxPrevPage.data.communityList;/////
        let id = parseFloat(_this.data.id);
        let curCommunityList = un._.find(communityList, {id: id});
        _this.getNewLiveDetail(function (dataObj) {

            curCommunityList.join = dataObj.joinList.length;
            curCommunityList.type = dataObj.type;
            curCommunityList.seat_number = dataObj.seat_number;
            curCommunityList.isHasDriver = dataObj.isHasDriver;
            curCommunityList.status = dataObj.status;
            curCommunityList.joinList = [];
            for (var i in dataObj.joinList) {
                curCommunityList.joinList.push(dataObj.joinList[i].avatar);
            }
            if (_this.data.form == "record") {
                curCommunityList.title = dataObj.title;
            }
            if (wxPrevPage) {
                wxPrevPage.setData({communityList: communityList});
            }

        });


        //  _this.setData({ communityList: communityList });
    },
    //////免责声明
    radioChange1: function (e) {
        var _this = this;
        let mzsm = _this.data.mzsm;
        if (!mzsm) {
            _this.setData({mzsm: true});
        }
        else {
            _this.setData({mzsm: false});
        }

    },
    //////////查看免责声明
    showSm: function () {
        var _this = this;
        _this.setData({showMz: true})
    },
    ///////关闭免责
    clearSm: function () {
        var _this = this;
        _this.setData({showMz: false})
    },
    onPullDownRefresh: function () {
        var _this = this;
        _this.reFreshPage();
        wx.stopPullDownRefresh();
    },
    reFreshPage: function () {

        var _this = this;
        a.pageOnLoad(this);
        _this.setData({
            master_count: 0,
            passenger_count: 0,
            passenger_cur_count: 0,
            is_passenger: 1,
            is_join: false,

            disabled: false, ////加入按钮是否禁用
            curreUidCrea: false, ////////当前用户是否是创建者
            isFull: false, ///////是否满员
            is_all: true
        });
        // _this.showLoading();
        _this.getLiveDetail();
        // _this.getCommentInfo();

    }

});