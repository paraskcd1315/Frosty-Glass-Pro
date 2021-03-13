var homeActive = document.getElementById("homeMenu").classList.contains("active");
var musicActive = document.getElementById("musicMenu").classList.contains("active");
var lpmMode = false;

var loadWidget = {
    width: window.innerWidth,
    contentContainer: "",
    loadHome: function() {
        if(this.width <= 500) {
            homeMaker.init();
        } else {
            if(document.getElementById("weatherContainer")) {
                document.getElementById("weatherContainer").classList.remove("closed");
                const weatherDiv = domMaker.init({
                        type: "div",
                        id: "weatherInfo",
                        className: 'weatherBig'
                    }),
                    weatherDiv2 = domMaker.init({
                        type: "div",
                        id: "weatherInfo2",
                        className: 'weatherSmall'
                    });
                homeMaker.populateWeatherContainer(weatherDiv, weatherDiv2, api.weather);
                domMaker.domAppender({
                    div: document.getElementById("weatherContainer"),
                    children: [weatherDiv, weatherDiv2]
                });
            } else {
                homeMaker.init();
            }
        }
    },
    loadMusic: function() {
        musicMaker.init();
        if(document.getElementById("weatherContainer")) {
            document.getElementById("weatherContainer").classList.remove("closed");
        }
    },
    loadNews: function() {
        newsMaker.init();
    },
    init: function(params) {
        this.contentContainer = params.contentContainer;
        localstore.init({
            storageName: "KCDFrost"
        });
        params.drawerContainer.addEventListener("click", () => {
            drawer.init({
                appContainer: [
                    {
                        id: 'dockFavs', 
                        title: 'Dock', 
                        limit: 8, 
                        callback: (mainDiv) => {
                            homeMaker.populateDockContainer(mainDiv, api.apps);
                            homeMaker.checkToHide();
                        }
                    }
                ]
            });
        });
        params.menuContainer.addEventListener("touchend", (e) => {
            if(e.target.id) {
                if(loadWidget.width <= 500) {
                    loadWidget.contentContainer.classList.add("hide");
                    if(document.getElementById("appSearchContainer")) {
                        document.body.removeChild(document.getElementById("appSearchContainer"));
                    }
                } else {
                    document.getElementById("weatherContainer").classList.add("closed");
                }
                for(let i = 0; i < params.menuContainer.children.length; i++) {
                    let child = params.menuContainer.children[i];
                    if(child.classList.contains("active")) {
                        child.classList.remove("active");
                    }
                }
                setTimeout(() => {
                    if(loadWidget.width <= 500) {
                        loadWidget.contentContainer.innerHTML = "";
                    } else {
                        document.getElementById("weatherContainer").innerHTML = "";
                    }
                }, 300);
                switch(e.target.id) {
                    case "homeMenu": 
                        e.target.classList.add("active");
                        musicActive = false;
                        setTimeout(() => {
                            homeActive = true;
                            loadWidget.loadHome();
                        }, 360);
                        break;
                    case "musicMenu":
                        e.target.classList.add("active");
                        homeActive = false;
                        setTimeout(() => {
                            musicActive = true;
                            loadWidget.loadMusic();
                        }, 360);
                        break;
                    case "newsMenu":
                        e.target.classList.add("active");
                        homeActive = false;
                        musicActive = false;
                        setTimeout(() => {
                            loadWidget.loadNews();
                        }, 360);
                        break;
                }
                setTimeout(() => {
                    loadWidget.contentContainer.classList.remove("hide");
                }, 350);
            }
        });
        this.loadHome();
    }
}