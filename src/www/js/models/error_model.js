/**
* Error Model. Represents the data for a single error. Contains the validation
* data, accepted fields and corresponding model service URL.
*
* @class ErrorModel
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone){
    "use strict";
        var ErrorModel = Backbone.Model.extend({
            defaults: {
                id: "",
                error_name: "",
                error_symbol: "",
                description: "",
                show_dismiss: ""
            }
        });
        return ErrorModel;
});