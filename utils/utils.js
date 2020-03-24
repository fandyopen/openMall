function formatTime(t) {
    var r = t.getFullYear(), e = t.getMonth() + 1, a = t.getDate(), o = t.getHours(), n = t.getMinutes(), m = t.getSeconds();
    return [ r, e, a ].map(formatNumber).join("/") + " " + [ o, n, m ].map(formatNumber).join(":");
}

function formatData(t) {
    var r = t.getFullYear(), e = t.getMonth() + 1, a = t.getDate();
    t.getHours(), t.getMinutes(), t.getSeconds();
    return [ r, e, a ].map(formatNumber).join("-");
}

function formatNumber(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

function objectToUrlParams(t) {
    var r = "";
    for (var e in t) r += "&" + e + "=" + t[e];
    return r.substr(1);
}

module.exports = {
    formatTime: formatTime,
    objectToUrlParams: objectToUrlParams,
    formatData: formatData,
    scene_decode: function(t) {
        var r = (t + "").split(","), e = {};
        for (var a in r) {
            var o = r[a].split(":");
            0 < o.length && o[0] && (e[o[0]] = o[1] || null);
        }
        return e;
    }
};