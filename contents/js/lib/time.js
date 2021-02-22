//Script by Paras Khanchandani https://twitter.com/ParasKCD

var time = {
    twentyfour: true,
    zeroPadding: true,
    d: "",
    funcs: {
        greet: translate[current].greets,
        textDay: translate[current].weekday,
        shortTextDay: translate[current].sday,
        textMonth: translate[current].month,
        shortTextMonth: translate[current].shortTextMonth,
        hour: function() {
            let hour = (time.twentyfour === true) ? time.d.getHours() : (time.d.getHours() + 11) % 12 + 1;
            hour = (time.zeroPadding === true) ? (hour < 10 ? "0" + hour : "" + hour) : hour;
            return hour;
        },
        rawHour: function() {
            return time.d.getHours();
        },
        minute: function() {
            return (time.d.getMinutes() < 10) ? "0" + time.d.getMinutes() : time.d.getMinutes();
        },
        rawMinute: function() {
            return time.d.getMinutes();
        },
        seconds: function() {
            return (time.d.getSeconds() < 10) ? "0" + time.d.getSeconds() : time.d.getSeconds();
        },
        rawSeconds: function() {
            return time.d.getSeconds();
        },
        ampm: function() {
            if(time.twentyfour === true) return ' ';
            else return (time.d.getHours > 11) ? "pm" : "am";
        },
        date: function() {
            return time.d.getDate();
        },
        day: function() {
            return time.d.getDay();
        },
        month: function() {
            return time.d.getMonth();
        },
        year: function() {
            return time.d.getFullYear();
        },
        dayText: function() {
            return this.textDay[this.day()];
        },
        monthText: function() {
            return this.textMonth[this.month()];
        },
        sDayText: function() {
            return this.shortTextDay[this.day()];
        },
        sMonthText: function() {
            return this.shortTextMonth[this.month()];
        },
        greetings: function() {
            if(this.rawHour() < 12) return this.greet[0]
            else if(this.rawHour() < 17) return this.greet[1]
            else return this.greet[2]
        }
    },
    init: function(params) {
        this.d = new Date();
        this.twentyfour = params.twentyfour || true;
        this.zeroPadding = params.zeroPadding || true;
        params.callback(this.funcs);
        setTimeout(function() {
            time.init(params)
        }, params.refresh);
    }
};