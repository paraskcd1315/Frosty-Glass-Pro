var settings = {
    styles: [],
    addStyle: function(params) {
        let element, node;
        if(params.id) {
            if(document.getElementById(params.id)) {
                element = document.getElementById(params.id);
                document.body.removeChild(element);
            }
        }
        node = domMaker.init({
            type: "style",
            id: params.id,
            innerHTML: params.str
        });
        return node;
    },
    appendToBody: function() {
        domMaker.domAppender({
            div: document.body,
            children: this.styles
        })
    },
    init: function() {
        this.styles.push(this.addStyle({
            id: "lookAndFeel",
            str: `
            :root {
                --text-color: ${config.textColor};
                --background-color: ${config.backgroundColor};
                --background-secondary: ${config.secondaryBackgroundColor};
                --search-background: ${config.panelColor};
            }
            .mainPageContainer #weatherContainer .weatherSmall:before,
            .mainPageContainer #weatherContainer .weatherBig:before, 
            .mainPageContainer #homeHeader #bottomHeader #searchContainer:before,
            .mainPageContainer #dockContainer .hsApp .hsAappBadge:before,
            #drawerContainer:before, 
            .menuBar .menuButtons.active:before, 
            #appSearchContainer:before,
            .mainPageContainer #fullNews:before,
            .mainPageContainer #newsHeadlines .newsHeadlines .theHeadline:before,
            .mainPageContainer #musicHeaderContainer #musicArtworkContainer #musicDecoration:before {
                border-radius: ${Math.ceil(config.borderRadius)}px;
                backdrop-filter: blur(${Math.ceil(config.blurIntensity)}px);
                -webkit-backdrop-filter: blur(${Math.ceil(config.blurIntensity)}px);
            }
            #drawerContainer, .mainPageContainer #fullNews .newsHeader {
                border-top-left-radius: ${Math.ceil(config.borderRadius)}px;
                border-top-right-radius: ${Math.ceil(config.borderRadius)}px;
            }
            #drawerContainer:before {
                border-radius: 0px;
                border-top-left-radius: ${Math.ceil(config.borderRadius)}px;
                border-top-right-radius: ${Math.ceil(config.borderRadius)}px;
            }
            #pageContainer .mainPageContainer #appSearchContainer,
            .mainPageContainer #homeHeader #bottomHeader #searchContainer,
            .mainPageContainer #weatherContainer .weatherBig, 
            .mainPageContainer #weatherContainer .weatherSmall,
            .mainPageContainer #dockContainer .hsApp .hsAappBadge,
            .menuBar .menuButtons,
            .mainPageContainer #fullNews,
            .mainPageContainer #newsHeadlines .newsHeadlines .theHeadline,
            .mainPageContainer #musicHeaderContainer #musicArtworkContainer #musicDecoration,
            .mainPageContainer #musicHeaderContainer #musicArtworkContainer img {
                border-radius: ${Math.ceil(config.borderRadius)}px;
            }`
        }));
        if(config.hideStatusbarIcons) {
            this.styles.push(this.addStyle({
                id: "hideStatusbarIcons",
                str: `
                .mainPageContainer #homeHeader #topHeader #statusbarContainer{
                    display: none;
                }`
            }));
        }
        if(config.hideAppLabels) {
            this.styles.push(this.addStyle({
                id: "hideAppLabels",
                str: `
                .hsApp .hsAppName {
                    display: none;
                }
                .mainPageContainer #appSearchContainer .hsApp .hsAppName {
                    display: block;
                }`
            }));
        }
        if(config.hideAppBadges) {
            this.styles.push(this.addStyle({
                id: "hideAppBadges",
                str: `
                .hsApp .hsAappBadge {
                    display: none;
                }`
            }));
        }
        if(config.hideAppShadows) {
            this.styles.push(this.addStyle({
                id: "hideAppShadows",
                str: `
                .hsApp img {
                    filter: unset;
                }`
            }));
        }
        if(config.hideDrawerButton) {
            this.styles.push(this.addStyle({
                id: "hideDrawerButton",
                str: `
                #pageContainer #statusbarContainer {
                    bottom: 29vh;
                }
                #pageContainer .mainPageContainer {
                    transform: translateY(-7vh);
                }
                .menuBar {
                    bottom: 2vh;
                }
                #drawerContainer {
                    display: none;
                }`
            }));
        }
        if(config.hideMenuBar) {
            this.styles.push(this.addStyle({
                id: "hideMenuBar",
                str: `
                .menuBar {
                    display: none;
                }
                #pageContainer .mainPageContainer {
                    transform: translateY(-7vh);
                }
                #pageContainer #statusbarContainer {
                    bottom: 29vh;
                }`
            }));
        }
        if(config.hideAppDrawerLabels) {
            this.styles.push(this.addStyle({
                id: "hideAppDrawerLabels",
                str: `
                #drawer #drawerContent .drawerPages .drawerApp .drawerAppName {
                    display: none;
                }`
            }))
        }
        if(config.hideMusic) {
            this.styles.push(this.addStyle({
                id: "hideMusic",
                str: `
                    #musicMenu {
                        display: none;
                    }
                `
            }))
        }
        if(config.hideNews) {
            this.styles.push(this.addStyle({
                id: "hideNews",
                str: `
                    #newsMenu {
                        display: none;
                    }
                `
            }))
        }
        if(config.hideMusicButtons) {
            this.styles.push(this.addStyle({
                id: "hideNews",
                str: `
                    .mainPageContainer .musicButtonsContainer  {
                        display: none;
                    }
                `
            }))
        }
        if(config.hideMusicInfo) {
            this.styles.push(this.addStyle({
                id: "hideNews",
                str: `
                    .mainPageContainer #musicHeaderContainer #musicInfoContainer {
                        display: none;
                    }
                `
            }))
        }
        if(config.hideArtwork) {
            this.styles.push(this.addStyle({
                id: "hideNews",
                str: `
                    .mainPageContainer #musicHeaderContainer #musicArtworkContainer{
                        display: none;
                    }
                `
            }))
        }
        this.appendToBody();
    }
}

settings.init();