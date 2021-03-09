var homeActive = document.getElementById("homeMenu").classList.contains("active");
var musicActive = document.getElementById("musicMenu").classList.contains("active");
var lpmMode = false;

var loadWidget = {
    contentContainer: "",
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