var a = getApp(), t = a.api,   un = require("../../../../utils/underscore-min.js"),
    utils = require("../../../../utils/utils.js");
var dateTimePicker = require("../../../../utils/datetimepicker.js");
Page({
    data: {
        is_often: 0,
        is_ds: false,
        earliest_time: "",
        latest_time: "",
        date: '2018-10-01',
        time: '12:00',
        dateTimeArray2: null,
        dateTime2: null,
        dateTimeArray1: null,
        dateTime1: null,
        startYear: 2000,
        endYear: 2050,
        ischange: false,
        is_passenger: 0,
        isCanSelSj: false,
        mzsm: false,//////免责声明默认为0
        showMz: false,
        formNum:1,
        form_id_array:[],
        disabled: false////加入按钮是否禁用
    },
    onReady: function () {

    },
    onUnload: function () {
        var _this = this;

    },
    onLoad: function (t) {

        var _this = this;
        a.page.onLoad(this, t);
        _this.setData({
            stype: t.type,
            circleId: t.circle_id,
            form:t.form||null
        });
        var r = wx.getStorageSync("USER_INFO");
       // a.goLogin(r); //获取个人用户信息
        r && _this.setData({
            user_info: r
        });
        _this.getQuickRouteData();
        // 获取完整的年月日 时分秒，以及默认显示的数组
        //var obj2 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        // 精确到分的处理，将数组的秒去掉
        var lastArray = obj1.dateTimeArray.pop();
        var lastTime = obj1.dateTime.pop();
        this.setData({
            dateTime2: obj1.dateTime,
            dateTimeArray2: obj1.dateTimeArray,
            dateTimeArray1: obj1.dateTimeArray,
            dateTime1: obj1.dateTime
        });


        if (t.id) {
            _this.setData({
                id: t.id
            });
            _this.getLiveDetail();
        }
    },
    changeDateTime1(e) { ////选择时间-点击确定

        var typea = e.target.dataset.type;
        if (typea == "start") {
            var arr = this.data.dateTime1,
                dateArr = this.data.dateTimeArray1;
            this.setData({
                dateTime1: e.detail.value
            });
            if (!this.data.ischange) {
                arr[e.detail.column] = e.detail.value;
                dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
                var earliest_time = dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] + "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":" + dateArr[4][arr[4]];
                this.setData({
                    dateTimeArray1: dateArr,
                    dateTime1: arr,
                    earliest_time: earliest_time
                });
            }
        } else {
            var arr = this.data.dateTime2,
                dateArr = this.data.dateTimeArray2;
            this.setData({
                dateTime2: e.detail.value
            });
            if (!this.data.ischange) {
                arr[e.detail.column] = e.detail.value;
                dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
                var latest_time = dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] + "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":" + dateArr[4][arr[4]];
                this.setData({
                    dateTimeArray2: dateArr,
                    dateTime2: arr,
                    latest_time: latest_time
                });
            }
        }

    },
    changeDateTimeColumn1(e) { ////选择时间
        this.setData({
            ischange: true
        }); //判断是否改变过时间
        var typea = e.target.dataset.type;
        if (typea == "start") {
            var arr = this.data.dateTime1,
                dateArr = this.data.dateTimeArray1;
            arr[e.detail.column] = e.detail.value;
            dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
            var earliest_time = dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] + "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":" + dateArr[4][arr[4]];
            this.setData({
                dateTimeArray1: dateArr,
                dateTime1: arr,
                earliest_time: earliest_time
            });
        } else {
            var arr = this.data.dateTime2,
                dateArr = this.data.dateTimeArray2;
            arr[e.detail.column] = e.detail.value;
            dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
            var latest_time = dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] + "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":" + dateArr[4][arr[4]];
            this.setData({
                dateTimeArray2: dateArr,
                dateTime2: arr,
                latest_time: latest_time
            });


        }
    },
    //////设为常用路线
    switch1Change: function (e) {
        var _this = this;
        _this.setData({
            is_often: e.detail.value
        })
    },
    //////是否打赏
    switch2Change: function (e) {

        var _this = this;

        _this.setData({
            is_ds: e.detail.value
        })
    },
