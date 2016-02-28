define([
	'js/libs/backbone/backbone-min', 
	'js/internal-libs/backbone_cache',
	'js/url_handle'
], function (Backbone, newSync, urlHandle) {

	// //Now add the access token to the Ajax calls too, these are added separately where needed... :s
	Backbone.ajax = function() {	
		arguments[0].url = urlHandle.appendUrlOptions(arguments[0].url);
		return Backbone.$.ajax.apply(Backbone.$, arguments);
	};

	Backbone.Model.prototype.sync = newSync;
	Backbone.Collection.prototype.sync = newSync;

  return Backbone;
});