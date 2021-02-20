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
        this.loadHome();
    }
}