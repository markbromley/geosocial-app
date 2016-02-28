/**
* Error collection. Store collections of ErrorModel objects.
*
* @class ErrorCollection
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "../models/error_model"
], function($, _, Backbone, ErrorModel){
    "use strict";
        var errorCollection = Backbone.Collection.extend({
            model: ErrorModel
        });
        return errorCollection;
});