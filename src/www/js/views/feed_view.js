/**
* Feed View. Displays the local feed.
*
* @class FeedView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/feed_page.html",
    "text!tmpl/no_data_page.html",
    "js/collections/post_collection",
    "js/views/indiv_post_view.js",
    "js/ajax_error",
    "js/mods/spinner_mod",
    "js/views/help_view",
    "backbonesubviews"
], function($, _, Backbone, feedTemplate, noDataTemplate, PostCollection, 
    IndividualPostView, ajaxError, spinner, HelpView){
    "use strict";
        var FeedView = Backbone.View.extend({
            // Private vars
            _helpObj :{
                title: "Local Feed",
                message: "<p>Here you can see what's going on near you, right now.</p><p>To add a post, just tap the circular button at the bottom.</p><p>P.S. Don't worry if the posts move around and change. As you move, the feed will automatically update to show you the posts closest to you right now.</p>"
            },
            _renderNoDataString: "Try looking for nearby posts later or in a different location.",

            /**
            * The main template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(feedTemplate),

            /**
            * The no data template for the view.
            * 
            * @property templateNd
            * @type {Object}
            */
            templateNd: _.template(noDataTemplate),

            /**
            * Binds callbacks and fetches collection data before calling render.
            *
            * @method initialize
            */
            initialize: function(){
                spinner.showSpinner();
                Backbone.Subviews.add(this);
                var that = this;
                this.collection = new PostCollection();
                // Fetch the users and don't render until after data 
                this.collection.fetch({
                    success: function (posts) {
                        spinner.hideSpinner();
                        that.renderMain(posts);
                    },
                    error: function(model, xhr, options){
                        spinner.hideSpinner();
                        ajaxError.fetchError(model, xhr, options);
                    },
                    afterSuccess: function(resp){
                        that.collection = new PostCollection(resp);
                        that.renderMain(resp);
                    }
                });
            },

            /**
            * Renders the appropriate view template.
            *
            * @method render
            */
            render: function(){
                this.$el.html(this.template());
                return this;
            },

            /**
            * Renders the no data view.
            *
            * @method renderNoData
            * @param {string} message The message for the no data view.
            */
            renderNoData: function(message){
                this.$el.html(this.templateNd({message: message}));
                return this;
            },

            /**
            * Renders the main view template.
            *
            * @method renderMain
            * @param {object} resp The response object.
            */
            renderMain: function(resp){
                var help = new HelpView(this._helpObj);
                if(resp.length === 0){
                    this.renderNoData(this._renderNoDataString);
                }else{
                    this.render();
                }
            },

            /**
            * Renders the individual post view for each post in the
            * feed collection.
            *
            * @property subviewCreators
            */
            subviewCreators: {
                "individualPostView" : function() {
                    var options = {collection: this.collection};
                    return new IndividualPostView(options);
                }
            }
        });
        return FeedView;    
});