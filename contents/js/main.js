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
            drawer.init([
                {
                    id: 'dockFavs', 
                    title: 'Dock', 
                    limit: 8, 
                    callback: (mainDiv) => {
                        homeMaker.populateDockContainer(mainDiv, api.apps);
                        homeMaker.checkToHide();
                    }
                }
            ]);
        });
        this.loadHome();
    }
}