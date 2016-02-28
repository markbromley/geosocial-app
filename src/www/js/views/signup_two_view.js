/**
* Signup Two View. Data transmission signup view.
*
* @class SignupTwoView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/signup_page_2.html",
    "js/mods/error_mod",
    "js/bkgd/notify_mod",
    "js/mods/spinner_mod",
    "js/url_handle",
    "js/bkgd/local_storage_mod"
], function($, _, Backbone, signupTwoPage, errorBar, notify, spinner, 
    urlHandle, perStore){
    "use strict";
        var signupTwoView = Backbone.View.extend({
            // Private vars
            _signUpTwoUrlHash: "#signup_two",
            _homeUrlHash: "#home",
            _notifyStructure: {
                message: "Location updated",
                title: "Welcome",
                buttonName: "Ok"
            },

            /**
            * Fired when geolocation data successfully transmitted.
            *
            * @event geoSuccess
            */
            geoSuccessEvent: "geoSuccess",

            /**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(signupTwoPage),

            /**
            * Location error key.
            *
            * @property locErr
            * @type {string}
            */
            locErr: "location_error",

            /**
            * Initialises the view.
            *
            * @method initialize
            */
            initialize: function(){
                this.render();
            },

            /**
            * Renders the view template.
            *
            * @method render
            */
            render: function(){
                this.$el.html(this.template());
                this.checkIfGpsTransmitted();
                return this;
            },

            /**
            * Checks if the GPS data has been transmitted and binds associated
            * callbacks.
            *
            * @method checkIfGpsTransmitted
            */
            checkIfGpsTransmitted: function(){
                if(perStore.checkItemExists(this.locErr)){
                    if(perStore.getItem(this.locErr) === "false"){
                        // If there is NOT an error
                        this.locationFound();
                    }else{
                        this.locationNotFound();
                    }
                }else{
                    this.locationNotFound();
                }
            },

            /**
            * Called if location not found. Binds to geolocation success event
            * waiting for next event.
            *
            * @method locationNotFound
            */
            locationNotFound: function(){
                var callback = _.bind(this.locationFound, this);
                $(document).one(this.geoSuccessEvent, callback);
            },

            /**
            * Called if location found. Notifies the user that signup complete.
            *
            * @method locationFound
            */
            locationFound: function(){
                // Check this callback has been invoked whilst viewing the
                // correct page, else discard it
                if(urlHandle.getUrlHash() === this._signUpTwoUrlHash){
                    var that = this;
                    var confirmCallback = function(){
                        urlHandle.changeUrlHash(that._homeUrlHash);
                    };
                    // Good to go
                    notify.showAlert(this._notifyStructure.message,
                    confirmCallback,
                    this._notifyStructure.title, 
                    this._notifyStructure.buttonName, 
                    true, 
                    true);
                }
            }
        });
        return signupTwoView;
});