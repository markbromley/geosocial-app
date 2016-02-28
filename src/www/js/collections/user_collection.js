/**
* User collection. Stores collections of UserModel objects.
*
* @class UserCollection
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
        var userCollection = Backbone.Collection.extend({
            url: urlHandle.createUrlFromSegment("/users"),
            model: UserModel
        });
        return userCollection;
});