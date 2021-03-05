var homeMaker = {
    //Time and Date Related Section
    populateTimeContainer: function(digitalClock, day, newData) {
        time.init({
            refresh: 1000,
            twentyfour: newData.isTwentyFourHourTimeEnabled,
            callback: function(time) {
                digitalClock.innerHTML = time.hour() + ":" + time.minute();
                day.innerHTML = `${time.dayText()}, ${time.date()} ${time.sMonthText()}`;
            }
        });
    },
    makeTimeContainer: function() {
        const mainDiv = domMaker.init({
                type: "div",
                id: "timeContainer",
            }),
            digitalClock = domMaker.init({
                type: "div",
                id: "digitalClock",
            }),
            day = domMaker.init({
                type: "div",
                id: "day",
            });
        this.populateTimeContainer(digitalClock, day, api.system);
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
            children: [digitalClock, day]
        });
        return mainDiv;
    },
    //Statusbar Related Section
    makeStatusbarContainer: function() {
        
    },
    //Search Related Section
    makeAppSearchContainer: function() {
        const mainDiv = domMaker.init({
                type: "div",
                id: "appSearchContainer",
                className: "closed"
            });
        mainDiv.addEventListener('touchend', function(el) {
            let callback = () => {
                document.getElementById("searchTextField").value = "";
                homeMaker.closeAppSearchContainer();
            }
            drawer.openApp(el.target.id, callback);
            drawer.movedWhilePressing = false;
        });
        mainDiv.addEventListener('touchmove', () => drawer.movedWhilePressing = true);
        return mainDiv;
    },
    closeAppSearchContainer: function() {
        let appSearchContainer = document.getElementById("appSearchContainer");
        appSearchContainer.classList.add("closed");
        setTimeout(() => appSearchContainer.innerHTML = "", 350);
        document.getElementById("timeContainer").style.pointerEvents = null;
    },
    populateAppSearch: function(e) {
        let appSearchContainer = document.getElementById("appSearchContainer");
        let searchString = e.target.value.toLowerCase();
        let filteredApps = drawer.allApplications.filter((app) => {
            return app.name.toLowerCase().includes(searchString);
        });
        if(e.target.value) {
            if(filteredApps.length > 0) {
                appSearchContainer.innerHTML = homeMaker.displayApps(filteredApps);
                setTimeout(() => appSearchContainer.classList.remove("closed"), 350);
            } else {
                homeMaker.closeAppSearchContainer();
            }            
        } else {
            homeMaker.closeAppSearchContainer();
        }
    },
    redirect: function(e) {
        if(e.keyCode === 13) {
            let url = e.target.value;
            let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            if(e.target.value.substring(0, 8) === "https://" || e.target.value.substring(0,7) === "http://") {
                window.location = e.target.value;
            } else if(regexp.test(url)) {
                let url = `https://${e.target.value}`;
                window.location = url;
            } else {
                window.location = `https://www.google.com/search?q=${e.target.value}`;
            }
            e.target.value = "";
        }
    },
    moveUpForTextFieldFocus: function(event) {
        let offsetFromCenter = event.target.getBoundingClientRect().top - ((screen.height / 2) - 100);
        if (Math.sign(offsetFromCenter) != -1) {
            event.target.parentElement.parentElement.style.transform = `translateY(-${offsetFromCenter}px)`;
        }
    },
    resetMoveUp: function(event) {
        event.target.parentElement.parentElement.style.transform = null;
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
        searchInput.addEventListener("focus", (e) => {
            this.moveUpForTextFieldFocus(e);
            document.getElementById("timeContainer").style.pointerEvents = "none";
        }, false);
        searchInput.addEventListener("blur", (e) => {
            this.resetMoveUp(e);
            e.target.value = "";
        }, false);
        searchInput.addEventListener("keyup", (e) => {
            homeMaker.populateAppSearch(e);
            homeMaker.redirect(e);
        }, false)
        domMaker.domAppender({
            div: mainDiv,
            children: [searchInput, searchIcon]
        });
        return mainDiv;
    },
    //Weather Related Section
    populateWeatherContainer: function(weatherDiv, weatherDiv2, newData) {
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
        this.populateWeatherContainer(weatherDiv, weatherDiv2, api.weather);
        domMaker.domAppender({
            div: mainDiv,
            children: [weatherDiv, weatherDiv2]
        });
        
        return mainDiv;
    },
    //Apps Related Section
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
                    id: "switchApp",
                    title: "Switch App",
                    callback: function() {
                        drawer.init({
                            oldApp: {
                                id: "dockFavs",
                                appID: el.id,
                                callback: function() {
                                    drawer.invokeMenu = false;
                                    let appContainer = el.parentElement;
                                    homeMaker.checkToHide();
                                    homeMaker.populateDockContainer(appContainer, api.apps);
                                }
                            }
                        })
                    }
                },
                {
                    id: "removeApp",
                    title: "Remove App",
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
        homeMaker.populateDockContainer(mainDiv, api.apps);
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
    //Hiding Logic
    checkToHide: function() {
        if(localstore["dockFavs"]) {
            let dockHide = domMaker.init({
                type: "style",
                id: "hideDock",
                innerHTML: `
                .mainPageContainer #dockContainer.closed .hsApp:nth-last-child(-n+${localstore["dockFavs"].length - 4}) {
                    opacity: 0;
                    pointer-events: none;
                }
                .mainPageContainer #dockContainer.closed {
                    transform: translateY(10vh);
                }
                .mainPageContainer #timeContainer, .mainPageContainer #searchContainer {
                    transform: translateY(24vh);
                }`
            });
            if(document.getElementById("hideDock")) {
                document.body.removeChild(document.getElementById("hideDock"));
            }
            if(localstore["dockFavs"].length > 4) {  
                if(!document.body.contains(document.getElementById("hideDock"))) {
                    document.body.appendChild(dockHide);
                }
            }
        } 
    },
    //Initiate HomeMaker
    init: function() {
        let appSearchContainer = this.makeAppSearchContainer();
        let timeContainer = this.makeTimeContainer();
        let searchContainer = this.makeSearchContainer();
        let weatherContainer = this.makeWeatherContainer();
        let dockContainer = this.makeDockContainer();
        domMaker.domAppender({
            div: loadWidget.contentContainer,
            children: [appSearchContainer, timeContainer, searchContainer, weatherContainer, dockContainer]
        });
        homeMaker.checkToHide();
    }
}

//Xen API Data Observers
api.apps.observeData(function(newData) {
    if(homeActive) {
        homeMaker.populateDockContainer(document.getElementById("dockContainer"), newData);
    }
});

api.weather.observeData(function(newData) {
    if(homeActive) {
        homeMaker.populateWeatherContainer(document.getElementById("weatherInfo"), document.getElementById("weatherInfo2"), newData);
    }
});

api.system.observeData(function(newData) {
    if(homeActive) {
        homeMaker.populateTimeContainer(document.getElementById("digitalClock"), document.getElementById("day"), newData);
    }
});