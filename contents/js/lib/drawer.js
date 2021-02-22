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
        return this.displayApps(paginatedItems, page);
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
    displayApps: function(filteredApps, page) {
        const htmlString = filteredApps.map((app) => {
            return `<div id='${app.identifier}' class='drawerApp'>
                        <img id='${app.identifier}+.icon' src='${app.icon}' class='drawerAppIcon' />
                        <div id='${app.identifier}+.name' class='drawerAppName'>
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
        let totalPages = Math.ceil(drawer.allApplications.length / per_page);
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
    init: function() {
        this.drawer = this.makeDrawer();
        this.close = this.makeCloseButton();
        this.search = this.makeSearchBar();
        this.content = this.makeAppHolder();
        this.fillPages();
        domMaker.domAppender({
            div: this.drawer,
            children: [this.close, this.search, this.content]
        });
        document.body.appendChild(this.drawer);
    }
}