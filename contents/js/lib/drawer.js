/* 
Script by Paras Khanchandani https://twitter.com/ParasKCD

#Requirements:-
 - taphold.js by junesiphone
 - domMaker.js
 - localstore.js
 - menu.js
 - menu.css
 - drawer.css

#Usage:-
drawer.init([
    {
        id: //Your div className where you want user to add their own App Shortcuts
        title: //Any name that will be stored in localStorage
        limit: //Limit for number of apps you want a div to hold
        callback: (element) => //function to update apps in that div(element, api.apps)
    }, 
    //You can add multiple objects for multiple divs
])

#Example:- 
params.drawerContainer.addEventListener("click", () => {
    drawer.init([
        {
            id: 'dockFavs', 
            title: 'Dock', 
            limit: 8, 
            callback: (mainDiv) => homeMaker.populateDockContainer(mainDiv, api.apps)
        },
        {
            id: 'homeFavs',
            title: 'HomeScreen',
            limit: 25,
            callback: (mainDiv) => homeMaker.populateHomeAppsContainer(mainDiv, api.apps)
        }
    ]);
});
*/

var drawer = {
    searchFlag: false,
    allApplications: api.apps.allApplications,
    drawer: "",
    header: "",
    close: "",
    search: "",
    content: "",
    perPage: 24,
    invokeMenu: false,
    movedWhilePressing: false,
    appContainer: [],
    //The Pagination Logic
    paginator: function(items, page) {
        var page = page || 1,
            offset = (page - 1) * this.perPage,
            paginatedItems = items.slice(offset).slice(0, this.perPage);
        return this.displayApps(paginatedItems, page);
    },
    //Create a new DOM for Drawer
    makeDrawer: function() {
        return domMaker.init({
            type: "div",
            id: "drawer",
            className: "closed",
        });
    },
    //Create a new DOM for Header
    makeHeader: function() {
        return domMaker.init({
            type: "div",
            id: "drawerHeader"
        })
    },
    animateIcon: function(on, bundle) {
        if(bundle) {
            var grow = 1.2,
                standard = 1.0,
                el = document.getElementById(bundle);
    
            el.style.transition = "transform 350ms ease-in-out";
    
            if(on) {
                el.style.transform = "scale(" + grow + ")";
                el.style.zIndex = "2";
                el.style.webkitTransform = "scale(" + grow + ")";
            } else {
                el.style.transform = "scale(" + standard + ")";
                el.style.zIndex = "2";
                el.style.webkitTransform = "scale(" + standard + ")";
            }
        }
    },
    animateApp: function(el) {
        if((el.target.className === "drawerApp" || el.target.className === 'hsApp') && !drawer.movedWhilePressing) {
            drawer.animateIcon(true, el.target.id);
        }
    },
    //Create a new DOM for Searchbar
    makeSearchBar: function() {
        const mainDiv = domMaker.init({
                type: "div",
                id: "drawerSearchContainer",
            }),
            searchInput = domMaker.init({
                type: "input",
                id: "drawerSearchTextField",
                className: "inputTextField",
                attribute: ["type", "search"],
                attribute2: ["placeholder", "Search Apps.."]
            });
        searchInput.addEventListener("keyup", (e) => this.searchEvent(e));
        mainDiv.appendChild(searchInput);
        return mainDiv;
    },
    //Create a new DOM for Close Button
    makeCloseButton: function() {
        const mainDiv = domMaker.init({
            type: "div",
            id: "closeButtonContainer",
            className: "drawerButton",
            innerHTML: "X"
        });
        mainDiv.addEventListener("click", (e) => this.closeDrawerEvent(e));
        return mainDiv;
    },
    //Create a new DOM for Containing apps
    makeAppHolder: function() {
        return domMaker.init({
                type: "div",
                id: "drawerContent",
        });
    },
    //Create a new DOM for displaying the apps
    displayApps: function(filteredApps, page) {
        const htmlString = filteredApps.map((app) => {
            return `<div id='${app.identifier}' name='${app.name}' class='drawerApp'>
                        <img id='${app.identifier}.icon' src='${app.icon}' class='drawerAppIcon' />
                        <div id='${app.identifier}.name' class='drawerAppName'>
                            ${app.name}
                        </div>
                    </div>`
        }).join('');
        let mainDiv = domMaker.init({
            type: "div",
            id: "page" + page,
            className: "drawerPages",
            innerHTML: htmlString
        });
        mainDiv.addEventListener('touchend', function(el) {
            drawer.openApp(el.target.id);
            if(!drawer.invokeMenu && !drawer.movedWhilePressing) {
                drawer.closeDrawerEvent(el);
            }
            if(el.target.className === 'drawerApp') {
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
                drawer.tapHoldOnIcon(el);
            },
        });
        return mainDiv;
    },
    tapHoldOnIcon: function(el) {
        if(el.className === "drawerApp") {
            drawer.invokeMenu = true;
            drawer.checkIfMenuExists();
            drawer.makeMenu(el);
        }
    },
    openApp: function(bundle) {
        if(bundle && !drawer.invokeMenu && !drawer.movedWhilePressing) {
            api.apps.launchApplication(bundle);
        }
    },
    searchFunc: function(e) {
        const searchString = e.target.value.toLowerCase();
        const filteredApps = this.allApplications.filter((app) => {
            return (app.name.toLowerCase().includes(searchString));
        });
        return drawer.paginator(filteredApps, 1);
    },
    fillPages: function() {
        const totalPages = Math.ceil(drawer.allApplications.length / this.perPage);
        for(let i = 0; i < totalPages; i++) {
            let page = drawer.paginator(drawer.allApplications, i+1);
            drawer.content.appendChild(page);
        }
    },
    searchEvent: function(e) {
        this.searchFlag = true;
        this.content.innerHTML = "";
        if(e.target.value) {
            drawer.content.appendChild(drawer.searchFunc(e));
        } else {
            this.fillPages();
        }
    },
    closeDrawerEvent: function() {
        this.drawer.classList.add("closed");
        setTimeout(() => document.body.removeChild(this.drawer), 350);
    },
    addApps: function(appID) {
        let menuItems = [];
        for(let i = 0; i < this.appContainer.length; i++) {
            let appContainerStuff = drawer.appContainer[i];
            let menuItem = {
                id: appContainerStuff.id,
                title: appContainerStuff.title,
                callback: function() {
                    drawer.invokeMenu = false;
                    if(!localstore[appContainerStuff.id] || appContainerStuff.limit !== localstore[appContainerStuff.id].length) {
                        let appContainer = document.getElementsByClassName(appContainerStuff.id)[0]
                        localstore.addApp(appContainerStuff.id, appID);
                        appContainerStuff.callback(appContainer);
                    } else {
                        alert("Can't add more apps!");
                    }
                }
            }
            menuItems.push(menuItem);
        }
        menuItems.push({id: "closeMenu", title: "Cancel", callback: function(){}});
        return menuItems;
    },
    makeMenu: function(element) {
        menu.init({
            id: element.id + ".Menu",
            message: element.getAttribute("name"),
            menuItems: [
                {
                    id: "addApp",
                    title: "Add to Homescreen",
                    callback: function() {
                        setTimeout(() => {
                            menu.init({
                                id: element.id + "Add",
                                message: "Where do you want to add the App?",
                                menuItems: drawer.addApps(element.id)
                            });
                        }, 400);
                    }
                },
                {
                    id: "deleteApp",
                    title: "Uninstall App",
                    callback: function() {
                        drawer.invokeMenu = false;
                        api.apps.deleteApplication(element.id);
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
    checkIfMenuExists: function() {
        let theMenu = document.querySelector(".menuWindow");
        if(theMenu) {
            menu.closeMenu();
        }
    },
    init: function(appContainer) {
        this.drawer = this.makeDrawer();
        this.header = this.makeHeader();
        this.close = this.makeCloseButton();
        this.search = this.makeSearchBar();
        this.content = this.makeAppHolder();
        this.appContainer = appContainer;
        this.fillPages();
        domMaker.domAppender({
            div: this.header,
            children: [this.close, this.search]
        })
        domMaker.domAppender({
            div: this.drawer,
            children: [this.header, this.content]
        });
        document.body.appendChild(this.drawer);
        this.drawer.style.display = "block";
        setTimeout(() => drawer.drawer.classList.remove("closed"), 350)
    }
}