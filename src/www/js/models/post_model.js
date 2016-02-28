/**
* Post Model. Represents the data for a single post. Contains the validation
* data, accepted fields and corresponding model service URL.
*
* @class PostModel
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "js/url_handle"
], function($, _, Backbone, urlHandle){
    "use strict";
        var individualPostsModel = Backbone.Model.extend({
            defaults: {
                category: "post",
                user_id: "",
                name: "",
                pref_name: "",
                prof_im_url: "",
                distance: "",
                distanceFormat: "miles",
                content_string: "None.",
                img_url_id: "",
                date: "",
                user_likes: 0,
                user_already_liked: true,
                is_current_users_post: false,
                comments: ""
            },
            urlRoot: urlHandle.createUrlFromSegment('/posts')
        });
        return individualPostsModel;
});