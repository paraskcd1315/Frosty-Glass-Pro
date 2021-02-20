//Script by Paras Khanchandani https://twitter.com/ParasKCD

var domMaker = {
    element: "",
    domAppender: function(params) {
        for(let i = 0; i < params.children.length; i++) {
            params.div.appendChild(params.children[i]);
        }
    },
    init: function(params) {
        this.element = document.createElement(params.type);
        if(params.id) {
            this.element.id = params.id;
        }
        if(params.src) {
            this.element.src = params.src;
        }
        if(params.className) {
            this.element.className = params.className;
        }
        if(params.innerHTML) {
            this.element.innerHTML = params.innerHTML;
        }
        if(params.attribute) {
            this.element.setAttribute(attribute[0], attribute[1]);
        }
        if(params.attribute2) {
            this.element.setAttribute(attribute2[0], attribute2[1]);
        }
        return this.element;
    }
}