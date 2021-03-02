var homeMaker = {
    appContainer: [],
    appPages: function(items, page, per_page) {
        var page = page || 1,
            per_page = per_page || 24,
            offset = (page - 1) * per_page,
            paginatedItems = items.slice(offset).slice(0, per_page);
        return this.displayApps(paginatedItems, page);
    },
    displayApps: function(filteredApps) {
        const htmlString = filteredApps.map((app) => {
            let badgeDiv = ``;
            if(app.badge || app.badge !== '') {
                badgeDiv = `<div id='${app.identifier}.badge' class='hsAappBadge'>${app.badge}</div>`
            }
            return `<div id='${app.identifier}' name='${app.name}' class='hsApp'>
                        ${badgeDiv}
                        <img id='${app.identifier}.icon' src='${app.icon}' class='hsAppIcon' />
                        <div id='${app.identifier}.name' class='hsAppName'>${app.name}</div>
                    </div>`
        }).join('');
        return htmlString;
    },
    populateDockContainer: function(mainDiv, newData) {
        if(localstore["dockFavs"]) {
            let appIDs = localstore["dockFavs"];
            let dockApps = [];
            for(let i = 0; i < appIDs.length; i++) {
                dockApps.push(newData.applicationForIdentifier(appIDs[i]));
            }
            mainDiv.innerHTML = homeMaker.displayApps(dockApps);
        } else {
            mainDiv.innerHTML = "<div id='noApps'>Please, add App Shortcuts from Drawer!</div>";
        }
    },
    makeDockContainer: function() {
        const mainDiv = domMaker.init({
                type: "div",
                className: "dockFavs closed",
                id: "dockContainer",
            });
        api.apps.observeData(function(newData) {
            homeMaker.populateDockContainer(mainDiv, newData);
        });
        mainDiv.addEventListener('touchend', function(el) {
            drawer.openApp(el.target.id);
            if(el.target.className === 'hsApp') {
                setTimeout(function(){
                    drawer.animateIcon(false, el.target.id);
                }, 100);
            }
            drawer.movedWhilePressing = false;
        });
        mainDiv.addEventListener('touchstart', drawer.animateApp, false);
        mainDiv.addEventListener('touchmove', () => drawer.movedWhilePressing = true, false);
        touchhold.init({
            time: 400,
            element: mainDiv,
            callback: function(el) {
                homeMaker.tapHoldOnIcon(el);
            },
        });
        return mainDiv;
    },
    tapHoldOnIcon: function(el) {
        drawer.invokeMenu = true;
        drawer.checkIfMenuExists();
        homeMaker.makeMenu(el);
    },
    makeMenu: function(el) {
        menu.init({
            id: el.id + ".Menu",
            message: el.getAttribute("name"),
            menuItems: [
                {
                    id: "removeApp",
                    title: "Remove App from Homescreen",
                    callback: function() {
                        drawer.invokeMenu = false;
                        localstore.removeApp('dockFavs', el.id);
                        let appContainer = el.parentElement;
                        homeMaker.checkToHide();
                        homeMaker.populateDockContainer(appContainer, api.apps);
                    }
                },
                {
                    id: "closeMenu",
                    title: "Cancel",
                    callback: function() {
                        drawer.invokeMenu = false;
                    }
                }
            ]
        });
    },
    makeWeatherContainer: function() {
        const mainDiv = domMaker.init({
                type: "div",
                id: "weatherContainer",
                className: "closed"
            }),
            weatherDiv = domMaker.init({
                type: "div",
                id: "weatherInfo",
                className: 'weatherBig'
            }),
            weatherDiv2 = domMaker.init({
                type: "div",
                id: "weatherInfo2",
                className: 'weatherSmall'
            });
        api.weather.observeData(function(newData) {
            weatherDiv.innerHTML = `<div id='degree'>
                                    ${newData.now.temperature.current} °${newData.units.temperature}
                                </div>
                                <div id='condition'>
                                    ${translate[current].condition[newData.now.condition.code]}
                                </div>
                                <div id='city'>
                                    ${newData.metadata.address.city}
                                </div>`;
            weatherDiv2.innerHTML = `<div id='icon'>
                                    <img src='contents/icons/weatherIcons/${newData.now.condition.code}.svg' width='45' height='45'>
                                </div>
                                <div id='condition'>
                                    ${newData.now.temperature.minimum} °${newData.units.temperature} / ${newData.now.temperature.maximum} °${newData.units.temperature}
                                </div>`;
        });
        domMaker.domAppender({
            div: mainDiv,
            children: [weatherDiv, weatherDiv2]
        });
        
        return mainDiv;
    },
    makeSearchContainer: function() {
        const mainDiv = domMaker.init({
                type: "div",
                id: "searchContainer"
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
                id: "searchIcon",
                className: "inputTextFieldIcons"
            });
        searchInput.addEventListener("focus", this.moveUpForTextFieldFocus, false);
        searchInput.addEventListener("blur", this.resetMoveUp, false);
        searchInput.addEventListener("keyup", (e) => {
            if(e.keyCode === 13) {
                window.location = `https://www.google.com/search?q=${e.target.value}`;
                e.target.value = "";
            }
        }, false)
        domMaker.domAppender({
            div: mainDiv,
            children: [searchInput, searchIcon]
        });
        return mainDiv;
    },
    moveUpForTextFieldFocus: function(event) {
        let offsetFromCenter = event.target.getBoundingClientRect().top - ((screen.height / 2) - 40);
        if (Math.sign(offsetFromCenter) != -1) {
            event.target.parentElement.parentElement.style.transform = `translateY(-${offsetFromCenter}px)`;
        }
    },
    resetMoveUp: function(event) {
        event.target.parentElement.parentElement.style.transform = `translateY(-7vh)`;
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
        api.system.observeData(function(newData) {
            time.init({
                refresh: 1000,
                twentyfour: newData.isTwentyFourHourTimeEnabled,
                callback: function(time) {
                    greeter.innerHTML = time.greetings();
                    digitalClock.innerHTML = time.hour() + ":" + time.minute();
                    day.innerHTML = time.dayText();
                    date.innerHTML = time.date() + " " + time.monthText();
                }
            });
        });
        mainDiv.addEventListener("click", (e) => {
            if(!(e.target.parentElement.id === loadWidget.contentContainer.id)) {
                e.target.parentElement.classList.toggle("closed");
                e.target.parentElement.nextElementSibling.classList.toggle("closed");
                e.target.parentElement.nextElementSibling.nextElementSibling.classList.toggle("closed");
                e.target.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.classList.toggle("closed");
            } else {
                e.target.classList.toggle("closed");
                e.target.nextElementSibling.classList.toggle("closed");
                e.target.nextElementSibling.nextElementSibling.classList.toggle("closed");
                e.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.toggle("closed");
            }
            homeMaker.checkToHide();
        })
        domMaker.domAppender({
            div: mainDiv,
            children: [greeter, digitalClock, day, date]
        });
        return mainDiv;
    },
    checkToHide: function() {
        if(localstore["dockFavs"]) {
            let dockHide = domMaker.init({
                type: "style",
                id: "hideDock",
                innerHTML: `
                .mainPageContainer #dockContainer.closed .hsApp:nth-last-child(-n+4) {
                    opacity: 0;
                    display: none;
                }`
            });
            if(localstore["dockFavs"].length > 4) {  
                if(!document.body.contains(document.getElementById("hideDock"))) {
                    document.body.appendChild(dockHide);
                }
            } else {
                if(document.body.contains(dockHide)) {
                    document.body.removeChild(dockHide);
                }
            }
        } 
    },
    init: function() {
        this.appContainer = localstore['homeFavs'];
        let timeContainer = this.makeTimeContainer();
        let searchContainer = this.makeSearchContainer();
        let weatherContainer = this.makeWeatherContainer();
        let dockContainer = this.makeDockContainer();
        domMaker.domAppender({
            div: loadWidget.contentContainer,
            children: [timeContainer, searchContainer, weatherContainer, dockContainer]
        });
        homeMaker.checkToHide();
    }
}