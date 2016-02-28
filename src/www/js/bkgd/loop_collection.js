/**
* Represents the live data transmissions for the application.
*
* @class LiveCollection
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "js/bkgd/loop_model",
    "js/url_handle"

], function($, _, Backbone, LoopModel, urlHandle){
    "use strict";
        var _liveDataUrlSegment = "/live-data";
        var LoopCollection = Backbone.Collection.extend({
            url: urlHandle.createUrlFromSegment(_liveDataUrlSegment),
            model: LoopModel
        });
        return LoopCollection;
});