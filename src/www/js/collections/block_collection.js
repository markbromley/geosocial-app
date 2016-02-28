/**
* Blocks collection. Stores collections of UserModel objects as blocks.
*
* @class BlockCollection
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
        var blockCollection = Backbone.Collection.extend({
            url: urlHandle.createUrlFromSegment("/blocks"),
            model: UserModel
        });
        return blockCollection;
});