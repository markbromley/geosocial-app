/**
* Main View. The outer view for the application.
*
* @class MainView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/outer_page.html",
    "js/views/new_post_view",
    "js/url_handle",
    "js/bkgd/local_storage_mod",
    "js/bkgd/session_storage_mod",
    "js/mods/spinner_mod"
], function($, _, Backbone, outerPage, NewPost, urlHandle, perStore, 
    tmpStore, spinner){
    "use strict";
        var mainView = Backbone.View.extend({
            // Private vars
            _headerId: "header",
            _footerId: "footer",
            _appContainerId: "app_container",
            _noExistHash: "#noexist",
            _latestTempEncodeUrlKey: "latestTempEncodeUrl",
            _getPageHeightUrlString: function(docHeight, pageHeight){
                return "<style>body, #app_container{height:" + 
                        docHeight + "px;}.page{height:" + 
                        pageHeight + "px;}" + "</style>";
            },

            /**
            * Fired when the outer view is ready.
            *
            * @event mainViewReady
            */
            mainViewReadyEvent: "mainviewready",
            events:{
                "click #main_pop"       : "showPopover",
                "click #header_refresh" : "refreshPage"
            },
            el: $('body'),

            /**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(outerPage),

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
                $('body')[0].offsetWidth;
                this.createPageHeight();
                // Trigger the after render event to init the router in app.js
                $(document).trigger(this.mainViewReadyEvent);
                return this;
            },

            /**
            * Fits the application to the available device viewport.
            *
            * @method createPageHeight
            */
            createPageHeight: function(){
                var headerHeight = document.getElementById(this._headerId).clientHeight;
                var footerHeight = document.getElementById(this._footerId).clientHeight;
                var windowHeight = document.getElementById(this._appContainerId).clientHeight;
                var pageHeight = windowHeight - headerHeight - footerHeight;
                var docHeight = document.documentElement.clientHeight;
                var html = this._getPageHeightUrlString(docHeight, pageHeight);
                $(html).appendTo('head');
                $('body')[0].offsetWidth;
            },

            /**
            * Createa new Post popover view. Allows the user to create
            * a new post in the service.
            *
            * @method showPopover
            * @param {object} e The event object.
            */
            showPopover: function(e){
                e.preventDefault();
                var post = new NewPost();
            },

            /**
            * Refreshes the internal view of the application to update the
            * data.
            *
            * @method refreshPage
            * @param {object} e The event object.
            */
            refreshPage: function(e){
                e.preventDefault();
                // Delete this page, retrieve value from session storage and 
                // use as key to find data in local storage
                var curUrl = tmpStore.getItem(this._latestTempEncodeUrlKey);
                perStore.removeItem(curUrl);
                // Show spinner, set url hash to somewhere else temporarily 
                // and then back again to force the router to re-render the 
                // internal view
                spinner.showSpinner();
                var curHash = urlHandle.getUrlHash();
                urlHandle.changeUrlWithoutUpdatingHistory(this._noExistHash);
                setTimeout(function(){
                    urlHandle.changeUrlWithoutUpdatingHistory(curHash);
                    spinner.hideSpinner();
                }, 250);
            }
        });
        return mainView;
});