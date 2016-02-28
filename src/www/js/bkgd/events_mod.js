/**
* Wraps the events fired by Cordova. Fires events again with fixed name.
* Performs basic error handling of some critical errors.
*
* @class EventsMod
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "js/ajax_error"
], function($, _, ajaxError){
    "use strict";
    return{

        // Private vars
        _batteryCriticalErrorHash: "#error/3",

        /**
        * Fired when battery reaches critical level.
        *
        * @event batteryCritical
        */
        batteryCriticalEvent: "npbatterycritical",

        /**
        * Fired when battery reaches low level.
        *
        * @event batteryLow
        */
        batteryLowEvent: "npbatteryLow",

        /**
        * Fired when battery status changes.
        *
        * @event batteryStatus
        */
        batteryStatusEvent:"npbatterystatus",

        /**
        * Fired when device becomes online.
        *
        * @event online
        */
        onlineEvent: "nponline",

        /**
        * Fired when device becomes offline.
        *
        * @event offline
        */
        offlineEvent: "npoffline",

        /**
        * Fired when application is paused.
        *
        * @event pause
        */
        pauseEvent: "nppause",

        /**
        * Fired when application is resumed.
        *
        * @event resume
        */
        resumeEvent: "npresume",

        /**
        * Fired when back button is pressed.
        *
        * @event backButton
        */
        backButtonEvent: "npbackbutton",
    
        /**
        * Wraps the Cordova events and forwards to associated method.
        *
        * @method init
        */
        init: function(){
            //window based event
            window.addEventListener("batterycritical", _.bind(this.batteryCritical, this), false);
            window.addEventListener("batterylow", _.bind(this.batteryLow,this), false);
            window.addEventListener("batterystatus", _.bind(this.batteryStatus,this), false);
    
            //document based event
            document.addEventListener("online", _.bind(this.online, this), false);
            document.addEventListener("offline", _.bind(this.offline,this), false);
            document.addEventListener("pause", _.bind(this.pause,this), false);
            document.addEventListener("resume", _.bind(this.resume, this), false);
            document.addEventListener("backbutton", _.bind(this.backButton,this), false);
        },

        /**
        * Triggers battery critical event with data.
        * Changes view to battery critical view.
        *
        * @method batteryCritical
        * @param {object} info The data for the event.
        */
        batteryCritical: function(info){
            $(window).trigger(this.batteryCriticalEvent, info);
            window.location.hash = this._batteryCriticalErrorHash; // TODO: Add to ajax error enum
        },

        /**
        * Triggers battery low event with data.
        * Changes view to battery low view.
        *
        * @method batteryLow
        * @param {object} info The data for the event.
        */
        batteryLow: function(info){
            $(window).trigger(this.batteryLowEvent, info);
            ajaxError.generalError(3);
        },

        /**
        * Triggers battery status event with data.
        *
        * @method batteryStatus
        * @param {object} info The data for the event.
        */
        batteryStatus: function(info){
            $(window).trigger(this.batteryStatusEvent, info);
        },

        /**
        * Triggers online event.
        *
        * @method online
        */
        online: function(){
            $(document).trigger(this.onlineEvent);
        },

        /**
        * Triggers offline event.
        *
        * @method offline
        */
        offline: function(){
            $(document).trigger(this.offlineEvent);
            ajaxError.generalError(2);
        },

        /**
        * Triggers pause event.
        *
        * @method pause
        */
        pause: function(){
            $(document).trigger(this.pauseEvent);
        },

        /**
        * Triggers resume event.
        *
        * @method resume
        */
        resume: function(){
            $(document).trigger(this.resumeEvent);
        },

        /**
        * Triggers backButton event.
        *
        * @method backButton
        */
        backButton: function(){
            $(document).trigger(this.backButtonEvent);
        }
};//end of return
});