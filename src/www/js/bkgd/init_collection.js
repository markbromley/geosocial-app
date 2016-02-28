/**
* Represents the initial data transmissions for the application.
*
* @class InitCollection
* @constructor
*/ 
define([
	"jquery",
	"underscore",
	"backbone",
	"js/bkgd/init_model",
	"js/url_handle"

], function($, _, Backbone, InitModel, urlHandle){
	"use strict";
		var _staticDataUrlSegment = "/static-data";
		var InitCollection = Backbone.Collection.extend({
			url: urlHandle.createUrlFromSegment(_staticDataUrlSegment),
			model: InitModel
		});
		return InitCollection;	
});