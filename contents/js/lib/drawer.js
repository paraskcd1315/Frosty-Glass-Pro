/* 
Script by Paras Khanchandani https://twitter.com/ParasKCD

#Requirements:-
 - touchhold.js
 - domMaker.js
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
    //Create a new DOM for Searchbar
    makeSearchBar: function() {
        let mainDiv = domMaker.init({
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
        let mainDiv = domMaker.init({
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
        mainDiv.addEventListener("touchend", this.appEvent, false);
        mainDiv.addEventListener("touchmove", () => this.movedWhilePressing = true, false)
        return mainDiv;
    },
    searchFunc: function(e) {
        const searchString = e.target.value.toLowerCase();
        const filteredApps = this.allApplications.filter((app) => {
            return (app.name.toLowerCase().includes(searchString));
        });
        return drawer.paginator(filteredApps, 1);
    },
    fillPages: function() {
        let totalPages = Math.ceil(drawer.allApplications.length / this.perPage);
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
                    localstore.addApp(appContainerStuff.id, appID);
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
                        }, 350*2);
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
    appEvent: function(e) {
        if(e.target.id && e.target.className == 'drawerApp') {
            if(!(drawer.movedWhilePressing)) {
                if(!(drawer.invokeMenu)) {
                    api.apps.launchApplication(e.target.id);
                }
                touchHold.init({
                    duration: 400,
                    element: e.target,
                    callback: function(element) {
                        drawer.invokeMenu = true;
                        drawer.checkIfMenuExists();
                        drawer.makeMenu(element);
                    }
                });
            }
            drawer.movedWhilePressing = false;
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