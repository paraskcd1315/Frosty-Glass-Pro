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
                {id: 'homeFavs', title: 'Homescreen'},
                {id: 'dockFavs', title: 'Dock'}
            ]);
        });
        this.loadHome();
    }
}