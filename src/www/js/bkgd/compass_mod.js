/**
* Wraps the naviagtor heading API and handles success/ error
* events. Fires success event on successful completion.
*
* @class CompassMod
* @constructor
*/ 
define([
    "jquery",
    "underscore"
], function($, _){
    "use strict";
    return{
        /**
        * Fired when compass data available
        *
        * @event compReady
        * @param {object} compResult The compResult object.
        */
        compReadyEvent: "compReady",

        /**
        * Storage object for the result of the navigator heading API.
        * 
        * @property geoResult
        * @type {object}
        */
        compResult:{

        },
        /**
        * Calls the API to access current heading. Binds success and error
        * callbacks to the API callbacks.
        *
        * @method initialize
        */
        initialize: function(){
            if (navigator.compass){
                navigator.compass.getCurrentHeading(
                    _.bind(this.compSuccess,this), 
                    _.bind(this.compError,this));
            }else{
                $(document).trigger(this.compReadyEvent, [this.compResult]);
            }
        },

        /**
        * Called on successful identification of the device current heading.
        *
        * @method compSuccess
        * @param {object} heading The heading object returned from the API.
        */
        compSuccess: function(heading){
            this.compResult = {
                comp_heading: heading.magneticHeading
            };
            $(document).trigger(this.compReadyEvent, [this.compResult]);
        },

        /**
        * Called on failure to identify device current heading.
        *
        * @method compError
        * @param {object} error The error returned from the heading API.
        */
        compError: function(error){
            this.compResult = {
                comp_error_code: error.code
            };
            $(document).trigger(this.compReadyEvent, [this.compResult]);
        }
    };//end of return
});