///邀请好友跳转
    inviteFn: function () {
        var _this = this;
        wx.navigateTo({
          url: '/active/share-active/share-active?id=' + _this.data.id + '&cid=' + _this.data.circleId + '&atype=1'
        })

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

            curCommunityList.start_place = dataObj.start_place;
            curCommunityList.end_place = dataObj.end_place;
             curCommunityList.seat_number = dataObj.seat_number;
            curCommunityList.distance = dataObj.distance;
          curCommunityList.isHasDriver = dataObj.isHasDriver;
          curCommunityList.type = dataObj.type;
           curCommunityList.mark = dataObj.joinList[0].mark;///////第一个永远都是创建者
            curCommunityList.status = dataObj.status;
            curCommunityList.time = dataObj.time;
          curCommunityList.join = dataObj.joinList.length;
          curCommunityList.joinList = [];
          for (var i in dataObj.joinList) {
            curCommunityList.joinList.push(dataObj.joinList[i].avatar);
          }
            if(_this.data.form=="record"){
                curCommunityList.title=dataObj.title;
            }
            if (wxPrevPage) {
                wxPrevPage.setData({communityList: communityList});
            }

        });




        //  _this.setData({ communityList: communityList });
    },
    //////免责声明
    radioChange: function (e) {
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
        wx.stopPullDownRefresh();
    },
    onReady: function () {

    },
    onShow: function () {
        var _this = this;
        _this.getDriver(); //////获取司机信息
    },
    onHide: function () {

    },
    onUnload: function () {

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
    ///////获取活动详细信息
    getLiveDetail: function () {
        var _this = this;
        wx.showToast({
            icon: "loading",
            duration: 5000,
            mask: true
        });

        a.request({
            url: t.active.live_detail,
            data: {
                id: _this.data.id
            },
            success: function (t) {

                if (0 == t.code) {
                    var joinlist = t.data.joinList;
                    wx.hideToast();
                    if (t.data.status == 1 || joinlist.length > 1 || (joinlist.length > 1 && t.data.seat_number == 0 && t.data.isHasDriver == 1)) { ///////如果有人加入了或者满员了都要跳转
                        let val = "";
                        if (joinlist.length > 1) {
                            val = "已有成员加入不能编辑!";
                        }
                        if (t.data.status == 1) {
                            val = "过期的活动不能编辑";
                        }
                        wx.showModal({
                            title: val,
                            content: "你可以选择以下操作哦~",
                            showCancel: 1,
                            confirmText: "返回上页",
                            cancelText: "查看拼车",
                            success: function (res) {
                                if (res.confirm) {

                                    wx.navigateBack({//返回
                                        delta: 1
                                    })
                                } else if (res.cancel) {

                                    wx.redirectTo({
                                        url: '/active/active-template/carpool-active/join-active/join-active?cid=' + _this.data.circleId + '&id=' + _this.data.id
                                    })
                                }


                            }
                        })


                    }
                    else {

                        var startAddressInfoN = {};
                        var endAddressInfoN = {};
                        startAddressInfoN.latitude = t.data.start.lat;
                        startAddressInfoN.longitude = t.data.start.lng;
                        startAddressInfoN.name = t.data.start_place;
                        endAddressInfoN.latitude = t.data.end.lat;
                        endAddressInfoN.longitude = t.data.end.lng;
                        endAddressInfoN.name = t.data.end_place;
                        _this.setData({
                            joininfo: t.data,
                            earliest_time: t.data.earliest_time,
                            latest_time: t.data.latest_time,
                            startAddressInfo: startAddressInfoN,
                            endAddressInfo: endAddressInfoN
                        });

                        //////是否打开打赏

                        if (t.data.price && t.data.price != 0.00) {
                            _this.setData({is_ds: true});
                        }

                        ////////判断是否是创建者
                        for (var i in joinlist) {
                            //////判断是否创建者
                            if (joinlist[i].is_master == 1) {
                                _this.setData({
                                    masterInfo: joinlist[i],
                                    is_passenger: joinlist[i].is_passenger
                                });

                            }
                        }
                        //////如果有人加入了都要跳转

                        setTimeout(function () {
                            wx.hideToast({});
                        }, 500)
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
    /////////返回刷新
    returnRefresh() {
        var _this = this;

        wx.navigateBack({
            delta: 1
        })
    },
    getStartAddress: function () { //////获取起点位置信息
        var _this = this;
        //1、获取当前位置坐标

        wx.getLocation({
            // type: 'gjc02',
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                wx.chooseLocation({
                    success: function (res) {

                        _this.setData({
                            startAddressInfo: res,
                        })
                        // wx.showLoading({
                        //   title: res.name,
                        //   mask: !0
                        // });


                    }
                })
            },
            fail: function () {
                wx.navigateTo({
                    url: '/active/authorization/authorization'
                })
            }
        })
    },
    getEndAddress: function () { ///////获取终点位置信息
        var _this = this;
        //1、获取当前位置坐标
        wx.getLocation({
            // type: 'gjc02',
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                wx.chooseLocation({
                    success: function (res) {
                        _this.setData({
                            endAddressInfo: res
                        })


                    },
                    fail: function () {
                        wx.navigateTo({
                            url: '/active/authorization/authorization'
                        })
                    }
                })
            }
        })
    },

    getFormId:function(e){ ///////处理发送模板消息时获取大量form_id
        var _this = this;
        var formNum=_this.data.formNum;
        var formId =e.detail.formId;
        _this.data.form_id_array.push(formId);
        formNum++;
        _this.setData({formNum:formNum,form_id:_this.data.form_id_array});


        if(formNum==5){ ///////处理发送模板消息时获取大量form_id

            return true;
        }
        return false;
    },
    //////////创建活动
    creatActive: function (e) {

        var _this = this;
        if (!_this.getFormId(e)) {
            return false
        }///////处理发送模板消息时获取大量form_id
        var url = t.active.circle_publish + "&access_token=" + _this.data.user_info.access_token;
        var sai = _this.data.startAddressInfo;
        var eai = _this.data.endAddressInfo;
        var is_ds = _this.data.is_ds;
        if (!_this.checkFn(e)) {
          _this.setData({
            formNum: 1,
            form_id: [],
            form_id_array: []
          });
            return false;
            
        }

        var par = {};
        par.type = _this.data.stype; //活动类型

        var start = {
            place: sai.name,
            lat: sai.latitude,
            lng: sai.longitude
        }; //起点地址信息
        var end = {
            place: eai.name,
            lat: eai.latitude,
            lng: eai.longitude
        }; //终点地址信息
        par.circleId = _this.data.circleId;
        par.start = start;
        par.end = end;
        par.earliest_time = _this.data.earliest_time; //最早时间
        par.latest_time = _this.data.latest_time; //最晚时候
        par.is_passenger = _this.data.is_passenger; //是乘客还是司机：1-乘客，0-司机

        if (!_this.data.driver_info || (_this.data.is_passenger == 0 && _this.data.driver_info.car_number == "")) {
            wx.showToast({
                icon: "none",
                title: "请先完善个人信息",
                duration: 2000
            });
          _this.setData({
            formNum: 1,
            form_id: [],
            form_id_array: []
          });
            return false;
        }
        par.number = e.detail.value.number; //一起的人数
        if (is_ds) {
            par.price = e.detail.value.price;
        } //参考价
        par.mark = e.detail.value.mark; //备注
        par.form_id = _this.data.form_id;//formid
        par.is_often = _this.data.is_often ? "1" : "0"; ///是否设置为常用路线
        wx.showLoading({
            title: "加载中",
            mask: !0
        });
        _this.setData({disabled: true});
        a.request({
            url: url,
            data: par,
            header: {
                //必须设置参数内容类型为json 
                'Content-Type': 'application/json'
            },
            method: "POST",
            success: function (t) {

                if (0 == t.code) {
                    wx.hideLoading();
                    wx.showModal({
                        title: "提示",
                        content: "发布成功",
                        showCancel: !1,
                        success: function (t) {

                            _this.setData({
                                formNum:1,
                                form_id:[],
                              form_id_array:[]
                            });

                            t.confirm && wx.redirectTo({//返回
                            url: '/active/community-detail/community-detail?cid=' + _this.data.circleId
                            })

                        }
                    }), 1 == t.code && wx.showLoading({
                        title: t.msg,
                        mask: !0,
                        duration: 2000
                    });


                } else {

                }
                _this.setData({disabled: false})
            },
            fail: function () {

            },
            complete: function (e) {

                wx.hideLoading();
            }
        });
    },

    //////////编辑活动
    editActive: function (e) {
        var _this = this;
        if (!_this.getFormId(e)) {
            return false
        }///////处理发送模板消息时获取大量form_id
        var sai = _this.data.startAddressInfo;
        var eai = _this.data.endAddressInfo;
        var is_ds = _this.data.is_ds;
        var url = t.active.edit_carpool + "&access_token=" + _this.data.user_info.access_token;
        if (!_this.checkFn(e)) {
          _this.setData({
            formNum: 1,
            form_id: [],
            form_id_array: []
          });
            return false;
        }
        var par = {};
        par.id = _this.data.joininfo.id;
        par.type = _this.data.stype; //活动类型
        var start = {
            place: sai.name,
            lat: sai.latitude,
            lng: sai.longitude
        }; //起点地址信息
        var end = {
            place: eai.name,
            lat: eai.latitude,
            lng: eai.longitude
        }; //终点地址信息
        par.start = start;
        par.end = end;
        par.earliest_time = _this.data.earliest_time; //最早时间
        par.latest_time = _this.data.latest_time; //最晚时候
        par.is_passenger = _this.data.is_passenger; //是乘客还是司机：1-乘客，0-司机
        par.number = e.detail.value.number; //一起的人数

        if (is_ds) {
            par.price = parseInt(e.detail.value.price);
        } //参考价
        par.mark = e.detail.value.mark; //备注
        par.form_id = _this.data.form_id;//formid
        par.is_often = _this.data.is_often ? "1" : "0"; ///是否设置为常用路线

        wx.showLoading({
            title: "加载中",
            mask: !0
        });

        _this.setData({disabled: true});
        a.request({
            url: url,
            data: par,
            header: {
                //必须设置参数内容类型为json 
                'Content-Type': 'application/json'
            },
            method: "POST",
            success: function (t) {

                if (0 == t.code) {
                    wx.hideLoading();

                    wx.showModal({
                        title: "提示",
                        content: "保存成功,返回上页~",
                        success: function (res) {
                            _this.setData({
                                formNum:1,
                                form_id:[]
                            });
                            _this.changeData();///编辑页面同步
                            wx.navigateBack({//返回
                                delta: 1
                            })

                        }
                    })


                } else {
                    wx.showToast({
                        icon: "none",
                        title: t.msg,
                        duration: 2000
                    });
                }
                _this.setData({disabled: false})
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },

    //////////////检查验证
    checkFn: function (e) {
        var _this = this;
        var sai = _this.data.startAddressInfo;
        var eai = _this.data.endAddressInfo;
        var is_ds = _this.data.is_ds;

        if (!_this.data.driver_info.car_number && _this.data.is_passenger == 0) {
            wx.showToast({
                icon: "none",
                title: "请先完善司机信息",
                duration: 2000
            });
            return false;
        }
        if (!sai) {
            wx.showToast({
                icon: "none",
                title: "请选择起点",
                duration: 2000
            });
            return false;
        }
        if (!eai) {
            wx.showToast({
                icon: "none",
                title: "请选择终点",
                duration: 2000
            });
            return false;
        }
        if (_this.data.earliest_time == "") {
            wx.showToast({
                icon: "none",
                title: "请选择最早出发时间",
                duration: 2000
            });
            return false;
        }
        if (_this.data.latest_time == "") {
            wx.showToast({
                icon: "none",
                title: "请选择出发时间",
                duration: 2000
            });
            return false;
        }


        if (!_this.checkNumInt(e.detail.value.number)) {
            wx.showToast({
                icon: "none",
                title: "请填写大于0的人数",
                duration: 2000
            });
            return false;
        }

        if (!_this.checkNumInt(parseInt(e.detail.value.price)) && is_ds && _this.data.is_passenger == 0) {
            wx.showToast({
                icon: "none",
                title: "请填写整数的参考价格",
                duration: 2000
            });
            return false;
        }

        if (!_this.data.mzsm) {
            wx.showToast({
                icon: "none",
                title: "确认已阅读拼车声明",
                duration: 2000
            });
            return false;
        }
        return true;
    },

    ///////选择类型
    selectDriver: function (e) {

        var _this = this;
        var is_passenger = e.currentTarget.dataset.is_passenger;
        _this.setData({
            is_passenger: is_passenger
        })
    },

    ///////选择快捷路线
    setQuickRoute: function (index) {
        var _this = this;
        var curentData = _this.data.listArry[index];
        var startAddressInfo = {};
        var endAddressInfo = {};
        //debugger;
        // let { latitude,longitude,longitude } = curentData.start;
        startAddressInfo.latitude = curentData.start.lat;
        startAddressInfo.longitude = curentData.start.lng;
        startAddressInfo.name = curentData.start.place;
        endAddressInfo.latitude = curentData.end.lat;
        endAddressInfo.longitude = curentData.end.lng;
        endAddressInfo.name = curentData.end.place;
        _this.setData({
            startAddressInfo: startAddressInfo,
            endAddressInfo: endAddressInfo

        });

    },
    getQuickRouteData: function () {
        var _this = this;
        a.request({
            url: t.active.get_often,
            data: {},
            success: function (t) {
                if (0 == t.code) {
                    var listArry = [];
                    var itemListObj = {};
                    var itemListArry = ["还没有常用路线"];
                    if (t.data.length > 0) {
                        itemListArry = [];
                        for (var i in t.data) {
                            var itemListObj = t.data[i];
                            listArry.push(itemListObj);
                            var str = t.data[i].start.place;
                            itemListArry.push(str)
                        }

                        _this.setData({
                            listArry: listArry,
                            tData: t,
                            itemListArry: itemListArry
                        });
                        ////////默认第一条路线显示
                        _this.setQuickRoute(0)
                    }


                } else {

                }

            },
            fail: function () {

            },
            complete: function (ee) {

            }
        });
    },
    ///////获取快捷路线
    getQuickRoute: function () {
        var _this = this;
        var syi = a.systemData.systemInfo;
        var t = _this.data.tData;
        var itemListArry = _this.data.itemListArry;

        var version = syi.version;
        version = version.replace(/\./g, "");
        let iscontains = un._.contains(itemListArry, "关闭");
        if (syi.platform == "android" && version > 670 && !iscontains) {
            itemListArry.unshift("关闭")
        }

        wx.showActionSheet({
            itemList: itemListArry,
            itemColor: '#333',
            success(res) {

                console.log(res.tapIndex);
                if (syi.platform == "android" && version > 670) {
                    if (t.data.length > 0) {
                        if (res.tapIndex == 0) {
                        } else {
                            _this.setQuickRoute(res.tapIndex - 1);
                        }

                    }
                } else {
                    if (t.data.length > 0) {
                        _this.setQuickRoute(res.tapIndex);
                    }
                }
                // if (t.data.lenght > 0) {_this.setQuickRoute(res.tapIndex); }


            }
        })
        // } else {

        // }

        //   },
        //   fail: function() {

        //   },
        //   complete: function(ee) {

        //   }
        // });
    },
    /////////切换地址
    changeAddress: function () {

        var _this = this;
        var sai = _this.data.startAddressInfo;
        var eai = _this.data.endAddressInfo;
        if (!sai) {
            return false;
        }
        if (!eai) {
            return false;
        }
        _this.setData({
            startAddressInfo: eai,
            endAddressInfo: sai
        })

    },
    //////判断是否为正整数
    checkNumInt: function (num) {

        if (!(/(^[1-9]\d*$)/.test(num))) {　　　　　　 //alert("输入的不是正整数);

            return false;
        } else {
            return true;　　　　　 //　alert(‘输入的是正整数’);

        }
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
                    // debugger
                    var aaa = _this.data.is_passenger;
                    //if (t.data.car_number!="") {
                    _this.setData({
                        driver_info: t.data
                    });
                    // }


                } else {
                    wx.showToast({
                        title: t.msg,
                        duration: 2000
                    })
                }

            },
            fail: function () {

            },
            complete: function () {

            }
        });
    }

});