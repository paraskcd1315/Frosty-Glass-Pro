var homeMaker = {
    appContainer: [],
    appPages: function(items, page, per_page) {
        var page = page || 1,
            per_page = per_page || 24,
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
    makeWeatherContainer: function() {
        const mainDiv = domMaker.init({
            type: "div",
            id: "weatherContainer",
        });
        api.weather.observeData(function(newData){
            mainDiv.innerHTML = "";
            let weatherDiv = domMaker.init({
                    type: "div",
                    id: "weatherInfo",
                    className: 'weatherBig',
                    innerHTML: `<div id='degree'>
                                    ${newData.now.temperature.current} °${newData.units.temperature}
                                </div>
                                <div id='condition'>
                                    ${newData.now.condition.description}
                                </div>
                                <div id='city'>
                                    ${newData.metadata.address.city}
                                </div>`
                }),
                weatherDiv2 = domMaker.init({
                    type: "div",
                    id: "weatherInfo2",
                    className: 'weatherSmall',
                    innerHTML: `<div id='icon'>
                                    <img src='contents/icons/weatherIcons/${newData.now.condition.code}.svg'>
                                </div>
                                <div id='condition'>
                                    ${newData.now.temperature.minimum} °${newData.units.temperature} / ${newData.now.temperature.maximum} °${newData.units.temperature}
                                </div>`
                });
            domMaker.domAppender({
                div: mainDiv,
                children: [weatherDiv, weatherDiv2]
            });
        });
        return mainDiv;
    },
    makeSearchContainer: function() {
        const mainDiv = domMaker.init({
                type: "div",
                id: "searchContainer",
            }),
            searchInput = domMaker.init({
                type: "input",
                id: "searchTextField",
                className: "inputTextField",
                attribute: ["type", "search"],
                attribute2: ["placeholder", "Search.."]
            }),
            searchIcon = domMaker.init({
                type: 'div',
                
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
        this.appContainer = localstore['homeFavs'];
        let timeContainer = this.makeTimeContainer();
        let searchContainer = this.makeSearchContainer();
        let weatherContainer = this.makeWeatherContainer();
        domMaker.domAppender({
            div: loadWidget.contentContainer,
            children: [timeContainer, searchContainer, weatherContainer]
        })
    }
}