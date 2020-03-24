var t = {
    page: null,
    time_list: {
        hour: "00",
        minute: "00",
        second: "00"
    },
    init: function(t) {
        var e = this;
        this.page = t, t.setData({
            time_list: e.time_list,
            intval: []
        }), t.setTimeOver = function() {
            var t = e.page, i = setInterval(function() {
                if (t.data.reset_time <= 0) clearInterval(i); else {
                    var e = t.data.reset_time - 1, s = t.setTimeList(e);
                    t.setData({
                        reset_time: e,
                        time_list: s
                    });
                }
            }, 1e3);
        };
    }
};

module.exports = t;