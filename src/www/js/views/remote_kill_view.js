/**
* Remote Kill View. Displayed when the application is remotely disabled.
*
* @class RemoteKillView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/remote_kill_page.html",
    "js/url_handle",
    "js/bkgd/local_storage_mod",
    "js/mods/error_mod",
    "js/bkgd/init_view"

], function($, _, Backbone, remoteKillPage, urlHandle, perStore, errorBar, StaticDataView){
    "use strict";
        var RemoteKillView = Backbone.View.extend({ 
            template: _.template(remoteKillPage),   
            /**
            * Sets up the remote kill view.
            *
            * @method initialize
            */
            initialize: function(){
                this.render();
            },  
            /**
            * Renders the remote kill view.
            *
            * @method render
            */
            render: function(){
                this.$el.html(this.template());
                return this;
            }
        });
        return RemoteKillView;
});