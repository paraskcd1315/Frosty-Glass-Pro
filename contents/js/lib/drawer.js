//Script by Paras Khanchandani https://twitter.com/ParasKCD

var drawer = {
    searchFlag: false,
    allApplications: api.apps.allApplications,
    drawer: "",
    close: "",
    search: "",
    content: "",
    paginator: function(items, page) {
        var page = page || 1,
            per_page = 24,
            offset = (page - 1) * per_page,
            paginatedItems = items.slice(offset).slice(0, per_page);
            total_pages = Math.ceil(items.length / per_page);
        this.displayApps(paginatedItems);
    },
    makeDrawer: function() {
        return domMaker.init({
            type: "div",
            id: "drawer",
            className: "closed",
        });
    },
    makeSearchBar: function() {
        let mainDiv = domMaker.init({
                type: "div",
                id: "drawerSearchContainer",
            }),
            searchInput = domMaker.init({
                type: "input",
                id: "drawerSearchTextField",
                className: "inputTextField",
                inputType: "search"
            });
        searchInput.addEventListener("keyup", (e) => this.searchEvent(e));
        mainDiv.appendChild(searchInput);
        return mainDiv;
    },
    makeCloseButton: function() {
        return domMaker.init({
            type: "div",
            id: "closeButtonContainer",
            className: "drawerButton",
            innerHTML: "X"
        });
    },
    makeAppHolder: function() {
        return domMaker.init({
                type: "div",
                id: "drawerContent",
        });
    },
    displayApps: function(filteredApps) {
        const htmlString = filteredApps.map((app) => {
            return `<div id='${app.identifier}' class='drawerApp'>
                        <img id='${app.identifier}+.icon' src='${app.icon}' class='drawerAppIcon' />
                        <div id='${app.identifier}+.name' class='drawerAppName'>
                            ${app.name}
                        </div>
                    </div>`
        }).join('');
        if(this.searchFlag) {
            this.content.innerHTML = htmlString;
        } else {
            this.content.innerHTML += htmlString;
        }
    },
    searchFunc: function(e) {
        const searchString = e.target.value.toLowerCase();
        const filteredApps = this.allApplications.filter((app) => {
            return (app.name.toLowerCase().includes(searchString));
        });
        drawer.displayApps(filteredApps);
    },
    searchEvent: function(e) {
        loadPage.searchFlag = true;
        if(e.target.value) {
            drawer.searchFunc(e);
        } else {
            drawer.paginator(drawer.allApplications, 1);
        }
    },
    init: function() {
        this.drawer = this.makeDrawer();
        this.close = this.makeCloseButton();
        this.search = this.makeSearchBar();
        this.content = this.makeAppHolder();
        this.paginator(this.allApplications, 1);
        domMaker.domAppender({
            div: this.drawer,
            children: [this.close, this.search, this.content]
        });
        document.body.appendChild(this.drawer);
    }
}