/**
* Wraps the device API.
* Fires success event on successful device type identification.
*
* @class DeviceMod
* @constructor
*/ 
define([
    "jquery",
], function($){
    "use strict";
    return{
        /**
        * Fired when device type data is available.
        *
        * @event devInfoReady
        * @param {object} devResult The devResult object.
        */
        devInfoReadyEvent: "devInfoReady",

        /**
        * Storage object for the result of the window device API.
        * 
        * @property devResult
        * @type {Object}
        */
        devResult:{},

        /**
        * Attempts to access devcie type data and fires success event
        * if possible.
        *
        * @method initialize
        */
        initialize: function(){
            if (window.device !== undefined){
                this.devResult ={
                    dev_cordova: device.cordova,
                    dev_platform: device.platform,
                    dev_uuid: device.uuid,
                    dev_model: device.model,
                    dev_version: device.version
                };
            }
            $(document).trigger(this.devInfoReadyEvent, [this.devResult]);
        }
    };//end of return value
});