/**
* Login View. Responsible for the login view.
*
* @class LoginView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/login_page.html",
    "js/url_handle",
    "js/bkgd/local_storage_mod",
    "js/mods/error_mod",
    "js/bkgd/init_view"
], function($, _, Backbone, loginPage, urlHandle, perStore, errorBar, 
    StaticDataView){
    "use strict";
        var termsView = Backbone.View.extend({
            // Private vars
            _loginEmailElement: "#login_email",
            _loginPasswordElement: "#login_password",

            _homeHash: "#home",
            _loginUrlSegment: "/login",

            _getElementByID: function(id){
                return this.$(id);
            },

            events:{
                'submit form': 'submitLogin'
            },

            /**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(loginPage),

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
            * Submits the login credentials and binds success/ error callbacks.
            *
            * @method submitLogin
            * @param {object} e The event object.
            */
            submitLogin: function(e){
                e.preventDefault();
                perStore.clear();
                var modelObj = {};
                    modelObj.email = this._getElementByID(
                        this._loginEmailElement).val().toLowerCase();
                    modelObj.password = this._getElementByID(
                        this._loginPasswordElement).val();
                var url = urlHandle.createUrlFromSegment(this._loginUrlSegment);
                var success = _.bind(this.submitSuccess, this);
                var error = _.bind(this.submitError, this);
                //ajax options below
                var opts ={
                    type:"POST",
                    success: success,
                    url: url,
                    data: modelObj,
                    dataType: 'json',
                    error: error
                };
                $.ajax(opts);
            },

            /**
            * Success callback for submitting login credentials.
            *
            * @method submitSuccess
            * @param {object} The data object.
            * @param {object} The textStatus object.
            * @param {object} The jqXhr object.
            */
            submitSuccess: function(data, textStatus, jqXhr){
                urlHandle.addUrlTokenToStorage(data.token);
                var stat = new StaticDataView();
                urlHandle.changeUrlHash(this._homeHash);
            },

            /**
            * Error callback for submitting login credentials.
            *
            * @method submitError
            * @param {object} The data object.
            * @param {object} The textStatus object.
            * @param {object} The jqXhr object.
            */
            submitError: function(data, textStatus, jqXhr){
                res = JSON.parse(data.response);
                errorBar.showError(res.description);
            }
        });
        return termsView;
});