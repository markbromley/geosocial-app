/**
* Individual User View. Responsible for an individual user view.
*
* @class IndivUserView
* @constructor
*/
define([
	"jquery",
	"underscore",
	"backbone",
	"text!tmpl/indiv_user.html"
], function($, _, Backbone, Indusertmpl){
	"use strict";
		var individualUserView = Backbone.View.extend({

			/**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
			template: _.template(Indusertmpl),

			/**
            * Renders the individual user view.
            *
            * @method render
            */
			render: function(){
				this.collection.each(function(user){
					user = $(this.template(user.toJSON()));
					this.$el.append(user);
				},this);
				return this;
			}
		});
		return individualUserView;	
});