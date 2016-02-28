/**
* Friend collection. Stores collections of UserModel objects as friends.
*
* @class FriendCollection
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "../models/user_model",
    "js/url_handle"
], function($, _, Backbone, UserModel, urlHandle){
    "use strict";
        var friendCollection = Backbone.Collection.extend({
            url: urlHandle.createUrlFromSegment("/friends"),
            model: UserModel
        });
        return friendCollection;
});