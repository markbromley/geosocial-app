/**
* Wraps the geolocation API and handles success/ error
* events. Fires success event on successful completion.
*
* @class GeolocationMod
* @constructor
*/ 
define([
"jquery",
"underscore",
"js/url_handle",
"js/bkgd/local_storage_mod"
], function($, _, urlHandle, perStore){
    "use strict";
    return{
        /**
        * Options used for geolocation API.
        * 
        * @property geoOptions
        * @type {Object}
        */
        geoOptions: {
            maximumAge: 10000,
            timeout: 10000, 
            enableHighAccuracy: true
        },

        /**
        * Storage object for the result of the geolocation API.
        * 
        * @property geoResult
        * @type {Object}
        */
        geoResult:{},

        /**
        * Fired when geolocation data available.
        *
        * @event geoReady
        * @param {object} geoResult The geoResult object.
        */
        geoReadyEvent: "geoReady",

        /**
        * Fired when geolocation API successfully identifies location
        *
        * @event geoSuccess
        */
        geoSuccessEvent: "geoSuccess",


        // Private vars
        _locationErrorAccessDeniedPage: "#error/4",
        _locationErrorHardwareFaultPage: "#error/5",
        _locationErrorStaleDataPage: "#error/6",
        //Below is used in sign up page two view and ajaxError module
        // -brittle.. should be abstracted as constant
        locErr: "location_error",

        /**
        * Initialises Geolcoation Module. Gets location if API available.
        * @method initialize
        */
        initialize: function(){
            if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                    _.bind(this.geoSuccess, this), 
                    _.bind(this.geoError, this), 
                    this.GeoOptions);
            }
        },

        /**
        * Called on successful determination of user location. Sets
        * geolocation object values accordingly and triggers success event.
        *
        * @method geoSuccess
        * @param {Object} position The position object returned on success of
        *                 the geolocation API.
        */
        geoSuccess: function(position){
            this.geoResult = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitude: position.coords.altitude,
                accuracy: position.coords.accuracy,
                altitude_accuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
                timestamp: position.timestamp
            };
            $(document).trigger(this.geoReadyEvent, [this.geoResult]);
            $(document).trigger(this.geoSuccessEvent);
            if(perStore.getItem(this.locErr) == "true"){
                // If there is currently an error
                var currentUrlHash = urlHandle.getUrlHash();
                if(!this.checkNotLocationErrorPage(currentUrlHash)){
                    urlHandle.goBackN(1); // go back to the previous page
                }
            }
            perStore.setItem(this.locErr, "false");
        },

        /**
        * Checks that the urlHash supplied doesn't correspond to any of the
        * location error pages.
        * 
        * @method checkNotLocationErrorPage
        * @param urlHash The hash of the URL to check.
        * @return True if urlhash is not a location error page.
        */
        checkNotLocationErrorPage: function(urlHash){
            if(urlHash != this._locationErrorAccessDeniedPage &&
               urlHash != this._locationErrorHardwareFaultPage &&
               urlHash != this._locationErrorStaleDataPage){
                return true;
            }else{
                return false;
            }
        },

        /**
        * Called on error of the geolocation API. Handles error and redirects
        * user appropriately. 
        *
        * @method geoError
        * @param {Object} error The error object returned by the geolocation
        *                 API.
        */
        geoError: function(error){
            var currentUrlHash = urlHandle.getUrlHash();
            perStore.setItem(this.locErr, "true");
            if(error.code == 1){
                if(this.checkNotLocationErrorPage(currentUrlHash)){
                    urlHandle.changeUrlHash(this._locationErrorAccessDeniedPage);
                }
            }else if(error.code == 2 || error.code == 3){
                if(this.checkNotLocationErrorPage(currentUrlHash)){
                    urlHandle.changeUrlHash(this._locationErrorHardwareFaultPage);
                }
            }
            this.geoResult = {
                geo_error_code: error.code,
                geo_error_message: error.message
            };
            $(document).trigger(this.geoReadyEvent, [this.geoResult]);
        }
    };//end of return
});