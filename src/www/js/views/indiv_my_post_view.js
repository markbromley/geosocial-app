/**
* Individual My Post View. Responsible for an individual post view on a user's profile.
*
* @class IndivMyPostView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/indiv_post.html",
    "text!tmpl/no_data_my_posts_page.html",
], function($, _, Backbone, IndPostTmpl, noDataTemplate){
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
            * The no data template for the view.
            * 
            * @property templateNd
            * @type {Object}
            */
            templateNd: _.template(noDataTemplate),

            /**
            * Renders the individual post view.
            *
            * @method render
            */
            render: function(){
                var posts = this.collection;
                if(posts.length === 0){
                    this.$el.html(this.templateNd());
                }
                for (var i = 0; i < posts.length; i++) {
                    var post = $(this.template(posts[i]));
                    this.$el.append(post);
                }
                return this;
            }
        });
        return individualPostsView;
});