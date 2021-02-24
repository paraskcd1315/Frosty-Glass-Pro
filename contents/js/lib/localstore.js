var localstore = {
    storageName: "",
    storageData: [],
    load: function() {
        let storage = JSON.parse(localStorage.getItem(this.storageName));
        if(storage) {
            for(let i = 0; i < this.storageData.length; i++) {
                localstore[localstore.storageData[i]] = storage[localstore.storageData[i]];
            }
        }
    },
    save: function() {
        let storage = {};
        for(let i = 0; i < this.storageData.length; i++) {
            storage[localstore.storageData[i]] = localstore[localstore.storageData[i]];
        }
        localStorage.setItem(this.storageName, JSON.stringify(storage));
    },
    addApp: function(arrayName, app) {
        //check if array exists
        if(localstore[arrayName]) {
            //check if app exists already in that array
            if(localstore[arrayName].indexOf(app) > -1) {
                alert('App already placed');
                return;
            } else {
                localstore[arrayName].push(app);
            }
        } else {
            localstore[arrayName] = [app];
        }
        localstore.storageData.push(arrayName);
        this.save();
    },
    replaceApp: function(arrayName, older, newer) {
        if(localstore[arrayName].indexOf(newer) > -1) {
            alert('App already placed');
            return;
        } else {
            let index = this[arrayName].indexOf(older);
            if(index !== -1) {
                this[arrayName][index] = newer;
            }
            this.save();
        }
    },
    changeAppOrder: function(arrayName, appA, appB) {
        let indexA = this[arrayName].indexOf(appA);
        let indexB = this[arrayName].indexOf(appB);
        this[arrayName][indexA] = appB;
        this[arrayName][indexB] = appA;
        this.save();
    },
    addValue: function(name, value) {
        localstore[name] = value;
        localstore.storageData.push(name);
        this.save();
    },
    removeValue: function(name) {
        localstore[name] = null;
        let index = this.storageData.indexOf(name);
        this.storageData.splice(index, 1);
        this.save();
    },
    resetStorage: function() {
        localStorage.removeItem(localstore.storageName);
        location.href = location.href;
    },
    init: function(params) {
        this.storageName = params.storageName;
        if(localStorage.getItem(this.storageName)) {
            localstore.storageData = Object.keys(JSON.parse(localStorage.getItem(localstore.storageName)));
            this.load();
            return
        } else {
            localstore[localstore.storageName] = [];
        }
    }
}