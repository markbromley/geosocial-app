/**
* Individual User View. Responsible for an individual user view.
*
* @class IndivUserView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/home_page.html",
    "text!tmpl/no_data_page.html",
    "js/collections/user_collection",
    "js/views/indiv_view.js",
    "js/ajax_error",
    "js/mods/error_mod",
    "js/url_handle",
    "js/mods/spinner_mod",
    "js/views/help_view",
    "backbonesubviews"

], function($, _, Backbone, homeTemplate, noDataTemplate, UserCollection, 
    IndividualUserView, ajaxError, errorBar, urlHandle, spinner, HelpView){
    "use strict";
        var HomeView = Backbone.View.extend({
            // Private vars
            _helpObj:{
                title: "Nearby People",
                message: "<p>Here you can see everyone who's nearby and how far away they are.</p><p>Tap and explore!</p>"
            },
            _noDataMessage: "Try looking for people nearby later or in a different location.",
            _loginHash: "#login",

            /**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(homeTemplate),

            /**
            * The no data template for the view.
            * 
            * @property templateNd
            * @type {Object}
            */
            templateNd: _.template(noDataTemplate),

            /**
            * Checks if the user is logged in and redirects if not.
            *
            * @method initialize
            */
            initialize: function(){
                var isLoggedIn = urlHandle.checkTokenExists();
                if(!isLoggedIn){
                    urlHandle.changeUrlHash(this._loginHash);
                }else{
                    this._postInitialize();
                }
            },

            /**
            * Fetches the user collection, binds callbacks and renders on
            * successful collection population.
            *
            * @method _postInitialize
            */
            _postInitialize: function(){
                spinner.showSpinner();
                Backbone.Subviews.add(this);
                var that = this;
                this.collection = new UserCollection();
                // Fetch the users and render once loaded 
                this.collection.fetch({
                    success: function (users) {
                        spinner.hideSpinner();
                        that.renderMain(users);
                    },
                    error: function(model, xhr, options){
                        spinner.hideSpinner();
                        ajaxError.fetchError(model, xhr, options);
                    },
                    afterSuccess: function(resp){
                        that.collection = new UserCollection(resp);
                        that.renderMain(resp);
                    }
                });
            },

            /**
            * Renders the standard view template.
            *
            * @method render
            */
            render: function(){
                this.$el.html(this.template());
                return this;
            },

            /**
            * Renders alternate view in case of there being no blocks data.
            *
            * @method renderNoData
            * @param {string} message The message to display if there is no data.
            */
            renderNoData: function(message){
                this.$el.html(this.templateNd({message: message}));
                return this;
            },

            /**
            * Renders the appropriate view template (dependent on whether
            * collection data available).
            *
            * @method renderMain
            * @param {array} users The list of users for the view.
            */
            renderMain: function(users){
                var help = new HelpView(this._helpObj);
                if(users.length === 0){
                    this.renderNoData(this._noDataMessage);
                }else{
                    this.render();
                }
            },

            /**
            * Renders the individual user view for each user in the
            * users collection.
            *
            * @property subviewCreators
            */
            subviewCreators: {
                "individualUserView" : function() {
                    var options = {collection: this.collection};
                    return new IndividualUserView(options);
                }
            }
        });
        return HomeView;
});