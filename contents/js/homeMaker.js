var homeMaker = {
    appPages: function(items, page, per_page) {
        var page = page || 1,
            per_page = per_page || 8,
            offset = (page - 1) * per_page,
            paginatedItems = items.slice(offset).slice(0, per_page),
            total_pages = Math.ceil(items.length / per_page);
    },
    displayApps: function(filteredApps, page) {
        const htmlString = filteredApps.map((app) => {
            return `<div id='${app.identifier}' name='${app.name}' class='hsApp'>
                        <div id='${app.identifier}.badge' class='hsAappBadge'>${app.badge}</div>
                        <img id='${app.identifier}.icon' src='${app.icon}' class='hsAppIcon' />
                        <div id='${app.identifier}.name' class='hsAppName'>${app.name}</div>
                    </div>`
        }).join('');
    },
    makeSearchContainer: function() {
        let mainDiv = domMaker.init({
                type: "div",
                id: "searchContainer",
            }),
            searchInput = domMaker.init({
                type: "input",
                id: "searchTextField",
                className: "inputTextField",
                attribute: ["type", "search"],
                attribute2: ["placeholder", "Search.."]
            });
        mainDiv.appendChild(searchInput);
        return mainDiv;
    },
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
            twentyfour: api.system.isTwentyFourHourTimeEnabled,
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
        drawer.init([
            {id: 'homeFavs', title: 'Homescreen'}, 
            {id: 'dockFavs', title: 'Dock'}
        ]);
        let timeContainer = this.makeTimeContainer();
        let searchContainer = this.makeSearchContainer();
        domMaker.domAppender({
            div: loadWidget.contentContainer,
            children: [timeContainer, searchContainer]
        })
    }
}