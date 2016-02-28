/**
* Individual Post View. Responsible for an individual post view in the feed.
*
* @class IndivPostView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/indiv_post.html"
], function($, _, Backbone, IndPostTmpl){
    "use strict";
        var individualPostsView = Backbone.View.extend({

            /**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(IndPostTmpl),

            /**
            * Renders the individual post view.
            *
            * @method render
            */
            render: function(){
                this.collection.each(function(post){
                    post = $(this.template(post.toJSON()));
                    this.$el.append(post);
                },this);
                return this;
            }
        });
        return individualPostsView;
});