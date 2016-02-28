/**
* Settings View. Responsible for Settings options view.
*
* @class SettingsView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/settings_page.html",
    "js/url_handle",
    "js/bkgd/local_storage_mod",
    "js/mods/error_mod",
    "js/bkgd/notify_mod"

], function($, _, Backbone, settingsPage, urlHandle, perStore, errorBar, 
    notify){
    "use strict";
        var profileView = Backbone.View.extend({
            // Private vars
            _confirmStructure:{
                title: "Sign Out",
                message: "Are you sure you want to Sign Out?",
                options: ["No", "Yes"]
            },
            _loginHash: "#login",
            _logoutUrlSegment: "/logout",
            _logoutErrorMessage: "Logout error occured.",
            events:{
                'click #settings_logout': 'confirmLogout'
            },

            /**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(settingsPage),

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
                return this;
            },

            /**
            * Displays a confirmation message, establishing if the user wishes
            * to log out of the service.
            *
            * @method confirmLogout
            * @param {object} e The event object.
            */
            confirmLogout: function(e){
                e.preventDefault();
                //bind the callback to this view
                var calllback = _.bind(this.logOutDecision, this);
                notify.showConfirm(
                    this._confirmStructure.message,
                    calllback,
                    this._confirmStructure.title,
                    this._confirmStructure.options,
                    true,
                    false
                );
            },

            /**
            * Evaluates the user's decision and logs the user out, if requested.
            *
            * @method logOutDecision
            * @param {number} val The value of the confirmation option selected.
            */
            logOutDecision: function(val){
                if(val == 2 || val == -1){
                    this.logOut();
                }
            },

            /**
            * Attempts to log the user out of the service.
            *
            * @method logOut
            */
            logOut: function(){
                var url = urlHandle.createUrlFromSegmentWithOptions(
                    this._logoutUrlSegment);
                var success = _.bind(this.logOutSuccess, this);
                var error = _.bind(this.logOutError, this);
                // Ajax options below
                var opts ={
                    type:"GET",
                    success: success,
                    url: url,
                    error: error
                };
                // Submit the request
                $.ajax(opts);
            },

            /**
            * Success callback for logging the user out of the service.
            *
            * @method logOutSuccess
            * @param {object} The data object.
            * @param {object} The textStatus object.
            * @param {object} The jqXhr object.
            */
            logOutSuccess: function(data, textStatus, jqXhr){
                perStore.clear();
                urlHandle.changeUrlHash(this._loginHash);
            },

            /**
            * Error callback for logging the user out of the service.
            *
            * @method logOutError
            * @param {object} The data object.
            * @param {object} The textStatus object.
            * @param {object} The jqXhr object.
            */
            logOutError: function(data, textStatus, jqXhr){
                perStore.clear();
                urlHandle.changeUrlHash(this._loginHash);
                errorBar.showError(this._logoutErrorMessage);
            }
        });
        return profileView;
});