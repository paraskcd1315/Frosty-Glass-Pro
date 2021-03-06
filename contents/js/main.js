var homeActive = document.getElementById("homeMenu").classList.contains("active");
var lpmMode = false;

var loadWidget = {
    contentContainer: "",
    populateStatusbarContainer: function(div, newData) {
        let signal;
        let wifi;
        if(document.getElementById("statusbarSignal")) {
            div.removeChild(document.getElementById("statusbarSignal"));
        }
        if(document.getElementById("statusbarWifi")) {
            div.removeChild(document.getElementById("statusbarWifi"));
        }
        if(newData.wifi.enabled) {
           wifi = domMaker.init({
                type: "img",
                id: "statusbarWifi",
                src: "contents/icons/statusIcons/wifi/" + newData.wifi.bars + ".png"
            });
            div.prepend(wifi);
        }
        if(newData.telephony.type !== "") {
            signal = domMaker.init({
                type: "img",
                id: "statusbarSignal",
                src: "contents/icons/statusIcons/telephony/" + newData.telephony.bars + ".png"
            });
            div.prepend(signal);
        }
    },
    populateWithBattery: function(div, newData) {
        let battlevel = Math.ceil((newData.battery.percentage) / 10) * 10;
        let battery;
        let batteryChargingURL = lpmMode ? "contents/icons/statusIcons/battery-charging-lpm/" + battlevel + ".png" : "contents/icons/statusIcons/battery-charging/" + battlevel + ".png";
        let batteryURL = lpmMode ? "contents/icons/statusIcons/battery-lpm/" + battlevel + ".png" : "contents/icons/statusIcons/battery/" + battlevel + ".png";
        switch(newData.battery.state) {
            case 0: 
                battery = domMaker.init({
                    type: "img",
                    id: "statusbarBattery",
                    src: batteryURL
                });
                break;
            case 1:
                battery = domMaker.init({
                    type: "img",
                    id: "statusbarBattery",
                    src: batteryChargingURL
                });
                break;
            default:
                battery = domMaker.init({
                    type: "img",
                    id: "statusbarBattery",
                    src: batteryURL
                });
                break;
        }
        if(document.getElementById("statusbarBattery")) {
            div.removeChild(document.getElementById("statusbarBattery"));
        }
        div.appendChild(battery);
    },
    makeStatusBarContainer: function() {
        const mainDiv = domMaker.init({
                type: "div",
                id: "statusbarContainer",
            });
        this.populateStatusbarContainer(mainDiv, api.comms);
        this.populateWithBattery(mainDiv, api.resources)
        return mainDiv;
    },
    loadHome: function() {
        homeMaker.init();
    },
    loadMusic: function() {
        musicMaker.init();
    },
    newsMaker: function() {
        musicMaker.init();
    },
    init: function(params) {
        params.pageContainer.prepend(loadWidget.makeStatusBarContainer());
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
                loadWidget.contentContainer.classList.add("hide");
                for(let i = 0; i < params.menuContainer.children.length; i++) {
                    let child = params.menuContainer.children[i];
                    if(child.classList.contains("active")) {
                        child.classList.remove("active");
                    }
                }
                setTimeout(() => {
                    loadWidget.contentContainer.innerHTML = "";
                }, 300);
                switch(e.target.id) {
                    case "homeMenu": 
                        e.target.classList.add("active");
                        setTimeout(() => {
                            homeActive = true;
                            loadWidget.loadHome();
                        }, 360);
                        break;
                    case "musicMenu":
                        e.target.classList.add("active");
                        break;
                    case "newsMenu":
                        e.target.classList.add("active");
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

//Xen API Observers
api.comms.observeData(function(newData) {
    loadWidget.populateStatusbarContainer(document.getElementById("statusbarContainer"), newData);
});

api.resources.observeData(function(newData) {
    loadWidget.populateWithBattery(document.getElementById("statusbarContainer"), newData);
});