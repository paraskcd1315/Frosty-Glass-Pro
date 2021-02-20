var homeMaker = {
    makeTimeContainer: function() {
        let mainDiv = domMaker.init({
                type: "div",
                id: "timeContainer",
            }),
            greeter = domMaker.init({
                type: "div",
                id: "greeterContainer",
            }),
            digitalClock = domMaker.init({
                type: "div",
                id: "digitalClock",
            }),
            day = domMaker.init({
                type: "div",
                id: "day",
            }),
            date = domMaker.init({
                type: "div",
                id: "date"
            });
        time.init({
            refresh: 1000,
            callback: function(time) {
                greeter.innerHTML = time.greetings();
                digitalClock.innerHTML = time.hour() + ":" + time.minute();
                day.innerHTML = time.dayText();
                date.innerHTML = time.date() + " " + time.monthText();
            }
        });
        domMaker.domAppender({
            div: mainDiv,
            children: [greeter, digitalClock, day, date]
        });
        return mainDiv;
    },
    init: function() {
        let timeContainer = this.makeTimeContainer();
        loadWidget.contentContainer.appendChild(timeContainer);
    }
}