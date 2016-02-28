/**
* Represents the initial data transmission. This viewController has no associated
* template.
*
* @class InitView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "js/bkgd/init_collection",
    "js/bkgd/glob_mod",
    "js/bkgd/device_mod",
    "js/ajax_error"
], function($, _, Backbone, InitCollection, globMod, devMod, ajaxError){
        "use strict";
        var InitView = Backbone.View.extend({
            /**
            * Represents the initial data model. Mimics the data structure
            * expected by the service.
            * 
            * @property newModel
            * @type {Object}
            */
            newModel: {
                dev_cordova: null,
                dev_platform: null,
                dev_uuid: null,
                dev_model: null,
                dev_version: null,
                pref_lang: null,
                pref_lang_err: null,
                locale: null,
                locale_err: null,
                nav_platform: navigator.platform,
                nav_ua: navigator.userAgent
            },

            // Private vars
            _globLangReadyEvent: "globLangReady",
            _globLocaleReadyEvent: "globLoacaleReady",
            _devInfoReadyEvent: "devInfoReady",

            _count: 0,
            _initCollection:{},

            /**
            * Adds listeners for the location, compass and connection events.
            * Initialises all associated models.
            *
            * @method initialize
            */
            initialize: function(){
                // Set the necessary attributes and add callbacks
                this._initCollection = new InitCollection();
                
                var that = this;
                //wait for the events
                $(document).on(this._globLangReadyEvent, function(event, obj){
                    that.extendModel(obj);
                });

                $(document).on(this._globLocaleReadyEvent, function(event, obj){
                    that.extendModel(obj);
                });

                $(document).on(this._devInfoReadyEvent, function(event, obj){
                    that.extendModel(obj);
                });

                var dev = devMod.initialize();
                var glob = globMod.initialize();
            
            },

            /**
            * Extends the init data model with the new data object supplied.
            * Checks to see if the init data model is complete (e.g. all
            * callbacks have fired).
            *
            * @method extendModel
            * @param {object} obj The object to extend the init data model with.
            */
            extendModel: function(obj){
                $.extend(this.newModel, obj);
                this._count ++;
                this._checkCount();
            },

            /**
            * Checks to see if the init data model is fully populated and
            * creates the collection if so.
            *
            * @method _checkCount
            */
            _checkCount: function(){
                if(this._count === 3){
                    this._count = 0;
                    var that = this;
                    this.initCreate(that);
                }
            },

            /**
            * Creates a new init data collection and attaches associated
            * callbacks.
            *
            * @method initCreate
            * @param {object} scope Function scope.
            */
            initCreate: function(scope){
                this._initCollection.create(this.newModel,{
                    wrap: true,
                    success: this.createSuccess,
                    error: this.createError
                });
            },

            /**
            * New init data collection success callback.
            *
            * @method createSuccess 
            * @param {object} collection The collection.
            * @param {object} response The response.
            */
            createSuccess: function(collection, response){
                // Deal with these functiosn at a later date...
                // Once more is known about the server set up
            },

            /**
            * New init data collection error callback.
            *
            * @method createError
            * @param {object} err The error.
            * @param {object} response The response.
            */
            createError: function(err, response){
                // Deal with these functiosn at a later date...
                // Once more is known about the server set up
                ajaxError.createError(err, response);
            }
        });
        return InitView;
});