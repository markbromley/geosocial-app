/**
* Help View. Provides a small popover view with help information relevant to
* the current view.
*
* @class HelpView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/help_dial.html",
    "js/bkgd/local_storage_mod",
    "js/url_handle"
], function($, _, Backbone, helpDialTemplate, perStore, urlHandle){
    "use strict";
    var ProfileView = Backbone.View.extend({
        el: ".help",
        events:{
            "click .close": "closeDialogue"
        },

        // Private vars
        _initialClass: "hide bounceOutDown",
        _hideClass: "animated bounceOutDown",
        _showClass: "animated bounceInUp",
        _animationLength: 1000,

        template: _.template(helpDialTemplate),

        /**
        * Populates the help with latest data and renders.
        *
        * @method initialize
        */
        initialize: function(options){
            var url = 'helpbox' + urlHandle.getUrlHash().split("/")[0];
            // Only show the message box once
            if(perStore.checkItemExists(url)){
                // If it has already been shown
                return null;
            }else{
                // If it has not yet been shown
                // Not a real backbone model - not necessary in this case
                perStore.setItem(url, 1);
                this.model = options;
                this.render();
            }//end if
        },

        /**
        * Renders the view template.
        *
        * @method render
        */
        render: function(){
            this.$el.html(this.template(this.model));
            this.$el.removeClass(this._initialClass).addClass(this._showClass);
            this.$el.show();
            return this;
        },

        /**
        * Closes the help dialog.
        *
        * @method closeDialogue
        * @param {object} e The event object.
        */
        closeDialogue: function(e){
            // Check if an event called the function and if so halt it
            if(e){
                e.preventDefault();
            }
            var that = this;
            this.$el.unbind();
            this.$el.removeClass(this._showClass);
            this.$el.addClass(this._hideClass);
            setTimeout(function(){
                that.$('p').unbind().remove();
                that.$el.removeClass(this._hideClass);
                that.$el.show().hide();
            }, this._animationLength);

        }
    });
    return ProfileView;
});