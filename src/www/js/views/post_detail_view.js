/**
* Post Detail View. Responsible for the full post view.
*
* @class PostDetailView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/post_detail_page.html",
    "js/models/post_model",
    "js/url_handle",
    "js/ajax_error",
    "js/mods/spinner_mod"
], function($, _, Backbone, postDetailTemplate, PostModel, urlHandle, 
    ajaxError, spinner){
    "use strict";
        var postView = Backbone.View.extend({
            // Private vars
            events:{
                "click #like" : "createNewLike"
            },
            _likeButtonStructure:{
                removeClass: "not_liked ss-like",
                addClass: "liked ss-dislike",
                text: " Unlike"
            },
            _unLikeButtonStructure:{
                removeClass: "liked ss-dislike",
                addClass: "not_liked ss-like",
                text: " Like"
            },
            _likesString: " likes",

            _likeElement: "#like",
            _likesUrlSegment: "/likes",
            _fourthClass: "fourth",

            /**
            * Indicates if the post is liked by the current user.
            * 
            * @property isLiked
            * @type {boolean}
            */
            isLiked: false,

            /**
            * The number of likes this post has received.
            * 
            * @property noLikes
            * @type {number}
            */
            noLikes: 0,

            /**
            * The template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(postDetailTemplate),

            /**
            * Checks if the user is logged in and redirects if not.
            *
            * @method initialize
            */
            initialize: function(options){
                spinner.showSpinner();
                this.options = options;
                var that = this;
                this.model = new PostModel({id: this.options.id});
                this.model.fetch({
                    success: function(post){
                        spinner.hideSpinner();
                        that.render(post);
                    },
                    error: function(model, xhr, options){
                        spinner.hideSpinner();
                        ajaxError.fetchError(model, xhr, options);
                    },
                    afterSuccess: function(resp){
                        that.model = new PostModel(resp);
                        that.render(that.model);
                    }
                });
            },

            /**
            * Renders the view template with the specified post.
            *
            * @method render
            * @param {object} post The post model object.
            */
            render: function(post){
                this.$el.html(this.template(post.toJSON()));
                this.post_id = post.id;
                this.isLiked = post.attributes.user_already_liked;
                this.noLikes = this.model.attributes.user_likes;
                if(this.isLiked){
                    this.toggleLikeButton(true);
                }
                if(post.attributes.is_current_users_post){
                    this.$(this._likeElement).unbind().remove();
                }
                return this;
            },

            /**
            * Called when the user taps the like button.
            *
            * @method toggleLikeButton
            * @param {boolean} liked Indicates if the post is being liked/ unliked.
            */
            toggleLikeButton: function(liked){
                var likeButton = this.$(this._likeElement);
                if(liked){
                    likeButton.removeClass(this._likeButtonStructure.removeClass);
                    likeButton.addClass(this._likeButtonStructure.addClass);
                    likeButton.text(this._likeButtonStructure.text);
                }else{
                    likeButton.removeClass(this._unLikeButtonStructure.removeClass);
                    likeButton.addClass(this._unLikeButtonStructure.addClass);
                    likeButton.text(this._unLikeButtonStructure.text);
                }
            },

            /**
            * Creates a new like request for the post on the service.
            *
            * @method createNewLike
            * @param {object} e The event object.
            */
            createNewLike: function(e){
                e.preventDefault();
                var url = urlHandle.createUrlFromSegmentWithOptions(
                    this._likesUrlSegment);
                var likeModel = {};
                    likeModel.post_id = this.post_id;
                var success = _.bind(this.likeSuccess, this);
                var error = _.bind(this.likeError, this);
                var type;
                if(this.isLiked){
                    type = "DELETE";
                }else{
                    type = "POST";
                }

                var opts ={
                    type: type,
                    success: success,
                    url: url,
                    data: likeModel,
                    dataType: 'json',
                    error: error
                };
                $.ajax(opts);
            },

            /**
            * Success callback for liking the post.
            *
            * @method likeSuccess
            * @param {object} The data object.
            * @param {object} The textStatus object.
            * @param {object} The jqXhr object.
            */
            likeSuccess: function(data, textStatus, jqXhr){
                if(this.isLiked){
                    this.noLikes -= 1;
                    this.toggleLikeButton(false);
                    this.isLiked = false;
                }else{
                    this.noLikes += 1;
                    this.toggleLikeButton(true);
                    this.isLiked = true;
                }
                this.$("." + this._fourthClass).text(
                    this.noLikes + this._likesString);
            },

            /**
            * Error callback for liking the post.
            *
            * @method likeError
            * @param {object} The data object.
            * @param {object} The textStatus object.
            * @param {object} The jqXhr object.
            */
            likeError: function(data, textStatus, jqXhr){
                console.log(data);
                console.log("Like Error");
            }
        });
        return postView;
});