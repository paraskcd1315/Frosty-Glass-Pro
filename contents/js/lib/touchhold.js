/*
Inspired by Junesiphone's taphold.js
Script by Paras Khanchandani https://twitter.com/ParasKCD

#Usage:-
 touchHold.init({
     duration: 400,
     element: element,
     callback: function(element) {
         //do something
     }
 })
*/

var touchHold = {
    duration: null,
    callback: null,
    timer: null,
    clearTimer: function() {
        if(this.timer) clearTimeout(this.timer);
    },
    tapEvent: function(event) {
        this.clearTimer;
        this.timer = setTimeout(() => touchHold.callback(event.target, event), touchHold.timer);
    },
    addEvents: function(element) {
        element.addEventListener('touchstart', this.tapEvent, false);
        element.addEventListener('touchmove', this.clearTimer, false);
        element.addEventListener('touchend', this.clearTimer, false);
        element.addEventListener('touchcancel', this.clearTimer, false);
    },      
    init: function(params) {
        this.duration = params.duration;
        this.callback = params.callback;
        this.addEvents(params.element);
    }
}