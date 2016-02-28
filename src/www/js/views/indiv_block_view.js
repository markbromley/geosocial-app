/**
* Individual Block View. Responsible for an individual blocked profile.
*
* @class IndivBlockView
* @constructor
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/indiv_block.html"
], function($, _, Backbone, IndBlockTmpl){
    "use strict";
        var individualBlockView = Backbone.View.extend({
            /**
            * Fired when a user taps to unblock a user.
            *
            * @event unblockUserEvent
            */
            _unblockUserEvent: "UnBlockUser",

            /**
            * The standard template for the view.
            * 
            * @property template
            * @type {Object}
            */
            template: _.template(IndBlockTmpl),
            
            /**
            * Renders the individual block view. Binds the tap event to the
            * template.
            *
            * @method render
            */
            render: function(){
                this.collection.each(function(user){
                    var obj = $(this.template(user.toJSON()));
                    var that = this;
                    obj.on("click", function(){
                        var id = user.toJSON().user_id.toString().trim();
                        that.$el.trigger(that._unblockUserEvent,[id]);
                    });
                    this.$el.append(obj);
                },this);
                return this;
            }
        });
        return individualBlockView;    
});