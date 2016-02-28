/**
* Force Logout View. Displayed when the user has been remotely logged out
* by the service.
*
* @class ForceLogoutView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/force_logout_page.html",
    "js/url_handle",
    "js/bkgd/local_storage_mod",
    "js/mods/error_mod",
    "js/bkgd/init_view"
], function($, _, Backbone, forceLogoutPage, urlHandle, perStore, 
    errorBar, StaticDataView){
    "use strict";
        var ForceLogoutView = Backbone.View.extend({
            template: _.template(forceLogoutPage),

            /**
            * Initialises the view.
            *
            * @method initialize
            */
            initialize: function(){
                this.render();
            },

            /**
            * Renders the template for the view.
            * 
            * @method render
            */
            render: function(){
                this.$el.html(this.template());
                return this;
            }
        });
        return ForceLogoutView;
});