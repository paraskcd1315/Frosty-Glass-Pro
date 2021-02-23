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
    makeMenu: function(element) {
        let mainDiv = domMaker.init({
                type: 'div',
                id: element.id + ".Menu",
                className: "drawerMenu closed",
            }),
            appName = domMaker.init({
                type: "div",
                id: "appName",
                className: "drawerHeader",
                innerHTML: element.getAttribute("name")
            })
            addApp = domMaker.init({
                type: 'div',
                id: "addApp",
                className: "menuButton",
                innerHTML: "Add to Homescreen"
            }),
            deleteApp = domMaker.init({
                type: 'div',
                id: "deleteApp",
                className: "menuButton",
                innerHTML: "Uninstall App"
            }),
            cancel = domMaker.init({
                type: 'div',
                id: "closeMenu",
                className: "menuButton",
                innerHTML: "Cancel"
            });
        mainDiv.addEventListener("touchend", this.menuEvents, false);
        domMaker.domAppender({
            div: mainDiv,
            children: [appName, addApp, deleteApp, cancel]
        });
        return mainDiv;
    },
    menuEvents: function(e) {
        if(e.target.className == 'menuButton') {
            let menu = e.target.parentElement;
            let app = e.target.parentElement.parentElement;
            switch(e.target.id) { 
                case 'deleteApp':
                    api.apps.deleteApplication(app.id);
                    break;
            }
            menu.classList.add('closed');
            setTimeout(() => {
                app.removeChild(menu);
                drawer.invokeMenu = false;
            }, 350);  
        }
    },
    checkIfMenuExists: function() {
        let menu = document.querySelector(".drawerMenu");
        if(menu) {
            menu.classList.add('closed');
            setTimeout(() => menu.parentElement.removeChild(menu), 350);
        }
    },
    appEvent: function(e) {
        if(e.target.id && e.target.className == 'drawerApp') {
            if(!(drawer.invokeMenu) && !(drawer.movedWhilePressing)) {
                api.apps.launchApplication(e.target.id);
            }
            touchHold.init({
                duration: 400,
                element: e.target,
                callback: function(element) {
                    drawer.invokeMenu = true;
                    drawer.checkIfMenuExists();
                    let menu = drawer.makeMenu(element);
                    element.appendChild(menu);
                    setTimeout(() => menu.classList.remove("closed"), 350);
                }
            })
        }
    },
    init: function() {
        this.drawer = this.makeDrawer();
        this.header = this.makeHeader();
        this.close = this.makeCloseButton();
        this.search = this.makeSearchBar();
        this.content = this.makeAppHolder();
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