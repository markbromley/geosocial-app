/**
* Posts collection. Stores collections of PostModel objects.
*
* @class PostCollection
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "../models/post_model",
    "js/url_handle"
], function($, _, Backbone, PostModel, urlHandle){
    "use strict";
        var postCollection = Backbone.Collection.extend({
            url: urlHandle.createUrlFromSegment("/posts"),
            model: PostModel
        });
        return postCollection;
});