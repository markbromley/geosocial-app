/**
* Individual Friend View. Responsible for an individual friend profile.
*
* @class IndivFriendView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/indiv_friend.html"
], function($, _, Backbone, IndFrTmpl){
    "use strict";
        var individualFriendView = Backbone.View.extend({
            // Private vars
            userTypeCount: {
                "college" : 0,
                "colleague" : 0,
                "family" : 0,
                "buddy" : 0
            },

            /**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(IndFrTmpl),

            /**
            * Renders the individual friend view. Binds the tap event to the
            * template.
            *
            * @method render
            */
            render: function(){
                this.collection.each(function(user){
                    this.userTypeCount[user.attributes.rel_type] += 1;
                    user = $(this.template(user.toJSON()));
                    this.$el.append(user);
                },this);
                return this;
            }
        });
        return individualFriendView;    
});