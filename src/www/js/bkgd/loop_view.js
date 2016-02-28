/**
* Represents the live data transmission. This viewController has no associated
* template.
*
* @class LiveView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "js/bkgd/loop_collection",
    "js/bkgd/geolocation_mod",
    "js/bkgd/compass_mod",
    "js/bkgd/conn_mod",
    "js/ajax_error"
], function($, _, Backbone, LoopCollection, geolocationMod, compassMod, 
    connMod, ajaxError){
        "use strict";
        var LoopView = Backbone.View.extend({
            /**
            * Represents the live data model. Mimics the data structure
            * expected by the service.
            * 
            * @property newModel
            * @type {Object}
            */
            newModel: {
                latitude: null,
                longitude: null,
                altitude: null,
                accuracy: null,
                altitude_accuracy: null,
                heading: null,
                speed: null,
                timestamp: null,
                geo_error_code: null,
                geo_error_message: null,
                comp_heading: null,
                comp_error_code: null,
                connection: null
            },

            // Private vars
            _geoReadyEvent: "geoReady",
            _compReadyEvent: "compReady",
            _connReadyEvent: "connReady",

            _count: 0,
            _loopCollection:{
            },

            /**
            * Adds listeners for the location, compass and connection events.
            * Initialises all associated models.
            *
            * @method initialize
            */
            initialize: function(){
                // Sets the necessary attributes, adds them to the server
                this._loopCollection = new LoopCollection();

                var that = this;
                $(document).one(this._geoReadyEvent, function(event, obj){
                    that.extendModel(obj);
                });

                $(document).one(this._compReadyEvent, function(event, obj){
                    that.extendModel(obj);
                });
                
                $(document).one(this._connReadyEvent, function(event, obj){
                    that.extendModel(obj);
                });

                var geo = geolocationMod.initialize();
                var comp = compassMod.initialize();
                var conn = connMod.initialize();
            },

            /**
            * Extends the live data model with the new data object supplied.
            * Checks to see if the live data model is complete (e.g. all
            * callbacks have fired).
            *
            * @method extendModel
            * @param obj The object to extend the live data model with.
            */
            extendModel: function(obj){
                $.extend(this.newModel, obj);
                this._count ++;
                this._checkCount();
            },

            /**
            * Checks to see if the live data model is fully populated and
            * creates the collection if so.
            *
            * @method _checkCount
            */
            _checkCount: function(){
                if(this._count === 2){
                    this._count = 0;
                    var that = this;
                    this.loopCreate(that);
                }
            },

            /**
            * Creates a new live data collection and attaches associated
            * callbacks.
            *
            * @method loopCreate
            * @param {object} scope Function scope.
            */
            loopCreate: function(scope){
                this._loopCollection.create(this.newModel,{
                    wrap: true,
                    success: this.createSuccess,
                    error: this.createError
                });
            },

            /**
            * New live data collection success callback.
            *
            * @method createSuccess 
            * @param {object} collection The collection.
            * @param {object} response The response.
            */
            createSuccess: function(collection, response){
                // Deal with these functions at a later date... once 
                // more is known about the server set up
            },

            /**
            * New live data collection error callback.
            *
            * @method createError
            * @param {object} err The error.
            * @param {object} response The response.
            */
            createError: function(err, response){
                // Deal with these functions at a later date... once 
                // more is known about the server set up
                ajaxError.createError(err, response);
                console.log("GPS Create Errors from Server: ");
                console.log(err);
                console.log(response);
            }
        });
        return LoopView;
});